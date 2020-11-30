const mongo = require('../config/db');
const collection = 'yfUSDT_price';

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const findPriceWithTimePeriods = async (startTime, endTime) => {
  const db = mongo.getDB();
  return await db.collection(collection).find({
    timestamp: {
      $gte: startTime,
      $lte: endTime
    }
  }).toArray();
}

const add = async (params) => {
  const db = mongo.getDB();
  Object.assign(params, {
    timestamp: new Date().getTime()
  })
  return await db.collection(collection).insertOne(params);
}

module.exports = {
  findAll,
  findPriceWithTimePeriods,
  add
};