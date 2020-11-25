const express = require('express');
const db = require('./config/db')
const vaultsApy = require('./services/vaults/apy/handler');
const vaultApySave = require('./services/vaults/apy/save/handler');
const userStatistics = require('./services/user/vaults/statistics/handler');
const userTransactions = require('./services/user/vaults/transactions/handler');
const vaultSave = require('./services/vaults/save/handler');
const app = express();
const port = process.env.PORT || 8080;

async function init() {
  // Improve debugging
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason)
  });

  db.connectDB(async (err) => {
    if (err) throw err;
  })

  // TODO Run Cron Job everyday 00:00 (Save Vault APY, Save Vault, Add Price Updated and store into database)

  app.get('/vaults/apy', (req, res) => vaultsApy.handler(res));
  app.get('/vaults/apy/save', (req, res) => vaultApySave.handler(res));
  app.get('/vaults/save', (req, res) => vaultSave.handler(res));
  app.get('/user/:userAddress/vaults/statistics', (req, res) => userStatistics.handler(req, res));
  app.get('/user/:userAddress/vaults/tranasctions', (req, res) => userTransactions.handler(req, res));

  app.listen(port, () => console.log(`Listening on ${port}`));
};

init();


