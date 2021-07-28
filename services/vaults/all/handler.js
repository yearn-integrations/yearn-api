const { findAllTVL } = require("../tvl/handler");
const { findAllHistoricalAPY } = require("../apy/save/historical-handle");
const { getVaultsApy: findVaultsApy } = require("../apy/handler");
const constant = require("../../../utils/constant");
const contractHelper = require("../../../utils/contract");
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
    console.log(`Vault Key ${vaultKey}`);
    console.log(vaultApy);
    return vaultApy ? vaultApy : null;
}

const proccessingVault = async (obj) => {
   const { vaults, network, startTime } = obj;

   const [tvls, historicalAPYS, apys] = await Promise.all([
        findAllTVL(contracts),
        findAllHistoricalAPY(startTime.unix(), network),
        findVaultsApy(),
   ]);

   const results = {};

   vaults.map(key  =>  {
       const obj = {};
       obj["tvl"] = tvls[key] ? tvls[key] : null;
       // obj["historicalAPY"] = historicalAPYS[key] ? historicalAPYS[key] : null;
       obj["apy"] = getVaultApy(apys, key);

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