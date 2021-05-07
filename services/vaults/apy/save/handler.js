require("dotenv").config();
const AWS = require("aws-sdk");
// const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const db = require('../../../../models/apy.model');
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
const { testContracts, mainContracts } = require('../../../../config/serverless/domain');

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

const saveVaultWithApy = async (data) => {
  await db.add(data).catch((err) => console.log('err', err));
  console.log(`Saved ${data.name}`);
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
    };
  } else {
    // Yearn Vault
    const pool = _.find(pools, { symbol });
    var vaultContract;
    if (vault.isHarvest) {
      const envContracts = process.env.PRODUCTION != null && process.env.PRODUCTION != '' ? mainContracts : testContracts;
      vaultContract = new archiveNodeWeb3.eth.Contract(envContracts.harvest[vault.id].abi, envContracts.harvest[vault.id].address);
    } else {
      vaultContract = new archiveNodeWeb3.eth.Contract(abi, address);
    }

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
  // const contract = new infuraWeb3.eth.Contract(abi, address);
  const apy = await getApyForVault(vault);

  // const loanscanApy = await getLoanscanApyForVault(vault);
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
  await saveVaultWithApy(data);
  return data;
};

module.exports.handler = async () => {
  try {
    const oneDayAgo = moment().subtract(1, "days").valueOf();
    const threeDaysAgo = moment().subtract(3, "days").valueOf();
    const oneWeekAgo = moment().subtract(1, "weeks").valueOf();
    const oneMonthAgo = moment().subtract(1, "months").valueOf();

    console.log("Fetching historical blocks", 'save Vault APY');
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
  } catch (err) {
    console.error(err);
  }
};
