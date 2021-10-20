const db = require("../../../models/total-deposited-amount.model");

const {
    getLatestDistributeLPTokenEvent,
    getDepositEvents
} = require('./helper/subgraphQuery');
const contractHelper = require("../../../utils/contract");

const getStrategyTotalDepositAmountInfo = async(strategyId) => { 
    let totalDepositedAmount = null;
    try {
        if(!strategyId || strategyId === null || strategyId === "") {
            throw(`Missing strategy ID`);
        }
        totalDepositedAmount =  await db.getStrategyTotalDepositedAmount(strategyId);;
    } catch (err) {
        console.error(`Error in getStrategyTotalDepositAmountInfo(): `, err);
    } finally {
        return totalDepositedAmount;
    }
}

const getLatestTotalAmountDepositInfo = async(strategyId) => {
    let totalDepositedAmount = null;
    try {
        if(strategyId === undefined || strategyId === null || strategyId === "") {
            throw (`Missing strategy ID`);
        }
        totalDepositedAmount = await db.getLatestTotalAmountDepositInfo(strategyId);
    } catch (err) {
        console.error(`Error in getLatestTotalAmountDepositInfo(): `, err);
    } finally {
        return totalDepositedAmount;
    }
}

const saveToDb = async(strategyId, blockNumber, blockTimestamp, totalDepositedAmount) => { 
    const saveObjects = {
        timestamp: new Date().getTime(),
        totalDepositedAmount: totalDepositedAmount,
        blockNumber: blockNumber,
        blockTimestamp: blockTimestamp,
        symbol: strategyId
    };
    await db.add(saveObjects);
}

const calculateTotalDepositedAmount = (transactions) => {
    const totalDepositedAmount = transactions.reduce((total, transaction) => {
        const deposit = transaction.deposits[0];
        return total + parseFloat(deposit.amountAfterFee);
    }, 0);
    return totalDepositedAmount;
}

const saveTotalDepositedAmount = async() => {
    let totalDepositedAmount = 0;
    const etfStrategies = ["daoCDV2", "daoSTO2"]; // Only applies to daoCDV2 and daoSTO2
    const contracts = contractHelper.getContractsFromDomain();

    try {
        for(const strategyId of etfStrategies) {
            const { address: strategyAddress, inceptionBlock } = contracts.farmer[strategyId];
            console.log(`Getting total deposited amount for ${strategyId}`);
            const datas = await db.findAll(strategyId);
        
            // Block number for latest Distribute LP Token event
            let blockNumbersRaw = await getLatestDistributeLPTokenEvent(strategyAddress);
            blockNumbers = blockNumbersRaw.map(element => parseFloat(element.blockNumber))
                .filter((element, index, self) => index === self.indexOf(element))
                .sort();
            if(blockNumbers === undefined || blockNumbers.length < 0) {
                console.error(`[totalDepositedAmount/handler] ${strategyId}: block numbers are not defined`);
                await saveToDb(strategyId, 0, 0, 0);
                continue;
            }
           
            let transactions = [];
            if(datas.length > 0) { 
                const latestDistributeTokenBlockNumber = blockNumbers[blockNumbers.length - 1];
                transactions = await getDepositEvents(latestDistributeTokenBlockNumber, undefined, strategyAddress);

                if(transactions.length <= 0) {
                    console.error(`[totalDepositedAmount/handler] ${strategyId}: No transaction found`);
                    await saveToDb(strategyId, 0, 0, 0);
                    continue;
                }

                totalDepositedAmount = calculateTotalDepositedAmount(transactions);
                let blockTimestamp = (blockNumbersRaw.find(b => parseFloat(b.blockNumber) === parseFloat(latestDistributeTokenBlockNumber))).timestamp;
            
                await saveToDb(strategyId, latestDistributeTokenBlockNumber, blockTimestamp, totalDepositedAmount);
            } else {
                // For first time sync
                // Add strategy start block
                blockNumbers.unshift(inceptionBlock);
    
                for(let i = 0 ; i < blockNumbers.length ; i++) {
                    const startBlock = blockNumbers[i];
                    const endBlock = blockNumbers[i + 1];

                    transactions = await getDepositEvents(startBlock, endBlock, strategyAddress);
                    if(transactions.length <= 0) {
                        console.error(`[totalDepositedAmount/handler] ${strategyId}: No transaction found`);
                        await saveToDb(etfStrategies[i], startBlock, 0);
                        continue;
                    }

                    let blockInfo = blockNumbersRaw.find(b => parseFloat(b.blockNumber) === parseFloat(startBlock));
                    if(blockInfo === undefined) {
                        blockInfo = await contractHelper.getEthereumBlockInfo(startBlock);
                    } 
                    const blockTimestamp = parseFloat(blockInfo.timestamp);

                    totalDepositedAmount = calculateTotalDepositedAmount(transactions);
                    await saveToDb(strategyId, startBlock, blockTimestamp, totalDepositedAmount);
                }
            }
        }
    } catch (err) {
        console.error(`Error in saveTotalDepositedAmount(): `, err);
    } finally { 
    }
}



module.exports = {
    getStrategyTotalDepositAmountInfo,
    getLatestTotalAmountDepositInfo,
    saveTotalDepositedAmount
}