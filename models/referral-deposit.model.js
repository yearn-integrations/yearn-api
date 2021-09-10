const mongo = require("../config/db");
const collection = "Referral-Deposit";
//const subgraphUrl = process.env.SUBGRAPH_ENDPOINT;
//const polygonSubgraphUrl = process.env.POLYGON_SUBGRAPH_ENDPOINT;

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
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

//Blockchain address, Amount, Referral

const depositAmount = async (params) => {
  const db = mongo.getDB();
  return await db.collection(collection).insertOne(params);
};

module.exports = {
  findAll,
  findOne,
  getTransaction,
  depositAmount,
};
