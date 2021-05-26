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
        { tokenId: "tether", price: 0.00,  },
        { tokenId: "usd-coin", price: 0.00 },
        { tokenId: "dai", price: 0.00 },
        { tokenId: "true-usd", price: 0.00 },
        { tokenId: "daoventures", price: 0.00 }
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
        const totalPoolWeight = await daoStakeContract.methods.totalPoolWeight().call();
        return totalPoolWeight;
    } catch (err) {
        console.log("Error in getDaoStakeTotalPoolWeight(): ", err);
    }
}

// Get token balanceOf(DAOstake)  
const getLPTokenBalanceOfDAOStake = async (contract, daoStakeAddress) => {
    try { 
        const decimals = await contract.methods.decimals().call();
        let lpTokenBalOfDaoStake = await contract.methods.balanceOf(daoStakeAddress).call();
        lpTokenBalOfDaoStake = lpTokenBalOfDaoStake / ( 10 ** decimals);
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

// Calculate APR and TVL for pool
const poolCalculation = async(daoStake, poolInfo, tokensPrice) => {
    let apr = 0;

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
    const poolTokenPrice = tokens.find(t => t.tokenId === pool.tokenId).price;

    console.log("pid: " + pool.pid);
    console.log("multiplier: " + multiplier);
    console.log("pool percent: " + poolPercent);
    console.log("dvg price: " + dvgPrice);
    console.log("pool weight: " + poolWeight);
    console.log("total pool weight: "+ totalPoolWeight);
    console.log("token bal of dao stake: " + tokenBalOfDAOStake);
    console.log("pool token price: " + poolTokenPrice);
   
    // APR Calculation
    apr = (multiplier * poolPercent * dvgPrice * (poolWeight / 100)) / 
                    ((totalPoolWeight / 100) * tokenBalOfDAOStake * poolTokenPrice);

    // TVL Calculation
    const tvl = tokenBalOfDAOStake * poolTokenPrice;
    console.log("apr: "+ apr + ", tvl: " + tvl);

    Object.assign(pool, { apr: apr === Infinity ? 0 : apr, tvl });

    return pool;
}

module.exports.saveStakedPools = async() => {
    try {
        // Find price for each token
        const tokens = await getTokenPrice();
        // Get DVG price
        const dvgPrice = tokens.find(t => t.tokenId === 'daoventures').price;
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
            if(poolAbiContractMap.has(pools[index].contract_address) && pools[index].status == 'A') {
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
            
                delete pool._id;
                db.add(pool);
            }
        }
    } catch (err) {
        console.error(err);
    }
    return;
}

module.exports.getStakePools = async (req, res) => {
    try {
        const pools = await db.findAll();
        const result = [];

        pools
        .filter((pool) => pool.status === 'A')
        .forEach((pool) => {
            delete pool._id;
            result.push(pool);
        });
        
        res.status(200).json({
            message: "Successful response",
            body:  {
                pools: result
            }
        });
    } catch (err) {
        res.status(200).json({
            message: err.messge,
            body: null
        });
    }
    return;
}