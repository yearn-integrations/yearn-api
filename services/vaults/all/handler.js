const { findAllTVL } = require("../tvl/handler");
const { getVaultsApy: findVaultsApy } = require("../apy/handler");
const { findAllPool } = require("../../staking/handler");
const { findAllVaultCategory: findAllVaults } = require("../category/handler");
const { findAllStrategiesAssetDistribution } = require("../distribution/handler");
const { getVaultsStatistics } = require("../../user/vaults/statistics/handler");
const { findAllHistoricalAPY } = require("../apy/save/historical-handle");
const performanceDb = require("../../../models/performance.model");
const contractHelper = require("../../../utils/contract");
const constant = require("../../../utils/constant");
const moment = require("moment");

let contracts;

const getStartTime = (days) => {
    var startTime = -1;

    switch (days) {
        case '30d':
            startTime = moment().subtract(30, 'days');
            break;
        case '7d':
            startTime = moment().subtract(7, 'days');
            break;
        case '1d':
            startTime = moment().subtract(1, 'days');
            break;
    }
    return startTime;
}

const getVaultApy = (apys, vaultKey) => {
    const vaultApy = apys.find(a => a.vaultSymbol === vaultKey);
    return vaultApy ? vaultApy : null;
}

const getVaultDAOmineAPY = (pools, vaultAddress) => {
    const pool = pools.find(p => p.status === 'A' && p.contract_address.toLowerCase() === vaultAddress.toLowerCase());
    return pool ? pool.apr : null;
}

const getVaultInfo = (vaultContracts, vaultAddress, vaultObject) => {
    const vault = vaultContracts.find(v => v.contract_address.toLowerCase() === vaultAddress.toLowerCase());
    vaultObject["deposit"] = (!vault) ? true : vault.deposit;
    vaultObject["depositMessage"] = (!vault) ? "" : vault.depositMessage;
    vaultObject["withdraw"] = (!vault) ? true : vault.withdraw;
    vaultObject["withdrawMessage"] = (!vault) ? "" : vault.withdrawMessage;
    return vaultObject;
}

const getStatisticsInfo = (statistics, vaultAddress) => {
    const vaultStatistic = statistics.find(s => s.contractAddress.toLowerCase() === vaultAddress.toLowerCase());
    return vaultStatistic;
}

const findAllPerformance = async () => {
    // Only for daoCDV and daoSTO for now
    const etfTypeStrategies = constant.ETF_STRATEGIES;

    const returnResult = {};
    for(const strategy of etfTypeStrategies) {
        const result = await performanceDb.findAll(strategy);
        const lastDataIndex = result.length - 1;
        returnResult[strategy] = result[lastDataIndex]["lp_performance"];
    }

    return returnResult;
}

const proccessingVault = async (obj) => {
   const { vaults } = obj;

   const [tvls, apys, daominePools, vaultContracts, performances, assetsDistribution] = await Promise.all([
        findAllTVL(contracts),
        findVaultsApy(),
        findAllPool(),
        findAllVaults(),
        findAllPerformance(),
        findAllStrategiesAssetDistribution(),
        // findAllHistoricalAPY(startTime.unix(), network),
        // getVaultsStatistics(userAddress, network),
   ]);

   const results = {};
   const etfStrategies = constant.ETF_STRATEGIES;

    vaults.map(key => {
        const vaultAddress = contracts.farmer[key].address;

        let obj = {};
        obj = getVaultInfo(vaultContracts, vaultAddress, obj);
        obj["apy"] = getVaultApy(apys, key);
        obj["daomineApy"] = getVaultDAOmineAPY(daominePools, vaultAddress);
        obj["tvl"] = tvls[key] ? tvls[key] : null;
        // obj["historicalAPY"] = historicalAPYS[key] ? historicalAPYS[key] : null;
        // obj["statistics"] = getStatisticsInfo(statistics, vaultAddress);

        if (etfStrategies.includes(key)) {
            obj["lp_performance"] = performances[key];
            obj["asset_distribution"] = assetsDistribution[key];
        }
        results[key] = obj;
    });

   return results;
}

module.exports.handler = async (req, res) => {
    try {
        if (req.params.network === null || req.params.network === "") {
            res.status(200).json({
                message: 'Missing network type.',
                body: null
            });
            return;
        } 

        contracts = await contractHelper.getContractsFromDomain();
        if(contracts.length <= 0) {
            res.status(200).json({
                message: "Something wrong with handler.",
                body: null
            });
            return;
        }

        const vaults = [];
        Object.keys(contracts.farmer).forEach(k => {
            if(contracts.farmer[k].network === req.params.network) {
                vaults.push(k);
            }
        })
        const result = await proccessingVault({vaults});

        res.status(200).json({
            message: "Successful",
            body: result
        });

    } catch (err) {
        console.error("Error in All Vault Handler: ", err);
    }
}