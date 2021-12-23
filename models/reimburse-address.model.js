const mongo = require('../config/db');
const collection = 'reimburse-address';
const BigNumber = require("bignumber.js");

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

const updateClaimAmount = async(params) => {
    const db = mongo.getDB();
    const result = await db.collection(collection).findOne({
      address: params.address
    });
    if (result != null) {
      const previousAmount = (result.claimAmount ? new BigNumber(result.claimAmount) : new BigNumber(0));
      const claimedAmount =  previousAmount.plus(params.amount).toFixed();

      return await db.collection(collection).updateOne({
        address: params.address
      },
      {
        $set: {
          "claimAmount": claimedAmount,
        }
      });
    }
} 

module.exports = {
  findAll,
  findOne,
  updateClaimAmount,
};