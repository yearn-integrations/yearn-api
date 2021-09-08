const mongo = require("../config/db");

const collection = "Referral-Withdrawal";

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const getTransaction = async (transactionID) => {
  const db = mongo.getDB();
  return await db.collection(collection).findOne({
    _id: transactionID,
  });
};

const withdrawAmount = async (params) => {
  return await db.collection(collection).insertOne(params);
};

module.exports = {
  findAll,
  getTransaction,
  withdrawAmount,
};
