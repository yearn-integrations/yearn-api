const mongo = require('../config/db');

const findAll = async (collection) => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const findPriceWithTimePeriods = async (collection, startTime, endTime) => {
  const db = mongo.getDB();
  return await db.collection(collection).find({
    timestamp: {
      $gte: startTime * 1000,
      $lte: endTime
    }
  }).toArray();
}

const add = async (collection, params) => {
  const db = mongo.getDB();
  Object.assign(params, {
    timestamp: new Date().getTime()
  })
  return await db.collection(collection).insertOne(params);
}

module.exports = {
  findAll,
  findPriceWithTimePeriods,
  add,
  usdtFarmer: 'yUSDT_price',
  usdcFarmer: 'yUSDC_price',
  tusdFarmer: 'yTUSD_price',
  daiFarmer: 'yDAI_price',
  cUsdtFarmer: 'cUSDT_price',
  cUsdcFarmer: 'cUSDC_price',
  cDaiFarmer: 'cDAI_price',
  daoCDVFarmer: 'daoCDV_price',
  hfDaiFarmer: 'hfDAI_price',
  hfUsdcFarmer: 'hfUSDC_price',
  hfUsdtFarmer: 'hfUSDT_price',
};