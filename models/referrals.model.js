const mongo = require("../config/db");
const collection = "referrals";

//1. Address 2. Referral associated with address

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const findOne = async (params) => {
  const db = mongo.getDB();
  return await db.collection(collection).findOne({
    address: params.address,
  });
};

const checkReferral = async (referral) => {
  const db = mongo.getDB();
  return await db.collection(collection).findOne({
    referral: referral,
  });
};

const addReferral = async (params) => {
  const db = mongo.getDB();
  return await db.collection(collection).insertOne(params);
};

module.exports = {
  findAll,
  findOne,
  addReferral,
  checkReferral,
};
