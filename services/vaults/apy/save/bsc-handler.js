// Function same as handler.js, this is for BSC network
const vaults = require("./bsc-vault");
const { delayTime } = require("./config");
const delay = require("delay");
const moment = require("moment");
const contractHelper = require("../../../../utils/contract");
const apyDb = require('../../../../models/apy.model');
const { 
    getDaoDegenPricePerFullShare, 
    getDaoSafuPricePerFullShare} 
= require("./historical-handle-bsc");


let bscBlockNumber = {
    current: 0,
    oneDay: 0,
}

const getApyForVault = async (vault) => {
    const { lastMeasurement: inceptionBlockNumber } = vault;
    
    const contracts = await contractHelper.getContractsFromDomain();

    // DAO Degen
    if(vault.isDaoDegen) {
        const contractInfo = contracts.farmer["daoDEGEN"];
        const contract = await contractHelper.getBSCContract(contractInfo.abi, contractInfo.address);

        let pricePerFullShareCurrent = await getDaoDegenPricePerFullShare(contract, bscBlockNumber.current, inceptionBlockNumber);
        let pricePerFullShareOneDayAgo = await getDaoDegenPricePerFullShare(contract, bscBlockNumber.oneDay, inceptionBlockNumber);

        pricePerFullShareCurrent = (0 < pricePerFullShareCurrent) ? pricePerFullShareCurrent : 1;
        pricePerFullShareOneDayAgo = (0  < pricePerFullShareOneDayAgo) ? pricePerFullShareOneDayAgo : 1;

        const n = 2;
        const apr = (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n;
        let apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;

        return {
            apy: apy
        }
    } else if(vault.isDaoSafu) {
        const contractInfo = contracts.farmer["daoSAFU"];
        const contract = await contractHelper.getBSCContract(contractInfo.abi, contractInfo.address);

        let pricePerFullShareCurrent = await getDaoSafuPricePerFullShare(contract, bscBlockNumber.current, inceptionBlockNumber);
        let pricePerFullShareOneDayAgo = await getDaoSafuPricePerFullShare(contract, bscBlockNumber.oneDay, inceptionBlockNumber);
        pricePerFullShareCurrent = (0 < pricePerFullShareCurrent) ? pricePerFullShareCurrent : 1;
        pricePerFullShareOneDayAgo = (0  < pricePerFullShareOneDayAgo) ? pricePerFullShareOneDayAgo : 1;

        const n = 2;
        const apr = (pricePerFullShareCurrent - pricePerFullShareOneDayAgo) * n;
        let apy = (Math.pow((1 + (apr / 100) / n), n) - 1) * 100;
        
        return {
            apy: apy
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
       
        console.log("Fetching BSC historical blocks");
        current = await contractHelper.getBSCCurrentBlockNumber();
        console.log(`(BSC) Current Block Number: ${current}`);
        oneDay = await contractHelper.getBscBlockNumberByTimeline(oneDayAgo); 
        console.log(`(BSC) 1d ago Block Number: ${oneDay}`);
    
        bscBlockNumber = {current, oneDay};
        console.log("Done fetching BSC historical blocks");
    } catch (err){
        console.log("Error in fetching BSC historical block", err);
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
