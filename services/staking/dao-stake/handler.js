const db = require ("../../../models/stake-pool.model"); 
const { testContracts, mainContracts } = require("../../../config/serverless/domain");

const _ = require("lodash");
const delay = require("delay");
const fetch = require("node-fetch");

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const Web3 = require("web3");
const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT;
const archiveNodeWeb3 = new Web3(archiveNodeUrl);

const delayTime = 500;
let contracts = [];

// Get token price
const getTokenPrice = async () => {
    const tokens = [
        { name: "USDT", tokenId: "tether", price: 0.00,  },
        { name: "USDC", tokenId: "usd-coin", price: 0.00 },
        { name: "DAI", tokenId: "dai", price: 0.00 },
        { name: "TUSD", tokenId: "true-usd", price: 0.00 },
        { name: "DVG", tokenId: "daoventures", price: 0.00 }
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

        return tokens;
    } catch (err) {
        console.log("Error in getTokenPrice(): ", err);
    }
    return;
}

const getContractInfo = (name) => {
    contracts = process.env.PRODUCTION != null && process.env.PRODUCTION != "" 
                        ? mainContracts : testContracts;
    return contracts[name];
}

const getContract = async (contractInfo) => {
    const { abi, address } = contractInfo;
    const contract = new archiveNodeWeb3.eth.Contract(abi, address);
    return contract;
}

const fetchContractABI = async (address) => {
    let network = '';

    if (process.env.PRODUCTION == null || process.env.PRODUCTION == "") {
        network = '-kovan';
    }
    const url = `https://api${network}.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const resp = await fetch(url).then((res) => res.json());
    const metadata = resp.result;

    await delay(delayTime);
    return metadata;
}

// DAOstake totalPoolWeight()
const getDaoStakeTotalPoolWeight = async (daoStakeContract) => {
    try {
        let totalPoolWeight = await daoStakeContract.methods.totalPoolWeight().call();
        totalPoolWeight = totalPoolWeight / (10 ** 15);
        return totalPoolWeight;
    } catch (err) {
        console.log("Error in getDaoStakeTotalPoolWeight(): ", err);
    }
}

// Get token balanceOf(DAOstake)  
const getLPTokenBalanceOfDAOStake = async (contract, daoStakeAddress) => {
    try { 
        const lpTokenBalOfDaoStake = await contract.methods.balanceOf(daoStakeAddress).call();
        return lpTokenBalOfDaoStake;
    } catch (err) {
        console.log("Error in getLPTokenBalanceOfDAOStake(): ", err);
    }
}

// getMultiplier() from DAOstake contract
const getMultiplier = async(start, current, daoStakeContract) => {
    try {
        let multiplier = await daoStakeContract.methods.getMultiplier(start, current).call();
        multiplier = multiplier / (10 ** 18);
        return multiplier;
    } catch (err) {
        console.log("Error in getMultiplier(): ", err);
    }
}

// getPool() from DAOstake contract
const getPoolFromDaoStake = async(pid, daoStakeContract) => {
    try {
        const pool = await daoStakeContract.methods.pool(pid).call();
        return pool;
    } catch (err) {
        console.log("Error in getPoolFromDaoStake(): ", err);
    }
}

// getTotalSupply() from token contract
const getTokenTotalSupply = async (contract) => {
    try {
        const totalSupply = await contract.methods.totalSupply().call();
        return totalSupply;
    } catch (err) {
        console.log("Error in getTokenTotalSupply(): ", err);
    }
}

// Calculate APR and TVL for pool
const poolCalculation = async(daoStake, poolInfo, tokensPrice) => {
    // Extract data from daoStake param
    const { startBlock, poolPercent, totalPoolWeight , daoStakeContract } = daoStake;

    // Extract data from poolInfo param
    const { poolContract, pool }  = poolInfo;
    
    // Extract data from tokensPrice param
    const { tokens, dvgPrice } = tokensPrice;
   
    // Pass in DAOstake contract, pool's pid to invoke pool() in DAOstake contract
    const getPool = await getPoolFromDaoStake(pool.pid, daoStakeContract);
    const { lastRewardBlock, poolWeight } = getPool;

    // Pass in pool's contract, DAOstake address get balanceOf() in pool's contract
    const tokenBalOfDAOStake = await getLPTokenBalanceOfDAOStake(poolContract, daoStakeContract._address);

    // Pass in start block, last reward block to invoke getMultiplier() in DAOstake contract
    const multiplier = await getMultiplier(startBlock,lastRewardBlock, daoStakeContract);
    
    // Find pool token price
    const poolTokenPrice = tokens.find(t => t.name === pool.name).price;
   
    // APR Calculation
    const apr = (multiplier * poolPercent * dvgPrice * (poolWeight / (10 ** 15))) / 
                    (totalPoolWeight * tokenBalOfDAOStake * poolTokenPrice);
    console.log("apr for " + pool.pid + ": " + apr);                
  
    // TVL Calculation
    const totalSupply = await getTokenTotalSupply(poolContract);
    const tvl = totalSupply * poolTokenPrice;
    console.log("tvl for " + pool.pid + ": " + tvl);

    Object.assign(pool, { apr, tvl });

    return pool;
}

module.exports.getDaoStake = async(req, res) => {
    try {
        const result = [];

        // Find price for each token
        const tokens = await getTokenPrice();
        // Get DVG price
        const dvgPrice = tokens.find(t => t.name == 'DVG').price;
        const tokensPrice = { tokens, dvgPrice };

        // Get DAOstake 
        const daoStakeContractInfo = getContractInfo("daoStake");
        const daoStakeContract = await getContract(daoStakeContractInfo);
        const totalPoolWeight = await getDaoStakeTotalPoolWeight(daoStakeContract);
        const daoStake = {  
            daoStakeContract: daoStakeContract, 
            totalPoolWeight,
            startBlock: daoStakeContractInfo.startBlock,
            poolPercent: daoStakeContractInfo.poolPercent
        };

        // Find all pools
        const pools = await db.findAll();
        const poolSize = _.size(pools);

        // Find pool contract and contract abi value pair
        const poolAbiContractMap = new Map();
        Object.values(contracts.farmer).map(v => {
            poolAbiContractMap.set(v.address, v.abi);
        });
       
        for (index = 0 ; index < poolSize; index ++) {
            // Fetch abi of pool contract
            const poolContractInfo = { 
                address: pools[index].contract_address, 
                abi: poolAbiContractMap.get(pools[index].contract_address)
            };

            // Get pool contract
            const poolContract = await getContract(poolContractInfo);
            let poolInfo = {
                pool: pools[index],
                poolContract, 
            }

            const pool = await poolCalculation(daoStake, poolInfo, tokensPrice);
           
            delete pools[index].strategy_address;
            delete pools[index]._id;

            result.push(pool);
        }

        res.status(200).json({
            message: "Successful response",
            body:  {
                pools: result
            }
        });

    } catch (err) {
        console.log(err);
        res.status(200).json({
            message: err.messge,
            body: null
        })
    }
    return;
}