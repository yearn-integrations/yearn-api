const { findAllTVL } = require("../tvl/handler");
const { findAllHistoricalAPY } = require("../apy/save/historical-handle");
const { getVaultsApy: findVaultsApy } = require("../apy/handler");
const { findAllPool } = require("../../staking/handler");
const { findAllVaultCategory: findAllVaults } = require("../category/handler");
const constant = require("../../../utils/constant");
const contractHelper = require("../../../utils/contract");
const moment = require("moment");
const { zipObjectDeep } = require("lodash");

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

const proccessingVault = async (obj) => {
   const { vaults, network, startTime } = obj;

   const [tvls, historicalAPYS, apys, daominePools, vaultContracts] = await Promise.all([
        findAllTVL(contracts),
        findAllHistoricalAPY(startTime.unix(), network),
        findVaultsApy(),
        findAllPool(),
        findAllVaults()
   ]);

   const results = {};

   vaults.map(key  =>  {
       const vaultAddress = contracts.farmer[key].address;

       let obj = {};
       obj = getVaultInfo(vaultContracts, vaultAddress, obj);
       obj["apy"] = getVaultApy(apys, key);
       obj["daomineApy"] = getVaultDAOmineAPY(daominePools , vaultAddress);
       obj["tvl"] = tvls[key] ? tvls[key] : null;
       // obj["historicalAPY"] = historicalAPYS[key] ? historicalAPYS[key] : null;
      
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
        if (req.params.days === null || req.params.days === "") {
            res.status(200).json({
                message: 'Missing days type.',
                body: null
            });
            return;
        } 

        const startTime = getStartTime(req.params.days);
        if(startTime === -1) {
            res.status(200).json({
                message: "Please only pass '30d', '7d' or '1d' as days option.",
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
        const result = await proccessingVault({vaults, network: req.params.network, startTime});

        res.status(200).json({
            message: "Successful",
            body: result
        });

    } catch (err) {
        console.error("Error in All Vault Handler: ", err);
    }
}