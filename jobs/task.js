const cron = require('node-cron');
const vaultApySave = require('../services/vaults/apy/save/handler');
const vaultSave = require('../services/vaults/save/handler');
const priceSave = require('../services/vaults/price/handler');

/** Save Vault APY */
const saveVaultAPY = async () => {
  await vaultApySave.handler();
  cron.schedule('0 0 0 * * *', async () => {
    console.log('[saveVaultAPY]');
    await vaultApySave.handler();
  }, {
    scheduled: true,
    timezone: "Etc/UTC" // UTC +0
  })
}

/** Save Vault **/
const saveVault = async () => {
  await vaultSave.handler();
  cron.schedule('0 0 0 * * *', async () => {
    console.log('[saveVault]');
    await vaultSave.handler();
  }, {
    scheduled: true,
    timezone: "Etc/UTC" // UTC +0
  })
}

/** Store getPricePerFullShare */
const savePricePerFullShare = async () => {
  await priceSave.handler();
  cron.schedule('*/5 * * * *', async () => {
    console.log('[savePricePerFullShare]', new Date().getTime());
    await priceSave.handler();
  }, {
    scheduled: true
  })
}

/** Store Historical APY */
const saveHistoricalAPY = async () => {
  await vaultApySave.saveHandler();
  cron.schedule('*/5 * * * *', async () => {
    console.log('[saveAPY]', new Date().getTime());
    await vaultApySave.saveHandler();
  }, {
    scheduled: true
  })
}

module.exports = {
  saveVaultAPY,
  saveVault,
  savePricePerFullShare,
  saveHistoricalAPY
}