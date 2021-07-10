const config = require("./config.js");
const abi = require('../../../../config/abi')
const constant = require('../../../../utils/constant.js')

const testVaults = [
    {
        id: "daoMPT",
        name: "DAO Vault Money Printer",
        symbol: ["USDT","USDC","DAI"],
        description: "DAO Vault Money Printer for 3 stablecoins",
        vaultSymbol: "daoMPT",
        erc20address: "0xbd21a10f619be90d6066c941b04e340841f1f989",
        vaultContractAddress: "0xdc2f0e17702f9083adc057893b2b1e273c11e09a", 
        vaultContractABI: abi.moneyPrinterVaultContract,
        strategyContractAddress: "0x9fbbfc353772672b58a9ee1ad55265a5a09640a1",
        strategyABI: abi.moneyPrinterStrategyContract,
        balance: 0,
        vaultBalance: 0,
        decimals: 18,
        deposit: true,
        depositAll: true,
        withdraw: true,
        withdrawAll: true,
        lastMeasurement: 16133926,
        measurement: 1e18,
        price_id: ["tether", "usd-coin", "dai"],
        isMoneyPrinter: true,
        network: constant.POLYGON,
    },
];

const mainVaults = [
    {
        id: "daoMPT",
        name: "DAO Vault Money Printer",
        symbol: ["USDT","USDC","DAI"],
        description: "DAO Vault Money Printer for 3 stablecoins",
        vaultSymbol: "daoMPT",
        erc20address: "0xbd21a10f619be90d6066c941b04e340841f1f989",
        vaultContractAddress: "0xdc2f0e17702f9083adc057893b2b1e273c11e09a",  
        vaultContractABI: abi.moneyPrinterVaultContract,
        strategyContractAddress: "0x9fbbfc353772672b58a9ee1ad55265a5a09640a1",
        strategyABI: abi.moneyPrinterStrategyContract,
        balance: 0,
        vaultBalance: 0,
        decimals: 18,
        deposit: true,
        depositAll: true,
        withdraw: true,
        withdrawAll: true,
        lastMeasurement: 15970970,
        measurement: 1e18,
        price_id: ["tether", "usd-coin", "dai"],
        isMoneyPrinter: true,
        network: constant.POLYGON,
    },
];

module.exports = (process.env.PRODUCTION != '') ? mainVaults : testVaults;