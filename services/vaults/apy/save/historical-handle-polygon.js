const vaults = require("./polygon-vault");
const { delayTime } = require("./config");
const delay = require("delay");
const moment = require("moment");
const contractHelper = require("../../../../utils/contract");
const historicalDb = require('../../../../models/historical-apy.model');
const { 
    testContracts, 
    mainContracts
} = require('../../../../config/serverless/domain');

let polygonBlockNumber = {
    current: 0,
    oneDay: 0,
    threeDay: 0,
    oneWeek: 0,
    oneMonth: 0,
}

const getMoneyPrinterPricePerFullShare = async (contract, blockNumber, inceptionBlockNumber) => {
    if(blockNumber === inceptionBlockNumber) {
        return 1e18;
    }
    if(blockNumber < inceptionBlockNumber) {
        return 0;
    }

    let pricePerFullShare = 0;
    try {
        const pool = await contract.methods.getValueInPool().call(undefined, blockNumber);
        const totalSupply = await contract.methods.totalSupply().call(undefined, blockNumber);
        pricePerFullShare = pool / totalSupply;
    } catch (err) {
        console.log(`Error in getMoneyPrinterPricePerFullShare()`,err);
    }
    
    await delay(delayTime);
    return pricePerFullShare;
}

const getApyForVault = async (vault) => {
    const { lastMeasurement: inceptionBlockNumber } = vault

    // Money Printer vault
    if(vault.isMoneyPrinter) {
        const contractInfo = (process.env.PRODUCTION != '') 
            ? mainContracts.farmer['daoMPT'] 
            : testContracts.farmer['daoMPT'];
        const contract = await contractHelper.getPolygonContract(contractInfo.abi, contractInfo.address);

        let pricePerFullShareCurrent = await getMoneyPrinterPricePerFullShare(contract, polygonBlockNumber.current, inceptionBlockNumber);
        let pricePerFullShareOneDayAgo = await getMoneyPrinterPricePerFullShare(contract, polygonBlockNumber.oneDay, inceptionBlockNumber);
        
        pricePerFullShareCurrent = (0 < pricePerFullShareCurrent) ? pricePerFullShareCurrent : 1;
        pricePerFullShareOneDayAgo = (0  < pricePerFullShareOneDayAgo) ? pricePerFullShareOneDayAgo : 1;

        const n = 5 * 24 * 365;  // Assume trigger compound function 5 times per HOUR
        const apr = (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n;
        const apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;
    
        return {
            apyInceptionSample: 0,
            apyOneDaySample: 0,
            apyThreeDaySample: 0,
            apyOneWeekSample: 0,
            apyOneMonthSample: 0,
            apyLoanscan: 0,
            compoundApy: 0,
            citadelApy: 0,
            elonApy: 0,
            faangApy: 0,
            moneyPrinterApy: apy,
        }
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
        threeDay = await contractHelper.getPolygonBlockNumberByTimeline(threeDaysAgo);
        console.log(`(Polygon) 3d ago Block Number: ${threeDay}`);
        oneWeek = await contractHelper.getPolygonBlockNumberByTimeline(oneWeekAgo);
        console.log(`(Polygon) 1w ago Block Number: ${oneWeek}`);
        oneMonth = await contractHelper.getPolygonBlockNumberByTimeline(oneMonthAgo);
        console.log(`(Polygon) 1m ago Block Number: ${oneMonth}`);
        polygonBlockNumber = {current, oneDay, threeDay, oneWeek, oneMonth };

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
    getMoneyPrinterPricePerFullShare,
    saveHandler
};