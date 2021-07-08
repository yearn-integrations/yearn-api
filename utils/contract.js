const Web3 = require("web3");
const constant = require("./constant");

const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT; // Ethereum
const archiveNodePolygonUrl = process.env.POLYGON_ARCHIVENODE_ENDPOINT; // Polygon

const web3 = new Web3(archiveNodeUrl);
const polygonWeb3 = new Web3(archiveNodePolygonUrl);

const EthDater = require("../services/vaults/apy/save/ethereum-block-by-date");
const ethereumBlocks = new EthDater(web3, 1000);
const polygonBlocks = new EthDater(polygonWeb3, 1000);

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
                break;
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

// Get ethereum block number by timeline
module.exports.getEthereumBlockNumberByTimeline = async(timeline) => {
    try {
        return (await ethereumBlocks.getDate(timeline)).block;
    } catch (err) {
        console.log('Error in getEthereumCurrentBlockNumber()', err);
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

