const mongo = require("../config/db");
// const collection = "tvl";

const findAll = async () => {
  const db = mongo.getDB();
  return await db.collection(collection).find({}).toArray();
};

// Get TVL based on farm name
// yUSDT, yUSDC, yDAI, yTUSD, cUSDT, cUSDC, yDAI
const getTVL = async (collection, params) => {
  const db = mongo.getDB();
  return await db
    .collection(collection)
    .find()
    .sort({ $natural: -1 })
    .limit(params.limit)
    .toArray();
};

const getTotalTVL = async (params) => {
  const db = mongo.getDB();
  return await db
    .collection("total_tvl")
    .find()
    .sort({ $natural: -1 })
    .limit(params.limit)
    .toArray();
};

const add = async (collection, params) => {
  const db = mongo.getDB();

  // add timestamp to params
  Object.assign(params, {
    timestamp: new Date().getTime(),
  });

  return await db.collection(collection).insertOne(params);
};

module.exports = {
  findAll,
  getTotalTVL,
  getTVL,
  add,
  usdtFarmer: "yUSDT_tvl",
  usdcFarmer: "yUSDC_tvl",
  tusdFarmer: "yTUSD_tvl",
  daiFarmer: "yDAI_tvl",
  cUsdtFarmer: "cUSDT_tvl",
  cUsdcFarmer: "cUSDC_tvl",
  cDaiFarmer: "cDAI_tvl",
};