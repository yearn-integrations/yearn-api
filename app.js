require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const vaultsApy = require("./services/vaults/apy/handler");
const userStatistics = require("./services/user/vaults/statistics/handler");
const userTransactions = require("./services/user/vaults/transactions/handler");
const vaultsPrice = require("./services/vaults/price/handler");
const vaultsTvl = require("./services/vaults/tvl/handler");
const vaultHistoricalAPYSave = require("./services/vaults/apy/save/historical-handle");
const vaultCategory = require("./services/vaults/category/handler");
const vaultPerformance = require("./services/vaults/performance/handler");
const stakeVIP = require("./services/staking/xdvg/handler");
const stakePool = require("./services/staking/handler");
const stakeXDvg = require("./services/staking/vipdvg/handler");
const reimbursementAddresses = require("./services/reimbursement/handler");
const stakeDaoStakes = require("./services/staking/dao-stake/handler");
const specialEvent = require("./services/user/special-event/handler");
const reimburse = require("./services/user/reimburse/handler");
const referral = require("./services/referral/handler");
const deposit = require("./services/referral/deposit/handler");
const withdraw = require("./services/referral/deposit/handler");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const jobs = require("./jobs/task");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const bodyParser = require("body-parser");

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
    jobs.savePerformance();
  });

  app.use(cors());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());

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
  app.get("/vaults/tvl/total", (req, res) => vaultsTvl.totalHandle(req, res));
  app.get("/vaults/tvl/:farmer", (req, res) => vaultsTvl.tvlHandle(req, res));
  app.get("/vaults/category", (req, res) =>
    vaultCategory.getVaultCategory(req, res)
  );
  app.get("/staking/get-vip-tokens", (req, res) =>
    stakeVIP.getVipDVGToken(req, res)
  );
  app.get("/staking/get-pools", (req, res) => stakePool.getPools(req, res));
  app.get("/staking/get-xdvg-stake", (req, res) =>
    stakeXDvg.getxDVGStake(req, res)
  );
  app.get("/staking/get-xdvd-stake", (req, res) => {
    stakeXDvg.getxDVDStake(req, res);
  });
  app.get("/event/verify", (req, res) =>
    specialEvent.handleVerifyEvent(req, res)
  );
  app.get("/event/verify/:amount", (req, res) =>
    specialEvent.handler(req, res)
  );

  app.get("/vaults/performance/:farmer/:days", (req, res) =>
    vaultPerformance.performanceHandle(req, res)
  );
  app.get("/vaults/performance/:farmer", (req, res) =>
    vaultPerformance.performanceHandle(req, res)
  );

  app.get("/reimbursement-addresses/dvg", (req, res) =>
    reimbursementAddresses.handler(req, res)
  );

  app.get("/reimbursement-addresses/dvg/:address", (req, res) =>
    reimbursementAddresses.handler(req, res)
  );

  app.get("/vaults/pnl/:farmer/:days", (req, res) =>
    vaultPerformance.pnlHandle(req, res)
  );
  app.get("/vaults/pnl/:farmer", (req, res) =>
    vaultPerformance.pnlHandle(req, res)
  );

  app.post("/staking/emergency-withdraw-snapshot", (req, res) =>
    stakePool.snapshotEmergency(req, res)
  );

  app.get("/user/reimburse-address/:address", (req, res) =>
    reimburse.getReimburseAddress(req, res)
  );

  /*
  app.get("/user/:referral", (req, res) => {
    referral.checkReferral(req, res);
  });
*/
  app.get("/user/getreferrals", (req, res) => {
    referral.seeAllReferrals(req, res);
  });

  app.post("/user/:referral/:address", (req, res) => {
    referral.addNewReferral(req, res);
  });

  app.post("/user/:address/:amount/:referrer", (req, res) => {
    deposit.addDepositAmount(req, res);
  });

  app.get("/user/getdeposits", (req, res) => {
    deposit.getAll(req, res);
  });

  app.get("/user/:id", (req, res) => {
    deposit.getTransaction(req, res);
  });

  app.post("/user/reimburse-address/update", (req, res) => {
    reimburse.updateReimburseAddressClaimAmount(req, res);
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.listen(port, () => console.log(`Listening on ${port}`));
}

init();
