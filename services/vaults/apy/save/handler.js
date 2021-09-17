require("dotenv").config();
const BigNumber = require("bignumber.js");
// const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const db = require('../../../../models/apy.model');
const moment = require("moment");
const delay = require("delay");
const vaults = require("./vaults");
const poolABI = require("./abis/pool");
const _ = require("lodash");
const { delayTime } = require("./config");

const contractHelper = require("../../../../utils/contract");

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
  currentBlockNbr,
  nbrBlocksInDay
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

const getPriceFromChainLink = async (block) => {
  let price = 0;

  try {
    const contracts = contractHelper.getContractsFromDomain();
    const contract = await contractHelper.getEthereumContract(contracts.chainLink.USDT_ETH.abi, contracts.chainLink.USDT_ETH.address);
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

const getCubanPricePerFullShare = async (contract, block, inceptionBlockNbr) => {
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

const getMetaversePricePerFullShare = async(contract, block, inceptionBlockNumber) => {
  const contractDidntExist = block < inceptionBlockNumber;
  const inceptionBlock = block === inceptionBlockNumber;

  if (inceptionBlock) {
    return 1e18;
  }
  if (contractDidntExist) {
    return 0;
  }

  let pricePerFullShare = 0;
  try {
    pricePerFullShare = await contract.methods.getPricePerFullShare().call(undefined, block);
  } catch (err) {
    console.error(`[apy/save/handler]Error in getMetaversePricePerFullShare(): `, err);
  } finally {
    return pricePerFullShare;
  }
}

const getVirtualPrice = async (address, block) => {
  const poolContract = contractHelper.getEthereumContract(poolABI, address);
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
    };
  } else if (vault.isCitadel) {
    // Citadel Vault
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
    // Cuban's Ape Vault
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
    }
  } else if (vault.isFaang) {
    // DAO Faang Stonk Vault
    const contract = await contractHelper.getEthereumContract(abi, address);

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
      cubanApy: 0,
      faangApy: apy,
    }
  } else if (vault.isHarvest) {
    // Harvest Vault
    const vaultContract = await contractHelper.getEthereumContract(abi, address);
    const strategyContract = await contractHelper.getEthereumContract(vault.strategyABI, vault.strategyContractAddress);

    // Get current price per full share
    const pool = strategyContract.methods.pool().call();
    const totalSupply = vaultContract.methods.totalSupply().call();
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
    };

  } else if (vault.isMetaverse) {
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
      cubanApy: 0,
      faangApy: 0,
      metaverseApy: apy
    }
  } else {
    // Yearn Vault
    const pool = _.find(pools, { symbol });
    var vaultContract = await contractHelper.getEthereumContract(abi, address);

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
    };
  }
};

const readVault = async (vault, contracts) => {
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
  const apy = await getApyForVault(vault, contracts);

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

    console.log("Fetching Ethereum historical blocks", "Save APY");
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

    const vaultsWithApy = [];
    const contracts = contractHelper.getContractsFromDomain();

    for (const vault of vaults) {
      const vaultWithApy = await readVault(vault, contracts);
      if (vaultWithApy !== null) {
        vaultsWithApy.push(vaultWithApy);
      }
      await delay(delayTime);
    }

    console.log(`[saveVaultAPY()] completed. ${new Date().getTime()}`);
  } catch (err) {
    console.error(err);
  }
};

module.exports.getApy = getApy;
module.exports.getVirtualPrice = getVirtualPrice;
module.exports.getCompoundSupplyApy = getCompoundSupplyApy;
module.exports.getPricePerFullShare = getPricePerFullShare;
module.exports.getCitadelPricePerFullShare = getCitadelPricePerFullShare;
module.exports.getElonPricePerFullShare = getElonPricePerFullShare;
module.exports.getCubanPricePerFullShare = getCubanPricePerFullShare;
module.exports.getFaangPricePerFullShare = getFaangPricePerFullShare;
module.exports.getHarvestFarmerAPR = getHarvestFarmerAPR;
module.exports.getMetaversePricePerFullShare = getMetaversePricePerFullShare;