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

const updateStatus = async (id, amount) => {
  const db = mongo.getDB();
  const result = await db.collection(collection).findOne({
    _id: id,
  });
  if (result) {
    return await db.collection(collection).updateOne(
      {
        _id: id,
      },
      {
        $set: {
          status: "success",
          amount: amount,
        },
      }
    );
  }
};

module.exports = {
  findAll,
  findOne,
  getTransaction,
  withdrawAmount,
  updateStatus,
};
