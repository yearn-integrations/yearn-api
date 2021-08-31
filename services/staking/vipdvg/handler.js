const { testContracts, mainContracts } = require("../../../config/serverless/domain");

const Web3 = require("web3");
const CoinGecko = require("coingecko-api");
const moment = require("moment");
const delay = require("delay");
const EthDater = require("../../vaults/apy/save/ethereum-block-by-date");
const { delayTime } = require("../../vaults/apy/save/config");
const db = require("../../../models/vip-apy.model");
const CoinGeckoClient = new CoinGecko();

const infuraUrl = process.env.WEB3_ENDPOINT;
const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT;
const archiveNodeWeb3 = new Web3(archiveNodeUrl);
const infuraWeb3 = new Web3(infuraUrl);
const blocks = new EthDater(archiveNodeWeb3, delayTime);

const contractHelper = require("../../../utils/contract");

const getContracts = () => {
    return contractHelper.getContractsFromDomain();
}

// Get contract
const getContract = async (contractInfo) => {
    const { abi, address } = contractInfo;
    return await contractHelper.getContract(abi, address, null);
}

// Get Token Price
const getTokenPrice = async (coingecko_token_id) => {
    let data;
    try {
        data = await CoinGeckoClient.simple.price({
            ids: coingecko_token_id,
            vs_currencies: ["usd"],
        });
        return data.data[coingecko_token_id]["usd"];
    } catch (err) {
        console.log("Error in getTokenPrice(): ", err);
    }
    return;
}

const getTokenBalanceOfVipToken = async(tokenContract, vipTokenAddress) => {
    try {
        const tokenBalanceOfVipToken = await tokenContract.methods.balanceOf(vipTokenAddress).call();
        return tokenBalanceOfVipToken;
    } catch (err) {
        console.log("Error in getTokenBalanceOfVipToken(): ", err)
    }
}

const getVipTokenPrice = async (vipTotalSupply, tokenBalOfVipToken, tokenPrice) => {
    return (tokenBalOfVipToken * tokenPrice) / vipTotalSupply;
}

const getTotalSupply = async (contract) => {
    try {
      let totalSupply = await contract.methods.totalSupply().call();
      return totalSupply;
    } catch (err) {
      // Catch error
      console.log(err);
    }
};

const getVipTokenTVL = async (vipTokenDecimals, vipTotalSupply, vipTokenPrice) => {
    return (vipTotalSupply / (10 ** vipTokenDecimals)) * vipTokenPrice;
};

const calculateAPR = async (apr, days) => {
    const aprPerDay = apr / days;
    return {
        aprOneDay: aprPerDay,
        aprOneWeek: aprPerDay * 7,
        aprOneMonth: aprPerDay * 30,
        aprOneYear: aprPerDay * 365,
    }
}

const getAPR = async (vipName) => {
    const apr = await db.findOne({
        name: vipName,
    });

    if (apr != null) {
        delete apr._id;
        delete apr.name;
    }
    return apr;
}

const getVipTokenAPR = async (tokenContract, vipTokenContract, days, tokenPriceId) => {
    const tokenBalOfVipToken = await getTokenBalanceOfVipToken(tokenContract, vipTokenContract._address);
    const vipTotalSupply = await getTotalSupply(vipTokenContract);

    // Get token usd price from Coingecko
    const tokenPrice = await getTokenPrice(tokenPriceId); 

    const vipTokenPrice = await getVipTokenPrice(vipTotalSupply, tokenBalOfVipToken, tokenPrice);

    let apr = (vipTotalSupply * vipTokenPrice) / (tokenBalOfVipToken * tokenPrice);
    console.log(`APR: (${vipTotalSupply} * ${vipTokenPrice}) / (${tokenBalOfVipToken} * ${tokenPrice})`);

    if (isNaN(apr)) {
        apr = 0;
    }

    const aprInfo = await calculateAPR(apr, days);
    return { ...aprInfo, apr };
}

const getVipTokenInfo = async (tokenContract, vipTokenContract, vipContractInfo, tokenPriceId) => {
    const vipTotalSupply = await getTotalSupply(vipTokenContract);
    const tokenBalOfVipToken = await getTokenBalanceOfVipToken(tokenContract, vipTokenContract._address);

    // Get token usd price from Coingecko
    const tokenPrice = await getTokenPrice(tokenPriceId);

    let vipTokenPrice = await getVipTokenPrice(vipTotalSupply, tokenBalOfVipToken, tokenPrice);

    const tvl = await getVipTokenTVL(vipContractInfo.decimals, vipTotalSupply, vipTokenPrice);
    const apr = await getAPR(vipContractInfo.name);
    return { ...apr, tokenPrice, tvl, vipTokenPrice: vipTokenPrice / tokenPrice};
}

module.exports.getVipAPY = async () => {
    try {
        const contracts = getContracts();
        
        const tokenPairs = [
            { token: "DVG", vipToken: "vipDVG" }, 
            { token: "DVD", vipToken: "vipDVD" },
        ];

        const oneDayAgo = moment().subtract(1, "days").valueOf();
        await delay(delayTime);
      
        const oneDayAgoBlock = await contractHelper.getEthereumBlockNumberByTimeline(oneDayAgo);
        const currentBlockNbr = await infuraWeb3.eth.getBlockNumber();
       
        const nbrBlocksInDay = currentBlockNbr - oneDayAgoBlock;
       
        for(let i = 0 ; i < tokenPairs.length; i++) {
            const tokenInfo = contracts[tokenPairs[i].token];
            const vipTokenInfo = contracts[tokenPairs[i].vipToken];

            const tokenContract = await getContract(tokenInfo);
            const vipTokenContract = await getContract(vipTokenInfo); 

            const days = (currentBlockNbr - vipTokenInfo.lastMeasurement) / nbrBlocksInDay;
            let result = await getVipTokenAPR(tokenContract, vipTokenContract, days, tokenInfo.tokenId);
            await db.add({
                ...result,
                name: tokenPairs[i].vipToken,
            });
        }
    } catch (err) {}
}

module.exports.getxDVGStake = async(req, res) => {
    try {
        const contracts = getContracts(); 

        const xDVGInfo = contracts["vipDVG"];
        const dvgInfo = contracts["DVG"];

        // Create contract object
        const xDVGContract = await getContract(xDVGInfo);
        const dvgContract = await getContract(dvgInfo);
         
        const result = await getVipTokenInfo(dvgContract, xDVGContract, xDVGInfo, dvgInfo.tokenId);
        const finalResult = {
            aprOneDay: result.aprOneDay,
            aprOneWeek: result.aprOneWeek,
            aprOneMonth: result.aprOneMonth,
            aprOneYear: result.aprOneYear,
            apr: result.apr,
            dvgPrice: result.tokenPrice,
            xDVGPrice: result.vipTokenPrice,
            tvl: result.tvl,
        };

        res.status(200).json({
            message: 'Successful Response',
            body: finalResult
        });

    } catch (err) {
        res.status(200).json({
            message: err.message,
            body: null
        });
    }
    return;
};

module.exports.getxDVDStake = async (req, res) => {
    try {
        const contracts = getContracts(); 

        const xDVDInfo = contracts["vipDVD"];
        const dvdInfo = contracts["DVD"];

        // Create contract object
        const xDVDContract = await getContract(xDVDInfo);
        const dvdContract = await getContract(dvdInfo);
         
        const result = await getVipTokenInfo(dvdContract, xDVDContract, xDVDInfo, dvdInfo.tokenId);
        const finalResult = {
            aprOneDay: result.aprOneDay,
            aprOneWeek: result.aprOneWeek,
            aprOneMonth: result.aprOneMonth,
            aprOneYear: result.aprOneYear,
            apr: result.apr,
            dvdPrice: result.tokenPrice,
            xDVDPrice: result.vipTokenPrice,
            tvl: result.tvl,
        };

        res.status(200).json({
            message: 'Successful Response',
            body: finalResult
        });

    } catch (err) {
        res.status(200).json({
            message: err.message,
            body: null
        });
    }
    return;
}

module.exports.getVipTokenPrice = getVipTokenPrice;