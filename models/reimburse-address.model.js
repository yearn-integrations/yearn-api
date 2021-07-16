const mongo = require('../config/db');
const collection = 'reimburse-address';

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

const findOne = async (params) => {
    const db = mongo.getDB();
    return await db.collection(collection).findOne({
        address: params,
    });
}

module.exports = {
  findAll,
  findOne,
};