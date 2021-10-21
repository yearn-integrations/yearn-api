// Function same as handler.js, this is for Avalanche network
const vaults = require("./avalanche-vault");
const { delayTime } = require("./config");
const delay = require("delay");
const moment = require("moment");
const contractHelper = require("../../../../utils/contract");
const apyDb = require('../../../../models/apy.model');
const { getPricePerFullShare, calculateApy } = require("./handler"); 

let avaxBlockNumber = {
    current: 0,
    oneDay: 0
}

const getApyForVault = async (vault) => {
    const {
        lastMeasurement: inceptionBlockNumber,
        vaultContractABI: abi,
        vaultContractAddress: address,
        triggerDuration,
        vaultSymbol
    } = vault;

    const contract = await contractHelper.getAvalancheContract(abi, address);
    const currentPrice = await getPricePerFullShare(contract, avaxBlockNumber.current, inceptionBlockNumber, vaultSymbol);
    const oneDayAgoPrice = await getPricePerFullShare(contract, avaxBlockNumber.oneDay, inceptionBlockNumber, vaultSymbol);
    const apy = calculateApy(triggerDuration, currentPrice, oneDayAgoPrice);
    return { apy: apy };
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
       
        console.log("Fetching Avalanche historical blocks");
        current = await contractHelper.getAvalancheCurrentBlockNumber();
        console.log(`(Avalanche) Current Block Number: ${current}`);
        oneDay = await contractHelper.getAvalancheBlockNumberByTimeline(oneDayAgo); 
        console.log(`(Avalanche) One day ago Block Number: ${oneDay}`);
       
        avaxBlockNumber = {current, oneDay};
        console.log("Done fetching Avalanche historical blocks");
    } catch (err){
        console.log("Error in fetching Avalanche historical block", err);
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
    getApyForVault,
    saveHandler
}