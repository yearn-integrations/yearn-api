const _ = require("lodash");
const db = require ("../../../models/daomine-pool.model");
const contractHelper = require("../../../utils/contract");

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
 
const { getVipTokenPrice } = require("../vipdvg/handler");
const { getUniswapLPTokenPrice } = require("../dao-stake/handler");

let contracts = [];

const getContract = async (contractInfo) => {
    const { abi, address } = contractInfo;
    return await contractHelper.getEthereumContract(abi, address);
}

const getTotalPoolWeight = async (contract) => {
    try {
        return await contract.methods.totalPoolWeight().call();
    } catch (err) {
        console.error("Error occurred in totalPoolWeight()", err)
    }
}

const getPool = async (contract, pid) => {
    try {
        return await contract.methods.pool(pid).call();
    } catch (err) {
        console.error("Error in getPool(): ", err);
    }
}

const getMultiplier = async(startBlock, endBlock, contract) => {
    try {
        console.log(`Start Block: ${startBlock}, End Block: ${endBlock}`);
        let multiplier = await contract.methods.getMultiplier(startBlock, endBlock).call();
        multiplier = multiplier / (10 ** 18);
        return multiplier;
    } catch(err) {
        console.error("Error in getMultiplier(): ", err);
    }
}

const getTokenPrice = async () => {
    const tokens = [
        { tokenId: "tether", price: 0.00,  },
        { tokenId: "usd-coin", price: 0.00 },
        { tokenId: "dai", price: 0.00 },
        { tokenId: "true-usd", price: 0.00 },
        { tokenId: "daoventures", price: 0.00 },
        { tokenId: "ethereum", price: 0.00 },
    ];
    const tokenIds = tokens.map(t => t.tokenId);

    try {
        data = await CoinGeckoClient.simple.price({
            ids: tokenIds,
            vs_currencies: ["usd"],
        });

        // Append price to each token
        if(data.code == 200 && data.message == 'OK' && data.data) {
            const result = data.data;

            tokens.map(t => {
                t.price = result[t.tokenId]["usd"];
            })
        }

        // DAOvip (DVD)
        const tokenContractInfo = contracts["DVD"];
        const vipTokenContractInfo = contracts["vipDVD"];

        const tokenContract = await getContract(tokenContractInfo);
        const vipTokenContract = await getContract(vipTokenContractInfo);

        const vipTokenTotalSupply = await contractHelper.totalSupply(vipTokenContract);
        const tokenBalOfVipToken = await contractHelper.balanceOf(tokenContract, vipTokenContract._address);

        const vipTokenPrice = await getVipTokenPrice(vipTokenTotalSupply, tokenBalOfVipToken, tokens.find(t => t.tokenId === 'daoventures').price);
        tokens.push({ tokenId: "xDVD", price: vipTokenPrice });


        /** Uniswap ETH <-> DVD LP */
        const ethDVDPoolInfo = contracts.uniswap["ethDVD"];
        const ethDVDPoolContract = await getContract(ethDVDPoolInfo);
        const ethDVDPoolPrice = await getUniswapLPTokenPrice(ethDVDPoolContract, ethDVDPoolInfo.address, tokens, 'daoventures', 'ethereum');
        tokens.push({
            tokenId: 'ethDVD',
            price: ethDVDPoolPrice,
        });

        return tokens;
    } catch (err) {
        console.log("Error in getTokenPrice(): ", err);
    }
}

// Create address <-> abi key value pair
const getPoolAbiContractMap = async() => {
    const poolAbiContractMap = new Map();
    Object.values(contracts.farmer).map(v => {
        poolAbiContractMap.set(v.address.toLowerCase(), v.abi);
    });

    // DAOvip (DVD)
    poolAbiContractMap.set(contracts.vipDVD.address.toLowerCase(), contracts.vipDVD.abi);
    
    // Uniswap ETH <-> DVD Pool 
    poolAbiContractMap.set(contracts.uniswap.ethDVD.address.toLowerCase(), contracts.uniswap.ethDVD.abi);

    return poolAbiContractMap;
}

// Calculate APR and TVL for pool
const poolCalculation = async(daoMine, poolInfo, tokensPrice) => {

    let apr = 0;

    const { poolPercent, totalPoolWeight , daoMineContract } = daoMine;
    const { poolContract, pool }  = poolInfo;
    const { tokens, dvdPrice } = tokensPrice;
   
    const daominePool = await getPool(daoMineContract, pool.pid);
    const { poolWeight } = daominePool;

    const decimal = await contractHelper.decimals(poolContract);

    // Get DAOmine balance in each LP tokens
    const tokenBalOfDAOmine = await contractHelper.balanceOf(poolContract, daoMineContract._address) / (10 ** decimal);
    
    // Pass in start block, last reward block to invoke getMultiplier() in DAOmine contract
    const multiplier = await getMultiplier(pool.startBlock, pool.endBlock, daoMineContract);
   
    // Find pool's token price
    const poolTokenPrice = tokens.find(t => t.tokenId === pool.tokenId).price;
   
    // APR Calculation
    apr = (multiplier * poolPercent * dvdPrice * (poolWeight / 100)) / 
                    ((totalPoolWeight / 100) * tokenBalOfDAOmine * poolTokenPrice);
    console.log(`APR Calculation for pool ${pool.name} :(${multiplier} * ${poolPercent} * ${dvdPrice} * (${poolWeight} / 100)) / ((${totalPoolWeight} / 100) * ${tokenBalOfDAOmine} *${poolTokenPrice}) * 100`);

    apr = apr * 100; // For percent display on frontend.

    // TVL Calculation
    const tvl = tokenBalOfDAOmine * poolTokenPrice;

    Object.assign(pool, { apr: apr === Infinity ? 0 : apr, tvl , multiplier, decimal});
   
    return pool;
}

module.exports.saveDAOminePools = async () => {
    try {
        contracts = contractHelper.getContractsFromDomain();

        // Find price for each token
        const tokens = await getTokenPrice();
       
        // Get DVG price
        const dvdPrice = tokens.find(t => t.tokenId === 'daoventures').price;
        const tokensPrice = { tokens, dvdPrice };

        // Get DAOmine 
        const daoMineContractInfo = contracts["daoMine"];
        const daoMineContract = await getContract(daoMineContractInfo);
        const totalPoolWeight = await getTotalPoolWeight(daoMineContract);
        const daoMine = {  
            daoMineContract, 
            totalPoolWeight,
            startBlock: daoMineContractInfo.startBlock,
            poolPercent: daoMineContractInfo.poolPercent
        };
       
        // Find all pools
        const pools = await db.findAll();
        const poolSize = _.size(pools);
       
        // Find pool contract and contract abi value pair
        const poolAbiContractMap = await getPoolAbiContractMap();

        // Current Block Number
        const currentBlockNumber = await contractHelper.getEthereumCurrentBlockNumber();

        // Block number generated per year, 4 block per minute
        const blockNumberPerYear = (4 * 60 * 24 * 365); 
       
        for (index = 0 ; index < poolSize; index ++) {
            const contractAddressToLowerCase = pools[index].contract_address.toLowerCase();
            
            if(poolAbiContractMap.has(contractAddressToLowerCase) && pools[index].status == 'A') {
                // Fetch abi of pool contract
                const poolContractInfo = { 
                    address: pools[index].contract_address, 
                    abi: poolAbiContractMap.get(contractAddressToLowerCase)
                };
               
                // Checking on pool's start block number
                if(pools[index].startBlock) {
                    let startBlock = pools[index].startBlock;
                    let endBlock = startBlock + blockNumberPerYear;

                    // Update new start block and end block
                    if(currentBlockNumber >= endBlock) {
                        startBlock = endBlock;
                        endBlock = startBlock + blockNumberPerYear;
                    }

                    pools[index].startBlock = startBlock;
                    pools[index].endBlock = endBlock;
                } else {
                    console.log(`Pool ${pools[index].label} is missing its startBlock.`);
                }
                
                // Get pool contract
                const poolContract = await getContract(poolContractInfo);
                let poolInfo = {
                    pool: pools[index],
                    poolContract, 
                }

                const pool = await poolCalculation(daoMine, poolInfo, tokensPrice);
                pool.abi = JSON.stringify(poolContractInfo.abi);
            
                delete pool._id;
                db.add(pool);
            }
        }
    } catch (err) {
        console.error(err);
    }
    return;
}