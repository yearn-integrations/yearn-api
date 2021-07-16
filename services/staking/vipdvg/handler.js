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
const DB_CONSTANT = 'daoVip';

// Get VIP DVG contract info from domain based on enviroment
const getContractInfo = (name) => {
    const contracts =  process.env.PRODUCTION != null && process.env.PRODUCTION != "" 
                        ? mainContracts : testContracts;
    return contracts[name];
} 

// Get contract
const getContract = async (contractInfo) => {
    const { abi, address } = contractInfo;
    const contract = new archiveNodeWeb3.eth.Contract(abi, address);
    return contract;
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

const getDecimals = async (contract) => {
    try {
      let decimals = await contract.methods.decimals().call();
      return decimals;
    } catch (err) {
      // Catch error
      console.log(err);
    }
};

// DVG's balance of vipDVG contract
const getDVGBalanceOfxDVG = async(dvgContract, xDVGAddress) => {
    try {
        const dvgBalanceOfVipDVG = await dvgContract.methods.balanceOf(xDVGAddress).call();
        return dvgBalanceOfVipDVG;
    } catch (err) {
        console.log("Error in getDVGBalanceOfxDVG(): ", err)
    }
}

// xDVGPrice Formula :  xDVG price = ( DVG amount of xDVG SC * DVG price) / xDVG totalSupply
const getxDVGPrice = async (xDVGTotalSupply, dvgBalanceOfxDVG, dvgPrice) => {
    return (dvgBalanceOfxDVG * dvgPrice) / xDVGTotalSupply;
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

/**
 * Get TVL of xDVG.
 * TVL = totalSupply * xDVG Price
 */
 const getTVLxDVG = async (vault, totalSupply, tokenPrice) => {
    let tvl;
    const contract = await getContract(vault);
    const decimals = await getDecimals(contract);
  
    tvl = (totalSupply / 10 ** decimals) * tokenPrice;
    return tvl;
};

const calculateAPR = async (apr, lastMeasurement) => {
    const oneDayAgo = moment().subtract(1, "days").valueOf();
    await delay(delayTime);
    const oneDayAgoBlock = (await blocks.getDate(oneDayAgo)).block;
    const currentBlockNbr = await infuraWeb3.eth.getBlockNumber();
    const nbrBlocksInDay = currentBlockNbr - oneDayAgoBlock;
    const days = (currentBlockNbr - lastMeasurement) / nbrBlocksInDay;
    const aprPerDay = apr / days;
    return {
        aprOneDay: aprPerDay,
        aprOneWeek: aprPerDay * 7,
        aprOneMonth: aprPerDay * 30,
        aprOneYear: aprPerDay * 365,
    }
}

const getAPR = async () => {
    const apr = await db.findOne({
        name: DB_CONSTANT,
    });

    if (apr != null) {
        delete apr._id;
        delete apr.name;
    }
    return apr;
}

// APR calculation Formula : (xDVG's total supply * xDVG price) / (DVG.balanceOf(xDVG) * DVG price)
const getxDVGAPR = async (dvgContract, xDVGContract, xDVGContractInfo) => {
    const xDVGTotalSupply = await getTotalSupply(xDVGContract);
    const dvgBalOfxDVG = await getDVGBalanceOfxDVG(dvgContract, xDVGContract._address);

    const dvgPrice = await getTokenPrice("daoventures");
    const xDVGPrice = await getxDVGPrice(xDVGTotalSupply, dvgBalOfxDVG, dvgPrice);
    let apr = (xDVGTotalSupply * xDVGPrice) / (dvgBalOfxDVG * dvgPrice);

    if (isNaN(apr)) {
        apr = 0;
    }
    const aprInfo = await calculateAPR(apr, xDVGContractInfo.lastMeasurement);
    return { ...aprInfo, apr };
}

const getxDVGInfo = async (dvgContract, xDVGContract, xDVGContractInfo) => {
    const xDVGTotalSupply = await getTotalSupply(xDVGContract);
    const dvgBalOfxDVG = await getDVGBalanceOfxDVG(dvgContract, xDVGContract._address);

    // const dvgPrice = await getTokenPrice("daoventures");
    const dvgPrice = 0.225;
    const xDVGPrice = await getxDVGPrice(xDVGTotalSupply, dvgBalOfxDVG, dvgPrice);
    const tvl = await getTVLxDVG(xDVGContractInfo, xDVGTotalSupply, xDVGPrice);
    const apr = await getAPR();
    return { ...apr, dvgPrice, tvl, xDVGPrice: xDVGPrice/dvgPrice };
}

module.exports.getVipAPY = async () => {
    try {
        // Get vipDVG contract
        const xDVGContractInfo = getContractInfo("vipDVG");
        const xDVGContract = await getContract(xDVGContractInfo);

        // Get DVG contract
        const dvgContractInfo = getContractInfo("DVG");
        const dvgContract = await getContract(dvgContractInfo);

        let result = await getxDVGAPR(dvgContract, xDVGContract, xDVGContractInfo);
        await db.add({
            ...result,
            name: DB_CONSTANT,
        })
    } catch (err) {}
}

module.exports.getxDVGStake = async(req, res) => {
    try {
        // Get vipDVG contract
        const xDVGContractInfo = getContractInfo("vipDVG");
        const xDVGContract = await getContract(xDVGContractInfo);

        // Get DVG contract
        const dvgContractInfo = getContractInfo("DVG");
        const dvgContract = await getContract(dvgContractInfo);
         
        let result = await getxDVGInfo(dvgContract, xDVGContract, xDVGContractInfo);

        res.status(200).json({
            message: 'Successful Response',
            body: { 
                xdvg: result
            }
        });

    } catch (err) {
        res.status(200).json({
            message: err.message,
            body: null
        });
    }
    return;
};