"use strict"

const {
  testContracts,
  mainContracts,
} = require('../../../config/serverless/domain');
const {
  getContract,
  getPricePerFullShare
} = require('../../user/vaults/statistics/handler');
const db = require('../../../models/price.model');
const BigNumber = require("bignumber.js");
const moment = require("moment");
const delay = require("delay");
const { delayTime } = require("../apy/save/config");
const Web3 = require("web3");
const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT;
const archiveNodeWeb3 = new Web3(archiveNodeUrl);

const getPriceFromChainLink = async () => {
  let contract, price = 0;
  if (process.env.PRODUCTION != '') {
    contract = new archiveNodeWeb3.eth.Contract(mainContracts.chainLink.USDT_ETH.abi, mainContracts.chainLink.USDT_ETH.address);
  } else {
    contract = new archiveNodeWeb3.eth.Contract(testContracts.chainLink.USDT_ETH.abi, testContracts.chainLink.USDT_ETH.address);
  }

  try {
    price = await contract.methods.latestAnswer().call();
  } catch (ex) {}
  await delay(delayTime);
  return price;
};

const getCitadelPricePerFullShare = async (contract) => {
  let pricePerFullShare = 0;
  try {
    const price = await getPriceFromChainLink();
    const pool = await contract.methods.getAllPoolInETH(price).call();
    const totalSupply = await contract.methods.totalSupply().call();
    pricePerFullShare = pool / totalSupply;
  } catch (ex) {}
  
  await delay(delayTime);
  return pricePerFullShare;
}

const getElonPricePerFullShare = async (contract) => {
  let pricePerFullShare = 0;
  try {
    const pool = await contract.methods.getAllPoolInUSD().call(); // All pool in USD (6 decimals)
    const totalSupply = await contract.methods.totalSupply().call();
    pricePerFullShare = (new BigNumber(pool)).shiftedBy(12).dividedBy(totalSupply).toNumber();
  } catch (ex) {}

  await delay(delayTime);
  return pricePerFullShare;
}

const getFaangPricePerFullShare = async (contract) => {
  let pricePerFullShare = 0;
  try {
    const pool = await contract.methods.getTotalValueInPool().call();
    const totalSupply = await contract.methods.totalSupply().call();
    pricePerFullShare = pool / totalSupply;
  } catch (ex) {}
  await delay(delayTime);
  return pricePerFullShare;
}

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
          citadelPrice: 0,
          elonPrice: 0,
          harvestPrice: 0
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'compound') {
        const compoundContract = getContract(contracts.compund[key].abi, contracts.compund[key].address);
        const getCash = await compoundContract.methods.getCash().call();
        const totalBorrows = await compoundContract.methods.totalBorrows().call();
        const totalReserves = await compoundContract.methods.totalReserves().call();
        const totalSupply = await compoundContract.methods.totalSupply().call();
        const exchangeRate = (getCash + totalBorrows - totalReserves) / totalSupply;
    
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: exchangeRate,
          citadelPrice: 0,
          elonPrice: 0,
          faangPrice: 0,
          harvestPrice: 0,
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'citadel') {
        const contract = getContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getCitadelPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: isNaN(pricePerFullShare) ? 0 : pricePerFullShare,
          elonPrice: 0,
          faangPrice: 0,
          harvestPrice: 0,
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'elon') {
        const contract = getContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getElonPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: pricePerFullShare,
          faangPrice: 0,
          harvestPrice: 0,
        }).catch((err) => console.log('err', err));
      } else if(contracts.farmer[key].contractType === 'daoFaang') {
        const contract = getContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const pricePerFullShare = await getFaangPricePerFullShare(contract);
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: 0,
          faangPrice: pricePerFullShare,
          harvestPrice: 0,
        }).catch((err) => console.log('err', err));
      } else if (contracts.farmer[key].contractType === 'harvest') {
        // Get vault contract and strategy contract
        const vaultContract = getContract(contracts.farmer[key].abi, contracts.farmer[key].address);
        const strategyContract = getContract(contracts.farmer[key].strategyABI, contracts.farmer[key].strategyAddress);

        // Get pool
        const pool = await strategyContract.methods.pool().call(); 

        // Get total supply
        const totalSupply = await vaultContract.methods.totalSupply().call();

        // Calculate price per full share
        const pricePerFullShare = pool / totalSupply;
     
        await db.add(key + '_price', {
          earnPrice: 0,
          vaultPrice: 0,
          compoundExchangeRate: 0,
          citadelPrice: 0,
          elonPrice: 0,
          faangPrice: 0,
          harvestPrice: pricePerFullShare,
        })
      }
    } catch (err) {
      await db.add(key + '_price', {
        earnPrice: "0",
        vaultPrice: "0",
        compoundExchangeRate: 0,
        citadelPrice: 0,
        elonPrice: 0,
        faangPrice: 0,
        harvestPrice: "0"
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
      case db.daoCDVFarmer:
        collection = db.daoCDVFarmer;
        break;
      case db.daoELOFarmer:
        collection = db.daoELOFarmer;
        break;
      case db.daoSTOFarmer: 
        collection = db.daoSTOFarmer;
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
