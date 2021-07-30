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
        erc20address: "0xbd21a10f619be90d6066c941b04e340841f1f989",
        vaultContractAddress: "",  // TODO: Mainnet Address
        vaultContractABI: abi.moneyPrinterVaultContract,
        strategyContractAddress: "", // TODO: Mainnet Address
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