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
      address: '0x359902517f43b8d38cf9718fe90e552375476f05',
      abi: config.vaultContractV2ABI,
    },
    'yUSDC': {
      address: '0x231991d392dbe5980586665bc1a066f8efac78c8',
      abi: config.vaultContractABI,
    },
    'yDAI': {
      address: '0x193b83e8cc108c86362e47a4c2d3048837d4996e',
      abi: config.vaultContractV2ABI,
    },
    'yTUSD': {
      address: '0x0c9ddf949e32221612145807e34483ccf946b2b9',
      abi: config.vaultContractV2ABI,
    },
  },
  farmer: {
    'yUSDT': {
      address: '0x132b495eC9451c9D572A791Ef9cB6f96Dcb67020',
      abi: abi.vaultUSDTABIContract,
      strategyAddress: '0x157fbacbbf6ba50c45e1375ae728f88f0cde1615',
      strategyABI: abi.yearnUSDTABIContract,
    },
    'yUSDC': {
      address: '0xBdf7cC9c7a9dFF3d54Aa976e9586CE9935484005',
      abi: abi.vaultUSDCABIContract,
      strategyAddress: '0xf5a1988a9d02ce26b2cca31a56368e5f6a9b55ac',
      strategyABI: abi.yearnUSDCABIContract,
    },
    'yDAI': {
      address: '0x2BB53Ee2592319e3c3cF2323f1a81B1bF7854B7C',
      abi: abi.vaultDAIABIContract,
      strategyAddress: '0x26cd801a2dbd05caad547b9d67ac2665e45dbc7e',
      strategyABI: abi.yearnDAIABIContract,
    },
    'yTUSD': {
      address: '0xa8B73aE1E978315886E318FB086504231A3Ef917',
      abi: abi.vaultTUSDABIContract,
      strategyAddress: '0x5abeadf41fe9ea8dbd49ddf4e9659dd098da9610',
      strategyABI: abi.yearnTUSDABIContract,
    },
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
    },
    'yUSDC': {
      address: '0x9f0230FbDC0379E5FefAcca89bE03A42Fec5fb6E',
      abi: abi.vaultUSDCABIContract,
      strategyAddress: '0x4A9dE4dA5eC67E1dbc8e18F26E178B40D690A11D',
      strategyABI: abi.yearnUSDCABIContract,
    },
    'yDAI': { 
      address: '0x2bFc2Da293C911e5FfeC4D2A2946A599Bc4Ae770',
      abi: abi.vaultDAIABIContract,
      strategyAddress: '0x3685fB7CA1C555Cb5BD5A246422ee1f2c53DdB71',
      strategyABI: abi.yearnDAIABIContract,
    },
    'yTUSD': {
      address: '0x2C8de02aD4312069355B94Fb936EFE6CFE0C8FF6',
      abi: abi.vaultTUSDABIContract,
      strategyAddress: '0xA6F1409a259B21a84c8346ED1B0826D656959a54',
      strategyABI: abi.yearnTUSDABIContract,
    },
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


