const mongo = require('../config/db');
const collection = 'emergency-withdraw';

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const add = async (params) => {
  const db = mongo.getDB();

  const result = await db.collection(collection).findOne({
    pid: params.pid,
    userAddress: params.userAddress,
  });
  if (result != null) {
    return await db.collection(collection).updateOne({
        pid: params.pid,
        userAddress: params.userAddress,
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

const findOne = async (params) => {
    const db = mongo.getDB();
    return await db.collection(collection).findOne({
        pid: params.pid,
        userAddress: params.userAddress,
    });
}

module.exports = {
  findAll,
  add,
  findOne,
};