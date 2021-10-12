const mongo = require("../config/db");
const collection = "total-deposited-amount";

const findAll = async() => {
    const db = mongo.getDB();
    return await db.collection(collection).find({}).toArray();
}

const getStrategyTotalDepositedAmount = async(symbol) => {
    const db = mongo.getDB();
    return await db.collection(collection).findOne({
        symbol: symbol
    })
}

const add = async (params) => {
    const db = mongo.getDB();
    
    const result = await getStrategyTotalDepositedAmount(params.symbol);
    
    if (result != null) {
      return await db.collection(collection).updateOne({
        symbol: params.symbol
      },
      {
        $set: {
          ...params
        }
      });
    } else {
      return await db.collection(collection).insertOne(params);
    }
}

module.exports = {
    findAll,
    getStrategyTotalDepositedAmount,
    add
};