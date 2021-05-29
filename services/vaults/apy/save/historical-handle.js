require("dotenv").config();
const historicalDb = require('../../../../models/historical-apy.model');
const Web3 = require("web3");
const moment = require("moment");
const delay = require("delay");
const _ = require("lodash");
const vaults = require("./vaults");
const EthDater = require("./ethereum-block-by-date.js");
const { delayTime } = require("./config");
const poolABI = require("./abis/pool");
const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT;
const infuraUrl = process.env.WEB3_ENDPOINT;
const archiveNodeWeb3 = new Web3(archiveNodeUrl);
const infuraWeb3 = new Web3(infuraUrl);
const blocks = new EthDater(archiveNodeWeb3, delayTime);
const { aggregatedContractABI } = require('../../../../config/abi');
const { aggregatedContractAddress, testContracts, mainContracts } = require('../../../../config/serverless/domain');

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

const getApy = (
  previousValue,
  currentValue,
  previousBlockNbr,
  currentBlockNbr
) => {
  if (!previousValue) {
    return 0;
  }
  const blockDelta = currentBlockNbr - previousBlockNbr;
  const returnSincePrevBlock = (currentValue - previousValue) / previousValue;
  const days = blockDelta / nbrBlocksInDay;
  const yearlyRoi = 100 * ((1 + returnSincePrevBlock) ** (365.2425 / days) - 1);
  return yearlyRoi;
};

const getCompoundSupplyApy = async (cToken) => {
  const ethMantissa = 1e18;
  const blocksPerDay = 4 * 60 * 24;
  const daysPerYear = 365;

  const supplyRatePerBlock = await cToken.methods.supplyRatePerBlock().call();
  const supplyApy = (((Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
  return supplyApy;
};

const getVirtualPrice = async (address, block) => {
  const poolContract = new archiveNodeWeb3.eth.Contract(poolABI, address);
  const virtualPrice = await poolContract.methods
    .get_virtual_price()
    .call(undefined, block);
  await delay(delayTime);
  return virtualPrice;
};

const getPricePerFullShare = async (
  vaultContract,
  block,
  inceptionBlockNbr
) => {
  const contractDidntExist = block < inceptionBlockNbr;
  const inceptionBlock = block === inceptionBlockNbr;

  if (inceptionBlock) {
    return 1e18;
  }
  if (contractDidntExist) {
    return 0;
  }
  let pricePerFullShare = 0;
  try {
    pricePerFullShare = await vaultContract.methods
    .getPricePerFullShare()
    .call(undefined, block);
  } catch (ex) {}
  await delay(delayTime);
  return pricePerFullShare;
};

const getCitadelPricePerFullShare = async (contract, block, inceptionBlockNbr) => {
  const contractDidntExist = block < inceptionBlockNbr;
  const inceptionBlock = block === inceptionBlockNbr;

  if (inceptionBlock) {
    return 1e18;
  }
  if (contractDidntExist) {
    return 0;
  }

  let pricePerFullShare = 0;
  try {
    const pool = await contract.methods.getAllPoolInETH().call(undefined, block);
    const totalSupply = await contract.methods.totalSupply().call(undefined, block);
    pricePerFullShare = pool / totalSupply;
  } catch (ex) {}
  
  await delay(delayTime);
  return pricePerFullShare;
};

const getApyForVault = async (vault) => {
  const {
    lastMeasurement: inceptionBlockNbr,
    vaultContractABI: abi,
    vaultContractAddress: address,
    symbol,
  } = vault;

  // Compound Vault
  if (vault.isCompound) {
    let cToken;

    if (process.env.PRODUCTION != '') {
      const symbol = Object.keys(mainContracts.farmer).find((key) => mainContracts.farmer[key].address.toLowerCase() === vault.vaultContractAddress.toLowerCase());
      cToken = new archiveNodeWeb3.eth.Contract(mainContracts.compund[symbol].abi,  mainContracts.compund[symbol].address);
    } else {
      const symbol = Object.keys(testContracts.farmer).find((key) => testContracts.farmer[key].address.toLowerCase() === vault.vaultContractAddress.toLowerCase());
      cToken = new archiveNodeWeb3.eth.Contract(testContracts.compund[symbol].abi,  testContracts.compund[symbol].address);
    }
    const compoundApy = await getCompoundSupplyApy(cToken)
    return {
      apyInceptionSample: 0,
      apyOneDaySample: 0,
      apyThreeDaySample: 0,
      apyOneWeekSample: 0,
      apyOneMonthSample: 0,
      apyLoanscan: 0,
      compoundApy,
      citadelApy: 0,
    };
  } else if (vault.isCitadel) {
    // Citadel Vault
    let contract;
    if (process.env.PRODUCTION != '') {
      contract = new archiveNodeWeb3.eth.Contract(mainContracts.farmer['daoCDV'].abi, mainContracts.farmer['daoCDV'].address);
    } else {
      contract = new archiveNodeWeb3.eth.Contract(testContracts.farmer['daoCDV'].abi, testContracts.farmer['daoCDV'].address);
    }

    const pricePerFullShareCurrent = await getCitadelPricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
    const pricePerFullShareOneDayAgo = await getCitadelPricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);

    // APY Calculation
    const n = 365 / 2; // Assume 2 days to trigger invest function
    const apr = (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n;
    const apy = Math.pow((1 + apr / n), n) - 1;

    return {
      apyInceptionSample: 0,
      apyOneDaySample: 0,
      apyThreeDaySample: 0,
      apyOneWeekSample: 0,
      apyOneMonthSample: 0,
      apyLoanscan: 0,
      compoundApy: 0,
      citadelApy: apy,
    }
  } else {
    // Yearn Vault
    const pool = _.find(pools, { symbol });
    const vaultContract = new archiveNodeWeb3.eth.Contract(abi, address);

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
      currentBlockNbr
    );
  
    const apyOneDaySample =
      (getApy(
        pricePerFullShareOneDayAgo,
        pricePerFullShareCurrent,
        oneDayAgoBlock,
        currentBlockNbr
      )) || apyInceptionSample;
  
    const apyThreeDaySample =
      (getApy(
        pricePerFullShareThreeDaysAgo,
        pricePerFullShareCurrent,
        threeDaysAgoBlock,
        currentBlockNbr
      )) || apyInceptionSample;
  
    const apyOneWeekSample =
      (getApy(
        pricePerFullShareOneWeekAgo,
        pricePerFullShareCurrent,
        oneWeekAgoBlock,
        currentBlockNbr
      )) || apyInceptionSample;
  
    const apyOneMonthSample =
      (getApy(
        pricePerFullShareOneMonthAgo,
        pricePerFullShareCurrent,
        oneMonthAgoBlock,
        currentBlockNbr
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
        currentBlockNbr
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
    };
  }
};

const getLoanscanApyForVault = async (vault) => {
  const {
    lastMeasurement: inceptionBlockNbr,
    vaultContractABI: abi,
    vaultContractAddress: address,
  } = vault;

  const vaultContract = new archiveNodeWeb3.eth.Contract(abi, address);

  const pricePerFullShareInception = await getPricePerFullShare(
    vaultContract,
    inceptionBlockNbr,
    inceptionBlockNbr
  );
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
  }

  return result;
}

const saveAndReadVault = async (vault) => {
  const {
    name,
    symbol,
    description,
    vaultSymbol,
    vaultContractABI: abi,
    vaultContractAddress: address,
    erc20address: tokenAddress,
  } = vault;
  console.log(`Reading vault ${vault.name}`);
  if (!abi || !address) {
    console.log(`Vault ABI not found: ${name}`);
    return null;
  }
  const apy = await getApyForVault(vault);
  var aprs = 0;
  if (vault.isYearn && process.env.PRODUCTION != '') {
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
  }
  
  const data = {
    ...apy,
    aprs,
    symbol
  };
  await saveHistoricalAPY(data, vaultSymbol + '_historical-apy');
  return data;
};

module.exports.saveHandler = async () => {
  try {
    const oneDayAgo = moment().subtract(1, "days").valueOf();
    const threeDaysAgo = moment().subtract(3, "days").valueOf();
    const oneWeekAgo = moment().subtract(1, "weeks").valueOf();
    const oneMonthAgo = moment().subtract(1, "months").valueOf();

    console.log("Fetching historical blocks", 'save APY history');
    currentBlockNbr = await infuraWeb3.eth.getBlockNumber();
    console.log("currentBlockNbr", currentBlockNbr);
    oneDayAgoBlock = (await blocks.getDate(oneDayAgo)).block;
    console.log("oneDayAgoBlock", oneDayAgoBlock);
    threeDaysAgoBlock = (await blocks.getDate(threeDaysAgo)).block;
    console.log("threeDaysAgoBlock", threeDaysAgoBlock);
    oneWeekAgoBlock = (await blocks.getDate(oneWeekAgo)).block;
    console.log("oneWeekAgoBlock", oneWeekAgoBlock);
    oneMonthAgoBlock = (await blocks.getDate(oneMonthAgo)).block;
    console.log("oneMonthAgoBlock", oneMonthAgoBlock);
    nbrBlocksInDay = currentBlockNbr - oneDayAgoBlock;
    console.log("Done fetching historical blocks");

    const vaultsWithApy = [];
    for (const vault of vaults) {
      const vaultWithApy = await saveAndReadVault(vault);
      if (vaultWithApy !== null) {
        vaultsWithApy.push(vaultWithApy);
      }
      await delay(delayTime);
    }
  } catch (err) {
    console.error(err);
  }
}

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
    var startTime = -1;
    switch (req.params.days) {
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

    if (startTime !== -1) {
      var result = await getHistoricalAPY(startTime.unix(), req.params.contractAddress);
      const resultMapping = (apy) => {
        delete apy._id;
        return apy;
      };
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
