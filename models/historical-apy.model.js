const mongo = require('../config/db');

const findAll = async (collection) => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const findWithTimePeriods = async (startTime, endTime, collection) => {
  const db = mongo.getDB();
  return await db.collection(collection).find({
    timestamp: {
      $gte: startTime,
      $lte: endTime
    }
  }).toArray();
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
  add,
  usdtFarmer: 'yUSDT_historical-apy',
  usdcFarmer: 'yUSDC_historical-apy',
  tusdFarmer: 'yTUSD_historical-apy',
  daiFarmer: 'yDAI_historical-apy',
  cUsdtFarmer: 'cUSDT_historical-apy',
  cUsdcFarmer: 'cUSDC_historical-apy',
  cDaiFarmer: 'cDAI_historical-apy',
  daoCDVFarmer: 'daoCDV_historical-apy',
};