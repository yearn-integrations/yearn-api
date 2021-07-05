require("dotenv").config();
const BigNumber = require("bignumber.js");
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

const getPriceFromChainLink = async (block) => {
  let contract, price = 0;
  if (process.env.PRODUCTION != '') {
    contract = new archiveNodeWeb3.eth.Contract(mainContracts.chainLink.USDT_ETH.abi, mainContracts.chainLink.USDT_ETH.address);
  } else {
    contract = new archiveNodeWeb3.eth.Contract(testContracts.chainLink.USDT_ETH.abi, testContracts.chainLink.USDT_ETH.address);
  }

  try {
    price = await contract.methods.latestAnswer().call(undefined, block);
  } catch (ex) { }
  await delay(delayTime);
  return price;
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
    const price = await getPriceFromChainLink(block);
    const pool = await contract.methods.getAllPoolInETH(price).call(undefined, block);
    const totalSupply = await contract.methods.totalSupply().call(undefined, block);
    pricePerFullShare = pool / totalSupply;
  } catch (ex) { }

  await delay(delayTime);
  return pricePerFullShare;
}

const getElonPricePerFullShare = async (contract, block, inceptionBlockNbr) => {
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
    const pool = await contract.methods.getAllPoolInUSD().call(undefined, block); // All pool in USD (6 decimals)
    const totalSupply = await contract.methods.totalSupply().call(undefined, block);
    pricePerFullShare = (new BigNumber(pool)).shiftedBy(12).dividedBy(totalSupply).toNumber();
  } catch (ex) { }

  await delay(delayTime);
  return pricePerFullShare;
}

const getFaangPricePerFullShare = async (contract, block, inceptionBlockNbr) => {
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
    const pool = await contract.methods.getTotalValueInPool().call(undefined, block);
    const totalSupply = await contract.methods.totalSupply().call(undefined, block);
    pricePerFullShare = pool / totalSupply;
  } catch (ex) { }

  await delay(delayTime);
  return pricePerFullShare;
}

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
  } catch (ex) { }

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
      cToken = new archiveNodeWeb3.eth.Contract(mainContracts.compund[symbol].abi, mainContracts.compund[symbol].address);
    } else {
      const symbol = Object.keys(testContracts.farmer).find((key) => testContracts.farmer[key].address.toLowerCase() === vault.vaultContractAddress.toLowerCase());
      cToken = new archiveNodeWeb3.eth.Contract(testContracts.compund[symbol].abi, testContracts.compund[symbol].address);
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
      elonApy: 0,
      faangApy: 0,
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
      faangApy: 0,
    }
  } else if (vault.isElon) {
    // Elon's Ape Vault
    let contract;
    if (process.env.PRODUCTION != '') {
      contract = new archiveNodeWeb3.eth.Contract(mainContracts.farmer['daoELO'].abi, mainContracts.farmer['daoELO'].address);
    } else {
      contract = new archiveNodeWeb3.eth.Contract(testContracts.farmer['daoELO'].abi, testContracts.farmer['daoELO'].address);
    }

    let pricePerFullShareCurrent = await getElonPricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
    let pricePerFullShareOneDayAgo = await getElonPricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);
    pricePerFullShareCurrent = (0 < pricePerFullShareCurrent) ? pricePerFullShareCurrent : 1; // 0 can't be used as a reference for apy.
    pricePerFullShareOneDayAgo = (0 < pricePerFullShareOneDayAgo) ? pricePerFullShareOneDayAgo : 1; // 0 can't be used as a reference for apy.

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
      elonApy: apy,
      faangApy: 0,
    }
  } else if (vault.isFaang) {
    // FAANG Stonk vault
    let contract;
    if (process.env.PRODUCTION != '') {
      contract = new archiveNodeWeb3.eth.Contract(mainContracts.farmer['daoSTO'].abi, mainContracts.farmer['daoSTO'].address);
    } else {
      contract = new archiveNodeWeb3.eth.Contract(testContracts.farmer['daoSTO'].abi, testContracts.farmer['daoSTO'].address);
    }

    let pricePerFullShareCurrent = await getFaangPricePerFullShare(contract, currentBlockNbr, inceptionBlockNbr);
    let pricePerFullShareOneDayAgo = await getFaangPricePerFullShare(contract, oneDayAgoBlock, inceptionBlockNbr);
    pricePerFullShareCurrent = (0 < pricePerFullShareCurrent) ? pricePerFullShareCurrent : 1;
    pricePerFullShareOneDayAgo = (0  < pricePerFullShareOneDayAgo) ? pricePerFullShareOneDayAgo : 1;

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
      faangApy: apy,
    }
  } else if (vault.isHarvest) {
    // Harvest Vault
    const vaultContract = new archiveNodeWeb3.eth.Contract(vault.vaultContractABI, vault.vaultContractAddress);
    const strategyContract = new archiveNodeWeb3.eth.Contract(vault.strategyABI, vault.strategyContractAddress);

    // Get current price per full share
    const pool = strategyContract.methods.pool().call();
    const totalSupply = vaultContract.methods.totalSupply().call();
    const currentPricePerFullShare = pool / totalSupply;

    const dataRequiredForCalculation = {
      vaultContract,
      strategyContract,
      currentPricePerFullShare,
      lastMeasurement: vault.lastMeasurement
    };

    // APR based on one day sample
    Object.assign(dataRequiredForCalculation, { blockNumber: oneDayAgoBlock });
    const aprOneDaySample = await getHarvestFarmerAPR(
      vaultContract,
      strategyContract,
      oneDayAgoBlock,
      currentPricePerFullShare);

    // APR based on three day sample 
    Object.assign(dataRequiredForCalculation, { blockNumber: threeDaysAgoBlock });
    const aprThreeDaySample = await getHarvestFarmerAPR(
      vaultContract,
      strategyContract,
      threeDaysAgoBlock,
      currentPricePerFullShare);

    // APR based on one week sample        
    Object.assign(dataRequiredForCalculation, { blockNumber: oneWeekAgoBlock });
    const aprOneWeekSample = await getHarvestFarmerAPR(
      vaultContract,
      strategyContract,
      oneWeekAgoBlock,
      currentPricePerFullShare);

    // APR based on one month sample
    Object.assign(dataRequiredForCalculation, { blockNumber: oneMonthAgoBlock });
    const aprOneMonthSample = await getHarvestFarmerAPR(
      vaultContract,
      strategyContract,
      oneMonthAgoBlock,
      currentPricePerFullShare);

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
      faangApy: 0,
    };

  } else {
    // Yearn Vault
    const pool = _.find(pools, { symbol });
    var vaultContract = new archiveNodeWeb3.eth.Contract(abi, address);

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
      elonApy: 0,
      faangApy: 0,
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

const getHarvestFarmerAPR = async (vaultData) => {
  const {
    vaultContract,
    strategyContract,
    currentPricePerFullShare,
    lastMeasurement,
    blockNumber,
  } = vaultData;

  let apr = 0;

  // To ensure block number happens after contract creation
  if (blockNumber >= lastMeasurement) {
    const pool = await strategyContract.methods.pool().call(undefined, blockNumber);
    const totalSupply = await vaultContract.methods.totalSupply().call(undefined, blockNumber);

    const pricePerFullShareOfBeforeDay = pool / totalSupply;

    // APR calculation
    apr = (currentPricePerFullShare - pricePerFullShareOfBeforeDay) * 100 * 365;
  }
  return apr;
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
