const mongo = require('../config/db');

const findAll = async (collection) => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const findWithTimePeriods = async (startTime, endTime, collection, descending) => {
  const db = mongo.getDB();
  return await db.collection(collection).find({
    timestamp: {
      $gte: startTime * 1000,
      $lte: endTime
    }
  }).sort({
    timestamp: descending !== undefined ? -1 : 1
  }).toArray();
}

const getLatestNonZeroMoneyPrinterHistoricalAPY = async() => {
  const db = mongo.getDB();
  return await db.collection("daoMPT_historical-apy").find({
    moneyPrinterApy: {
      $ne: 0
    }
  }).sort({
    timestamp: -1
  }).limit(1).toArray();
}

const add = async (params, collection) => {
  const db = mongo.getDB();
  Object.assign(params, {
    timestamp: new Date().getTime()
  })
  return await db.collection(collection).insertOne(params);
}

module.exports = {
  findAll,
  findWithTimePeriods,
  getLatestNonZeroMoneyPrinterHistoricalAPY,
  add,
  usdtFarmer: 'yUSDT_historical-apy',
  usdcFarmer: 'yUSDC_historical-apy',
  tusdFarmer: 'yTUSD_historical-apy',
  daiFarmer: 'yDAI_historical-apy',
  cUsdtFarmer: 'cUSDT_historical-apy',
  cUsdcFarmer: 'cUSDC_historical-apy',
  cDaiFarmer: 'cDAI_historical-apy',
  daoCDVFarmer: 'daoCDV_historical-apy',
  daoELOFarmer: 'daoELO_historical-apy',
  daoCUBFarmer: 'daoCUB_historical-apy',
  daoSTOFarmer: 'daoSTO_historical-apy',
  daoSTO2Farmer: 'daoSTO2_historical-apy',
  daoMPTFarmer: 'daoMPT_historical-apy',
  daoMVFFarmer: 'daoMVF_historical-apy',
  daoCDV2Farmer: 'daoCDV2_historical-apy',
  daoTASFarmer: 'daoTAS_historical-apy',
  hfDaiFarmer: 'hfDAI_historical-apy',
  hfUsdcFarmer: 'hfUSDC_historical-apy',
  hfUsdtFarmer: 'hfUSDT_historical-apy',  
};