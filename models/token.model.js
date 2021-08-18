const mongo = require('../config/db');
const collection = "tokens";


const getDB = () => {   
    return mongo.getDB();
}

const findAll = async() => {
    const db = getDB();
    return await db.collection(collection).find({}).toArray();
}

const findTokenByIds = async(tokenIds) => {
    const db = getDB();
    return await db.collection(collection).find({
        tokenId: {
            $in: tokenIds
        }
    }).toArray();
}

const getTokenByTokenId = async(tokenId) => {
    const db = getDB();
    return await db.collection(collection).findOne({
        tokenId: tokenId
    });
}

const add = async(params) => {
    const db = mongo.getDB();
    const token = await getTokenByTokenId(params.tokenId);

    Object.assign(params, {
        timestamp: new Date().getTime(),
        date: new Date().toLocaleString()
    });

    if(token !== null) {
        return await db.collection(collection).updateOne({
            tokenId: params.tokenId
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
    add,
    getTokenByTokenId,
    findAll,
    findTokenByIds
}