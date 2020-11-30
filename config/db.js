const MongoClient = require('mongodb').MongoClient;
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
  AUTH_MECHANISM
} = process.env;
const Api = require('../utils/api')

let _db;
const connectDB = async (callback) => {
  var url = '';
  if (process.env.PRODUCTION != null && process.env.PRODUCTION != '') {
    url = `mongodb://${encodeURIComponent(MONGO_USERNAME)}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authMechanism=${AUTH_MECHANISM}`;
    // url = `mongodb://${MONGO_HOSTNAME}`;
  } else {
    url = `mongodb://${MONGO_HOSTNAME}`;
  }
  MongoClient.connect(url, {
    reconnectTries: Number.MAX_VALUE,
    autoReconnect: true,
    useNewUrlParser: true,
  }, (err, client) => {
    if (err) {
      console.error(err);
      Api.pushSlackErrorAlert('Yearn API\nDB Connection', "", JSON.stringify(err))
    } else {
      console.log('Connected successfully to database');
      _db = client.db(MONGO_DB, { useUnifiedTopology: true });
    }
      
    return callback(err);
  })
};

const getDB = () => _db;

module.exports = { connectDB, getDB };