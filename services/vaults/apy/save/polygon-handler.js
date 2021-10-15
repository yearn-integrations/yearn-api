// Function same as handler.js, this is for Polygon network
const vaults = require("./polygon-vault");
const { delayTime } = require("./config");
const delay = require("delay");
const moment = require("moment");
const contractHelper = require("../../../../utils/contract");
const apyDb = require('../../../../models/apy.model');
const { getPricePerFullShare, calculateApy } = require("./handler");

let polygonBlockNumber = {
    current: 0,
    oneDay: 0,
}

const moneyPrinterApyCalculation = (currentPrice, oneDayAgoPrice) => {
    const n = 5 * 24 * 365;  // Assume trigger compound function 5 times per HOUR
    const apr = (currentPrice - oneDayAgoPrice) * n;
    const apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;
    return (isNaN(apy) || apy === Infinity) ? 0 : apy;
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
        address: vault.vaultContractAddress,
        name: vault.name,
        symbol: vault.symbol,
        description: vault.description,
        vaultSymbol: vault.vaultSymbol,
        tokenAddress: vault.erc20address,
        timestamp: Date.now(),
        ...apy,
    };
    await saveVaultWithApy(data);
    return data;
}

const saveVaultWithApy = async (data) => {
    await apyDb.add(data).catch((err) => console.log('err', err));
    console.log(`Saved ${data.name}`);
};

const saveHandler = async() => {
    try {  
        const oneDayAgo = moment().subtract(1, "days").valueOf();
       
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
    saveHandler,
    moneyPrinterApyCalculation,
    getMoneyPrinterPricePerFullShare
}


