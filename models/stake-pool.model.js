const mongo = require('../config/db');
const collection = 'stake_pool';

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const add = async (params) => {
  const db = mongo.getDB();
  const result = await db.collection(collection).findOne({
    name: params.name
  });

  Object.assign(params, {
    timestamp: new Date().getTime(),
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
    findAll,
    add
};