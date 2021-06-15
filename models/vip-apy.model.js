const mongo = require('../config/db');
const collection = 'vip-apy';

const findOne = async (params) => {
  const db = mongo.getDB();
  return await db.collection(collection).findOne({
      name: params.name
  });
};

const add = async (params) => {
  const db = mongo.getDB();
  const result = await db.collection(collection).findOne({
    name: params.name
  });
  if (result != null) {
    return await db.collection(collection).updateOne({
      name: params.name
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
    findOne,
    add
};