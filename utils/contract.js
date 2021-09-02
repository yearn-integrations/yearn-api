const Web3 = require("web3");
const constant = require("./constant");

const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT; // Ethereum
const archiveNodePolygonUrl = process.env.POLYGON_ARCHIVENODE_ENDPOINT; // Polygon

const web3 = new Web3(archiveNodeUrl);
const polygonWeb3 = new Web3(archiveNodePolygonUrl);

const EthDater = require("../services/vaults/apy/save/ethereum-block-by-date");
const ethereumBlocks = new EthDater(web3, 1000);
const polygonBlocks = new EthDater(polygonWeb3, 1000);

const { testContracts, mainContracts } = require("../config/serverless/domain");

// Create Ethereum network contract
module.exports.getEthereumContract =  async (abi, address) => {
    try {
        const contract = new web3.eth.Contract(abi, address);
        return contract;
    } catch (err) {
        console.log("err in getEthereumContract", err);
    }
}

// Create Polygon network contract
module.exports.getPolygonContract = async (abi, address) => {
    try {
        const contract = new polygonWeb3.eth.Contract(abi, address);
        return contract;
    } catch (err) {
        console.log("err in getPolygonContract", err);
    }
}

module.exports.getContract = async (abi, address, network) => {
    try {
        switch(network) {
            case constant.ETHEREUM: 
                return this.getEthereumContract(abi, address);
            case constant.POLYGON: 
                return this.getPolygonContract(abi, address);
            default:
                return this.getEthereumContract(abi, address);
        }
    } catch (err) {
        console.log(err);
    }
}

// Get current block number for Ethereum
module.exports.getEthereumCurrentBlockNumber = async() => {
    try {
        const currentBlockNumber = await web3.eth.getBlockNumber();
        return currentBlockNumber;
    } catch (err) {
        console.log('Error in getEthereumCurrentBlockNumber()', err);
    }
}

// Get current block number for Polygon
module.exports.getPolygonCurrentBlockNumber = async() => {
    try {
        const currentBlockNumber = await polygonWeb3.eth.getBlockNumber();
        return currentBlockNumber;
    } catch (err) {
        console.log('Error in getEthereumCurrentBlockNumber()', err);
    }
}

// Get Ethereum Block By Timeline
module.exports.getEthereumBlockByTimeline = async(timeline) => {
    try {
        return (await ethereumBlocks.getDate(timeline));
    } catch (err) {
        console.log('Error in getEthereumBlockByTimeline()', err);
    }
}

// Get ethereum block number by timeline
module.exports.getEthereumBlockNumberByTimeline = async(timeline) => {
    try {
        return (await ethereumBlocks.getDate(timeline)).block;
    } catch (err) {
        console.log('Error in getEthereumCurrentBlockNumber()', err);
    }
}

// Get Polygon Block By Timeline
module.exports.getPolygonBlockByTimeline = async(timeline) => {
    try {
        return (await polygonBlocks.getDate(timeline));
    } catch (err) {
        console.log('Error in getPolygonBlockByTimeline()', err);
    }
}

// Get Polygon block number by timeline
module.exports.getPolygonBlockNumberByTimeline = async(timeline) => {
    try {
        return (await polygonBlocks.getDate(timeline)).block;
    } catch (err) {
        console.log('Error in getPolygonBlockNumberByTimeline()', err);
    }
}

// Get contracts from domain.js based on environment
module.exports.getContractsFromDomain = () => {
    return (process.env.PRODUCTION !== null && process.env.PRODUCTION != "")
      ? mainContracts
      : testContracts;
}

// Get First Block for every period stated within start and end, for ethereum only
module.exports.getEveryEthereum = async (duration, start, end, every, after) => {
    try {
        return await ethereumBlocks.getEvery(
            duration,
            start, 
            end,
            every, 
            after
        );
    } catch (err) {
        console.error(`Error in getEveryEthereum(): `, err);
    }
}

// Get First Block for every period stated within start and end, for Polygon only
module.exports.getEveryPolygon = async (duration, start, end, every, after) => {
    try {
        return await polygonBlocks.getEvery(
            duration,
            start, 
            end,
            every, 
            after
        );
    } catch (err) {
        console.error(`Error in getEveryPolygon(): `, err);
    }
}

// Get block information (Ethereum)
module.exports.getEthereumBlockInfo = async (blockNumber) => {
    try {
        if(!blockNumber) {
            return null;
        }
        return await web3.eth.getBlock(blockNumber);
    } catch (err) {
        console.log("Error in getEthereumBlockInfo(): ", err);
    }
}

// Get block information (Polygon)
module.exports.getPolygonBlockInfo = async (blockNumber) => {
    try {
        if(!blockNumber) {
            return null;
        }
        return await polygonWeb3.eth.getBlock(blockNumber);
    } catch (err) {
        console.log("Error in getEthereumBlockInfo(): ", err);
    }
}

// Get block information by network 
module.exports.getBlockInformation = async (blockNumber, network) => {
    try {
        if(!network || !blockNumber) {
            return null;
        }
        if(network === constant.ETHEREUM) {
            return await this.getEthereumBlockInfo(blockNumber);
        }
        if(network === constant.POLYGON) {
            return await this.getPolygonBlockInfo(blockNumber);
        }
    } catch (err) {
        console.log("Error in getBlockInformation(): ", err);
    }
}

// Get contract's total supply 
module.exports.totalSupply = async(contract) => {
    try{
        return await contract.methods.totalSupply().call();
    } catch (err) {
        console.error("Error in contract helper totalSupply(): ", err);
    }
}

// Get contract balance of address 
module.exports.balanceOf = async(contract, address) => {
    try{
        return await contract.methods.balanceOf(address).call();
    } catch (err) {
        console.error("Error in contract helper balanceOf(): ", err);
    }
}

// Get contract's decimal
module.exports.decimals = async(contract) => {
    try {
        return await contract.methods.decimals().call();
    } catch (err) {
        console.error("Error in contract helper decimals(): ", err);
    }
}


