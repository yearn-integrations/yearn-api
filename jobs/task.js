const cron = require("node-cron");
const delay = require("delay");
const vaultApySave = require("../services/vaults/apy/save/historical-handle");
const vaultPolygonApySave = require("../services/vaults/apy/save/historical-handle-polygon");
const vaultHandlerSave = require("../services/vaults/apy/save/handler");
const vaultPolygonHandlerSave = require("../services/vaults/apy/save/polygon-handler");
const vaultSave = require("../services/vaults/save/handler");
const priceSave = require("../services/vaults/price/handler");
const tvlSave = require("../services/vaults/tvl/handler");
const stakeSave = require("../services/staking/dao-stake/handler");
const poolSave = require("../services/staking/handler");
const vipDVG = require("../services/staking/vipdvg/handler");
// const performanceSave = require("../services/vaults/performance/handler");
const performanceSave = require("../services/vaults/performance/handlerv2"); 
const tokenSave = require("../services/vaults/distribution/handler");

const jobDelayTime = { 
  saveHistoricalApy: 3 * 60 * 1000, // 3 mins in milliseconds
  savePricePerFullShare: 6 * 60 * 1000, // 5 mins in milliseconds
  saveHistoricalTVL: 7 * 60 * 1000, // 7 mins
  saveVaultApy: 15 * 60 * 1000, // 15 mins
  saveABIPools: 18 * 60 * 1000, // 18 mins
  savePolygonVaultAPY: 3 * 60 * 1000, // 3 mins in milliseconds;
};

/** Save Vault **/
const saveVault = async () => {
  await saveVaultHandler();
  cron.schedule(
    "0 0 0 * * *",
    async () => {
      await saveVaultHandler();
    },
    {
      scheduled: true,
      timezone: "Etc/UTC", // UTC +0
    }
  );
};
const saveVaultHandler = async() => {
  console.log(`[saveVault] START: ${new Date().getTime()}`);
  await vaultSave.handler();
  console.log(`[saveVault] END: ${new Date().getTime()}`);
}

/** Save Vault APY */
const saveVaultAPY = async () => {
  await delay(jobDelayTime.saveVaultApy);
  await saveVaultAPYHandler();

  cron.schedule(
    "0 0 0 * * *",
    async () => {
      await saveVaultAPYHandler();
    },
    {
      scheduled: true,
      timezone: "Etc/UTC", // UTC +0
    }
  );
};
const saveVaultAPYHandler = async() => {
  console.log(`[saveVaultAPY] START: ${new Date().getTime()}`);
  await vaultHandlerSave.handler();
  console.log(`[saveVaultAPY] END: ${new Date().getTime()}`);
}

/** Save Vault APY */
const savePolygonVaultAPY = async() => {
  await delay(jobDelayTime.savePolygonVaultAPY);
  await savePolygonVaultAPYHandler();;

  cron.schedule(
    "0 0 0 * * *",
    async () => {
      await savePolygonVaultAPYHandler();
    },
    {
      scheduled: true,
      timezone: "Etc/UTC", // UTC +0
    }
  );
}
const savePolygonVaultAPYHandler = async() => {
  console.log(`[saveVaultAPY Polygon] START: ${new Date().getTime()}`);
  await vaultPolygonHandlerSave.saveHandler();
  console.log(`[saveVaultAPY Polygon] END: ${new Date().getTime()}`);
}

/** Store getPricePerFullShare */
const savePricePerFullShare = async () => {
  await delay(jobDelayTime.savePricePerFullShare);
  await savePricePerFullShareHandler();

  cron.schedule(
    "*/5 * * * *",
    async () => {
      await savePricePerFullShareHandler();
    },
    {
      scheduled: true,
    }
  );
};
const savePricePerFullShareHandler = async() => {
  console.log(`[savePricePerFullShare] START: ${new Date().getTime()}`);
  await priceSave.handler();
  console.log(`[savePricePerFullShare] END: ${new Date().getTime()}`);
}

/** Store Historical APY */
const saveHistoricalAPY = async () => {
  await delay(jobDelayTime.saveHistoricalApy);
  await saveHistoricalApyHandler();
  
  cron.schedule(
    "*/5 * * * *",
    async () => {
      await saveHistoricalApyHandler();
    },
    {
      scheduled: true,
    }
  );
};
const saveHistoricalApyHandler = async() => {
  console.log(`[saveHistoricalAPY] START: ${new Date().getTime()}`);
  await vaultApySave.saveHandler();
  console.log(`[saveHistoricalAPY] END: ${new Date().getTime()}`);
}

/** Store Historical APY For Polygon */
const savePolygonHistoricalAPY = async () => {
  await savePolygonHistoricalAPYHandler();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      await savePolygonHistoricalAPYHandler();
    },
    {
      scheduled: true,
    }
  );
}
const savePolygonHistoricalAPYHandler = async () => {
  console.log(`[savePolygonHistoricalAPY] START: ${new Date().getTime()}`);
  await vaultPolygonApySave.saveHandler();
  console.log(`[savePolygonHistoricalAPY] END: ${new Date().getTime()}`);
}

/** Store Historical TVL */
const saveHistoricalTVL = async () => {
  await delay(jobDelayTime.saveHistoricalTVL);
  await saveHistoricalTVLHandler();

  cron.schedule(
    "*/5 * * * *",
    async () => {
      await saveHistoricalTVLHandler();
    },
    {
      scheduled: true,
    }
  );
};
const saveHistoricalTVLHandler = async() => {
  console.log(`[saveTVL] START: ${new Date().getTime()}`);
  await tvlSave.saveAllTVLhandler();
  console.log(`[saveTVL] END: ${new Date().getTime()}`);
}

/** Store Historical Stake Pools */
const saveHistoricalPools = async () => {
  await saveStakedPoolsHandler();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      await saveStakedPoolsHandler();
    },
    {
      scheduled: true,
    }
  );
};
const saveStakedPoolsHandler = async() => {
  console.log(`[saveStakedPools] START: ${new Date().getTime()}`);
  await stakeSave.saveStakedPools();
  console.log(`[saveStakedPools] END: ${new Date().getTime()}`);
}

/** Store Stake Pools ABI */
const saveABIPools = async () => {
  await delay(jobDelayTime.saveABIPools);
  await saveABIPoolsHandler();

  cron.schedule(
    "0 2 0 * * *",
    async () => {
      await saveABIPoolsHandler();
    },
    {
      scheduled: true,
    }
  );
};
const saveABIPoolsHandler = async() => {
  console.log(`[savePoolInfo] START: ${new Date().getTime()}`);
  await poolSave.savePoolInfo();
  console.log(`[savePoolInfo] END: ${new Date().getTime()}`);
}

/** Store DAOVIP APR */
const saveVipApr = async () => {
  await saveVipAprHandler();
  cron.schedule(
    "*/5 * * * *",
    async () => {
      await saveVipAprHandler();
    },
    {
      scheduled: true,
    }
  );
};
const saveVipAprHandler = async() => {
  console.log(`[saveVipApr] START: ${new Date().getTime()}`);
  await vipDVG.getVipAPY();
  console.log(`[saveVipApr] END: ${new Date().getTime()}`);
}

/** Store Performance */
const savePerformance = async () => {
  currentDateTime = new Date().getTime();
  console.log(`[savePerformance] first, START: ${new Date().getTime()}`);
  await performanceSave.savePerformance(null);
  console.log(`[savePerformance] first, END: ${new Date().getTime()}`);
  cron.schedule(
    "*/5 * * * *",
    // "0 0 * * *",
    // "* * * * *",
    async () => {
      currentDateTime = new Date().getTime();
      console.log(`[savePerformance] START: ${new Date().getTime()}`);
      await performanceSave.savePerformance(currentDateTime);
      console.log(`[savePerformance] END: ${new Date().getTime()}`);
    },
    {
      scheduled: true,
      // timezone: "Etc/UTC", // UTC +0
    }
  );
};

const saveTokenPrice = async() => {
  await saveTokenPriceHandler();
  cron.schedule(
    "0 0 * * *",
    async () => {
      await saveTokenPriceHandler();
    },
    {
      scheduled: true,
      // timezone: "Etc/UTC", // UTC +0
    }
  );
}
const saveTokenPriceHandler = async() => {
  console.log(`[saveTokenPrice] START: ${new Date().getTime()}`);
  await tokenSave.saveAssetsPrice();
  console.log(`[saveTokenPrice] END: ${new Date().getTime()}`);
}

module.exports = {
  saveHistoricalTVL,
  saveVaultAPY,
  saveVault,
  savePolygonVaultAPY,
  savePricePerFullShare,
  saveHistoricalAPY,
  savePolygonHistoricalAPY,
  saveHistoricalPools,
  saveABIPools,
  saveVipApr,
  savePerformance,
  saveTokenPrice
};
