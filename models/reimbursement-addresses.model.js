const mongo = require('../config/db');

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection("reimburse-address").find({}).project({ _id: 0 }).toArray();
};

const find = async (address) => {
  const db = mongo.getDB();
  const _address = address.toLowerCase();
  return await db.collection("reimburse-address").find({ address: _address }).project({ _id: 0 }).toArray();
};

const add = async (params) => {
  const db = mongo.getDB();
  return await db.collection("reimburse-address").insertOne(params);
}

const drop = async () => {
  const db = mongo.getDB();
  return await db.collection("reimburse-address").drop();
}

module.exports = {
  findAll,
  find,
  add,
  drop,
};