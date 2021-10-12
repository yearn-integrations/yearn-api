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
        totalDepositedAmount =  await db.getStrategyTotalDepositAmount(strategyId);;
    } catch (err) {
        console.error(`Error in getStrategyTotalDepositAmountInfo(): `, err);
    } finally {
        return totalDepositedAmount;
    }
}

const saveToDb = async(strategyId, blockNumber, totalDepositedAmount) => { 
    const saveObjects = {
        timestamp: new Date().getTime(),
        totalDepositedAmount: totalDepositedAmount,
        blockNumber: blockNumber,
        symbol: strategyId
    };
    await db.add(saveObjects);
}

const saveTotalDepositedAmount = async() => {
    let totalDepositedAmount = 0;
    const etfStrategies = ["daoCDV2","daoSTO2"]; // Only applies to daoCDV2 and daoSTO2
    const contracts = contractHelper.getContractsFromDomain();

    try {
        for(let i = 0; i < etfStrategies.length; i++) {
            const strategyAddress = contracts.farmer[etfStrategies[i]].address;

            // Block number for latest Distribute LP Token event
            const blockNumber = await getLatestDistributeLPTokenEvent(strategyAddress);
            // const blockNumber = 27366061; // For Testing purpose
            if(blockNumber === undefined || parseFloat(blockNumber)  === 0) {
                await saveToDb(etfStrategies[i], 0, 0);
                continue;
            }

            const transactions = await getDepositEvents(blockNumber, strategyAddress);
            if(transactions.length <= 0) {
                await saveToDb(etfStrategies[i], 0, 0);
                continue;
            }

            totalDepositedAmount = transactions.reduce((total, transaction) => {
                const deposit = transaction.deposits[0];
                return total + parseFloat(deposit.amountAfterFee);
            }, 0);
               
            await saveToDb(etfStrategies[i], blockNumber, totalDepositedAmount);
        }
    } catch (err) {
        console.error(`Error in saveTotalDepositedAmount(): `, err);
    } finally { 
    }
}



module.exports = {
    getStrategyTotalDepositAmount: getStrategyTotalDepositAmountInfo,
    saveTotalDepositedAmount
}