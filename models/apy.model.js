const mongo = require('../config/db');
const collection = 'apy';

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const add = async (params) => {
  const db = mongo.getDB();
  
  const result = await db.collection(collection).findOne({
    vaultSymbol: params.vaultSymbol
  });
  if (result != null) {
    return await db.collection(collection).updateOne({
      vaultSymbol: params.vaultSymbol
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