
const constant = require("./constant");
const contractHelper = require("./contract");
const BigNumber = require("bignumber.js");

// Price info like ABI and address
const getPriceFeedContract = async(network, source, target) => {
    const contracts = contractHelper.getContractsFromDomain();
    const tokenPair = source + "_" + target;
   
    let contractInfo;
    if(network === constant.ETHEREUM) {
        contractInfo = contracts.chainLink[tokenPair];
        return contractHelper.getEthereumContract(contractInfo.abi, contractInfo.address);
    } else if (network === constant.POLYGON) {
        contractInfo = contracts.polygonChainLink[tokenPair];
        return contractHelper.getPolygonContract(contractInfo.abi, contractInfo.address);
    }
}

const getLatestAnswer = async(contract) => {
    return await contract.methods.latestAnswer().call();
}

const getDecimal = async (contract) => {
    return await contract.methods.decimals().call();
}

const getShiftedNumber = (number, decimal) => {
    return (new BigNumber(number)).shiftedBy(decimal);
}

// (Ethereum) USDT / ETH
module.exports.getEthereumUSDTETHPrice = async (raw = true) => {
    const contract = await getPriceFeedContract(constant.ETHEREUM, constant.USDT, constant.ETH);
    const price = await getLatestAnswer(contract);
    
    if(!raw) {
        const decimal = await getDecimal(contract) * (-1);
        return getShiftedNumber(price, decimal);
    }
    return price;
}

// (Ethereum) USDT / USD
module.exports.getEthereumUSDTUSDPrice = async(raw = true) => {
    const contract = await getPriceFeedContract(constant.ETHEREUM, constant.USDT, constant.USD);
    const price = await getLatestAnswer(contract);
    
    if(!raw) {
        const decimal = await getDecimal(contract) * (-1);
        return getShiftedNumber(price, decimal);
    }
    return price;
}

// (Polygon) USDT / USD
module.exports.getPolygonUSDTUSDPrice = async(raw = true) => {
    const contract = await getPriceFeedContract(constant.POLYGON, constant.USDT, constant.USD);
    const price = await getLatestAnswer(contract);
    
    if(!raw) {
        const decimal = await getDecimal(contract) * (-1);
        return getShiftedNumber(price, decimal);
    }
    return price;
}



