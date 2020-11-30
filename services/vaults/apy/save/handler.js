require("dotenv").config();
const AWS = require("aws-sdk");
// const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const db = require('../../../../models/apy.model');
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
const { devContract, prodContract } = require('../../../../config/serverless/domain');

let currentBlockNbr;
let oneDayAgoBlock;
let threeDaysAgoBlock;
let oneWeekAgoBlock;
let oneMonthAgoBlock;
let nbrBlocksInDay;
const oneDayAgo = moment().subtract(1, "days").valueOf();
const threeDaysAgo = moment().subtract(3, "days").valueOf();
const oneWeekAgo = moment().subtract(1, "weeks").valueOf();
const oneMonthAgo = moment().subtract(1, "months").valueOf();

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

const saveVault = async (data) => {
  // const params = {
  //   TableName: "vaultApy",
  //   Item: data,
  // };
  // await db
  //   .put(params)
  //   .promise()
  //   .catch((err) => console.log("err", err));

  await db.add(data).catch((err) => console.log('err', err));
  console.log(`Saved ${data.name}`);
};

const saveHistoricalAPY = async (data) => {
  await historicalDb.add(data).catch((err) => console.log('err', err));
};

const getApy = async (
  previousValue,
  currentValue,
  previousBlockNbr,
  currentBlockNbr
) => {
  if (!previousValue) {
    return 0;
  }
  const pricePerFullShareDelta = (currentValue - previousValue) / 1e18;
  const blockDelta = currentBlockNbr - previousBlockNbr;
  const dailyRoi = (pricePerFullShareDelta / blockDelta) * 100 * nbrBlocksInDay;
  const yearlyRoi = dailyRoi * 365;
  return yearlyRoi;
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
  const pricePerFullShare = await vaultContract.methods
    .getPricePerFullShare()
    .call(undefined, block);
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

  const now = Date.now();

  const apyInceptionSample = await getApy(
    pricePerFullShareInception,
    pricePerFullShareCurrent,
    inceptionBlockNbr,
    currentBlockNbr
  );

  const apyOneDaySample =
    (await getApy(
      pricePerFullShareOneDayAgo,
      pricePerFullShareCurrent,
      oneDayAgoBlock,
      currentBlockNbr
    )) || apyInceptionSample;

  const apyThreeDaySample =
    (await getApy(
      pricePerFullShareThreeDaysAgo,
      pricePerFullShareCurrent,
      threeDaysAgoBlock,
      currentBlockNbr
    )) || apyInceptionSample;

  const apyOneWeekSample =
    (await getApy(
      pricePerFullShareOneWeekAgo,
      pricePerFullShareCurrent,
      oneWeekAgoBlock,
      currentBlockNbr
    )) || apyInceptionSample;

  const apyOneMonthSample =
    (await getApy(
      pricePerFullShareOneMonthAgo,
      pricePerFullShareCurrent,
      oneMonthAgoBlock,
      currentBlockNbr
    )) || apyInceptionSample;

  let apyLoanscan = apyOneDaySample;

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
  };
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
  if (contractAddress == devContract.devYfUSDTContract || contractAddress == prodContract.prodYfUSDTContract) {
    result = await historicalDb.findWithTimePeriods(startTime, new Date().getTime())
  }
  return result;
}

const readVault = async (vault) => {
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
  const contract = new infuraWeb3.eth.Contract(abi, address);
  const apy = await getApyForVault(vault);
  const loanscanApy = await getLoanscanApyForVault(vault);
  console.log("Vault: ", name, apy);
  const data = {
    address,
    name,
    symbol,
    description,
    vaultSymbol,
    description,
    tokenAddress,
    timestamp: Date.now(),
    ...apy,
  };
  await saveVault(data);
  return data;
};

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
  const aprContract = new infuraWeb3.eth.Contract(aggregatedContractABI, prodContract.aggregatedContractAddress);
  var call = 'getAPROptions';//+asset.symbol
  var aprs = 0;
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
  console.log("Vault: ", name, apy);
  const data = {
    ...apy,
    aprs,
    symbol
  };
  await saveHistoricalAPY(data);
  return data;
};

module.exports.saveHandler = async () => {
  console.log("Fetching historical blocks");
  currentBlockNbr = await infuraWeb3.eth.getBlockNumber();
  await delay(delayTime);
  oneDayAgoBlock = (await blocks.getDate(oneDayAgo)).block;
  threeDaysAgoBlock = (await blocks.getDate(threeDaysAgo)).block;
  oneWeekAgoBlock = (await blocks.getDate(oneWeekAgo)).block;
  oneMonthAgoBlock = (await blocks.getDate(oneMonthAgo)).block;
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

module.exports.handler = async () => {
  console.log("Fetching historical blocks");
  currentBlockNbr = await infuraWeb3.eth.getBlockNumber();
  await delay(delayTime);
  oneDayAgoBlock = (await blocks.getDate(oneDayAgo)).block;
  threeDaysAgoBlock = (await blocks.getDate(threeDaysAgo)).block;
  oneWeekAgoBlock = (await blocks.getDate(oneWeekAgo)).block;
  oneMonthAgoBlock = (await blocks.getDate(oneMonthAgo)).block;
  nbrBlocksInDay = currentBlockNbr - oneDayAgoBlock;
  console.log("Done fetching historical blocks");

  const vaultsWithApy = [];
  for (const vault of vaults) {
    const vaultWithApy = await readVault(vault);
    if (vaultWithApy !== null) {
      vaultsWithApy.push(vaultWithApy);
    }
    await delay(delayTime);
  }
};
