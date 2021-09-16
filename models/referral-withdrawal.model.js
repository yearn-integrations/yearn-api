const mongo = require("../config/db");

const collection = "Referral-Withdrawal";

const findAll = async (query) => {
  const db = mongo.getDB();
  return await db.collection(collection).find(query).toArray();
};

const findOne = async (params) => {
  const db = mongo.getDB();
  return await db.collection(collection).findOne({
    address: params,
  });
};

const getTransaction = async (transactionID) => {
  const db = mongo.getDB();
  return await db.collection(collection).findOne({
    _id: transactionID,
  });
};

const withdrawAmount = async (params) => {
  const db = mongo.getDB();
  return await db.collection(collection).insertOne(params);
};

module.exports = {
  findAll,
  findOne,
  getTransaction,
  withdrawAmount,
};
