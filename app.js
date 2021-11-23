require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require('compression');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
<<<<<<< Updated upstream

const db = require("./config/db");
const jobs = require("./jobs/task");
const port = process.env.PORT || 8080;

const userRouter = require("./routes/userRoute");
const stakingRouter = require("./routes/stakingRoute");
const eventRouter = require("./routes/eventRoute");
const vaultRouter = require("./routes/vaultRoute");
const reimbursementRouter = require("./routes/reimbursementRouter");
=======
const bodyParser = require("body-parser");
const v2 = require('./services/user/v2/apis');
>>>>>>> Stashed changes

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
    jobs.saveBSCVaultAPY();
    jobs.saveAvalancheVaultAPY();
    jobs.savePricePerFullShare();
    jobs.saveHistoricalAPY();
    jobs.savePolygonHistoricalAPY();
    jobs.saveBSCHistoricalAPY();
    jobs.saveAvalancheHistoricalAPY();
    jobs.saveHistoricalTVL();
    jobs.saveHistoricalPools();
    jobs.saveDAOmineHistoricalPools();
    jobs.saveABIPools();
    jobs.saveVipApr();
    jobs.savePerformance();
    jobs.saveTokenPrice();
    jobs.saveTotalDepositedAmount();
  });

  app.use(cors());
  app.use(compression())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());
<<<<<<< Updated upstream
 
=======
  app.use(compression())

  app.get("/vaults/apy", (req, res) => vaultsApy.handler(res));
  app.get("/vaults/:network/all", (req, res) => allFarmers.handler(req, res));
  app.get("/vaults/price/:farmer/:days", (req, res) =>
    vaultsPrice.handleHistoricialPrice(req, res)
  );
  app.get("/vaults/price/:network/all/:days", (req, res) => {
    vaultsPrice.handleAllHistoricialPrice(req, res)
  });
  app.get("/vaults/performance-apy/:strategy/:days", (req, res) => performanceApy.handler(req, res));
  app.get("/vaults/historical-apy/:contractAddress/:days", (req, res) =>
    vaultHistoricalAPYSave.handleHistoricialAPY(req, res)
  );
  app.get("/vaults/historical-apy/:network/all/:days", (req, res) => {
    vaultHistoricalAPYSave.handleAllHistoricalAPY(req, res)
  });
  app.get("/vaults/tvl/total", (req, res) => vaultsTvl.totalHandle(req, res));
  app.get("/vaults/tvl/:farmer", (req, res) => vaultsTvl.tvlHandle(req, res));
  app.get("/vaults/tvl/find/all", (req, res) => vaultsTvl.getAllTVLHandler(req, res));
  app.get("/vaults/category", (req, res) => vaultCategory.getVaultCategory(req, res));
  app.get("/vaults/:farmerId/distribution", (req, res) => vaultAssetDistribution.handler(req, res));
  app.get("/user/:userAddress/:network/vaults/statistics", (req, res) =>
    userStatistics.handler(req, res)
  );
  app.get("/user/:userAddress/:network/vaults/transactions", (req, res) =>
    userTransactions.handler(req, res)
  );
  app.get("/staking/get-vip-tokens", (req, res) =>
    stakeVIP.getVipDVGToken(req, res)
  );
  app.get("/staking/get-pools", (req, res) => stakePool.getPools(req, res));
  app.get("/staking/get-xdvg-stake", (req, res) =>
    stakeXDvg.getxDVGStake(req, res)
  );
  app.get("/staking/get-xdvd-stake", (req, res) => {
    stakeXDvg.getxDVDStake(req, res)
  });
  app.get("/event/verify", (req, res) =>
    specialEvent.handleVerifyEvent(req, res)
  );
  app.get("/event/verify/:amount", (req, res) =>
    specialEvent.handler(req, res)
  );

  app.get('/v2/stable/coins', v2.getStableCoins);
  app.get('/v2/strategies/list', v2.getStrategies);

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

  app.get('/user/reimburse-address/:address', (req, res) =>
    reimburse.getReimburseAddress(req, res)
  );

  app.post('/user/reimburse-address/update', (req, res) => {
    reimburse.updateReimburseAddressClaimAmount(req, res)
  });

>>>>>>> Stashed changes
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/user", userRouter);
  app.use("/staking", stakingRouter);
  app.use("/event", eventRouter);
  app.use("/vaults", vaultRouter);
  app.use("/reimbursement-addresses", reimbursementRouter);

  app.listen(port, () => console.log(`Listening on ${port}`));
}

init();
