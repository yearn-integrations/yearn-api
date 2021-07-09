require('dotenv').config();
const express = require("express");
const db = require("./config/db");
const vaultsApy = require("./services/vaults/apy/handler");
const userStatistics = require("./services/user/vaults/statistics/handler");
const userTransactions = require("./services/user/vaults/transactions/handler");
const vaultsPrice = require("./services/vaults/price/handler");
const vaultsTvl = require("./services/vaults/tvl/handler");
const vaultHistoricalAPYSave = require("./services/vaults/apy/save/historical-handle");
const vaultCategory = require('./services/vaults/category/handler');
const stakeVIP = require('./services/staking/xdvg/handler');
const stakePool = require('./services/staking/handler');
const stakeXDvg = require('./services/staking/vipdvg/handler');
const stakeDaoStakes = require('./services/staking/dao-stake/handler');
const specialEvent = require("./services/user/special-event/handler");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const jobs = require("./jobs/task");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

async function init() {
  // Improve debugging
  process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at:", p, "reason:", reason);
  });

  db.connectDB(async (err) => {
    if (err) throw err;

    jobs.saveVault();
    jobs.saveVaultAPY();
    jobs.savePolygonVaultAPY();
    jobs.savePricePerFullShare();
    jobs.saveHistoricalAPY();
    jobs.savePolygonHistoricalAPY();
    jobs.saveHistoricalTVL();
    jobs.saveHistoricalPools();
    jobs.saveABIPools();
    jobs.saveVipApr();
  });

  app.use(cors());

  app.get("/vaults/apy", (req, res) => vaultsApy.handler(res));
  app.get("/user/:userAddress/vaults/statistics", (req, res) =>
    userStatistics.handler(req, res)
  );
  app.get("/user/:userAddress/vaults/transactions", (req, res) =>
    userTransactions.handler(req, res)
  );
  app.get("/vaults/price/:farmer/:days", (req, res) =>
    vaultsPrice.handleHistoricialPrice(req, res)
  );
  app.get("/vaults/historical-apy/:contractAddress/:days", (req, res) =>
    vaultHistoricalAPYSave.handleHistoricialAPY(req, res)
  );
  app.get("/vaults/tvl/total", (req, res) =>
    vaultsTvl.totalHandle(req, res)
  );
  app.get("/vaults/tvl/:farmer", (req, res) =>
    vaultsTvl.tvlHandle(req, res)
  );
  app.get("/vaults/category", (req, res) =>
    vaultCategory.getVaultCategory(req, res)
  );
  app.get("/staking/get-vip-tokens", (req, res) =>
    stakeVIP.getVipDVGToken(req, res)
  );
  app.get("/staking/get-pools", (req, res) =>
    stakePool.getPools(req, res)
  );
  app.get("/staking/get-xdvg-stake", (req, res) => stakeXDvg.getxDVGStake(req, res));
  app.get('/event/verify', (req,res) => specialEvent.handleVerifyEvent(req, res));
  app.get('/event/verify/:amount', (req, res) => specialEvent.handler(req, res));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.listen(port, () => console.log(`Listening on ${port}`));
}

init();
