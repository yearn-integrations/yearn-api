const _ = require("lodash");
const abi = require('../abi');
const config = require("../../services/vaults/apy/save/config");

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
    domainName: `staging-${DEFAULT.domainName}`
  });
};

module.exports.dev = () => {
  return _.merge({}, DEFAULT, {
    domainName: `dev-${DEFAULT.domainName}`,
  });
};

const testContracts = {
  earn: {
    'yUSDT': {
      address: '0x2ad9f8d4c24652ea9f8a954f7e1fdb50a3be1dfd',
      abi: abi.earnUSDTABIContract,
    },
    'yUSDC': {
      address: '0x2200a7e736821f5915ed3c40e7088a7e56dea64a',
      abi: abi.earnUSDCABIContract,
    },
    'yDAI': {
      address: '0x690bcadb0d5633766510be078b97796d90acc7d8',
      abi: abi.earnDAIABIContract,
    },
    'yTUSD': {
      address: '0x6c45ba691a8f587e3fd7f17c7adefce8dfa452aa',
      abi: abi.earnTUSDABIContract,
    },
  },
  vault: {
    'yUSDT': {
      address: '0xa5c53c76729e92630a2a3c549215110a330c902d',
      abi: config.vaultContractV2ABI,
    },
    'yUSDC': {
      address: '0xabdb489ded91b6646fadc8eeb0ca82ea1d526182',
      abi: config.vaultContractABI,
    },
    'yDAI': {
      address: '0x5c2eea0a960cc1f604bf3c35a52ca2273f12e67e',
      abi: config.vaultContractV2ABI,
    },
    'yTUSD': {
      address: '0xa8564f8d255c33175d4882e55f1a6d19e7a7d351',
      abi: config.vaultContractV2ABI,
    },
  },
  farmer: {
    'yUSDT': {
      address: '0x6B150E9BD70E216775c8b73270E64e870a3110c1',
      abi: abi.vaultUSDTABIContract,
      strategyAddress: '0x31324c1c0bb6b4b6f8102acb8346b065307926fa',
      strategyABI: abi.yearnUSDTABIContract,
      contractType: 'yearn'
    },
    'yUSDC': {
      address: '0x6E15e283dc430eca010Ade8b11b5B377902d6e56',
      abi: abi.vaultUSDCABIContract,
      strategyAddress: '0xe77ad5e2c4e7143fdbac6a4dde891727fc395c75',
      strategyABI: abi.yearnUSDCABIContract,
      contractType: 'yearn'
    },
    'yDAI': {
      address: '0x2428bFD238a3632552B343297c504F60283009eD',
      abi: abi.vaultDAIABIContract,
      strategyAddress: '0x8615dfb5b53e9ddb3751fbc3fc59512d4aba9a22',
      strategyABI: abi.yearnDAIABIContract,
      contractType: 'yearn'
    },
    'yTUSD': {
      address: '0xEcCb98c36bfc8c49c6065d1cD90bcf1c6F02D4AD',
      abi: abi.vaultTUSDABIContract,
      strategyAddress: '0xf64674cfc6597d597275144a1a746dad564b0fcd',
      strategyABI: abi.yearnTUSDABIContract,
      contractType: 'yearn'
    },
    'cUSDT': {
      address: '0x5d102e0bdf2037899e1ff2e8cc50987108533c52',
      abi: abi.compoundVaultContract,
      strategyAddress: '0xa5c956aef6a21c986665de9cf889ef36613c7d5e',
      strategyABI: abi.compoundStrategyContract,
      contractType: 'compound'
    },
    'cUSDC': {
      address: '0x05ab7659e6ef9ba1a5f790b402fd1688f01b003e',
      abi: abi.compoundVaultContract,
      strategyAddress: '0x3add8a9d3176c4b30dddeeababf9ca5cc3d49944',
      strategyABI: abi.compoundStrategyContract,
      contractType: 'compound'
    },
    'cDAI': {
      address: '0x47e565b1e23cda3d6bb69e7ae398b884f5addc7d',
      abi: abi.compoundVaultContract,
      strategyAddress: '0xb951976a7d79fd8a589a7ca9753641380f5c1ab4',
      strategyABI: abi.compoundStrategyContract,
      contractType: 'compound'
    },
  },
  compund: {
    'cUSDT': {
      address: '0x3f0a0ea2f86bae6362cf9799b523ba06647da018',
      abi: abi.cUSDTContract,
    },
    'cUSDC': {
      address: '0x4a92e71227d294f041bd82dd8f78591b75140d63',
      abi: abi.cUSDCContract,
    },
    'cDAI': {
      address: '0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad',
      abi: abi.cDAIContract,
    }
  }
};

const mainContracts = {
  earn: {
    'yUSDT': {
      address: '0xdb12e805d004698fc58f6e4fbdd876268df2dffe',
      abi: abi.earnUSDTABIContract,
    },
    'yUSDC': {
      address: '0xC6Be21D8533e90Fd136905eBe70c9d9148237f2d',
      abi: abi.earnUSDCABIContract,
    },
    'yDAI': {
      address: '0x21857b392b7d0ca20c439bc39896f38ee74c6023',
      abi: abi.earnDAIABIContract,
    },
    'yTUSD': {
      address: '0x63659fcb4a1f62e0c80690ddc67084e8e1560c61',
      abi: abi.earnTUSDABIContract,
    },
  },
  vault: {
    'yUSDT': {
      address: '0x2f08119c6f07c006695e079aafc638b8789faf18',
      abi: config.vaultContractV2ABI,
    },
    'yUSDC': {
      address: '0x597ad1e0c13bfe8025993d9e79c69e1c0233522e',
      abi: config.vaultContractABI,
    },
    'yDAI': {
      address: '0xacd43e627e64355f1861cec6d3a6688b31a6f952',
      abi: config.vaultContractV2ABI,
    },
    'yTUSD': {
      address: '0x37d19d1c4e1fa9dc47bd1ea12f742a0887eda74a',
      abi: config.vaultContractV2ABI,
    },
  },
  farmer: {
    'yUSDT': {
      address: '0x4F0C1c9bA6B9CCd0BEd6166e86b672ac8EE621F7',
      abi: abi.vaultUSDTABIContract,
      strategyAddress: '0x3DB93e95c9881BC7D9f2C845ce12e97130Ebf5f2',
      strategyABI: abi.yearnUSDTABIContract,
      contractType: 'yearn'
    },
    'yUSDC': {
      address: '0x9f0230FbDC0379E5FefAcca89bE03A42Fec5fb6E',
      abi: abi.vaultUSDCABIContract,
      strategyAddress: '0x4A9dE4dA5eC67E1dbc8e18F26E178B40D690A11D',
      strategyABI: abi.yearnUSDCABIContract,
      contractType: 'yearn'
    },
    'yDAI': { 
      address: '0x2bFc2Da293C911e5FfeC4D2A2946A599Bc4Ae770',
      abi: abi.vaultDAIABIContract,
      strategyAddress: '0x3685fB7CA1C555Cb5BD5A246422ee1f2c53DdB71',
      strategyABI: abi.yearnDAIABIContract,
      contractType: 'yearn'
    },
    'yTUSD': {
      address: '0x2C8de02aD4312069355B94Fb936EFE6CFE0C8FF6',
      abi: abi.vaultTUSDABIContract,
      strategyAddress: '0xA6F1409a259B21a84c8346ED1B0826D656959a54',
      strategyABI: abi.yearnTUSDABIContract,
      contractType: 'yearn'
    },
    'cUSDT': {
      address: '0xEeCe6AD323a93d4B021BDAaC587DCC04b5cf0a78',
      abi: abi.compoundVaultContract,
      strategyAddress: '0x11af10648ed5094f41753ccb69a2f74135697631',
      strategyABI: abi.compoundStrategyContract,
      contractType: 'compound'
    },
    'cUSDC': {
      address: '0xd1D7f950899C0269a7F2aad5E854cdc3a1350ba9',
      abi: abi.compoundVaultContract,
      strategyAddress: '0x89be389b0529ca3187b6e81e689496cb3bad8557',
      strategyABI: abi.compoundStrategyContract,
      contractType: 'compound'
    },
    'cDAI': {
      address: '0x43C20638C3914Eca3c96e9cAc8ebE7d652Be45c6',
      abi: abi.compoundVaultContract,
      strategyAddress: '0x0c5cff1c9ec7ce8e28998503471b19c848c5a581',
      strategyABI: abi.compoundStrategyContract,
      contractType: 'compound'
    },
  },
  compund: {
    'cUSDT': {
      address: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
      abi: abi.cUSDTContract,
    },
    'cUSDC': {
      address: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
      abi: abi.cUSDTContract,
    },
    'cDAI': {
      address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
      abi: abi.cDAIContract,
    }
  }
}

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
}

module.exports = {
  testContracts,
  mainContracts,
  aggregatedContractAddress,
}


