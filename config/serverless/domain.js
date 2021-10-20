const _ = require("lodash");
const abi = require("../abi");
const config = require("../../services/vaults/apy/save/config");
const constant = require("../../utils/constant");

const DEFAULT = {
  domainName: "api.yearn.tools",
  certificateName: "yearn.tools",
  stage: "${self:custom.currentStage}",
  createRoute53Record: true,
  basePath: "${self:custom.basePath}",
  endpointType: "regional",
  apiType: "rest",
  securityPolicy: "tls_1_2",
  autoDomain: true,
  // allowPathMatching: true, // enable only once when migrating from rest to http api migration
};

module.exports.prod = () => DEFAULT;

module.exports.staging = () => {
  return _.merge({}, DEFAULT, {
    domainName: `staging-${DEFAULT.domainName}`,
  });
};

module.exports.dev = () => {
  return _.merge({}, DEFAULT, {
    domainName: `dev-${DEFAULT.domainName}`,
  });
};
const testContracts = {
  earn: {
    yUSDT: {
      address: "0x2ad9f8d4c24652ea9f8a954f7e1fdb50a3be1dfd",
      abi: abi.earnUSDTABIContract,
    },
    yUSDC: {
      address: "0x2200a7e736821f5915ed3c40e7088a7e56dea64a",
      abi: abi.earnUSDCABIContract,
    },
    yDAI: {
      address: "0x690bcadb0d5633766510be078b97796d90acc7d8",
      abi: abi.earnDAIABIContract,
    },
    yTUSD: {
      address: "0x6c45ba691a8f587e3fd7f17c7adefce8dfa452aa",
      abi: abi.earnTUSDABIContract,
    },
  },
  vault: {
    yUSDT: {
      address: "0xa5c53c76729e92630a2a3c549215110a330c902d",
      abi: config.vaultContractV2ABI,
    },
    yUSDC: {
      address: "0xabdb489ded91b6646fadc8eeb0ca82ea1d526182",
      abi: config.vaultContractABI,
    },
    yDAI: {
      address: "0x5c2eea0a960cc1f604bf3c35a52ca2273f12e67e",
      abi: config.vaultContractV2ABI,
    },
    yTUSD: {
      address: "0xa8564f8d255c33175d4882e55f1a6d19e7a7d351",
      abi: config.vaultContractV2ABI,
    },
  },
  compund: {
    cUSDT: {
      address: "0x3f0a0ea2f86bae6362cf9799b523ba06647da018",
      abi: abi.cUSDTContract,
    },
    cUSDC: {
      address: "0x4a92e71227d294f041bd82dd8f78591b75140d63",
      abi: abi.cUSDCContract,
    },
    cDAI: {
      address: "0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad",
      abi: abi.cDAIContract,
    },
  },
  farmer: {
    daoCDV: {
      address: "0x626c25ca5b86277f395c0e40dbdf51f2a302ab43",
      abi: abi.citadelABIContract,
      strategyAddress: "0xc9939b0b2af53e8becba22ab153795e168140237",
      strategyABI: abi.citadelStrategyABIContract,
      contractType: "citadel",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 25336169,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoELO: {
      address: "0xf03fa8553379d872b4e2bafbc679409fb82604c2",
      abi: abi.elonApeVaultContract,
      strategyAddress: "0xa4f71f88bd522b33af3ae515caafa956bd1bbfa1",
      strategyABI: abi.elonApeStrategyContract,
      contractType: "elon",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 25413059,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
      ],
      network: constant.ETHEREUM,
    },
    daoCUB: {
      address: "0x5c304a6cb105e1bff9805ca5cf072f1d2c3beac5",
      abi: abi.cubanApeVaultContract,
      strategyAddress: "0x998372c8dc70833a7dc687020257302582fa5838",
      strategyABI: abi.cubanApeStrategyContract,
      contractType: "cuban",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 25536976,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
      ],
      network: constant.ETHEREUM,
    },
    daoSTO: {
      address: "0xd6af81e5288be43137debf969d7f2c03482c8cc1",
      abi: abi.daoFaangStonkVaultContract,
      strategyAddress: "0xc0f43b6db13e5988c92aa8c7c286a51f493620d4",
      strategyABI: abi.daoFaangStonkStrategyContract,
      contractType: "daoFaang",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 25867824,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoMPT: {
      address: "0x4f0bc6bd6beb231087781336bacd5613527ac63c",
      abi: abi.moneyPrinterVaultContract,
      strategyAddress: "0x8894da48bb8b7f7751ac4e2c37ed31b68d0c587f",
      strategyABI: abi.moneyPrinterStrategyContract,
      contractType: "moneyPrinter",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 16259595,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.POLYGON,
    },
    daoMVF: {
      address: '0xb2953c89615069fa6c14f3db3a09b7ecc077f533',
      abi: abi.metaverseVaultContract,
      strategyAddress: '0xf4655e971cc76b6daa78b4615dc2be4446e67e53',
      strategyABI: abi.metaverseStrategyContract,
      contractType: "metaverse",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 27591336,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoCDV2: {
      address: "0xc5719b5e85c30eb6a49d3c1b8058ae2435146c88",
      abi: abi.citadelV2VaultContract,
      strategyAddress: "0xa2b42a59ee0312a5f9d56dfad90ee6fa4a1be184",
      strategyABI: abi.citadelV2StrategyContract,
      contractType: "citadelv2",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 27355937,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoSTO2: {
      address: '0xb8e43526d2fee347f88e690ee86d047895472d04',
      abi: abi.daoStonksVaultContract,
      strategyAddress: '0x9cc2659d2516ecafe1abc1c5b45baf2709a9f597',
      strategyABI: abi.daoStonksStrategyContract,
      contractType: "daoStonks",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 27387067,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoDEGEN: {
      address: "0x56f2005c3fec21dd3c21899fbceb1aae5b4bc5da",
      abi: abi.daoDegenVaultContract,
      strategyAddress: "0xd1fc92873fcc59708cf26e2b8302188735caf526",
      strategyABI: abi.daoDegenStrategyContract,
      contractType: "daoDegen",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 12757720,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.BSC,
    }, 
    daoSAFU: {
      address: '0x81390703430015a751f967694d5ccb8745fda254',
      abi: abi.daoSafuVaultContract,
      strategyAddress: '0x7436297148face594f1b2f04a2901c3bb65eb771',
      strategyABI: abi.daoSafuStrategyContract,
      contractType: "daoSafu",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 12751827,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.BSC,
    },
    daoTAS : {
      address: '0xb72b89fa6d222973379cbd9c5c88768e3a050aed',
      abi: abi.daoTAVaultContract,
      strategyAddress: '0xfd2f8db43bcd7817bc6cd83a3bbf18dbe8227e55',
      strategyABI: abi.daoTAStrategyContract,
      contractType: "daoTA",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 27400992,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
  },
  DVD: {
    address: "0x6639c554a299d58284e36663f609a7d94526fec0",
    abi: abi.DVDABIContract,
    tokenId: "daoventures",
    network: constant.ETHEREUM,
  },
  vipDVD: {
    name: "vipDVD",
    address: "0x4bb18f377a9d2dd62a6af7d78f6e7673e0e0f648",
    abi: abi.xDVDABIContract,
    tokenId: "xDVD",
    decimals: 18,
    lastMeasurement: 26158560,
    network: constant.ETHEREUM,
  },
  DVG: {
    address: "0xea9726efc9831ef0499fd4db4ab143f15a797673",
    abi: abi.DVGABIContract,
    tokenId: "daoventures",
    network: constant.ETHEREUM,
  },
  vipDVG: {
    name: "vipDVG",
    address: "0x3aa8e8B6D3562a1E7aCB0dddD02b27896C00c424",
    abi: abi.xDVGABIContract,
    tokenId: "xDVG",
    decimals: 18,
    lastMeasurement: 24819747,
    network: constant.ETHEREUM,
  },
  daoStake: {
    address: "0xd8f59a99acfc597feb84914fef3769def87e7553",
    abi: abi.daoStakeContract,
    startBlock: 25721857, // Start block from contract's START_BLOCK
    poolPercent: 0.51,
    network: constant.ETHEREUM,
  },
  daoMine: {
    address: "0x651bf479d19cccb9d8646e760a7c1befbcda7411",
    abi: abi.daoMineContract,
    startBlock: 26524610, // Start block from contract's START_BLOCK
    poolPercent: 0.51,
    network: constant.ETHEREUM,
  },
  uniswap: {
    ethDVG: {
      address: "0x0A15e37442e2a41A3A51A9Eff7fE1DCE0E96f0bB",
      abi: abi.uniswapPairABIContract,
      network: constant.ETHEREUM,
    },
    ethDVD: {
      address: "0xf8098e1a33e5445322171c0acf785bd35def54fa",
      abi: abi.uniswapPairABIContract,  
      network: constant.ETHEREUM,
    }
  },
  harvest: {
    hfDAI: {
      address: "0xed2ebf9cde8c8fcc4f82ec6e3675130ae5649442",
      abi: abi.hfVault,
    },
    hfUSDC: {
      address: "0xeff936f12c1600b8ce60f0e0575f520f82aedce3",
      abi: abi.hfVault,
    },
    hfUSDT: {
      address: "0x1298e9b9a2350ad91f2baf68ab4de8ecb9267621",
      abi: abi.hfVault,
    },
  },
  chainLink: {
    USDT_ETH: {
      address: "0x0bF499444525a23E7Bb61997539725cA2e928138",
      abi: abi.eacAggregatoorProxyContract,
      network: constant.ETHEREUM,
    },
    USDT_USD: {
      address: "0x2ca5A90D34cA333661083F89D831f757A9A50148",
      abi: abi.eacAggregatoorProxyContract,
      network: constant.ETHEREUM,
    },
  },
  polygonChainLink: {
    USDT_USD: {
      address: "0x92c09849638959196e976289418e5973cc96d645",
      abi: abi.polygonEacAggregatoorProxyContract,
      network: constant.POLYGON,
    },
  },
  bot: {
    unibot: {
      abi: abi.uniBotContract,
      address: "0x26950eee5209a41bb0ae0ae8335cc5a2752624ef",
      startBlock: 26999775
    },
    dvdDistBot: {
      abi: abi.dvdDistBotContract,
      address: "0xcd3e01fdcf37d76f95f265001969695d00505d9f", 
      startBlock: 26902654
    }
  }
};

const mainContracts = {
  earn: {
    yUSDT: {
      address: "0xdb12e805d004698fc58f6e4fbdd876268df2dffe",
      abi: abi.earnUSDTABIContract,
    },
    yUSDC: {
      address: "0xC6Be21D8533e90Fd136905eBe70c9d9148237f2d",
      abi: abi.earnUSDCABIContract,
    },
    yDAI: {
      address: "0x21857b392b7d0ca20c439bc39896f38ee74c6023",
      abi: abi.earnDAIABIContract,
    },
    yTUSD: {
      address: "0x63659fcb4a1f62e0c80690ddc67084e8e1560c61",
      abi: abi.earnTUSDABIContract,
    },
  },
  vault: {
    yUSDT: {
      address: "0x2f08119c6f07c006695e079aafc638b8789faf18",
      abi: config.vaultContractV2ABI,
    },
    yUSDC: {
      address: "0x597ad1e0c13bfe8025993d9e79c69e1c0233522e",
      abi: config.vaultContractABI,
    },
    yDAI: {
      address: "0xacd43e627e64355f1861cec6d3a6688b31a6f952",
      abi: config.vaultContractV2ABI,
    },
    yTUSD: {
      address: "0x37d19d1c4e1fa9dc47bd1ea12f742a0887eda74a",
      abi: config.vaultContractV2ABI,
    },
  },
  farmer: {
    daoCDV: {
      address: "0x8fe826cc1225b03aa06477ad5af745aed5fe7066",
      abi: abi.citadelABIContract,
      strategyAddress: "0x8a00046ab28051a952e64a886cd8961ca90a59bd",
      strategyABI: abi.citadelStrategyABIContract,
      contractType: "citadel",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 12586420,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoELO: {
      address: "0x2d9a136cf87d599628bcbdfb6c4fe75acd2a0aa8",
      abi: abi.elonApeVaultContract,
      strategyAddress: "0x24d281dcc7d435500669459eaa393dc5200595b1",
      strategyABI: abi.elonApeStrategyContract,
      contractType: "elon",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 12722655,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
      ],
      network: constant.ETHEREUM,
    },
    daoCUB: {
      address: "0x2ad9f8d4c24652ea9f8a954f7e1fdb50a3be1dfd", 
      abi: abi.cubanApeVaultContract,
      strategyAddress: "0x7c0f84e9dc6f721de21d51a490de6e370fa01cd6",
      strategyABI: abi.cubanApeStrategyContract,
      contractType: "cuban",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 12799447,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
      ],
      network: constant.ETHEREUM,
    },
    daoSTO: {
      address: "0x9ee54014e1e6cf10fd7e9290fdb6101fd0d5d416",
      abi: abi.daoFaangStonkVaultContract,
      strategyAddress: "0x4a73dd597b8257e651ef12fd04a91a8819c89416",
      strategyABI: abi.daoFaangStonkStrategyContract,
      contractType: "daoFaang",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 12932754,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoMPT: {
      address: '0x3db93e95c9881bc7d9f2c845ce12e97130ebf5f2',
      abi: abi.moneyPrinterVaultContract,
      strategyAddress: '0x4728a38b6b00cdff9fdc59ace8e3c7ef3c6560e5',
      strategyABI: abi.moneyPrinterStrategyContract,
      contractType: "moneyPrinter",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 17566349,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.POLYGON,
    },
    daoMVF: {
      address: '0x5b3ae8b672a753906b1592d44741f71fbd05ba8c',
      abi: abi.metaverseVaultContractMainnet,
      strategyAddress: '0xfa83ca66fdacc4028dab383de4adc8ab7db21ff2',
      strategyABI: abi.metaverseStrategyContractMainnet,
      contractType: "metaverse",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 13239874,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoCDV2: {
      address: "0xcc6c417e991e810477b486d992faaca1b7440e76",
      abi: abi.citadelV2VaultContract,
      strategyAddress: "0x3845d7c09374df1ae6ce4728c99dd20d3d75f414",
      strategyABI: abi.citadelV2StrategyContract,
      contractType: "citadelv2",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 13344175,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoSTO2: {
      address: '0xd0b14644b0f91239075ed8a415769c4e20d37cf9',
      abi: abi.daoStonksVaultContract,
      strategyAddress: '	0x07450ffdaa82ec583f2928bf69293d05e53a4ae9',
      strategyABI: abi.daoStonksStrategyContract,
      contractType: "daoStonks",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 	13344659,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    },
    daoDEGEN: {
      address: "0x5e5d75c2d1eec055e8c824c6c4763b59d5c7f065",
      abi: abi.daoDegenVaultContract,
      strategyAddress: "0xeaa8c430d17c894134acfa0561853f37363ce887",
      strategyABI: abi.daoDegenStrategyContract,
      contractType: "daoDegen",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 11796468,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.BSC,
    },
    daoSAFU: {
      address: '0xb9e35635084b8b198f4bf4ee787d5949b46338f1',
      abi: abi.daoSafuVaultContract,
      strategyAddress: '0xdac6e0cd7a535038f5d836155784603fac1ba23d',
      strategyABI: abi.daoSafuStrategyContract,
      contractType: "daoSafu",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 11788791,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.BSC,
    },
    daoTAS : {
      address: '0xae6637a2e583295654989adcfb3221691bb490ef', 
      abi: abi.daoTAVaultContract,
      strategyAddress: '0xdddf9212cf1c87db8f61846b7c66aa0f066ed4e5', 
      strategyABI: abi.daoTAStrategyContract,
      contractType: "daoTA",
      tokenId: ["tether", "usd-coin", "dai"],
      inceptionBlock: 13390565,
      pnl:[
        {db: "lp", tokenId: ""},
        {db: "btc", tokenId: constant.TOKEN_COINGECKO_ID.BTC},
        {db: "eth", tokenId: constant.TOKEN_COINGECKO_ID.ETH},
      ],
      network: constant.ETHEREUM,
    }
  },
  compund: {
    cUSDT: {
      address: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
      abi: abi.cUSDTContract,
    },
    cUSDC: {
      address: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
      abi: abi.cUSDTContract,
    },
    cDAI: {
      address: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643",
      abi: abi.cDAIContract,
    },
  },
  DVD: {
    address: "0x77dcE26c03a9B833fc2D7C31C22Da4f42e9d9582",
    abi: abi.DVDABIContract,
    tokenId: "daoventures",
    network: constant.ETHEREUM
  },
  vipDVD: {
    name: "vipDVD",
    address: "0x1193c036833B0010fF80a3617BBC94400A284338",
    abi: abi.xDVDABIContract,
    tokenId: "xDVD",
    decimals: 18,
    lastMeasurement: 12838468,
    network: constant.ETHEREUM,
  },
  DVG: {
    address: "0x51e00a95748dbd2a3f47bc5c3b3e7b3f0fea666c",
    abi: abi.DVGABIContract,
    tokenId: "daoventures",
    network: constant.ETHEREUM,
  },
  vipDVG: {
    name: "vipDVG",
    address: "0xD6Ce913C3e81b5e67a6b94d705d9E7cDdf073A7e",
    abi: abi.xDVGABIContract,
    tokenId: "xDVG",
    decimals: 18,
    lastMeasurement: 12670237,
    network: constant.ETHEREUM,
  },
  daoStake: {
    address: "0x8437a6bf9235fd003d50cd4024fa7ec6979208d5", 
    abi: abi.daoStakeContract,
    startBlock: 12770000, // Start block from contract's START_BLOCK
    poolPercent: 0.51,
    network: constant.ETHEREUM,
  },
  daoMine: {
    address: "0x651bf479d19cccb9d8646e760a7c1befbcda7411", // TODO Update mainnet address
    abi: abi.daoMineContract,
    startBlock: 0, // Start block from contract's START_BLOCK
    poolPercent: 0.51,
    network: constant.ETHEREUM,
  },
  uniswap: {
    ethDVG: {
      address: "0xd11aD84D720A5e7fA11c8412Af6C1cAA815a436d",
      abi: abi.uniswapPairABIContract,
      network: constant.ETHEREUM,
    },
    ethDVD: {
      address: "0xce9add58ec5a07cb643faf7418eb94c193672844",
      abi: abi.uniswapPairABIContract,  
      network: constant.ETHEREUM,
    }
  },
  chainLink: {
    USDT_ETH: {
      address: "0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46",
      abi: abi.eacAggregatoorProxyContract,
      network: constant.ETHEREUM,
    },
    USDT_USD: {
      address: "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
      abi: abi.eacAggregatoorProxyContract,
      network: constant.ETHEREUM,
    },
  },
  polygonChainLink: {
    USDT_USD: {
      address: "0x0a6513e40db6eb1b165753ad52e80663aea50545",
      abi: abi.polygonEacAggregatoorProxyContract,
      network: constant.POLYGON,
    },
  },
  bot: {
    unibot: {
      abi: abi.uniBotContract,
      address: "0x161793275aeb70030239a2e176669b73ac8fc41f",
      startBlock: 12838474
    },
    dvdDistBot: {
      abi: abi.dvdDistBotContract,
      address: "0x118875dc986485fe53ed5b2cd6750a9150566c8f", 
      startBlock: 13086520
    }
  }
};

const devEarnContract = "0xdb12e805d004698fc58f6e4fbdd876268df2dffe";
const devVaultContract = "0x99dd34943c741E17EB772041cd3D7E8d317FA92f";
const devYfUSDTContract = "0x9680CF4CfED6Cf04eF0Eeb513c2399c192D0c0B0";
const prodEarnContract = "0xe6354ed5bc4b393a5aad09f21c46e101e692d447";
const prodVaultContract = "0x2f08119c6f07c006695e079aafc638b8789faf18";
const prodYfUSDTContract = "0xA0db955B5bdFA7C279CdE6C136FBA20C195CdEe5";
const aggregatedContractAddress = "0x9cad8ab10daa9af1a9d2b878541f41b697268eec";

module.exports.devContract = {
  devEarnContract,
  devVaultContract,
  devYfUSDTContract,
};

module.exports.prodContract = {
  prodEarnContract,
  prodVaultContract,
  prodYfUSDTContract,
};

module.exports = {
  testContracts,
  mainContracts,
  aggregatedContractAddress,
};
