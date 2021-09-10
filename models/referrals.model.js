const mongo = require("../config/db");
const collection = "referrals";

//1. Address 2. Code

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

const addReferral = async (params) => {
  const db = mongo.getDB();
  return await db.collection(collection).insertOne(params);
};

/*
const obj1 = { address: "#efg", referral: "adi" };
const obj2 = { address: "#pqr", referral: "soon" };
const obj3 = { address: "#xyz", referral: "vic" };

addReferral(obj1);
addReferral(obj2);
addReferral(obj3);
*/

module.exports = {
  findAll,
  findOne,
  addReferral,
};
