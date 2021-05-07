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
      contractType: 'yearn'
    },
    'yUSDC': {
      address: '0xBdf7cC9c7a9dFF3d54Aa976e9586CE9935484005',
      abi: abi.vaultUSDCABIContract,
      strategyAddress: '0xf5a1988a9d02ce26b2cca31a56368e5f6a9b55ac',
      strategyABI: abi.yearnUSDCABIContract,
      contractType: 'yearn'
    },
    'yDAI': {
      address: '0x2BB53Ee2592319e3c3cF2323f1a81B1bF7854B7C',
      abi: abi.vaultDAIABIContract,
      strategyAddress: '0x26cd801a2dbd05caad547b9d67ac2665e45dbc7e',
      strategyABI: abi.yearnDAIABIContract,
      contractType: 'yearn'
    },
    'yTUSD': {
      address: '0xa8B73aE1E978315886E318FB086504231A3Ef917',
      abi: abi.vaultTUSDABIContract,
      strategyAddress: '0x5abeadf41fe9ea8dbd49ddf4e9659dd098da9610',
      strategyABI: abi.yearnTUSDABIContract,
      contractType: 'yearn'
    },
    // 'cUSDT': {
    //   address: '0x5d102e0bdf2037899e1ff2e8cc50987108533c52',
    //   abi: abi.compoundVaultContract,
    //   strategyAddress: '0xa5c956aef6a21c986665de9cf889ef36613c7d5e',
    //   strategyABI: abi.compoundStrategyContract,
    //   contractType: 'compound'
    // },
    // 'cUSDC': {
    //   address: '0x05ab7659e6ef9ba1a5f790b402fd1688f01b003e',
    //   abi: abi.compoundVaultContract,
    //   strategyAddress: '0x3add8a9d3176c4b30dddeeababf9ca5cc3d49944',
    //   strategyABI: abi.compoundStrategyContract,
    //   contractType: 'compound'
    // },
    // 'cDAI': {
    //   address: '0x47e565b1e23cda3d6bb69e7ae398b884f5addc7d',
    //   abi: abi.compoundVaultContract,
    //   strategyAddress: '0xb951976a7d79fd8a589a7ca9753641380f5c1ab4',
    //   strategyABI: abi.compoundStrategyContract,
    //   contractType: 'compound'
    // },
    'hfDAI': {
      address: '0xf6cd30117e16feacaebd2bd30a6d682af6fb9844',
      abi: abi.hfDAOContract,
      strategyAddress: '0xd505538106e0e4fe73e913f990688f2eafd75901',
      strategyABI: abi.hfStrategyContract,
      contractType: 'harvest'
    },
    'hfUSDC': {
      address: '0xefd426cee17809039c84da8e37951c634901e427',
      abi: abi.hfDAOContract,
      strategyAddress: '0x3568bcd1d00db319dade2c5611c474e8f4d661d1',
      strategyABI: abi.hfStrategyContract,
      contractType: 'harvest'
    },
    'hfUSDT': {
      address: '0xb0f92a610e83602bf5df258265dbe1561ae33e85',
      abi: abi.hfDAOContract,
      strategyAddress: '0x5f75141042e8ac06a6f7aecac665acad228faae1',
      strategyABI: abi.hfStrategyContract,
      contractType: 'harvest'
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
  },
  harvest: {
    'hfDAI': {
      address: '0xed2ebf9cde8c8fcc4f82ec6e3675130ae5649442',
      abi: abi.hfVault,
    },
    'hfUSDC': {
      address: '0xeff936f12c1600b8ce60f0e0575f520f82aedce3',
      abi: abi.hfVault,
    },
    'hfUSDT': {
      address: '0x1298e9b9a2350ad91f2baf68ab4de8ecb9267621',
      abi: abi.hfVault,
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


