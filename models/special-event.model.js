const mongo = require("../config/db");
const collection = "special_event";

// Get any event in which current datetime falls within data's start date and end date.
const getCurrentEvent = async() => {
    const db = mongo.getDB();
    return await db
        .collection(collection)
        .find({
            startTime: { 
                $lte: new Date().getTime()
            },
            endTime: {
                $gte: new Date().getTime()
            }
        })
        .sort({ startTime : -1 })
        .limit(1)
        .toArray();
};

const findAll = async() => {
    const db = mongo.getDB();
    return await db.collection(collection).find({}).toArray();
}

module.exports = {
    getCurrentEvent,
    findAll
}