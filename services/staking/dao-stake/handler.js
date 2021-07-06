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

const infuraUrl = process.env.WEB3_ENDPOINT;
const infuraWeb3 = new Web3(infuraUrl);

const delayTime = 500;
let contracts = [];

// xDVGPrice Formula :  xDVG price = ( DVG amount of xDVG SC * DVG price) / xDVG amount
const getxDVGPrice = async (xDVGAmount, dvgBalanceOfxDVG, dvgPrice) => {
    return (dvgBalanceOfxDVG * dvgPrice) / xDVGAmount;
}

// Get vipDVG's total supply
const getxDVGTotalSupply = async(xDVGContract) => {
    try {
        const xDVGTotalSupply = await xDVGContract.methods.totalSupply().call();
        return xDVGTotalSupply;
    } catch(err) {
        console.log("Error in getxDVGTotalSupply(): ", err);
    }
}

// DVG's balance of vipDVG contract
const getDVGBalanceOfxDVG = async(dvgContract, xDVGAddress) => {
    try {
        const dvgBalanceOfVipDVG = await dvgContract.methods.balanceOf(xDVGAddress).call();
        return dvgBalanceOfVipDVG;
    } catch (err) {
        console.log("Error in getDVGBalanceOfxDVG(): ", err)
    }
}

// Get token price
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

        /**** DAOvip ***/ 
        // Get vipDVG contract
        const xDVGContractInfo = getContractInfo("vipDVG");
        const xDVGContract = await getContract(xDVGContractInfo);

        // Get DVG contract
        const dvgContractInfo = getContractInfo("DVG");
        const dvgContract = await getContract(dvgContractInfo);

        const xDVGTotalSupply = await getxDVGTotalSupply(xDVGContract);
        const dvgBalOfxDVG = await getDVGBalanceOfxDVG(dvgContract, xDVGContract._address);
        const xDVGPrice = await getxDVGPrice(xDVGTotalSupply, dvgBalOfxDVG, tokens.find(t => t.tokenId === 'daoventures').price);
        tokens.push({
            tokenId: 'xDVG',
            price: xDVGPrice,
        });

        /** Uniswap ETH<->DVG LP **/
        const ethDVGPoolInfo = getContractInfo("uniswap").ethDVG;
        const ethDVGPoolContract = await getContract(ethDVGPoolInfo);
        const ethDVGPoolPrice = await getUniswapLPTokenPrice(ethDVGPoolContract, ethDVGPoolInfo.address, tokens, 'daoventures', 'ethereum');
        tokens.push({
            tokenId: 'ethDVG',
            price: ethDVGPoolPrice,
        });

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
        //const currentBlockNbr = await infuraWeb3.eth.getBlockNumber();
        // let multiplier = await daoStakeContract.methods.getMultiplier(start, currentBlockNbr).call();
        const endBlockNumber = start + (4 * 60 * 24 * 365); // Temporaly fix
        let multiplier = await daoStakeContract.methods.getMultiplier(start, endBlockNumber).call();
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
};

const getUniswapLPTokenPrice = async (poolContract, poolAddress, tokenPrices, token0Id, token1Id) => {
    const token0Address = await poolContract.methods.token0().call();
    const token1Address = await poolContract.methods.token1().call();
    const totalSupply = await poolContract.methods.totalSupply().call();

    const token0Abi = await fetchContractABI(token0Address);
    const token1Abi = await fetchContractABI(token1Address);

    const token0 = await getContract({
        address: token0Address,
        abi: JSON.parse(token0Abi),
    });

    const token1 = await getContract({
        address: token1Address,
        abi: JSON.parse(token1Abi),
    });

    // Balance of Both pairs
    const token0Bal = await token0.methods.balanceOf(poolAddress).call();
    const token1Bal = await token1.methods.balanceOf(poolAddress).call();
    const token0Price = tokenPrices.find(t => t.tokenId === token0Id).price;
    const token1Price = tokenPrices.find(t => t.tokenId === token1Id).price;
    const pool = token0Bal * token0Price + token1Bal * token1Price;
    const price = pool / totalSupply;
    return price;
}

const getDecimal = async (poolContract) => {
    try {
        const decimal = await poolContract.methods.decimals().call();
        return decimal;
    } catch (err) {
        console.log("Err in getDecimal()", err);
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
    const multiplier = await getMultiplier(startBlock, lastRewardBlock, daoStakeContract);
   
    // Find pool token price
    const poolTokenPrice = tokens.find(t => t.tokenId === pool.tokenId).price;
   
    // APR Calculation
    apr = (multiplier * poolPercent * dvgPrice * (poolWeight / 100)) / 
                    ((totalPoolWeight / 100) * tokenBalOfDAOStake * poolTokenPrice);
    apr = apr * 100; // For percent display on frontend.

    // TVL Calculation
    const tvl = tokenBalOfDAOStake * poolTokenPrice;

    const decimal = await getDecimal(poolContract);

    Object.assign(pool, { apr: apr === Infinity ? 0 : apr, tvl , multiplier, decimal});

    return pool;
}

module.exports.saveStakedPools = async () => {
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
            poolAbiContractMap.set(v.address.toLowerCase(), v.abi);
        });

        // DAOvip
        poolAbiContractMap.set(contracts.vipDVG.address.toLowerCase(), contracts.vipDVG.abi);

        // Uniswap ETH <-> DVG Pool 
        poolAbiContractMap.set(contracts.uniswap.ethDVG.address.toLowerCase(), contracts.uniswap.ethDVG.abi);

        // daoCDV
        poolAbiContractMap.set(contracts.uniswap.ethDVG.address.toLowerCase(), contracts.uniswap.ethDVG.abi);
       
        for (index = 0 ; index < poolSize; index ++) {
            const contractAddressToLowerCase = pools[index].contract_address.toLowerCase();
           
            if(poolAbiContractMap.has(contractAddressToLowerCase) && pools[index].status == 'A') {
                // Fetch abi of pool contract
                const poolContractInfo = { 
                    address: pools[index].contract_address, 
                    abi: poolAbiContractMap.get(contractAddressToLowerCase)
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