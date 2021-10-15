const vaults = require("./polygon-vault");
const { delayTime } = require("./config");
const delay = require("delay");
const moment = require("moment");
const contractHelper = require("../../../../utils/contract");
const historicalDb = require('../../../../models/historical-apy.model');
const { getPricePerFullShare, calculateApy } = require("./handler");
const { moneyPrinterApyCalculation, getMoneyPrinterPricePerFullShare } = require("./polygon-handler");

let polygonBlockNumber = {
    current: 0,
    oneDay: 0,
    threeDay: 0,
    oneWeek: 0,
    oneMonth: 0,
}


const getApyForVault = async (vault) => {
    const { 
        lastMeasurement: inceptionBlockNumber, 
        vaultContractAddress: address,  
        vaultContractABI: abi,
        triggerDuration,
        vaultSymbol
    } = vault;

    const contract = await contractHelper.getPolygonContract(abi, address);

    if(vault.isMoneyPrinter) {
        let currentPrice = await getMoneyPrinterPricePerFullShare(contract, polygonBlockNumber.current, inceptionBlockNumber, vaultSymbol);
        let oneDayAgoPrice = await getMoneyPrinterPricePerFullShare(contract, polygonBlockNumber.oneDay, inceptionBlockNumber, vaultSymbol);
        apy = moneyPrinterApyCalculation(currentPrice, oneDayAgoPrice);
        return { apy: apy }
    } else {
        let currentPrice = await getPricePerFullShare(contract, polygonBlockNumber.current, inceptionBlockNumber, vaultSymbol);
        let oneDayAgoPrice = await getPricePerFullShare(contract, polygonBlockNumber.oneDay, inceptionBlockNumber, vaultSymbol);
        apy = calculateApy(triggerDuration, currentPrice, oneDayAgoPrice);
        return { apy: apy }
    }
}

const saveAndReadVault = async (vault) => {
    if(!vault.vaultContractABI || !vault.vaultContractAddress) {
        console.log(`Vault missing abi or address: ${vault.name}`);
        return;
    }

    const apy = await getApyForVault(vault);
    const data = {
        ...apy,
        aprs: 0,
        symbol: vault.symbol,
    }
    await saveHistoricalAPY(data, vault.vaultSymbol + '_historical-apy');
    return data;
}

// DB
const saveHistoricalAPY = async (data, collection) => {
    await historicalDb.add(data, collection).catch((err) => console.log('err', err));
}

// Cronjob handler
const saveHandler = async() => {
    try {
        const oneDayAgo = moment().subtract(1, "days").valueOf();
        const threeDaysAgo = moment().subtract(3, "days").valueOf();
        const oneWeekAgo = moment().subtract(1, "weeks").valueOf();
        const oneMonthAgo = moment().subtract(1, "months").valueOf();

        console.log("Fetching Polygon historical blocks");
        current = await contractHelper.getPolygonCurrentBlockNumber();
        console.log(`(Polygon) Current Block Number: ${current}`);
        oneDay = await contractHelper.getPolygonBlockNumberByTimeline(oneDayAgo); 
        console.log(`(Polygon) 1d ago Block Number: ${oneDay}`);
       
        polygonBlockNumber = {current, oneDay};

        console.log("Done fetching Polygon historical blocks");
    } catch (err){
        console.log("Error in fetching polygon historical block", err);
    }

    const vaultsWithApy = [];
    for(const vault of vaults) {
        try {
            const vaultWithApy = await saveAndReadVault(vault);
            if(vaultWithApy !== null) {
                vaultsWithApy.push(vaultWithApy);
                await delay(delayTime);
            }
        } catch (err) {
            console.log("Something wrong in save vault APY", err)
        }
    }
}

module.exports = {
    saveHandler
};