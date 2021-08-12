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
    yUSDT: {
      address: "0x6b150e9bd70e216775c8b73270e64e870a3110c1",
      abi: abi.vaultUSDTABIContract,
      strategyAddress: "0x31324c1c0bb6b4b6f8102acb8346b065307926fa",
      strategyABI: abi.yearnUSDTABIContract,
      contractType: "yearn",
      tokenId: "tether",
      network: constant.ETHEREUM,
    },
    yUSDC: {
      address: "0x6e15e283dc430eca010ade8b11b5b377902d6e56",
      abi: abi.vaultUSDCABIContract,
      strategyAddress: "0xe77ad5e2c4e7143fdbac6a4dde891727fc395c75",
      strategyABI: abi.yearnUSDCABIContract,
      contractType: "yearn",
      tokenId: "usd-coin",
      network: constant.ETHEREUM,
    },
    yDAI: {
      address: "0x2428bfd238a3632552b343297c504f60283009ed",
      abi: abi.vaultDAIABIContract,
      strategyAddress: "0x8615dfb5b53e9ddb3751fbc3fc59512d4aba9a22",
      strategyABI: abi.yearnDAIABIContract,
      contractType: "yearn",
      tokenId: "dai",
      network: constant.ETHEREUM,
    },
    yTUSD: {
      address: "0xeccb98c36bfc8c49c6065d1cd90bcf1c6f02d4ad",
      abi: abi.vaultTUSDABIContract,
      strategyAddress: "0xf64674cfc6597d597275144a1a746dad564b0fcd",
      strategyABI: abi.yearnTUSDABIContract,
      contractType: "yearn",
      tokenId: "true-usd",
      network: constant.ETHEREUM,
    },
    cUSDT: {
      address: "0x5d102e0bdf2037899e1ff2e8cc50987108533c52",
      abi: abi.compoundVaultContract,
      strategyAddress: "0xa5c956aef6a21c986665de9cf889ef36613c7d5e",
      strategyABI: abi.compoundStrategyContract,
      contractType: "compound",
      tokenId: "tether",
      network: constant.ETHEREUM,
    },
    cUSDC: {
      address: "0x05ab7659e6ef9ba1a5f790b402fd1688f01b003e",
      abi: abi.compoundVaultContract,
      strategyAddress: "0x3add8a9d3176c4b30dddeeababf9ca5cc3d49944",
      strategyABI: abi.compoundStrategyContract,
      contractType: "compound",
      tokenId: "usd-coin",
      network: constant.ETHEREUM,
    },
    cDAI: {
      address: "0x47e565b1e23cda3d6bb69e7ae398b884f5addc7d",
      abi: abi.compoundVaultContract,
      strategyAddress: "0xb951976a7d79fd8a589a7ca9753641380f5c1ab4",
      strategyABI: abi.compoundStrategyContract,
      contractType: "compound",
      tokenId: "dai",
      network: constant.ETHEREUM,
    },
    daoCDV: {
      address: "0x626c25ca5b86277f395c0e40dbdf51f2a302ab43",
      abi: abi.citadelABIContract,
      strategyAddress: "0xc9939b0b2af53e8becba22ab153795e168140237",
      strategyABI: abi.citadelStrategyABIContract,
      contractType: "citadel",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.ETHEREUM,
    },
    daoELO: {
      address: "0xf03fa8553379d872b4e2bafbc679409fb82604c2",
      abi: abi.elonApeVaultContract,
      strategyAddress: "0xa4f71f88bd522b33af3ae515caafa956bd1bbfa1",
      strategyABI: abi.elonApeStrategyContract,
      contractType: "elon",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.ETHEREUM,
    },
    daoCUB: {
      address: "0x5c304a6cb105e1bff9805ca5cf072f1d2c3beac5",
      abi: abi.cubanApeVaultContract,
      strategyAddress: "0x998372c8dc70833a7dc687020257302582fa5838",
      strategyABI: abi.cubanApeStrategyContract,
      contractType: "cuban",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.ETHEREUM,
    },
    daoSTO: {
      address: "0xd6af81e5288be43137debf969d7f2c03482c8cc1",
      abi: abi.daoFaangStonkVaultContract,
      strategyAddress: "0xc0f43b6db13e5988c92aa8c7c286a51f493620d4",
      strategyABI: abi.daoFaangStonkStrategyContract,
      contractType: "daoFaang",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.ETHEREUM,
    },
    hfDAI: {
      address: "0x6d7e8fa90c1ffdc019d691bafc18d6362fdeecd7",
      abi: abi.hfVaultContract,
      strategyAddress: "0xdfeb689aea68f221eaafeeeb91767003265968d6",
      strategyABI: abi.hfStrategyContract,
      contractType: "harvest",
      tokenId: "dai",
      network: constant.ETHEREUM,
    },
    hfUSDC: {
      address: "0x68b1c860300c4f7d577f08d8b3c3aee23887b280",
      abi: abi.hfVaultContract,
      strategyAddress: "0x7da9e06545c4fe6556fc0990f5afd4955379e1d2",
      strategyABI: abi.hfStrategyContract,
      contractType: "harvest",
      tokenId: "usd-coin",
      network: constant.ETHEREUM,
    },
    hfUSDT: {
      address: "0x35880615bb18da592ff0feb0940ade2c02249715",
      abi: abi.hfVaultContract,
      strategyAddress: "0xac783dc15d2cf08d1e1c34e18e531a9b182277b0",
      strategyABI: abi.hfStrategyContract,
      contractType: "harvest",
      tokenId: "tether",
      network: constant.ETHEREUM,
    },
    daoMPT: {
      address: "0x4f0bc6bd6beb231087781336bacd5613527ac63c",
      abi: abi.moneyPrinterVaultContract,
      strategyAddress: "0x8894da48bb8b7f7751ac4e2c37ed31b68d0c587f",
      strategyABI: abi.moneyPrinterStrategyContract,
      contractType: "moneyPrinter",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.POLYGON,
    },
  },
  DVD: {
    address: "0x6639c554a299d58284e36663f609a7d94526fec0",
    abi: abi.DVDABIContract,
    tokenId: "",
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
  uniswap: {
    ethDVG: {
      address: "0x0A15e37442e2a41A3A51A9Eff7fE1DCE0E96f0bB",
      abi: abi.uniswapPairABIContract,
      network: constant.ETHEREUM,
    },
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
    yUSDT: {
      address: "0x4f0c1c9ba6b9ccd0bed6166e86b672ac8ee621f7",
      abi: abi.vaultUSDTABIContract,
      strategyAddress: "0x3db93e95c9881bc7d9f2c845ce12e97130ebf5f2",
      strategyABI: abi.yearnUSDTABIContract,
      contractType: "yearn",
      tokenId: "tether",
      network: constant.ETHEREUM,
    },
    yUSDC: {
      address: "0x9f0230fbdc0379e5fefacca89be03a42fec5fb6e",
      abi: abi.vaultUSDCABIContract,
      strategyAddress: "0x4a9de4da5ec67e1dbc8e18f26e178b40d690a11d",
      strategyABI: abi.yearnUSDCABIContract,
      contractType: "yearn",
      tokenId: "usd-coin",
      network: constant.ETHEREUM,
    },
    yDAI: {
      address: "0x2bfc2da293c911e5ffec4d2a2946a599bc4ae770",
      abi: abi.vaultDAIABIContract,
      strategyAddress: "0x3685fb7ca1c555cb5bd5a246422ee1f2c53ddb71",
      strategyABI: abi.yearnDAIABIContract,
      contractType: "yearn",
      tokenId: "dai",
      network: constant.ETHEREUM,
    },
    yTUSD: {
      address: "0x2c8de02ad4312069355b94fb936efe6cfe0c8ff6",
      abi: abi.vaultTUSDABIContract,
      strategyAddress: "0xa6f1409a259b21a84c8346ed1b0826d656959a54",
      strategyABI: abi.yearnTUSDABIContract,
      contractType: "yearn",
      tokenId: "true-usd",
      network: constant.ETHEREUM,
    },
    cUSDT: {
      address: "0xeece6ad323a93d4b021bdaac587dcc04b5cf0a78",
      abi: abi.compoundVaultContract,
      strategyAddress: "0x11af10648ed5094f41753ccb69a2f74135697631",
      strategyABI: abi.compoundStrategyContract,
      contractType: "compound",
      tokenId: "tether",
      network: constant.ETHEREUM,
    },
    cUSDC: {
      address: "0xd1d7f950899c0269a7f2aad5e854cdc3a1350ba9",
      abi: abi.compoundVaultContract,
      strategyAddress: "0x89be389b0529ca3187b6e81e689496cb3bad8557",
      strategyABI: abi.compoundStrategyContract,
      contractType: "compound",
      tokenId: "usd-coin",
      network: constant.ETHEREUM,
    },
    cDAI: {
      address: "0x43c20638c3914eca3c96e9cac8ebe7d652be45c6",
      abi: abi.compoundVaultContract,
      strategyAddress: "0x0c5cff1c9ec7ce8e28998503471b19c848c5a581",
      strategyABI: abi.compoundStrategyContract,
      contractType: "compound",
      tokenId: "dai",
      network: constant.ETHEREUM,
    },
    daoCDV: {
      address: "0x8fe826cc1225b03aa06477ad5af745aed5fe7066",
      abi: abi.citadelABIContract,
      strategyAddress: "0x8a00046ab28051a952e64a886cd8961ca90a59bd",
      strategyABI: abi.citadelStrategyABIContract,
      contractType: "citadel",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.ETHEREUM,
    },
    daoELO: {
      address: "0x2d9a136cf87d599628bcbdfb6c4fe75acd2a0aa8",
      abi: abi.elonApeVaultContract,
      strategyAddress: "0x24d281dcc7d435500669459eaa393dc5200595b1",
      strategyABI: abi.elonApeStrategyContract,
      contractType: "elon",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.ETHEREUM,
    },
    daoCUB: {
      address: "0x2ad9f8d4c24652ea9f8a954f7e1fdb50a3be1dfd", 
      abi: abi.cubanApeVaultContract,
      strategyAddress: "0x7c0f84e9dc6f721de21d51a490de6e370fa01cd6",
      strategyABI: abi.cubanApeStrategyContract,
      contractType: "cuban",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.ETHEREUM,
    },
    daoSTO: {
      address: "0x9ee54014e1e6cf10fd7e9290fdb6101fd0d5d416",
      abi: abi.daoFaangStonkVaultContract,
      strategyAddress: "0x4a73dd597b8257e651ef12fd04a91a8819c89416",
      strategyABI: abi.daoFaangStonkStrategyContract,
      contractType: "daoFaang",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.ETHEREUM,
    },
    daoMPT: {
      address: '0x3db93e95c9881bc7d9f2c845ce12e97130ebf5f2',
      abi: abi.moneyPrinterVaultContract,
      strategyAddress: '0x4728a38b6b00cdff9fdc59ace8e3c7ef3c6560e5',
      strategyABI: abi.moneyPrinterStrategyContract,
      contractType: "moneyPrinter",
      tokenId: ["tether", "usd-coin", "dai"],
      network: constant.POLYGON,
    },
    // hfDAI: {
    //   address: '0x2cc1507e6e3c844eeb77db90d193489f1ddfb299', 
    //   abi: abi.hfVaultContract,
    //   strategyAddress: '0x89541e3b8e8b73c108744909ea11d506b4a8e6c7',
    //   strategyABI:  abi.hfStrategyContract,
    //   contractType: 'harvest',
    //   tokenId: "dai",
    //   network: constant.ETHEREUM
    // },
    // hfUSDC: {
    //   address: '0xd0f0858578c7780f2d65f6d81bc7ddbe166367cc', 
    //   abi: abi.hfVaultContract,
    //   strategyAddress: '0x0af9547974e056fca221f679dbbb7f8651407d7f',
    //   strategyABI: abi.hfStrategyContract,
    //   contractType: 'harvest',
    //   tokenId: "usd-coin",
    //   network: constant.ETHEREUM
    // },
    // hfUSDT: {
    //   address: '0xe4e6ce7c1d9ff44db27f622accbb0753c2f48955',
    //   abi: abi.hfVaultContract,
    //   strategyAddress: '0xef9a15025c2ed048a67c5c8019a1101172eeb51c',
    //   strategyABI: abi.hfStrategyContract,
    //   contractType: 'harvest',
    //   tokenId: "tether",
    //   network: constant.ETHEREUM
    // },
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
    tokenId: "",
    network: constant.ETHEREUM,
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
  uniswap: {
    ethDVG: {
      address: "0xd11aD84D720A5e7fA11c8412Af6C1cAA815a436d",
      abi: abi.uniswapPairABIContract,
      network: constant.ETHEREUM,
    },
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
