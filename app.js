const express = require("express");
const db = require("./config/db");
const vaultsApy = require("./services/vaults/apy/handler");
const userStatistics = require("./services/user/vaults/statistics/handler");
const userTransactions = require("./services/user/vaults/transactions/handler");
const vaultsPrice = require("./services/vaults/price/handler");
const vaultsTvl = require("./services/vaults/tvl/handler");
const vaultHistoricalAPYSave = require("./services/vaults/apy/save/historical-handle");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const jobs = require("./jobs/task");

async function init() {
  // Improve debugging
  process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at:", p, "reason:", reason);
  });

  db.connectDB(async (err) => {
    if (err) throw err;

    jobs.saveVault();
    jobs.saveVaultAPY();
    jobs.savePricePerFullShare();
    jobs.saveHistoricalAPY();
    jobs.saveHistoricalTVL();
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
  app.get("/vaults/tvl/:farmer", (req, res) =>
    vaultsTvl.getTVLhandle(req, res)
  );

  app.get("/vaults/tvl/total", (req, res) =>
    vaultsTvl.getTotalTVLhandle(req, res)
  );

  app.listen(port, () => console.log(`Listening on ${port}`));
}

init();
