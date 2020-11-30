"use strict"

const {
  devContract,
  prodContract,
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
  let earnAddress = "";
  let vaultAddress = "";

  if (process.env.PRODUCTION != null && process.env.PRODUCTION != '') {
    earnAddress = prodContract.prodEarnContract;
    vaultAddress = prodContract.prodVaultContract;
  } else {
    earnAddress = devContract.devEarnContract;
    vaultAddress = devContract.devVaultContract;
  }

  
  const earnContract = getContract(earnABIContract, earnAddress);
  const vaultContract = getContract(vaultABIContract, vaultAddress);

  const earnPricePerFullShare = await getPricePerFullShare(earnContract);
  const vaultPricePerFullShare = await getPricePerFullShare(vaultContract);
  await db.add({
    earnPrice: earnPricePerFullShare,
    vaultPrice: vaultPricePerFullShare,
  }).catch((err) => console.log('err', err));
}

const getHistoricalPrice = async (startTime, contractAddress) => {
  var result = [];
  if (contractAddress == devContract.devYfUSDTContract || contractAddress == prodContract.prodYfUSDTContract) {
    result = await db.findPriceWithTimePeriods(startTime, new Date().getTime())
  }
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
      var result = await getHistoricalPrice(startTime.unix(), req.params.contractAddress);
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
