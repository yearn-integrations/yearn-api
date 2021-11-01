const vaults = require("./avalanche-vault");
const { delayTime } = require("./config");
const delay = require("delay");
const contractHelper = require("../../../../utils/contract");
const dateTimeHelper = require("../../../../utils/dateTime");
const historicalDb = require('../../../../models/historical-apy.model');
const { getApyForVault } = require("./avax-handler");

let avaxBlockNumber = {
    current: 0,
    oneDay: 0,
}

const saveAndReadVault = async (vault) => {
    if(!vault.vaultContractABI || !vault.vaultContractAddress) {
        console.log(`Vault missing abi or address: ${vault.name}`);
        return;
    }
    const apy = await getApyForVault(vault);
    await saveHistoricalAPY(apy, vault.vaultSymbol);
    return;
}

// DB
const saveHistoricalAPY = async (apy, vaultSymbol) => {
    const data = {
        ...apy,
        aprs: 0,
        symbol: vaultSymbol,
    }
    const collectionName = `${vaultSymbol}_historical-apy`;
    await historicalDb.add(data, collectionName).catch((err) => console.log('err', err));
}

// Cronjob handler
const saveHandler = async() => {
    try {
        const oneDayAgo = dateTimeHelper.toMillisecondsTimestamp(
            dateTimeHelper.subtractDay(1, new Date())
        );
       
        console.log("Fetching Avalanche historical blocks");
        current = await contractHelper.getAvalancheCurrentBlockNumber();
        console.log(`(Avalanche) Current Block Number: ${current}`);
        oneDay = await contractHelper.getAvalancheBlockNumberByTimeline(oneDayAgo); 
        console.log(`(Avalanche) 1d ago Block Number: ${oneDay}`);
    
        console.log("Done fetching Avalanche historical blocks");
    } catch (err){
        console.log("Error in fetching Avalanche historical block", err);
    }

    for(const vault of vaults) {
        try {
            await saveAndReadVault(vault);
            await delay(delayTime);
        } catch (err) {
            console.log("Something wrong in save vault APY", err)
        }
    }
}

module.exports = {
    saveHandler
};

