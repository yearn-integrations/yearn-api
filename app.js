require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require('compression');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const db = require("./config/db");
const jobs = require("./jobs/task");
const port = process.env.PORT || 8080;

const userRouter = require("./routes/userRoute");
const stakingRouter = require("./routes/stakingRoute");
const eventRouter = require("./routes/eventRoute");
const vaultRouter = require("./routes/vaultRoute");
const reimbursementRouter = require("./routes/reimbursementRouter");

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
    jobs.savePricePerFullShare();
    jobs.saveHistoricalAPY();
    jobs.savePolygonHistoricalAPY();
    jobs.saveBSCHistoricalAPY();
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
 
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/user", userRouter);
  app.use("/staking", stakingRouter);
  app.use("/event", eventRouter);
  app.use("/vaults", vaultRouter);
  app.use("/reimbursement-addresses", reimbursementRouter);

  app.listen(port, () => console.log(`Listening on ${port}`));
}

init();
