const { findAllTVL } = require("../tvl/handler");
const { findAllPool } = require("../../staking/handler");
const { findAllVaultCategory: findAllVaults } = require("../category/handler");
const { findAllStrategiesAssetDistribution } = require("../distribution/handler");
const { calculateStrategyPNL, findPerformanceWithTimePeriods } = require("../performance/handler");
const { getLatestTotalAmountDepositInfo } = require("../totalDepositedAmount/handler");

const contractHelper = require("../../../utils/contract");
const dateTimeHelper = require("../../../utils/dateTime");
const constant = require("../../../utils/constant");

let contracts;

const getDefaultSupportedERC20ByNetwork = (network) => {
    let erc20address = contractHelper.getERC20AddressByNetwork(network);
    erc20address = erc20address.map((e, index) => {
        return { ...e, enabledDeposit: true, enabledWithdraw: true, tokenIndex: index }
    });
    return erc20address;
}

const getVaultInfo = (vaultContracts, vaultAddress, vaultObject, network) => {
    const vault = vaultContracts.find(v => v.contract_address.toLowerCase() === vaultAddress.toLowerCase());

    let deposit = true;
    let depositMessage = "";
    let withdraw = true;
    let withdrawMessage = "";
    let currencies = [];
    
    if(vault !== undefined) {
        deposit = vault.deposit;
        withdraw = vault.withdraw;
        depositMessage = vault.depositMessage;
        withdrawMessage = vault.withdrawMessage;
        currencies = vault.currencies;
    }

    // Append default ERC20 address
    if( vault === undefined || 
        vault.currencies === undefined || 
        vault.currencies.length <= 0
    ) {
        const erc20address = getDefaultSupportedERC20ByNetwork(network);
        currencies = erc20address;
    }
    
    vaultObject = { 
        ...vaultObject ,
        deposit,
        withdraw,
        depositMessage,
        withdrawMessage,
        currencies
    };
    
    return vaultObject;
}

const findAllDepositedAmount = async() => {
    const strategies = ["daoCDV2", "daoSTO2"];
    const resultMap = {};
    for(const s of strategies) {
        const totalDepositedAmount = await getLatestTotalAmountDepositInfo(s);
        resultMap[s] = (totalDepositedAmount === undefined || 
            totalDepositedAmount.length <= 0 || 
            totalDepositedAmount[0].totalDepositedAmount === null) 
            ? 0
            : totalDepositedAmount[0].totalDepositedAmount;
    }
    return resultMap;
}

const findAllPerformance = async () => {
    const etfTypeStrategies = constant.ETF_STRATEGIES;
    const period = "1y";
    const startTime = dateTimeHelper.getStartTimeFromParameter(period);

    const returnResult = {};
    for(const strategy of etfTypeStrategies) {
        const result = await findPerformanceWithTimePeriods(
            strategy,
            startTime
        );
        const pnl = await calculateStrategyPNL(result);
        returnResult[strategy] = pnl;
    }

    return returnResult;
}

const getVaultDAOmineAPY = (pools, vaultAddress) => {
    const pool = pools.find(p => p.status === 'A' && p.contract_address.toLowerCase() === vaultAddress.toLowerCase());
    return pool ? pool.apr : 0;
}

const proccessingVault = async (obj) => {
    const { vaults, selectedNetwork } = obj;

    const [tvls, daominePools, vaultContracts, performances, assetsDistribution, totalDepositedAmounts] = await Promise.all([
        findAllTVL(contracts),
        findAllPool(),
        findAllVaults(),
        findAllPerformance(),
        findAllStrategiesAssetDistribution(),
        findAllDepositedAmount()
    ]);

    const results = {};
    vaults.map(key => {
        const vaultAddress = contracts.farmer[key].address;
        const abi = contracts.farmer[key].abi;

        let obj = {};
        obj = getVaultInfo(vaultContracts, vaultAddress, obj, selectedNetwork);

        const tvl = tvls[key] ? tvls[key] : null;
        const pnl = performances[key] ? performances[key] : null;
        const assetDistribution = assetsDistribution[key] ? assetsDistribution[key] : null;
        const daomineApy = getVaultDAOmineAPY(daominePools, vaultAddress);

        obj = { ...obj, tvl, pnl, assetDistribution, daomineApy, address: vaultAddress, abi };

        // Temp Solution
        if (["daoCDV2", "daoSTO2"].includes(key)) {
            obj["totalDepositedAmount"] = totalDepositedAmounts[key];
        }
        results[key] = obj;
    });

    return results;
}

module.exports.handler = async (req, res) => {
    let message = "";
    let result = null;
    
    try {
        const selectedNetwork = req.params.network;

        // Checking for network
        if (selectedNetwork === undefined || selectedNetwork === null || selectedNetwork === "") {
            throw(`Missing network type`);
        } 

        // Check supported network
        const supportedNetwork = constant.SUPPORTED_NETWORK;
        if (!supportedNetwork.includes(selectedNetwork)) {
            throw(`Network type is not supported.`);
        }

        // Find contracts
        contracts = await contractHelper.getContractsFromDomain();
        if(contracts.length <= 0) {
            throw(`Something wrong with the handler`);
        }

        const vaults = [];
        Object.keys(contracts.farmer).forEach(k => {
            if(contracts.farmer[k].network === req.params.network) {
                vaults.push(k);
            }
        });
        
        result = await proccessingVault({vaults, selectedNetwork});
        message = "Successful Response";
    } catch (err) {
        message = err;
        console.error("Error in All Vault Handler: ", err);
    } finally {
        res.status(200).json({
            message,
            body: result
        });
    }
}