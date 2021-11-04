const abi = require("../../../../config/abi");

const testVaults = [
  {
    id: "daoAXA",
    name: "DAO Vault AXA",
    symbol: ["USDT", "USDC", "DAI"],
    description: "DAO Vault AXA for 3 stablecoins",
    vaultSymbol: "daoAXA",
    erc20address: [
      "0xE01A4D7de190f60F86b683661F67f79F134E0582",
      "0xA6cFCa9EB181728082D35419B58Ba7eE4c9c8d38",
      "0x3bc22AA42FF61fC2D01E87c2Fa4268D0334b1a4c",
    ],
    vaultContractAddress: "0x0b0e5b52e14152308f9f952ff19c67ebeb7560bb",
    vaultContractABI: abi.avaxVaultContract,
    decimals: 18,
    lastMeasurement: 2074684,
    measurement: 1e18,
    price_id: ["tether", "usd-coin", "dai"],
    isAXA: true,
  },
  {
    id: "daoAXS",
    name: "DAO Vault AXS",
    symbol: ["USDT", "USDC", "DAI"],
    description: "DAO Vault AXA for 3 stablecoins",
    vaultSymbol: "daoAXS",
    erc20address: [
      "0xE01A4D7de190f60F86b683661F67f79F134E0582",
      "0xA6cFCa9EB181728082D35419B58Ba7eE4c9c8d38",
      "0x3bc22AA42FF61fC2D01E87c2Fa4268D0334b1a4c",
    ],
    vaultContractAddress: "0xdf9fc6774937bf42602be1f80ab3da8a0b2a8594",
    vaultContractABI: abi.avaxStableVaultContract,
    decimals: 18,
    lastMeasurement: 2074783,
    measurement: 1e18,
    price_id: ["tether", "usd-coin", "dai"],
    isAXA: true,
    triggerDuration: 2
  },
  {
    id: "daoASA",
    name: "DAO Vault ASA",
    symbol: ["USDT", "USDC", "DAI"],
    description: "DAO Vault ASA for 3 stablecoins",
    vaultSymbol: "daoASA",
    erc20address: [
      "0xE01A4D7de190f60F86b683661F67f79F134E0582",
      "0xA6cFCa9EB181728082D35419B58Ba7eE4c9c8d38",
      "0x3bc22AA42FF61fC2D01E87c2Fa4268D0334b1a4c",
    ],
    vaultContractAddress: "0x0d79f121fd1eb213e5dbde11edbe7744ecb51352",
    vaultContractABI: abi.avaxStableVaultContract,
    decimals: 18,
    lastMeasurement: 2074872,
    measurement: 1e18,
    price_id: ["tether", "usd-coin", "dai"],
    isAXA: true,
    triggerDuration: 2
  },
  {
    id: "daoA2S",
    name: "DAO Vault A2S",
    symbol: ["USDT", "USDC", "DAI"],
    description: "DAO Vault A2S for 3 stablecoins",
    vaultSymbol: "daoA2S",
    erc20address: [
      "0xE01A4D7de190f60F86b683661F67f79F134E0582",
      "0xA6cFCa9EB181728082D35419B58Ba7eE4c9c8d38",
      "0x3bc22AA42FF61fC2D01E87c2Fa4268D0334b1a4c",
    ],
    vaultContractAddress: "0x89d6fd8ba3eaf76687cf7b3d10f914cc445eaec1",
    vaultContractABI: abi.avaxStableVaultContract,
    decimals: 18,
    lastMeasurement: 2074921,
    measurement: 1e18,
    price_id: ["tether", "usd-coin", "dai"],
    isAXA: true,
    triggerDuration: 2
  },
];

const mainVaults = [
  {
    id: "daoAXA",
    name: "DAO Vault AXA",
    symbol: ["USDT", "USDC", "DAI"],
    description: "DAO Vault AXA for 3 stablecoins",
    vaultSymbol: "daoAXA",
    erc20address: [
      "0xde3a24028580884448a5397872046a019649b084", 
      "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
      "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    ],
    vaultContractAddress: "0xa4dcbe792f51e13fc0e6961bbec436a881e73194", 
    vaultContractABI: abi.avaxVaultContract,
    decimals: 18,
    lastMeasurement: 6303210, // Update here
    measurement: 1e18,
    price_id: ["tether", "usd-coin", "dai"],
    isAXA: true,
    triggerDuration: 2
  },
  {
    id: "daoAXS",
    name: "DAO Vault AXS",
    symbol: ["USDT", "USDC", "DAI"],
    description: "DAO Vault AXA for 3 stablecoins",
    vaultSymbol: "daoAXS",
    erc20address: [
      "0xde3a24028580884448a5397872046a019649b084", 
      "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
      "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    ],
    vaultContractAddress: "0x6fd8c0c6cafb7b99c47bbe332cae42b32017cd58", // Update here
    vaultContractABI: abi.avaxStableVaultContract,
    decimals: 18,
    lastMeasurement: 6473117, 
    measurement: 1e18,
    price_id: ["tether", "usd-coin", "dai"],
    isAXA: true,
    triggerDuration: 2
  },
  {
    id: "daoASA",
    name: "DAO Vault ASA",
    symbol: ["USDT", "USDC", "DAI"],
    description: "DAO Vault ASA for 3 stablecoins",
    vaultSymbol: "daoASA",
    erc20address: [
      "0xde3a24028580884448a5397872046a019649b084", 
      "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
      "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    ],
    vaultContractAddress: "0x8b8d29166729b31b482df6055eaddcb944d4a1d8", 
    vaultContractABI: abi.avaxStableVaultContract,
    decimals: 18,
    lastMeasurement: 6473927, // Update here
    measurement: 1e18,
    price_id: ["tether", "usd-coin", "dai"],
    isAXA: true,
    triggerDuration: 2
  },
  {
    id: "daoA2S",
    name: "DAO Vault A2S",
    symbol: ["USDT", "USDC", "DAI"],
    description: "DAO Vault A2S for 3 stablecoins",
    vaultSymbol: "daoA2S",
    erc20address: [
      "0xde3a24028580884448a5397872046a019649b084", 
      "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
      "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    ],
    vaultContractAddress: "0xa236fa927dc61d9566faf62b29d287405c5e49fc", 
    vaultContractABI: abi.avaxStableVaultContract,
    decimals: 18,
    lastMeasurement: 6474452, // Update here
    measurement: 1e18,
    price_id: ["tether", "usd-coin", "dai"],
    isAXA: true,
    triggerDuration: 2
  },
];

module.exports = process.env.PRODUCTION != "" ? mainVaults : testVaults;
