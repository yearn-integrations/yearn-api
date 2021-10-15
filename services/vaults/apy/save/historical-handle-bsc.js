const vaults = require("./bsc-vault");
const { delayTime } = require("./config");
const delay = require("delay");
const contractHelper = require("../../../../utils/contract");
const dateTimeHelper = require("../../../../utils/dateTime");
const historicalDb = require('../../../../models/historical-apy.model');
const { getPricePerFullShare, calculateApy } = require("./handler");

let bscBlockNumber = {
    current: 0,
    oneDay: 0,
    threeDay: 0,
    oneWeek: 0,
    oneMonth: 0,
}

const getApyForVault = async (vault) => {
    const {
      lastMeasurement: inceptionBlockNumber,
      vaultContractABI: abi,
      vaultContractAddress: address,
      triggerDuration,
      vaultSymbol
    } = vault;

    const contract = await contractHelper.getBSCContract(abi, address);
    const currentPrice = await getPricePerFullShare(contract, bscBlockNumber.current, inceptionBlockNumber, vaultSymbol);
    const oneDayAgoPrice = await getPricePerFullShare(contract, bscBlockNumber.oneDay, inceptionBlockNumber, vaultSymbol);
    const apy = calculateApy(triggerDuration, currentPrice, oneDayAgoPrice);
    return {apy : apy};
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
       
        console.log("Fetching BSC historical blocks");
        current = await contractHelper.getBSCCurrentBlockNumber();
        console.log(`(BSC) Current Block Number: ${current}`);
        oneDay = await contractHelper.getBscBlockNumberByTimeline(oneDayAgo); 
        console.log(`(BSC) 1d ago Block Number: ${oneDay}`);
    
        console.log("Done fetching BSC historical blocks");
    } catch (err){
        console.log("Error in fetching BSC historical block", err);
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