"use strict"

const {
  getPricePerFullShare
} = require('../../user/vaults/statistics/handler');
const db = require('../../../models/price.model');
const BigNumber = require("bignumber.js");
const moment = require("moment");
const delay = require("delay");
const { delayTime } = require("../apy/save/config");

const contractHelper = require("../../../utils/contract");
const priceFeedHelper = require("../../../utils/chainlinkHelper");
const dateTimeHelper = require("../../../utils/dateTime");

const getCitadelPricePerFullShare = async (contract) => {
  let pricePerFullShare = 0;
  try {
    const price = await priceFeedHelper.getEthereumUSDTETHPrice();
    const pool = await contract.methods.getAllPoolInETH(price).call();
    const totalSupply = await contract.methods.totalSupply().call();
    pricePerFullShare = pool / totalSupply;
  } catch (ex) { }

  await delay(delayTime);
  return pricePerFullShare;
}

const getElonPricePerFullShare = async (contract) => {
  let pricePerFullShare = 0;
  try {
    const pool = await contract.methods.getAllPoolInUSD().call(); // All pool in USD (6 decimals)
    const totalSupply = await contract.methods.totalSupply().call();
    pricePerFullShare = (new BigNumber(pool)).shiftedBy(12).dividedBy(totalSupply).toNumber();
  } catch (ex) { }

  await delay(delayTime);
  return pricePerFullShare;
}

const getCubanPricePerFullShare = async (contract) => {
  let pricePerFullShare = 0;
  try {
    const pool = await contract.methods.getAllPoolInUSD().call(); // All pool in USD (6 decimals)
    const totalSupply = await contract.methods.totalSupply().call();
    pricePerFullShare = (new BigNumber(pool)).shiftedBy(12).dividedBy(totalSupply).toNumber();
  } catch (ex) { }

  await delay(delayTime);
  return pricePerFullShare;
}

const getFaangPricePerFullShare = async (contract) => {
  let pricePerFullShare = 0;
  try {
    const pool = await contract.methods.getTotalValueInPool().call();
    const totalSupply = await contract.methods.totalSupply().call();
    pricePerFullShare = pool / totalSupply;
  } catch (ex) { }
  await delay(delayTime);
  return pricePerFullShare;
}

const getMoneyPrinterPricePerFullShare = async (contract) => {
  let pricePerFullShare = 0;
  try {
    const pool = await contract.methods.getValueInPool().call();
    const totalSupply = await contract.methods.totalSupply().call();
    pricePerFullShare = pool / totalSupply;
  } catch (ex) { }
  await delay(delayTime);
  return pricePerFullShare;
}

const getMetaversePricePerFullShare = async(contract) => {
  let pricePerFullShare = 0;
  try {
    const pool = await contract.methods.getAllPoolInUSD().call();
    const totalSupply = await contract.methods.totalSupply().call();

    if(parseInt(pool) === 0 || parseInt(totalSupply) === 0) {
      pricePerFullShare = 0;
    } else {
      pricePerFullShare = pool / totalSupply;
    }
  } catch (ex) {
    console.error(`[price/handler] Error in getMetaversePricePerFullShare(): `, ex);
  } finally {
    return pricePerFullShare;
  }
}

const getCitadelV2PricePerFullShare = async(contract) => {
  let pricePerFullShare = 0;
  try {
    pricePerFullShare = await contract.methods.getPricePerFullShare().call();
    pricePerFullShare = new BigNumber(pricePerFullShare).shiftedBy(-18).toNumber();
  } catch (ex) {
    console.error(`[price/handler] Error in getCitadelV2PricePerFullShare(): `, ex);
  } finally {
    return pricePerFullShare;
  }
}


const getDAOStonksPricePerFullShare = async(contract) => {
  let pricePerFullShare = 0;
  try {
    const pool = await contract.methods.getAllPoolInUSD().call();
    const totalSupply = await contract.methods.totalSupply().call();

    if(parseInt(pool) === 0 || parseInt(totalSupply) === 0) {
      pricePerFullShare = 0;
    } else {
      pricePerFullShare = pool / totalSupply;
    }
  } catch (ex) {
    console.error(`[price/handler] Error in getDAOStonksPricePerFullShare(): `, ex);
  } finally {
    return pricePerFullShare;
  }
}

const getDaoDegenPricePerFullShare = async(contract, block) => {
  let pricePerFullShare = 0;
  try {
    pricePerFullShare = await contract.methods.getPricePerFullShare().call(undefined, block);
    pricePerFullShare = new BigNumber(pricePerFullShare).shiftedBy(-18).toNumber();
  } catch (err) {
    console.error(`[apy/save/handler]Error in getDaoDegenPricePerFullShare(): `, err);
  } finally {
    return pricePerFullShare;
  }
}


const getCurrentPrice = async () => {
  let contracts = contractHelper.getContractsFromDomain();

  for (const key of Object.keys(contracts.farmer)) {
    try {
      if (contracts.farmer[key].contractType === 'citadel') {
        const contract = await contractHelper.getEthereumContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getCitadelPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: isNaN(pricePerFullShare) ? 0 : pricePerFullShare,
          elonPrice: 0,
          cubanPrice: 0,
          faangPrice: 0,
          moneyPrinterPrice: 0,
          harvestPrice: 0,
          metaversePrice: 0,
          daoStonksPrice: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'elon') {
        const contract = await contractHelper.getEthereumContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getElonPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: pricePerFullShare,
          cubanPrice: 0,
          faangPrice: 0,
          harvestPrice: 0,
          metaversePrice: 0,
          citadelv2Price: 0,
          daoStonksPrice: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'cuban') {
        const contract = await contractHelper.getEthereumContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getCubanPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: 0,
          cubanPrice: pricePerFullShare,
          faangPrice: 0,
          moneyPrinterPrice: 0,
          harvestPrice: 0,
          metaversePrice: 0,
          citadelv2Price: 0,
          daoStonksPrice: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'metaverse') {
        const contract = await contractHelper.getEthereumContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getMetaversePricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: 0,
          cubanPrice: 0,
          faangPrice: 0,
          moneyPrinterPrice: 0,
          harvestPrice: 0,
          metaversePrice: pricePerFullShare,
          citadelv2Price: 0,
          daoStonksPrice: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'daoFaang') {
        const contract = await contractHelper.getEthereumContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getFaangPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: 0,
          cubanPrice: 0,
          faangPrice: pricePerFullShare,
          moneyPrinterPrice: 0,
          harvestPrice: 0,
          metaversePrice: 0,
          citadelv2Price: 0,
          daoStonksPrice: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'daoStonks') {
        const contract = await contractHelper.getEthereumContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getDAOStonksPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: 0,
          cubanPrice: 0,
          faangPrice: 0,
          moneyPrinterPrice: 0,
          harvestPrice: 0,
          metaversePrice: 0,
          citadelv2Price: 0,
          daoStonksPrice: pricePerFullShare
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'moneyPrinter') {
        const contract = await contractHelper.getPolygonContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getMoneyPrinterPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: 0,
          faangPrice: 0,
          moneyPrinterPrice: pricePerFullShare,
          harvestPrice: 0,
          metaversePrice: 0,
          citadelv2Price: 0,
          daoStonksPrice: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === "citadelv2") {
        const contract = await contractHelper.getEthereumContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getCitadelV2PricePerFullShare(contract);

        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: pricePerFullShare,
          cubanPrice: 0,
          faangPrice: 0,
          harvestPrice: 0,
          metaversePrice: 0,
          citadelv2Price: pricePerFullShare,
          daoStonksPrice: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === "daoDegen") {
        const contract = await contractHelper.getBscContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getDaoDegenPricePerFullShare(contract);

        await db.add(key + '_price', {
          price: pricePerFullShare
        })
      }
    } catch (err) {
      await db.add(key + '_price', {
        price: 0
      }).catch((err) => console.log('err', err));
    }
  }
}

const getHistoricalPrice = async (startTime, collection) => {
  var result = [];
  result = await db.findPriceWithTimePeriods(collection, startTime, new Date().getTime())
  return result;
}

const resultMapping = (apy) => {
  delete apy._id;
  return apy;
};

module.exports.handler = async () => {
  await getCurrentPrice();
}

module.exports.handleHistoricialPrice = async (req, res) => {
  let message = "Successful response";
  let result = null;

  try {
    if (req.params.days == null || req.params.days == '') {
      throw(`Days is empty`);
    }
    if (req.params.farmer == null || req.params.farmer == '') {
      throw(`Strategy ID is empty`);
    }

    const strategyId = req.params.farmer;
    if(!contractHelper.checkIsValidStrategyId(strategyId)) {
      throw(`Invalid Strategy ID`);
    }

    let startTime = dateTimeHelper.getStartTimeFromParameter(req.params.days);
    if(startTime === -1) {
      throw(`Please only pass '1y', '6m', 30d', '7d' or '1d' as days option.`)
    }
    startTime = dateTimeHelper.toTimestamp(startTime);

    const collectionName = `${strategyId}_price`;
    result = await getHistoricalPrice(startTime, collectionName);
    const resultMapping = (price) => {
      delete price._id;
      return price;
    };
    result = result.map(resultMapping);
    
  } catch(err) {
    message = err;
    console.error(`Error in handleHistoricialPrice(): `, err);
  } finally {
    res.status(200).json({
      message: message,
      body: result
    });
  }
}

module.exports.getAllVaultHistoricalPrice = async (startTime, network) => {
  try {
    const contracts = contractHelper.getContractsFromDomain();
    const results = {};

    for(const symbol of Object.keys(contracts.farmer)) {
      const vault = contracts.farmer[symbol];
    
      if(network !== "" && vault.network === network) {
        const collectionName = symbol + "_price";
        console.log(`Reading collection in getAllVaultHistoricalPrice(): ${collectionName}`);
        const historicalPrice = await getHistoricalPrice(startTime.unix(), collectionName);
        
        results[symbol] =  historicalPrice.map(resultMapping);
      }
    }
    return results;
  } catch (err) {
    console.error("Error in getAllVaultHistoricalPrice()", err);
    return;
  }
}

module.exports.handleAllHistoricialPrice = async (req, res) => {
  if (req.params.days == null || req.params.days == '') {
    res.status(200).json({
      message: 'Days is empty.',
      body: null
    });
  }

  if (req.params.network === null || req.params.network === "") {
    res.status(200).json({
      message: 'Network is empty.',
      body: null
    });
  }

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
    const results = await this.getAllVaultHistoricalPrice(startTime, req.params.network);

    res.status(200).json({
      message: "Success!",
      body: results
    })
  } else {
    res.status(200).json({
      message: "Please only pass '30d', '7d' or '1d' as days option.",
      body: null
    })
  }
}

