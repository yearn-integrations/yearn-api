const Web3 = require("web3");
const constant = require("./constant");

const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT; // Ethereum
const archiveNodePolygonUrl = process.env.POLYGON_ARCHIVENODE_ENDPOINT; // Polygon

const web3 = new Web3(archiveNodeUrl);
const polygonWeb3 = new Web3(archiveNodePolygonUrl);

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