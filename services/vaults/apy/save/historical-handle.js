require("dotenv").config();
const historicalDb = require('../../../../models/historical-apy.model');
const Web3 = require("web3");
const moment = require("moment");
const delay = require("delay");
const { jobDelayTime }  = require("../../../../constant/delayTimeConfig");
const _ = require("lodash");
const vaults = require("./vaults");
const { delayTime } = require("./config");
const infuraUrl = process.env.WEB3_ENDPOINT;
const infuraWeb3 = new Web3(infuraUrl);
const { aggregatedContractABI } = require('../../../../config/abi');
const { aggregatedContractAddress, testContracts, mainContracts } = require('../../../../config/serverless/domain');
const contractHelper = require("../../../../utils/contract");
const {
  getApy,
  getPricePerFullShare,
  getVirtualPrice,
  getCompoundSupplyApy,
  getCitadelPricePerFullShare,
  getElonPricePerFullShare,
  getCubanPricePerFullShare,
  getFaangPricePerFullShare,
  getMetaversePricePerFullShare,
  getHarvestFarmerAPR
} = require("./handler");

let currentBlockNbr;
let oneDayAgoBlock;
let threeDaysAgoBlock;
let oneWeekAgoBlock;
let oneMonthAgoBlock;
let nbrBlocksInDay;

const pools = [
  {
    symbol: "yCRV",
    address: "0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51",
  },
  {
    symbol: "crvBUSD",
    address: "0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27",
  },
  {
    symbol: "crvBTC",
    address: "0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714",
  },
];

const saveHistoricalAPY = async (data, collection) => {
  await historicalDb.add(data, collection).catch((err) => console.log('err', err));
};

const getApyForVault = async (vault, contracts) => {
  const {
    lastMeasurement: inceptionBlockNbr,
    vaultContractABI: abi,
    vaultContractAddress: address,
    symbol,
  } = vault;

  // Compound Vault 
  if (vault.isCompound) {
    const symbol = Object.keys(contracts.farmer).find((key) =>
      contracts.farmer[key].address.toLowerCase() === vault.vaultContractAddress.toLowerCase());

    // cToken
    const { abi: cTokenAbi, address: cTokenAddress } = contracts.compund[symbol];
    const cToken = await contractHelper.getEthereumContract(cTokenAbi, cTokenAddress);

    // APY 
    const compoundApy = await getCompoundSupplyApy(cToken);

    return {
      apyInceptionSample: 0,
      apyOneDaySample: 0,
      apyThreeDaySample: 0,
      apyOneWeekSample: 0,
      apyOneMonthSample: 0,
      apyLoanscan: 0,
      compoundApy,
      citadelApy: 0,
      elonApy: 0,
      cubanApy: 0,
      faangApy: 0,
      moneyPrinterApy: 0,
    };
  } else if (vault.isCitadel) {
    const contract = await contractHelper.getEthereumContract(abi, address);

    const pricePerFullShareCurrent = await getCitadelPricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
    const pricePerFullShareOneDayAgo = await getCitadelPricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);

    // APY Calculation
    const n = 365 / 2; // Assume 2 days to trigger invest function
    const apr = (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n;
    const apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;

    return {
      apyInceptionSample: 0,
      apyOneDaySample: 0,
      apyThreeDaySample: 0,
      apyOneWeekSample: 0,
      apyOneMonthSample: 0,
      apyLoanscan: 0,
      compoundApy: 0,
      citadelApy: isNaN(apy) ? 0 : apy,
      elonApy: 0,
      cubanApy: 0,
      faangApy: 0,
      moneyPrinterApy: 0,
    }
  } else if (vault.isElon) {
    // Elon's APE Vault
    const contract = await contractHelper.getEthereumContract(abi, address);

    const pricePerFullShareCurrent = await getElonPricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
    const pricePerFullShareOneDayAgo = await getElonPricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);

    // APY Calculation
    const n = 365 / 2; // Assume 2 days to trigger invest function
    const apr = (0 < pricePerFullShareCurrent && 0 < pricePerFullShareOneDayAgo) ? (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n : 0;
    const apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;

    return {
      apyInceptionSample: 0,
      apyOneDaySample: 0,
      apyThreeDaySample: 0,
      apyOneWeekSample: 0,
      apyOneMonthSample: 0,
      apyLoanscan: 0,
      compoundApy: 0,
      citadelApy: 0,
      elonApy: apy,
      cubanApy: 0,
      faangApy: 0,
    }
  } else if (vault.isCuban) {
    // Cuban's APE Vault
    const contract = await contractHelper.getEthereumContract(abi, address);

    const pricePerFullShareCurrent = await getCubanPricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
    const pricePerFullShareOneDayAgo = await getCubanPricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);

    // APY Calculation
    const n = 365 / 2; // Assume 2 days to trigger invest function
    const apr = (0 < pricePerFullShareCurrent && 0 < pricePerFullShareOneDayAgo) ? (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n : 0;
    const apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;

    return {
      apyInceptionSample: 0,
      apyOneDaySample: 0,
      apyThreeDaySample: 0,
      apyOneWeekSample: 0,
      apyOneMonthSample: 0,
      apyLoanscan: 0,
      compoundApy: 0,
      citadelApy: 0,
      elonApy: 0,
      cubanApy: apy,
      faangApy: 0,
      moneyPrinterApy: 0,
    }
  } else if (vault.isFaang) {
    // DAO Faang Stonk Vault
    const contract = await contractHelper.getEthereumContract(abi, address);

    let pricePerFullShareCurrent = await getFaangPricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
    let pricePerFullShareOneDayAgo = await getFaangPricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);
    pricePerFullShareCurrent = (0 < pricePerFullShareCurrent) ? pricePerFullShareCurrent : 1;
    pricePerFullShareOneDayAgo = (0 < pricePerFullShareOneDayAgo) ? pricePerFullShareOneDayAgo : 1;

    // APY Calculation
    const n = 365 / 2; // Assume 2 days to trigger invest function
    const apr = (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n;
    const apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;

    return {
      apyInceptionSample: 0,
      apyOneDaySample: 0,
      apyThreeDaySample: 0,
      apyOneWeekSample: 0,
      apyOneMonthSample: 0,
      apyLoanscan: 0,
      compoundApy: 0,
      citadelApy: 0,
      elonApy: 0,
      cubanApy: 0,
      faangApy: apy,
      moneyPrinterApy: 0,
    }
  } else if (vault.isMetaverse) {
    // Metaverse Vault
    const contract = await contractHelper.getEthereumContract(abi, address);

    let pricePerFullShareCurrent = await getMetaversePricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
    let pricePerFullShareOneDayAgo = await getMetaversePricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);
    pricePerFullShareCurrent = (0 < pricePerFullShareCurrent) ? pricePerFullShareCurrent : 1;
    pricePerFullShareOneDayAgo = (0  < pricePerFullShareOneDayAgo) ? pricePerFullShareOneDayAgo : 1;

    // APY Calculation
    const n = 365 / 2; // Assume 2 days to trigger invest function
    const apr = (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n;
    let apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;

    if(apy === Infinity) {
      apy = 0;
    }

    return {
      apyInceptionSample: 0,
      apyOneDaySample: 0,
      apyThreeDaySample: 0,
      apyOneWeekSample: 0,
      apyOneMonthSample: 0,
      apyLoanscan: 0,
      compoundApy: 0,
      citadelApy: 0,
      elonApy: 0,
      cubanApy: apy,
      faangApy: 0,
      moneyPrinterApy: 0,
      metaverseApy: apy
    }
  } else if (vault.isHarvest) {
    // Harvest Vault
    const vaultContract = await contractHelper.getEthereumContract(abi, address);
    const strategyContract = await contractHelper.getEthereumContract(vault.strategyABI, vault.strategyContractAddress);

    // Get current price per full share
    const pool = await strategyContract.methods.pool().call();
    const totalSupply = await vaultContract.methods.totalSupply().call();
    const currentPricePerFullShare = pool / totalSupply;

    const dataRequiredForCalculation = {
      vaultContract,
      strategyContract,
      currentPricePerFullShare,
      lastMeasurement: vault.lastMeasurement,
      blockNumber: 0
    };

    // APR based on one day sample
    dataRequiredForCalculation.blockNumber = oneDayAgoBlock;
    const aprOneDaySample = await getHarvestFarmerAPR(dataRequiredForCalculation);

    // APR based on three day sample 
    dataRequiredForCalculation.blockNumber = threeDaysAgoBlock;
    const aprThreeDaySample = await getHarvestFarmerAPR(dataRequiredForCalculation);

    // APR based on one week sample 
    dataRequiredForCalculation.blockNumber = oneWeekAgoBlock;
    const aprOneWeekSample = await getHarvestFarmerAPR(dataRequiredForCalculation);

    // APR based on one month sample
    dataRequiredForCalculation.blockNumber = oneMonthAgoBlock;
    const aprOneMonthSample = await getHarvestFarmerAPR(dataRequiredForCalculation);

    const aprData = {
      aprOneDaySample,
      aprThreeDaySample,
      aprOneWeekSample,
      aprOneMonthSample
    }

    return {
      ...aprData,
      apyLoanscan: 0,
      compoundApy: 0,
      citadelApy: 0,
      elonApy: 0,
      cubanApy: 0,
      faangApy: 0,
      moneyPrinterApy: 0,
    };
  } else {
    // Yearn Vault
    const pool = _.find(pools, { symbol });
    var vaultContract = await contractHelper.getEthereumContract(abi,address);
     
    const pricePerFullShareInception = await getPricePerFullShare(
      vaultContract,
      inceptionBlockNbr,
      inceptionBlockNbr
    );
   
    const pricePerFullShareCurrent = await getPricePerFullShare(
      vaultContract,
      currentBlockNbr,
      inceptionBlockNbr
    );
    const pricePerFullShareOneDayAgo = await getPricePerFullShare(
      vaultContract,
      oneDayAgoBlock,
      inceptionBlockNbr
    );
    const pricePerFullShareThreeDaysAgo = await getPricePerFullShare(
      vaultContract,
      threeDaysAgoBlock,
      inceptionBlockNbr
    );
    const pricePerFullShareOneWeekAgo = await getPricePerFullShare(
      vaultContract,
      oneWeekAgoBlock,
      inceptionBlockNbr
    );
    const pricePerFullShareOneMonthAgo = await getPricePerFullShare(
      vaultContract,
      oneMonthAgoBlock,
      inceptionBlockNbr
    );
    const apyInceptionSample = getApy(
      pricePerFullShareInception,
      pricePerFullShareCurrent,
      inceptionBlockNbr,
      currentBlockNbr,
      nbrBlocksInDay
    );
   
    const apyOneDaySample =
      (getApy(
        pricePerFullShareOneDayAgo,
        pricePerFullShareCurrent,
        oneDayAgoBlock,
        currentBlockNbr,
        nbrBlocksInDay
      )) || apyInceptionSample;
      
    const apyThreeDaySample =
      (getApy(
        pricePerFullShareThreeDaysAgo,
        pricePerFullShareCurrent,
        threeDaysAgoBlock,
        currentBlockNbr,
        nbrBlocksInDay
      )) || apyInceptionSample;

    const apyOneWeekSample =
      (getApy(
        pricePerFullShareOneWeekAgo,
        pricePerFullShareCurrent,
        oneWeekAgoBlock,
        currentBlockNbr,
        nbrBlocksInDay
      )) || apyInceptionSample;
  
    const apyOneMonthSample =
      (getApy(
        pricePerFullShareOneMonthAgo,
        pricePerFullShareCurrent,
        oneMonthAgoBlock,
        currentBlockNbr,
        nbrBlocksInDay
      )) || apyInceptionSample;
  
    let apyLoanscan = 0;
  
    const apyData = {
      apyInceptionSample,
      apyOneDaySample,
      apyThreeDaySample,
      apyOneWeekSample,
      apyOneMonthSample,
    };
  
    if (pool) {
      const poolAddress = pool.address;
      const virtualPriceCurrent = await getVirtualPrice(
        poolAddress,
        currentBlockNbr
      );
      const virtualPriceOneDayAgo = await getVirtualPrice(
        poolAddress,
        oneDayAgoBlock
      );
     
      const poolApy = await getApy(
        virtualPriceOneDayAgo,
        virtualPriceCurrent,
        oneDayAgoBlock,
        currentBlockNbr,
        nbrBlocksInDay
      );
  
      const poolPct = poolApy / 100;
      const vaultPct = apyOneDaySample / 100;
      apyLoanscan = ((1 + poolPct) * (1 + vaultPct) - 1) * 100;
  
      return { ...apyData, poolApy, apyLoanscan };
    }
  
    return {
      ...apyData,
      apyLoanscan,
      compoundApy: 0,
      citadelApy: 0,
      elonApy: 0,
      cubanApy: 0,
      faangApy: 0,
      moneyPrinterApy: 0,
    };
  }
};

const getHistoricalAPY = async (startTime, contractAddress) => {
  var result = [];
  switch (contractAddress.toLowerCase()) {
    case testContracts.vault['yUSDT'].address:
    case mainContracts.vault['yUSDT'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.usdtFarmer);
      break;
    case testContracts.vault['yUSDC'].address:
    case mainContracts.vault['yUSDC'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.usdcFarmer);
      break;
    case testContracts.vault['yDAI'].address:
    case mainContracts.vault['yDAI'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.daiFarmer);
      break;
    case testContracts.vault['yTUSD'].address:
    case mainContracts.vault['yTUSD'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.tusdFarmer);
      break;
    case testContracts.farmer['cDAI'].address:
    case mainContracts.farmer['cDAI'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.cDaiFarmer);
      break;
    case testContracts.farmer['cUSDC'].address:
    case mainContracts.farmer['cUSDC'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.cUsdcFarmer);
      break;
    case testContracts.farmer['cUSDT'].address:
    case mainContracts.farmer['cUSDT'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.cUsdtFarmer);
      break;
    case testContracts.farmer['daoCDV'].address:
    case mainContracts.farmer['daoCDV'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.daoCDVFarmer);
      break;
    case testContracts.farmer['daoELO'].address:
    case mainContracts.farmer['daoELO'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.daoELOFarmer);
      break;
    case testContracts.farmer['daoCUB'].address:
    case mainContracts.farmer['daoCUB'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.daoCUBFarmer);
      break;
    case testContracts.farmer['daoMPT'].address:
    case mainContracts.farmer['daoMPT'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.daoMPTFarmer);
      break;
    case testContracts.farmer['daoSTO'].address:
    case mainContracts.farmer['daoSTO'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.daoSTOFarmer);
      break;
    case testContracts.farmer['daoMVF'].address:
    case mainContracts.farmer['daoMVF'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.daoMVFFarmer);
      break;
    case testContracts.farmer['hfDAI'].address: 
    case mainContracts.farmer['hfDAI'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.hfDaiFarmer);
      break;
    case testContracts.farmer['hfUSDC'].address: 
    case mainContracts.farmer['hfUSDC'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.hfUsdcFarmer);
      break;
    case testContracts.farmer['hfUSDT'].address: 
    case mainContracts.farmer['hfUSDT'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.hfUsdtFarmer);
      break;
  }

  return result;
}

const saveAndReadVault = async (vault, contracts) => {
  console.log(`Reading vault ${vault.id}`);
  if (!vault.vaultContractABI || !vault.vaultContractAddress) {
    console.log(`Vault ABI not found: ${vault.name}`);
    return null;
  }
  
  const apy = await getApyForVault(vault, contracts);

  var aprs = 0;
  if (vault.isYearn && process.env.PRODUCTION != '') {
    try {
      const aprContract = new infuraWeb3.eth.Contract(aggregatedContractABI, aggregatedContractAddress);
      var call = 'getAPROptions';//+asset.symbol
      aprs = await aprContract.methods[call](vault.erc20address).call();
    
      const keys = Object.keys(aprs)
      const workKeys = keys.filter((key) => {
        return isNaN(key)
      })
      const maxApr = Math.max.apply(Math, workKeys.map(function(o) {
        if(o === 'uniapr' || o === 'unicapr' || o === "iapr") {
          return aprs[o]-100000000000000000000
        }
        return aprs[o];
      }))
    
      aprs = infuraWeb3.utils.fromWei(maxApr.toFixed(0), 'ether')
    } catch (ex) {}
  }
  
  const symbol = vault.symbol;
  const data = {...apy,aprs,symbol};

  await saveHistoricalAPY(data, vault.vaultSymbol + '_historical-apy');
  return data;
};

const getStartTime = (days) => {
  var startTime = -1;

  switch (days) {
    case '1y': 
      startTime = moment().subtract(1, 'years');
      break;
    case '6m': 
      startTime = moment().subtract(6, "months");
      break;
    case '30d':
      startTime = moment().subtract(30, 'days');
      break;
    case '7d':
      startTime = moment().subtract(7, 'days');
      break;
    case '1d':
      startTime = moment().subtract(1, 'days');
      break;
  }

  return startTime;
}

const resultMapping = (apy) => {
  delete apy._id;
  return apy;
};

module.exports.findAllHistoricalAPY = async(startTime, network) => {
  try {
    const results = {};
    const contracts = contractHelper.getContractsFromDomain();

    for(const symbol of Object.keys(contracts.farmer)) {
      const vault = contracts.farmer[symbol];
    
      if(network !== "" && vault.network === network) {
        const collectionName = symbol + "_historical-apy";
        const historicalApys = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), collectionName);
        results[symbol] =  historicalApys.map(resultMapping);
      }
    }
    return results;
  } catch (err) {
    console.error("Error in findAllHistoricalAPY(): ", err);
  }
}

// Cronjob
module.exports.saveHandler = async () => {
  try {
    await delay(jobDelayTime.saveHistoricalApy);

    const oneDayAgo = moment().subtract(1, "days").valueOf();
    const threeDaysAgo = moment().subtract(3, "days").valueOf();
    const oneWeekAgo = moment().subtract(1, "weeks").valueOf();
    const oneMonthAgo = moment().subtract(1, "months").valueOf();

    console.log("Fetching Ethereum historical blocks", "Save Historical APY");
    currentBlockNbr = await contractHelper.getEthereumCurrentBlockNumber();
    console.log(`[Ethereum] Current Block Number: ${currentBlockNbr}`);
    oneDayAgoBlock = await contractHelper.getEthereumBlockNumberByTimeline(oneDayAgo);
    console.log(`[Ethereum] 1d ago Block Number: ${oneDayAgoBlock}`);
    threeDaysAgoBlock = await contractHelper.getEthereumBlockNumberByTimeline(threeDaysAgo);
    console.log(`[Ethereum] 3d ago Block Number: ${threeDaysAgoBlock}`);
    oneWeekAgoBlock = await contractHelper.getEthereumBlockNumberByTimeline(oneWeekAgo);
    console.log(`[Ethereum] 1w ago Block Number: ${oneWeekAgoBlock}`);
    oneMonthAgoBlock = await contractHelper.getEthereumBlockNumberByTimeline(oneMonthAgo);
    console.log(`[Ethereum] 1m ago Block Number: ${oneMonthAgoBlock}`);

    nbrBlocksInDay = currentBlockNbr - oneDayAgoBlock;
    console.log("Done fetching historical blocks");

  } catch (err) {
    console.error(err);
  }

  const vaultsWithApy = [];

  const contracts = contractHelper.getContractsFromDomain();

  for (const vault of vaults) {
    try {
      const vaultWithApy = await saveAndReadVault(vault, contracts);
      if (vaultWithApy !== null) {
        vaultsWithApy.push(vaultWithApy);
      }
      await delay(delayTime);
    } catch (err) {
      console.error(err);
    }
  }
  console.log(`[saveHistoricalAPY()] completed. ${new Date().getTime()}`);
}

// API Handler
module.exports.handleAllHistoricalAPY = async(req, res) => {
  if (req.params.days === null || req.params.days === "") {
    res.status(200).json({
      message: "Days is empty",
      body: null
    })
  }
  if(req.params.network === null || req.params.network === "") {
    res.status(200).json({
      message: "Network is empty",
      body: null
    })
  }

  const startTime = getStartTime(req.params.days);
  const network = req.params.network;
 
  if (startTime !== -1) {
    const results = await this.findAllHistoricalAPY(startTime.unix(), network);
    
    res.status(200).json({
      message: '',
      body: results
    })
  } else {
    res.status(200).json({
      message: "Please only pass '1y', '6m', '30d', '7d' or '1d' as days option.",
      body: null
    })
  }

}

// API Handler
module.exports.handleHistoricialAPY = async (req, res) => {
  if (req.params.days == null || req.params.days == '') {
    res.status(200).json({
      message: 'Days is empty.',
      body: null
    });
  } else if (req.params.contractAddress == null || req.params.contractAddress == '') {
    res.status(200).json({
      message: 'Contract Address is empty.',
      body: null
    });
  } else {
    const startTime = getStartTime(req.params.days);

    if (startTime !== -1) {
      var result = await getHistoricalAPY(startTime.unix(), req.params.contractAddress);
      // const resultMapping = (apy) => {
      //   delete apy._id;
      //   return apy;
      // };
      result = result.map(resultMapping);
      res.status(200).json({
        message: '',
        body: result
      })
    } else {
      res.status(200).json({
        message: "Please only pass '30d', '7d' or '1d' as days option.",
        body: null
      })
    }
  }
}

