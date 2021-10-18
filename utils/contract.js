const Web3 = require("web3");
const constant = require("./constant");

const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT; // Ethereum
const archiveNodePolygonUrl = process.env.POLYGON_ARCHIVENODE_ENDPOINT; // Polygon
const archiveNodeBSCUrl = process.env.BSC_ARCHIVENODE_ENDPOINT; // BSC
const archiveNodeAvalancheUrl = process.env.AVALANCHE_ARCHIVENODE_ENDPOINT // Avalanche

const web3 = new Web3(archiveNodeUrl);
const polygonWeb3 = new Web3(archiveNodePolygonUrl);
const bscWeb3 = new Web3(archiveNodeBSCUrl);
const avaxWeb3 = new Web3(archiveNodeAvalancheUrl);

const EthDater = require("../services/vaults/apy/save/ethereum-block-by-date");
const ethereumBlocks = new EthDater(web3, 1000);
const polygonBlocks = new EthDater(polygonWeb3, 1000);
const bscBlocks = new EthDater(bscWeb3, 1000);
const avaxBlocks = new EthDater(avaxWeb3, 1000);

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

// Create BSC network contract
module.exports.getBSCContract = async(abi, address) => {
    try {
        const contract = new bscWeb3.eth.Contract(abi, address);
        return contract;
    } catch (err) {
        console.log("Error in getBSCContract()", err);
    }
}

// Create Avalanche network contract
module.exports.getAvalancheContract = async(abi, address) => {
    try {
        const contract = new avaxWeb3.eth.Contract(abi, address);
        return contract;
    } catch (err) {
        console.log("Error in getAvalancheContract()", err);
    }
}

module.exports.getContract = async (abi, address, network) => {
    try {
        switch(network) {
            case constant.ETHEREUM: 
                return this.getEthereumContract(abi, address);
            case constant.POLYGON: 
                return this.getPolygonContract(abi, address);
            case constant.BSC: 
                return this.getBSCContract(abi, address);
            case constant.AVAX:
                return this.getAvalancheContract(abi, address);
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
        console.log('Error in getPolygonCurrentBlockNumber()', err);
    }
}

// Get current block number for BSC
module.exports.getBSCCurrentBlockNumber = async() => {
    try {
        const currentBlockNumber = await bscWeb3.eth.getBlockNumber();
        return currentBlockNumber;
    } catch (err) {
        console.log('Error in getBSCCurrentBlockNumber()', err);
    }
}

// Get curent block number of Avalanche
module.exports.getAvalancheCurrentBlockNumber = async() => {
    try {
        const currentBlockNumber = await avaxWeb3.eth.getBlockNumber();
        return currentBlockNumber;
    } catch (err) {
        console.log('Error in getAvalancheCurrentBlockNumber()', err);
    }
} 

// Get current block number by network
module.exports.getCurrentBlockNumberByNetwork = async(network) => {
    try {
        switch(network) {
            case constant.ETHEREUM: 
                return this.getEthereumCurrentBlockNumber();
            case constant.POLYGON: 
                return this.getPolygonCurrentBlockNumber();
            case constant.BSC: 
                return this.getBSCCurrentBlockNumber();
            case constant.AVAX: 
                return this.getAvalancheCurrentBlockNumber();
            default: 
                return 0;
        }
    } catch (err) {
        console.log('Error in getCurrentBlockNumberByNetwork()', err);
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


// Get BSC Block By Timeline
module.exports.getBSCBlockByTimeline = async(timeline) => {
    try {
        return (await bscBlocks.getDate(timeline));
    } catch (err) {
        console.log('Error in getBSCBlockByTimeline()', err);
    }
}

// Get BSC block number by timeline
module.exports.getBscBlockNumberByTimeline = async(timeline) => {
    try {
        return (await bscBlocks.getDate(timeline)).block;
    } catch (err) {
        console.log('Error in getBscBlockNumberByTimeline()', err);
    }
}

// Get Avalanche Block By Timeline
module.exports.getAvalancheBlockByTimeline = async(timeline) => {
    try {
        return (await avaxBlocks.getDate(timeline));
    } catch (err) {
        console.log('Error in getAvalancheBlockByTimeline()', err);
    }
}

module.exports.getAvalancheBlockNumberByTimeline = async(timeline) => {
    try {
        return (await avaxBlocks.getDate(timeline)).block;
    } catch (err) {
        console.log('Error in getAvalancheBlockNumberByTimeline()', err);
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

// Get First Block for every period stated within start and end, for BSC only 
module.exports.getEveryBSC = async (duration, start, end, every, after) => {
    try {
        return await bscBlocks.getEvery(
            duration,
            start, 
            end,
            every, 
            after
        );
    } catch (err) {
        console.error(`Error in getEveryBSC(): `, err);
    }
}

// Get First Block for every period stated within start and end, for Avalanche only
module.exports.getEveryAvalanche = async (duration, start, end, every, after) => {
    try {
        return await avaxBlocks.getEvery(
            duration,
            start, 
            end,
            every, 
            after
        );
    } catch (err) {
        console.error(`Error in getEveryAvalanche(): `, err);
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
        console.log("Error in getPolygonBlockInfo(): ", err);
    }
}

// Get block information (BSC)
module.exports.getBscBlockInfo = async(blockNumber) => {
    try {
        if(!blockNumber) {
            return null;
        }
        return await bscWeb3.eth.getBlock(blockNumber);
    } catch (err) {
        console.log("Error in getBscBlockInfo(): ", err);
    }
}

// Get block information (Avalanche)
module.exports.getAvalancheBlockInfo = async(blockNumber) => {
    try {
        if(!blockNumber) {
            return null;
        }
        return await avaxWeb3.eth.getBlock(blockNumber);
    } catch (err) {
        console.log("Error in getAvalancheBlockInfo(): ", err);
    }
}

// Get block information by network 
module.exports.getBlockInformationByNetwork = async (blockNumber, network) => {
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
        if(network === constant.BSC) {
            return await this.getBscBlockInfo(blockNumber);
        }
        if(network === constant.AVAX) {
            return await this.getAvalancheBlockInfo(blockNumber);
        }
    } catch (err) {
        console.log("Error in getBlockInformation(): ", err);
    }
}

// Convert Wei value to ether value
module.exports.fromWei = async(value) => {
    try {
        if(!value) {
            return null;
        }
        return await web3.utils.fromWei(value, "ether");
    } catch(err) {
        console.log("Error in fromWei(): ", err);
    }
}

module.exports.totalSupply = async(contract) => {
    let totalSupply = 0;
    try { 
        totalSupply = await contract.methods.totalSupply().call();
    } catch(err) {
        console.error("Error in totalSupply(): ", err);
    } finally {
        return totalSupply;
    }
}

module.exports.balanceOf = async(contract, address) => {
    let balanceOf = 0;
    try {
        if(!contract || contract === undefined) {
            throw(`Missing contract`);
        }
        if(!address || address === "" || address === undefined) {
            throw(`Missing address`);
        }
        balanceOf = await contract.methods.balanceOf(address).call();
    } catch (err) {
        console.error(`Error in balanceOf(): `, err);
    } finally {
        return balanceOf;
    }
}

module.exports.checkIsValidStrategyId = (strategyId) => {
    let result = false;
    try { 
        if(strategyId === null || strategyId === "" || strategyId === undefined) {
            throw(`Missing strategy ID`);
        }

        const contracts = this.getContractsFromDomain();
        const strategies = Object.keys(contracts.farmer);

        result = strategies.includes(strategyId);
    } catch(err) {
        console.error(`Error in checkIsValidStrategyId(): `, err);
    } finally {
        return result;
    }
}


