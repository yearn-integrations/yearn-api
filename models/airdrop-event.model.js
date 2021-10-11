const mongo = require("../config/db");
const collection = "airdrop_event";

const findOne = async(params) => {
    const db = mongo.getDB();
    return await db.collection(collection).findOne({
        address :  { $regex : new RegExp(params, "i") }
    });
}

module.exports = {
    findOne
};