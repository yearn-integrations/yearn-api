require("dotenv").config();
const historicalDb = require('../../../../models/historical-apy.model');

const delay = require("delay");
const { delayTime } = require("./config");

const _ = require("lodash");
const vaults = require("./vaults");

const contractHelper = require("../../../../utils/contract");
const dateTimeHelper = require("../../../../utils/dateTime");

const { testContracts, mainContracts } = require("../../../../config/serverless/domain");

const {
  getCitadelPricePerFullShare,
  getElonPricePerFullShare,
  getCubanPricePerFullShare,
  getFaangPricePerFullShare,
  getMetaversePricePerFullShare,
  getCitadelV2PricePerFullShare,
  getDaoStonksPricePerFullShare
} = require("./handler");

let currentBlockNbr;
let oneDayAgoBlock;

const saveHistoricalAPY = async (data, collection) => {
  await historicalDb.add(data, collection).catch((err) => console.log('err', err));
};

const getApyForVault = async (vault, contracts) => {
  const {
    lastMeasurement: inceptionBlockNbr,
    vaultContractABI: abi,
    vaultContractAddress: address,
  } = vault;

  if (vault.isCitadel) {
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
  } else if (vault.isCitadelV2) {
    // Metaverse Vault
    const contract = await contractHelper.getEthereumContract(abi, address);

    let pricePerFullShareCurrent = await getCitadelV2PricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
    let pricePerFullShareOneDayAgo = await getCitadelV2PricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);
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
      citadelv2Apy: apy
    }
  } else if (vault.isDaoStonks) {
      // Metaverse Vault
      const contract = await contractHelper.getEthereumContract(abi, address);
  
      let pricePerFullShareCurrent = await getDaoStonksPricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
      let pricePerFullShareOneDayAgo = await getDaoStonksPricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);
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
        metaverseApy: 0,
        daoStonksApy: apy
      }
    } 
};

const getHistoricalAPY = async (startTime, contractAddress) => {
  var result = [];
  switch (contractAddress.toLowerCase()) {
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
    case testContracts.farmer['daoCDV2'].address:
    case mainContracts.farmer['daoCDV2'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.daoCDV2Farmer);
    case testContracts.farmer['daoSTO2'].address:
    case mainContracts.farmer['daoSTO2'].address:
      result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime(), historicalDb.daoSTO2Farmer);
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
  const symbol = vault.symbol;
  const data = {...apy,symbol};

  await saveHistoricalAPY(data, vault.vaultSymbol + '_historical-apy');
  return data;
};

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
    const oneDayAgo = dateTimeHelper.toMillisecondsTimestamp(
      dateTimeHelper.subtractDay(1, new Date())
    );
    
    console.log("Fetching Ethereum historical blocks", "Save Historical APY");
    currentBlockNbr = await contractHelper.getEthereumCurrentBlockNumber();
    console.log(`[Ethereum] Current Block Number: ${currentBlockNbr}`);
    oneDayAgoBlock = await contractHelper.getEthereumBlockNumberByTimeline(oneDayAgo);
    console.log(`[Ethereum] 1d ago Block Number: ${oneDayAgoBlock}`);

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

  const startTime = dateTimeHelper.getStartTimeFromParameter(req.params.days);
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
    const startTime = dateTimeHelper.getStartTimeFromParameter(req.params.days);

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

