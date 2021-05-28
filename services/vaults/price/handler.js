"use strict"

const {
  devContract,
  prodContract,
  testContracts,
  mainContracts,
} = require('../../../config/serverless/domain');
const earnABIContract = require('../../../config/abi').earnABIContract;
const vaultABIContract = require('../../../config/abi').vaultABIContract;
const {
  getContract,
  getPricePerFullShare
} = require('../../user/vaults/statistics/handler');
const db = require('../../../models/price.model');
const moment = require("moment");

const getCurrentPrice = async () => {
  let contracts = process.env.PRODUCTION != null && process.env.PRODUCTION != '' ? mainContracts : testContracts;

  for (const key of Object.keys(contracts.farmer)) {
    try {
      if (contracts.farmer[key].contractType === 'yearn') {
        const earnContract = getContract(contracts.earn[key].abi, contracts.earn[key].address);
        const vaultContract = getContract(contracts.vault[key].abi, contracts.vault[key].address);
    
        const earnPricePerFullShare = await getPricePerFullShare(earnContract);
        const vaultPricePerFullShare = await getPricePerFullShare(vaultContract);
        await db.add(key + '_price', {
          earnPrice: earnPricePerFullShare,
          vaultPrice: vaultPricePerFullShare,
          compoundExchangeRate: 0,
          price: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'compound') {
        const compoundContract = getContract(contracts.compund[key].abi, contracts.compund[key].address);
        const getCash = await compoundContract.methods.getCash().call({ from: account.address });
        const totalBorrows = await compoundContract.methods.totalBorrows().call({ from: account.address });
        const totalReserves = await compoundContract.methods.totalReserves().call({ from: account.address });
        const totalSupply = await compoundContract.methods.totalSupply().call({ from: account.address });
        const exchangeRate = (getCash + totalBorrows - totalReserves) / totalSupply;
    
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: exchangeRate,
          price: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'harvest') {
        const contract = getContract(contracts.harvest[key].abi, contracts.harvest[key].address);
        const pricePerFullShare = await getPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          price: pricePerFullShare
        })
      }
    } catch (err) {
      await db.add(key + '_price', {
        earnPrice: "0",
        vaultPrice: "0",
        compoundExchangeRate: 0,
        price: "0"
      }).catch((err) => console.log('err', err));
    }
  }
}

const getHistoricalPrice = async (startTime, collection) => {
  var result = [];
  result = await db.findPriceWithTimePeriods(collection, startTime, new Date().getTime())
  return result;
}

module.exports.handler = async () => {
  await getCurrentPrice();
}

module.exports.handleHistoricialPrice = async (req, res) => {
  if (req.params.days == null || req.params.days == '') {
    res.status(200).json({
      message: 'Days is empty.',
      body: null
    });
  } else if (req.params.farmer == null || req.params.farmer == '') {
    res.status(200).json({
      message: 'Farmer is empty.',
      body: null
    });
  } else {
    let collection = '';
    switch (req.params.farmer) {
      case db.usdtFarmer: 
        collection = db.usdtFarmer;
        break;
      case db.usdcFarmer:
        collection = db.usdcFarmer;
        break;
      case db.daiFarmer:
        collection = db.daiFarmer;
        break;
      case db.tusdFarmer:
        collection = db.tusdFarmer;
        break;
      case db.cUsdtFarmer: 
        collection = db.cUsdtFarmer;
        break;
      case db.cUsdcFarmer: 
        collection = db.cUsdcFarmer;
        break;
      case db.cDaiFarmer:
        collection = db.cDaiFarmer;
        break;
      case db.hfDaiFarmer: 
        collection = db.hfDaiFarmer;
        break;
      case db.hfUsdcFarmer: 
        collection = db.hfUsdcFarmer;
        break;
      case db.hfUsdtFarmer: 
        collection = db.hfUsdtFarmer;
        break;
      default:
        res.status(200).json({
          message: 'Invalid Farmer',
          body: null
        })
        return;
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
      var result = await getHistoricalPrice(startTime.unix(), collection);
      const resultMapping = (price) => {
        delete price._id;
        return price;
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
