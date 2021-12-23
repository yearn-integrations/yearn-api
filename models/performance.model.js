const mongo = require("../config/db");

const findAll = async (collection) => {
  const db = mongo.getDB();
  return await db
    .collection(collection + "_performance")
    .find({})
    .project({ _id: 0 })
    .toArray();
};

const findLatest = async (collection) => {
  const db = mongo.getDB();
  return await db
    .collection(collection + "_performance")
    .find()
    .project({ _id: 0 })
    .sort({ $natural: -1 })
    .limit(1)
    .toArray();
};

const findPerformanceWithTimePeriods = async (collection, startTime) => {
  const db = mongo.getDB();
  return await db
    .collection(collection + "_performance")
    .find({
      time_stamp: {
        $gte: startTime,
      },
    })
    .project({ _id: 0 })
    .toArray();
};

const add = async (collection, params) => {
  const db = mongo.getDB();
  if (!params.time_stamp) {
    Object.assign(params, {
      time_stamp: new Date().getTime(),
    });
  }
  return await db.collection(collection + "_performance").insertOne(params);
};

module.exports = {
  findAll,
  findLatest,
  findPerformanceWithTimePeriods,
  add,
  daoCDVFarmer: "daoCDV",
  daoELOFarmer: "daoELO",
  daoSTOFarmer: "daoSTO",
};
