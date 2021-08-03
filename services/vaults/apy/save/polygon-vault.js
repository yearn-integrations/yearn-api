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
        vaultContractAddress: "0x4f0bc6bd6beb231087781336bacd5613527ac63c", 
        vaultContractABI: abi.moneyPrinterVaultContract,
        strategyContractAddress: "0x8894da48bb8b7f7751ac4e2c37ed31b68d0c587f",
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
        erc20address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        vaultContractAddress: "0x3db93e95c9881bc7d9f2c845ce12e97130ebf5f2",  
        vaultContractABI: abi.moneyPrinterVaultContract,
        strategyContractAddress: "0x822427cd2a5a69e810301626bb355450a47c60ea", 
        strategyABI: abi.moneyPrinterStrategyContract,
        balance: 0,
        vaultBalance: 0,
        decimals: 18,
        deposit: true,
        depositAll: true,
        withdraw: true,
        withdrawAll: true,
        lastMeasurement: 17566349,
        measurement: 1e18,
        price_id: ["tether", "usd-coin", "dai"],
        isMoneyPrinter: true,
        network: constant.POLYGON,
    },
];

module.exports = (process.env.PRODUCTION != '') ? mainVaults : testVaults;