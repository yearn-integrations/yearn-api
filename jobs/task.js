const cron = require("node-cron");
const vaultApySave = require("../services/vaults/apy/save/historical-handle");
const vaultPolygonApySave = require("../services/vaults/apy/save/historical-handle-polygon");
const vaultHandlerSave = require("../services/vaults/apy/save/handler");
const vaultPolygonHandlerSave = require("../services/vaults/apy/save/polygon-handler");
const vaultSave = require("../services/vaults/save/handler");
const priceSave = require("../services/vaults/price/handler");
const tvlSave = require("../services/vaults/tvl/handler");
const stakeSave = require("../services/staking/dao-stake/handler");
const daomineSave = require("../services/staking/daomine/handler");
const poolSave = require("../services/staking/handler");
const vipDVG = require("../services/staking/vipdvg/handler");
const performanceSave = require("../services/vaults/performance/handler");

/** Save Vault **/
const saveVault = async () => {
  await vaultSave.handler();
  cron.schedule(
    "0 0 0 * * *",
    async () => {
      console.log("[saveVault]");
      await vaultSave.handler();
    },
    {
      scheduled: true,
      timezone: "Etc/UTC", // UTC +0
    }
  );
};

/** Save Vault APY */
const saveVaultAPY = async () => {
  await vaultHandlerSave.handler();
  cron.schedule(
    "0 0 0 * * *",
    async () => {
      console.log("[saveVaultAPY]");
      await vaultHandlerSave.handler();
    },
    {
      scheduled: true,
      timezone: "Etc/UTC", // UTC +0
    }
  );
};

/** Save Vault APY */
const savePolygonVaultAPY = async() => {
  await vaultPolygonHandlerSave.saveHandler();
  cron.schedule(
    "0 0 0 * * *",
    async () => {
      console.log("[saveVaultAPY Polygon]");
      await vaultPolygonHandlerSave.saveHandler();
    },
    {
      scheduled: true,
      timezone: "Etc/UTC", // UTC +0
    }
  );
}

/** Store getPricePerFullShare */
const savePricePerFullShare = async () => {
  await priceSave.handler();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("[savePricePerFullShare]", new Date().getTime());
      await priceSave.handler();
    },
    {
      scheduled: true,
    }
  );
};

/** Store Historical APY */
const saveHistoricalAPY = async () => {
  await vaultApySave.saveHandler();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("[saveAPY]", new Date().getTime());
      await vaultApySave.saveHandler();
    },
    {
      scheduled: true,
    }
  );
};

/** Store Historical APY For Polygon */
const savePolygonHistoricalAPY = async () => {
  await vaultPolygonApySave.saveHandler();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("[savePolygonAPY]", new Date().getTime());
      await vaultPolygonApySave.saveHandler();
    },
    {
      scheduled: true,
    }
  );
}

/** Store Historical TVL */
const saveHistoricalTVL = async () => {
  await tvlSave.saveAllTVLhandler();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("[saveTVL]", new Date().getTime());
      await tvlSave.saveAllTVLhandler();
    },
    {
      scheduled: true,
    }
  );
};

/** Store Historical Stake Pools */
const saveHistoricalPools = async () => {
  await stakeSave.saveStakedPools();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("[saveStakedPools]", new Date().getTime());
      await stakeSave.saveStakedPools();
    },
    {
      scheduled: true,
    }
  );
};

/** Store Historical Stake Pools for DAOmine v2 */
const saveDAOmineHistoricalPools = async() => {
  await daomineSave.saveDAOminePools();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("[saveDAOmineHistoricalPools]", new Date().getTime());
      await daomineSave.saveDAOminePools();
    },
    {
      scheduled: true,
    }
  );
}

/** Store Stake Pools ABI */
const saveABIPools = async () => {
  await poolSave.savePoolInfo();
  cron.schedule(
    "0 0 0 * * *",
    async () => {
      console.log("[savePoolInfo]", new Date().getTime());
      await poolSave.savePoolInfo();
    },
    {
      scheduled: true,
    }
  );
};

/** Store DAOVIP APR */
const saveVipApr = async () => {
  await vipDVG.getVipAPY();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("[saveVipApr]", new Date().getTime());
      await vipDVG.getVipAPY();
    },
    {
      scheduled: true,
    }
  );
};

/** Store Performance */
const savePerformance = async () => {
  currentDateTime = new Date().getTime();
  console.log("[savePerformance first]", currentDateTime);
  await performanceSave.savePerformance(null);
  cron.schedule(
    "*/5 * * * *",
    // "0 0 * * *",
    // "* * * * *",
    async () => {
      currentDateTime = new Date().getTime();
      console.log("[savePerformance job]", currentDateTime);
      await performanceSave.savePerformance(currentDateTime);
    },
    {
      scheduled: true,
      // timezone: "Etc/UTC", // UTC +0
    }
  );
};

module.exports = {
  saveHistoricalTVL,
  saveVaultAPY,
  saveVault,
  savePolygonVaultAPY,
  savePricePerFullShare,
  saveHistoricalAPY,
  savePolygonHistoricalAPY,
  saveHistoricalPools,
  saveDAOmineHistoricalPools,
  saveABIPools,
  saveVipApr,
  savePerformance,
};
