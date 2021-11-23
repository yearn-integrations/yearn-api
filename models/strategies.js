const mongo = require("../config/db");
const collection = "strategies";

const findByNetwork = async (network) => {
    const db = mongo.getDB();
    return await db.collection(collection).find({network}).toArray();
};

module.exports = {
    findByNetwork
};