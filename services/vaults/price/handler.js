"use strict"

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

const getCubanElonPricePerFullShare = async (contract) => {
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

const getPricePerFullShare = async(contract, vaultSymbol) => {
  let pricePerFullShare = 0;
  try {
    pricePerFullShare = await contract.methods.getPricePerFullShare().call();
    pricePerFullShare = new BigNumber(pricePerFullShare).shiftedBy(-18).toNumber();
  } catch (ex) {
    console.error(`[price/handler] Error in getPricePerFullShare(): ${vaultSymbol} `, ex);
  } finally {
    return pricePerFullShare;
  }
}

const getCurrentPrice = async () => {
  let contracts = contractHelper.getContractsFromDomain();

  for (const key of Object.keys(contracts.farmer)) {
    const { abi, address, network, contractType } = contracts.farmer[key];
    const contract = await contractHelper.getContract(abi, address, network);

    let pricePerFullShare = 0;

    try {
      if (contractType === 'citadel') {
        pricePerFullShare = await getCitadelPricePerFullShare(contract);
      } else if (contractType === 'elon' || contractType === 'cuban') {
        pricePerFullShare = await getCubanElonPricePerFullShare(contract);
      } else if (contracts.farmer[key].contractType === 'daoFaang') {
        pricePerFullShare = await getFaangPricePerFullShare(contract);
      } else if (contracts.farmer[key].contractType === 'moneyPrinter') {
        pricePerFullShare = await getMoneyPrinterPricePerFullShare(contract);
      } else {
        pricePerFullShare = await getPricePerFullShare(contract, key);
      }
      
      pricePerFullShare = isNaN(pricePerFullShare) ? 0 : pricePerFullShare;
    } catch (err) {
      console.error(`Error in getCurrentPrice(): ${key}`, err);
    } finally {
      await db.add(key + '_price', {
        price: pricePerFullShare
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
  const startTime = await dateTimeHelper.getStartTimeFromParameter(req.params.days);
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

