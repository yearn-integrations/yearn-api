const mongo = require("../config/db");
const collection = "total-deposited-amount";

const getCollectionName = (symbol) => {
  return `${symbol}_total_deposited_amount`;
}

const findAll = async(symbol) => {
    const db = mongo.getDB();
    const collectionName = getCollectionName(symbol);
    return await db.collection(collectionName).find({}).toArray();
}

const getStrategyTotalDepositedAmount = async(symbol) => {
    const db = mongo.getDB();
    const collectionName = getCollectionName(symbol);
    return await db.collection(collectionName).findOne({
        symbol: symbol
    })
}

const add = async (params) => {
    const db = mongo.getDB();
    const collectionName = getCollectionName(params.symbol);
    return await db.collection(collectionName).insertOne(params);
}

const getLatestTotalAmountDepositInfo = async(symbol) => {
  const db = mongo.getDB();
  const collectionName = getCollectionName(symbol);

  const latestData = await db.collection(collectionName).find({}).sort({ timestamp: -1 }).limit(1).toArray();

  return latestData;
}

module.exports = {
    findAll,
    getStrategyTotalDepositedAmount,
    add,
    getLatestTotalAmountDepositInfo
};