const config = require("./config.js");
const abi = require('../../../../config/abi')
const constant = require('../../../../utils/constant.js')

const testVaults = [
    {
        id: "daoSAFU",
        name: "DAO Vault Safu",
        symbol: ["USDT","USDC","DAI"],
        description: "DAO Vault Safu for 3 stablecoins",
        vaultSymbol: "daoSAFU",
        erc20address: ["0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", "0x64544969ed7EBf5f083679233325356EbE738930", "0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867"],
        vaultContractAddress: "0x81390703430015a751f967694d5ccb8745fda254",
        vaultContractABI: abi.daoSafuVaultContract,
        balance: 0,
        vaultBalance: 0,
        decimals: 18,
        deposit: true,
        depositAll: true,
        withdraw: true,
        withdrawAll: true,
        lastMeasurement: 12751827,
        measurement: 1e18,
        price_id: ["tether", "usd-coin", "dai"],
        isDaoSafu: true,
      },
];

const mainVaults = [
    {
        id: "daoSAFU",
        name: "DAO Vault Safu",
        symbol: ["USDT","USDC","DAI"],
        description: "DAO Vault Safu for 3 stablecoins",
        vaultSymbol: "daoSAFU",
        erc20address: [ "0x55d398326f99059fF775485246999027B3197955", "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d","0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",],
        vaultContractAddress: "0xb9e35635084b8b198f4bf4ee787d5949b46338f1",
        vaultContractABI: abi.daoSafuVaultContract,
        balance: 0,
        vaultBalance: 0,
        decimals: 18,
        deposit: true,
        depositAll: true,
        withdraw: true,
        withdrawAll: true,
        lastMeasurement: 11788791,
        measurement: 1e18,
        price_id: ["tether", "usd-coin", "dai"],
        isDaoSafu: true,
      },
];

module.exports = (process.env.PRODUCTION != '') ? mainVaults : testVaults;