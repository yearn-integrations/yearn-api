const _ = require("lodash");
const ApyModel = require('../../../models/apy.model');
const contractHelper = require("../../../utils/contract");
const vaults = require("../../vaults/apy/save/vaults");
const { aggregatedContractAddress } = require("../../../config/serverless/domain");
const { aggregatedContractABI } = require("../../../config/abi");


const getVaultsApy = async () => {
  const apy = await ApyModel.findAll();
  apy.forEach((v) => delete v._id)
  return apy;
};

const getApy = async(strategyId) => {
  try {
    return await ApyModel.getApy(strategyId);
  } catch(err) {
    console.error(`Error in getApy(): `, err);
  }
}

const getEarnAPR = async(address) => {
  try {
    if(!address || address === undefined) {
      throw(`Missing ERC 20 address`);
    }

    // Aggregated Contract address is ethereum mainnet address
    if(process.env.PRODUCTION !== null && process.env.PRODUCTION !== "") {
      const aprContract = await contractHelper.getEthereumContract(aggregatedContractABI, aggregatedContractAddress);
      const aprOptions = await aprContract.methods.getAPROptions(address).call();
    
      if(aprOptions) {
        const workKeys = Object.keys(aprOptions).filter(key => {return isNaN(key)});
        const maxApr = Math.max.apply(
          Math,
          workKeys.map(function (o) {
            if (o === "uniapr" || o === "unicapr" || o === "iapr") {
              return aprOptions[o] - 100000000000000000000;
            }
            return aprOptions[o];
          })
        );
        return await contractHelper.fromWei(maxApr.toFixed(0));
      }    
    } 
    return await contractHelper.fromWei(0);
  } catch (err) {
    console.error(`Error in getEarnAPR(): `, err);
  }
 
  return await contractHelper.fromWei(0);
}

const getYearnAPY = async(strategyId) => {
  try {
    if(!strategyId) {
      throw(`Missing strategy ID`);
    }

    let vaultAPY, earnAPR = 0;
  
    const vault = vaults.filter(v => v.vaultSymbol === strategyId);
    if(vault.length > 0) {
      await getEarnAPR(vault[0].erc20address).then(result => {
        if(result) {
          earnAPR = result * 100;
        }
      });
    }
    await getApy(strategyId).then((result) => {
      if(result) {
        vaultAPY = result.apyInceptionSample;
      }
    });
    
    const aprs = [earnAPR.toFixed(2), vaultAPY.toFixed(2)];
    return (earnAPR > vaultAPY) 
      ? `${aprs[1]} % - ${aprs[0]}%`
      : `${aprs[0]} % - ${aprs[1]}%`;

  } catch(err) {
    console.error(`Error in getYearnAPY() :`, err)
  }
}

const getCompoundAPY = async (strategyId) => {
  try {
    if(!strategyId || strategyId === undefined) {
      throw(`Missing strategy ID`);
    }
    let compoundApy = 0;
    await getApy(strategyId).then((result) => {
      if(result) {
        compoundApy = result.compoundApy;
      }
    })
    return compoundApy;
  } catch(err) {
    console.error(`Error in getCompoundAPY(): `, err);
  }
}

const handler = async(res) => {
  const apy = await getVaultsApy();
  res.status(200).json({
    message: '',
    body: apy
  });
}

module.exports.handler = handler;
module.exports.getYearnAPY = getYearnAPY;
module.exports.getCompoundAPY = getCompoundAPY;
module.exports.getEarnAPR = getEarnAPR;
module.exports.getVaultsApy = getVaultsApy;
