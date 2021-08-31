// Function same as handler.js, this is for Polygon network
const vaults = require("./polygon-vault");
const { delayTime } = require("./config");
const delay = require("delay");
const moment = require("moment");
const contractHelper = require("../../../../utils/contract");
const apyDb = require('../../../../models/apy.model');
const { getMoneyPrinterPricePerFullShare } = require("./historical-handle-polygon");
const { 
    testContracts, 
    mainContracts
} = require('../../../../config/serverless/domain');

let polygonBlockNumber = {
    current: 0,
    oneDay: 0,
}
const { jobDelayTime } = require("../../../../constant/delayTimeConfig");


const getApyForVault = async (vault) => {
    const { lastMeasurement: inceptionBlockNumber } = vault;
    
    const contracts = await contractHelper.getContractsFromDomain();

    // Money Printer vault
    if(vault.isMoneyPrinter) {
        const contractInfo = contracts.farmer["daoMPT"];
        const contract = await contractHelper.getPolygonContract(contractInfo.abi, contractInfo.address);

        let pricePerFullShareCurrent = await getMoneyPrinterPricePerFullShare(contract, polygonBlockNumber.current, inceptionBlockNumber);
        let pricePerFullShareOneDayAgo = await getMoneyPrinterPricePerFullShare(contract, polygonBlockNumber.oneDay, inceptionBlockNumber);
        pricePerFullShareCurrent = (0 < pricePerFullShareCurrent) ? pricePerFullShareCurrent : 1;
        pricePerFullShareOneDayAgo = (0  < pricePerFullShareOneDayAgo) ? pricePerFullShareOneDayAgo : 1;

        const n = 5 * 24 * 365;  // Assume trigger compound function 5 times per HOUR
        const apr = (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n;
        let apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;

        if(apy === 0) {
            // Use back previous value if apy = 0
            const mpApyObj = await apyDb.getApy("daoMPT");
            console.log(`MP Apy Obj ${mpApyObj.moneyPrinterApy}, timestamp: ${mpApyObj.timestamp}`);
            apy = mpApyObj.moneyPrinterApy;
        }
        
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

module.exports.saveHandler = async() => {
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
