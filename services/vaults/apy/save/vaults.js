const config = require("./config.js");
const abi = require('../../../../config/abi')

module.exports = [
  // {
  //   id: "DAI",
  //   name: "DAI",
  //   symbol: "DAI",
  //   description: "DAI Stablecoin",
  //   vaultSymbol: "yDAI",
  //   erc20address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  //   vaultContractAddress: "0xacd43e627e64355f1861cec6d3a6688b31a6f952",
  //   vaultContractABI: config.vaultContractV2ABI,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 18,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10650116,
  //   measurement: 1e18,
  //   price_id: "dai",
  // },
  // {
  //   id: "TUSD",
  //   name: "TUSD",
  //   symbol: "TUSD",
  //   description: "TrueUSD",
  //   vaultSymbol: "yTUSD",
  //   erc20address: "0x0000000000085d4780B73119b644AE5ecd22b376",
  //   vaultContractAddress: "0x37d19d1c4e1fa9dc47bd1ea12f742a0887eda74a",
  //   vaultContractABI: config.vaultContractV2ABI,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 18,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10603368,
  //   measurement: 1e18,
  //   price_id: "true-usd",
  // },
  // {
  //   id: "USDC",
  //   name: "USD Coin",
  //   symbol: "USDC",
  //   description: "USD//C",
  //   vaultSymbol: "yUSDC",
  //   erc20address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  //   vaultContractAddress: "0x597ad1e0c13bfe8025993d9e79c69e1c0233522e",
  //   vaultContractABI: config.vaultContractABI,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 6,
  //   deposit: true,
  //   depositAll: false,
  //   withdraw: true,
  //   withdrawAll: false,
  //   lastMeasurement: 10532708,
  //   measurement: 1e18,
  //   price_id: "usd-coin",
  // },
  // {
  //   id: "USDT",
  //   name: "USDT",
  //   symbol: "USDT",
  //   description: "Tether USD",
  //   vaultSymbol: "yUSDT",
  //   erc20address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  //   vaultContractAddress: "0x2f08119c6f07c006695e079aafc638b8789faf18",
  //   vaultContractABI: config.vaultContractV2ABI,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 6,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10651402,
  //   measurement: 1e18,
  //   price_id: "tether",
  // },
  // {
  //   id: "cDAI",
  //   name: "Compound DAI",
  //   symbol: "cDAI",
  //   description: "Compound DAI",
  //   erc20address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  //   vaultContractAddress: "0x43C20638C3914Eca3c96e9cAc8ebE7d652Be45c6",
  //   vaultContractABI: abi.cDAIContract,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 18,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10650116,
  //   measurement: 1e18,
  //   price_id: "cdai",
  //   vaultSymbol: 'cDAI',
  //   isCompound: true,
  // },
  // {
  //   id: "cUSDC",
  //   name: "Compound USDC",
  //   symbol: "cUSDC",
  //   description: "Compound USDC",
  //   erc20address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  //   vaultContractAddress: "0xd1D7f950899C0269a7F2aad5E854cdc3a1350ba9",
  //   vaultContractABI: abi.cUSDCContract,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 6,
  //   deposit: true,
  //   depositAll: false,
  //   withdraw: true,
  //   withdrawAll: false,
  //   lastMeasurement: 10532708,
  //   measurement: 1e18,
  //   price_id: "compound-usd-coin",
  //   vaultSymbol: 'cUSDC',
  //   isCompound: true,
  // },
  // {
  //   id: "cUSDT",
  //   name: "Compound USDT",
  //   symbol: "cUSDT",
  //   description: "Compound USDT",
  //   erc20address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  //   vaultContractAddress: "0xEeCe6AD323a93d4B021BDAaC587DCC04b5cf0a78",
  //   vaultContractABI: abi.cUSDTContract,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 6,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10651402,
  //   measurement: 1e18,
  //   price_id: "compound-usdt",
  //   vaultSymbol: 'cUSDT',
  //   isCompound: true,
  // },
  // {
  //   id: "cDAI",
  //   name: "Compound DAI",
  //   symbol: "cDAI",
  //   description: "Compound DAI",
  //   erc20address: "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
  //   vaultContractAddress: "0x47e565b1e23cda3d6bb69e7ae398b884f5addc7d",
  //   vaultContractABI: abi.cDAIContract,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 18,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10650116,
  //   measurement: 1e18,
  //   price_id: "dai",
  //   vaultSymbol: 'cDAI',
  //   isCompound: true,
  // },
  // {
  //   id: "cUSDC",
  //   name: "Compound USDC",
  //   symbol: "cUSDC",
  //   description: "Compound USDC",
  //   erc20address: "0xb7a4f3e9097c08da09517b5ab877f7a917224ede",
  //   vaultContractAddress: "0x05ab7659e6ef9ba1a5f790b402fd1688f01b003e",
  //   vaultContractABI: abi.cUSDCContract,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 6,
  //   deposit: true,
  //   depositAll: false,
  //   withdraw: true,
  //   withdrawAll: false,
  //   lastMeasurement: 10532708,
  //   measurement: 1e18,
  //   price_id: "usd-coin",
  //   vaultSymbol: 'cUSDC',
  //   isCompound: true,
  // },
  // {
  //   id: "cUSDT",
  //   name: "Compound USDT",
  //   symbol: "cUSDT",
  //   description: "Compound USDT",
  //   erc20address: "0x07de306ff27a2b630b1141956844eb1552b956b5",
  //   vaultContractAddress: "0x5d102e0bdf2037899e1ff2e8cc50987108533c52",
  //   vaultContractABI: abi.cUSDTContract,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 6,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10651402,
  //   measurement: 1e18,
  //   price_id: "tether",
  //   vaultSymbol: 'cUSDT',
  //   isCompound: true,
  // },
  // {
  //   id: "DAI",
  //   name: "DAI",
  //   symbol: "DAI",
  //   description: "DAI Stablecoin",
  //   vaultSymbol: "yDAI",
  //   erc20address: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
  //   vaultContractAddress: "0x193b83e8cc108c86362e47a4c2d3048837d4996e",
  //   vaultContractABI: config.vaultContractV2ABI,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 18,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10650116,
  //   measurement: 1e18,
  //   price_id: "dai",
  // },
  // {
  //   id: "TUSD",
  //   name: "TUSD",
  //   symbol: "TUSD",
  //   description: "TrueUSD",
  //   vaultSymbol: "yTUSD",
  //   erc20address: "0xe1964bdd447ee6f0ee2bc734f1043eba35444cfc",
  //   vaultContractAddress: "0x0c9ddf949e32221612145807e34483ccf946b2b9",
  //   vaultContractABI: config.vaultContractV2ABI,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 18,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10603368,
  //   measurement: 1e18,
  //   price_id: "true-usd",
  // },
  // {
  //   id: "USDC",
  //   name: "USD Coin",
  //   symbol: "USDC",
  //   description: "USD//C",
  //   vaultSymbol: "yUSDC",
  //   erc20address: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
  //   vaultContractAddress: "0x231991d392dbe5980586665bc1a066f8efac78c8",
  //   vaultContractABI: config.vaultContractABI,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 6,
  //   deposit: true,
  //   depositAll: false,
  //   withdraw: true,
  //   withdrawAll: false,
  //   lastMeasurement: 10532708,
  //   measurement: 1e18,
  //   price_id: "usd-coin",
  // },
  // {
  //   id: "USDT",
  //   name: "USDT",
  //   symbol: "USDT",
  //   description: "Tether USD",
  //   vaultSymbol: "yUSDT",
  //   erc20address: "0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02",
  //   vaultContractAddress: "0x359902517f43b8d38cf9718fe90e552375476f05",
  //   vaultContractABI: config.vaultContractV2ABI,
  //   balance: 0,
  //   vaultBalance: 0,
  //   decimals: 6,
  //   deposit: true,
  //   depositAll: true,
  //   withdraw: true,
  //   withdrawAll: true,
  //   lastMeasurement: 10651402,
  //   measurement: 1e18,
  //   price_id: "tether",
  // },
  {
    id: "hfDAI",
    name: "DAI",
    symbol: "DAI",
    description: "DAI Stablecoin",
    vaultSymbol: "hfDAI",
    erc20address: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
    vaultContractAddress: "0xf6cd30117e16feacaebd2bd30a6d682af6fb9844",
    vaultContractABI: config.daoVaultABI,
    balance: 0,
    vaultBalance: 0,
    decimals: 18,
    deposit: true,
    depositAll: true,
    withdraw: true,
    withdrawAll: true,
    lastMeasurement: 10650116,
    measurement: 1e18,
    price_id: "dai",
    isHarvest: true
  },
  {
    id: "hfUSDC",
    name: "USD Coin",
    symbol: "USDC",
    description: "USD//C",
    vaultSymbol: "hfUSDC",
    erc20address: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
    vaultContractAddress: "0xefd426cee17809039c84da8e37951c634901e427",
    vaultContractABI: config.daoVaultABI,
    balance: 0,
    vaultBalance: 0,
    decimals: 18,
    deposit: true,
    depositAll: false,
    withdraw: true,
    withdrawAll: false,
    lastMeasurement: 10532708,
    measurement: 1e18,
    price_id: "usd-coin",
    isHarvest: true
  },
  {
    id: "hfUSDT",
    name: "USDT",
    symbol: "USDT",
    description: "Tether USD",
    vaultSymbol: "hfUSDT",
    erc20address: "0xd9ba894e0097f8cc2bbc9d24d308b98e36dc6d02",
    vaultContractAddress: "0xb0f92a610e83602bf5df258265dbe1561ae33e85",
    vaultContractABI: config.daoVaultABI,
    balance: 0,
    vaultBalance: 0,
    decimals: 18,
    deposit: true,
    depositAll: true,
    withdraw: true,
    withdrawAll: true,
    lastMeasurement: 10651402,
    measurement: 1e18,
    price_id: "tether",
    isHarvest: true
  },
];
