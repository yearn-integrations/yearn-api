const mongo = require("../config/db");
const collection = "airdrop";

const findOne = async(params) => {
    const db = mongo.getDB();
    return await db.collection(collection).findOne({
        address: params
    });
}

module.exports = {
    findOne
};