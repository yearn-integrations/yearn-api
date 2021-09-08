const mongo = require("../config/db");
//const subgraphUrl = process.env.SUBGRAPH_ENDPOINT;
//const polygonSubgraphUrl = process.env.POLYGON_SUBGRAPH_ENDPOINT;

const collection = "Referral-Deposit";

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

//Blockchain address, Amount, Referral

const depositAmount = async (params) => {
  return await db.collection(collection).insertOne(params);
};

module.exports = {
  findAll,
  getTransaction,
  depositAmount,
};
