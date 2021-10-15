const vaults = require("./bsc-vault");
const { delayTime } = require("./config");
const delay = require("delay");
const BigNumber = require("bignumber.js");
const contractHelper = require("../../../../utils/contract");
const dateTimeHelper = require("../../../../utils/dateTime");
const historicalDb = require('../../../../models/historical-apy.model');

let bscBlockNumber = {
    current: 0,
    oneDay: 0,
    threeDay: 0,
    oneWeek: 0,
    oneMonth: 0,
}

const getDaoDegenPricePerFullShare = async(contract, block, inceptionBlockNumber) => {
    const contractDidntExist = block < inceptionBlockNumber;
    const inceptionBlock = block === inceptionBlockNumber;
  
    if (inceptionBlock) {
      return 1e18;
    }
    if (contractDidntExist) {
      return 0;
    }
  
    let pricePerFullShare = 0;
    try {
      pricePerFullShare = await contract.methods.getPricePerFullShare().call(undefined, block);
      pricePerFullShare = new BigNumber(pricePerFullShare).shiftedBy(-18).toNumber();
    } catch (err) {
      console.error(`[apy/save/handler]Error in getDaoDegenPricePerFullShare(): `, err);
    } finally {
      return pricePerFullShare;
    }
}

const getDaoSafuPricePerFullShare = async(contract, block, inceptionBlockNumber) => {
    const contractDidntExist = block < inceptionBlockNumber;
    const inceptionBlock = block === inceptionBlockNumber;
  
    if (inceptionBlock) {
      return 1e18;
    }
    if (contractDidntExist) {
      return 0;
    }
  
    let pricePerFullShare = 0;
    try {
      pricePerFullShare = await contract.methods.getPricePerFullShare().call(undefined, block);
      pricePerFullShare = new BigNumber(pricePerFullShare).shiftedBy(-18).toNumber();
    } catch (err) {
      console.error(`[apy/save/handler]Error in getDaoSafuPricePerFullShare(): `, err);
    } finally {
      return pricePerFullShare;
    }
  }

const getApyForVault = async (vault) => {
    const { lastMeasurement: inceptionBlockNumber } = vault;
    const contracts = contractHelper.getContractsFromDomain();

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
    getDaoDegenPricePerFullShare: getDaoDegenPricePerFullShare,
    getDaoSafuPricePerFullShare: getDaoSafuPricePerFullShare,
    saveHandler
};