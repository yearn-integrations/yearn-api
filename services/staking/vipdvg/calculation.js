const fetch = require("node-fetch");
const BigNumber = require("bignumber.js");

const db = require("../../../models/vip-apy.model");
const contractHelper = require("../../../utils/contract");
const tokenHelper = require("../../../utils/token");

const subgraphUrl = process.env.SUBGRAPH_ENDPOINT;

// VIP Token Price
const getVipTokenPrice = async(vipTotalSupply, tokenBalanceOfVipToken, tokenPrice) => {
    if (!vipTotalSupply ||
        !tokenBalanceOfVipToken ||
        !tokenPrice) {
        console.error(`Error in getVipTokenPrice(): Missing either vipTotalSupply / tokenBalanceOfVipToken / tokenPrice for calculation.`); 
        return null;
    }
    return (tokenBalanceOfVipToken * tokenPrice) / vipTotalSupply;
}

// TVL
const getVipTokenTVL = (decimal, totalSupply, tokenPrice) => {
    if (!decimal ||
        !totalSupply ||
        !tokenPrice) {
        console.error(`Error in getVipTokenTVL(): Missing either decimal / totalSupply / tokenPrice for calculation.`); 
        return null;
    }
    return (totalSupply / (10 ** decimal)) * tokenPrice;
}

const getTotalDistributedDVD = async(contract) => {
    try {
        if(!contract) {
            return 0;
        }
        return await contract.methods.amountDistributed().call();
    } catch(err) {
        console.error(`Error in getTotalDistributedDVD(): `, err);
    }
}

const findBuyBackFromSubgraph = async(subgraphParams) => {
    const  {
        queryItems: numberOfItems,
        blockNumber,
        timestamp,
        currentBlockNumber,
    } = subgraphParams;

    // Timestamp added to avoid transaction in the same block but different timestamp being missed out during pagination.
    // Block number >= (last updated block || last result from last query + timestamp > last result timestamp (pagination)) 
    // Block number < current block number
    // Order by blockNumber in ascending order
    const condition = `
        first: ${numberOfItems},
        where: {
            blockNumber_gte: ${blockNumber}
            blockNumber_lt: ${currentBlockNumber}
            ${(timestamp === null) ? "" : ",timestamp_gt : " + timestamp} 
        },
        orderBy: blockNumber,
        orderDirection: asc 
    `;

    const query = `
        { 
            buyBacks (${condition}) {
                id
                blockNumber
                amountRaw
                amount
                timestamp
            }
        }
    `;

    const response = await fetch(subgraphUrl , {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    
    const responseJson = await response.json();
    return responseJson.data;
}

const getStakedDVDInXDVD = async(contracts) => {
    try {
        if(!contracts) {
            return null;
        }
        const { abi, address } = contracts.DVD;
        const dvdContract = await contractHelper.getEthereumContract(abi, address);

        const { 
            address: vipDVDAddress, 
            name: vipName
        } = contracts.vipDVD;
       
        // Latest APR Record
        const latestRecord = await db.findOne({ name: vipName });
        
        // DVD Balance in DAOvip DVD contract, inclusive of buy back DVD
        const dvdBalanceOfVipDvd = await contractHelper.balanceOf(dvdContract, vipDVDAddress.toLowerCase());

        let continueLoop = true;
        let subgraphTotal = 0;
        let queryItems = 2;
        let timestamp = null;
        let blockNumber = 0;
        let currentBlockNumberInfo = await contractHelper.getEthereumBlockInfo(
            await contractHelper.getEthereumCurrentBlockNumber()
        );
    
        // If latestRecord block number found, use the block number, else start from uni bot / dvd dist bot inception block.
        if(latestRecord && latestRecord[0] && latestRecord[0].blockNumber) {
            blockNumber = latestRecord[0].blockNumber;
        } else {
            const uniBotStartBlock = contracts.bot.unibot.startBlock;
            const dvdDistBotStartBlock = contracts.bot.dvdDistBot.startBlock;

            blockNumber = (dvdDistBotStartBlock < uniBotStartBlock) 
                ? dvdDistBotStartBlock
                : uniBotStartBlock;
        }
 
        while(continueLoop) {
            // Find buy back event from subgraph
            const subgraphParams = {
                queryItems,
                blockNumber,
                currentBlockNumber: currentBlockNumberInfo.number,
                timestamp
            };
            const subgraphResult = await findBuyBackFromSubgraph(subgraphParams);
            let subgraphItems = (subgraphResult)
                ? subgraphResult.buyBacks
                : [];
        
            // If query item is 0, quit loop
            if(subgraphItems.length === 0) {
                console.log(`Empty Subgraph Items returned.`);
                continueLoop = false; 
                break;
            }

            // Sum up the buy back amount
            const partTotal = subgraphItems.reduce((a,b) => a + parseFloat(b.amount), 0);
            subgraphTotal = subgraphTotal + partTotal;

            // Update block number and timestamp for next iteration
            timestamp = subgraphItems[subgraphItems.length - 1].timestamp;
            blockNumber = subgraphItems[subgraphItems.length - 1].blockNumber;

            // If query item is less than queryItems, meaning is last loop, quit loop
            if(subgraphItems.length < queryItems) {
                continueLoop = false; 
                break;
            }
        }

        // Exclude buy back amount from current balance
        const finalStakedDVD = new BigNumber(dvdBalanceOfVipDvd).shiftedBy(-18).minus(subgraphTotal).toNumber();
        const result = {
            lastUpdatedBlock: currentBlockNumberInfo.number,
            lastUpdatedBlockTimestamp: currentBlockNumberInfo.timestamp,
            finalStakedDVD
        };

        return result;
    } catch (err) {
        console.error(`Error in getStakedDVDInXDVD():`, err);
    }
}

// DAOvip APR version 2
const calculateVipDvdApr = async () => {
    const contracts = contractHelper.getContractsFromDomain();

    const {abi, address} = contracts.bot.dvdDistBot;
    const dvdDistBotContract = await contractHelper.getEthereumContract(abi, address);

    const percentForxDVD = 33.33;
    const distributedMonth = 24;
    const totalDvdDistributed = new BigNumber(await getTotalDistributedDVD(dvdDistBotContract)).shiftedBy(-18);
    
    const stakeDvdResult = await getStakedDVDInXDVD(contracts);
    const totalStakedDvdInXDvd = stakeDvdResult.finalStakedDVD;

    let apr = (totalDvdDistributed * percentForxDVD * 12) /
        (distributedMonth * totalStakedDvdInXDvd) * 100;
    console.log(`calculateVipDvdApr(), apr: (${totalDvdDistributed} * ${percentForxDVD} * 12) 
        / (${distributedMonth} * ${totalStakedDvdInXDvd}) * 100`);

    const result = {
        apr,
        lastUpdatedBlock: stakeDvdResult.lastUpdatedBlock,
        lastUpdatedBlockTimestamp: stakeDvdResult.lastUpdatedBlockTimestamp
    };
    return result;
}

// DAOvip APR version 1
const calculateVipTokenApr = async(token, vipToken) => {
    try {
        const tokenContract = await contractHelper.getEthereumContract(token.abi, token.address);
        const vipTokenContract = await contractHelper.getEthereumContract(vipToken.abi, vipToken.address);

        const tokenBalanceOfVipToken = await contractHelper.balanceOf(tokenContract, vipToken.address);
        const vipTotalSupply = await contractHelper.totalSupply(vipTokenContract);

        const tokenPrice = await tokenHelper.getTokenPriceInUSD(token.tokenId);
        const vipTokenPrice = await getVipTokenPrice(
            vipTotalSupply,
            tokenBalanceOfVipToken,
            tokenPrice
        );

        let apr = (vipTotalSupply * vipTokenPrice) / (tokenBalanceOfVipToken * tokenPrice);
        console.log(`calculateVipTokenApr(), APR: (${vipTotalSupply} * ${vipTokenPrice}) / (${tokenBalanceOfVipToken} * ${tokenPrice})`);

        if (isNaN(apr)) {
            apr = 0;
        }
        return apr;
    } catch(err) {
        console.error(`Error in calculateVipTokenApr(): `, err);
    }
}

const calculateAprPerDay = async(apr, days) => {
    try {
        if(!apr || apr === undefined) {
            throw (`Missing APR for calculation`);
        }
        if(!days || days === undefined) {
            throw (`Missing Days for calculation`);
        }
    
        const aprPerDay = apr / days;
        return {
            aprOneDay: aprPerDay,
            aprOneWeek: aprPerDay * 7,
            aprOneMonth: aprPerDay * 30,
            aprOneYear: aprPerDay * 365,
        }
    } catch(err) {
        console.error(`Error in calculateAprPerDay(): `, err);
    }
}

module.exports.calculateVipDvdApr = calculateVipDvdApr;
module.exports.calculateVipTokenApr = calculateVipTokenApr;
module.exports.calculateAprPerDay = calculateAprPerDay;
module.exports.getVipTokenPrice = getVipTokenPrice;
module.exports.getVipTokenTVL = getVipTokenTVL;

