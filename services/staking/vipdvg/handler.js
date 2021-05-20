const { testContracts, mainContracts } = require("../../../config/serverless/domain");

const Web3 = require("web3");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT;
const archiveNodeWeb3 = new Web3(archiveNodeUrl);

let dvgContract;
let xDVGContract;

let dvgContractInfo;
let xDVGContractInfo;

let dvgBalanceOfxDVG = 0;
let xDVGTotalSupply = 0;
let dvgPrice = 0;
let xDVGPrice = 0;

// Get VIP DVG contract info from domain based on enviroment
const getContractInfo = (name) => {
    const contracts =  process.env.PRODUCTION != null && process.env.PRODUCTION != "" 
                        ? mainContracts : testContracts;
    return contracts[name];
} 

// Get contract
const getContract = async (contractInfo) => {
    const { abi, address } = contractInfo;
    const contract = new archiveNodeWeb3.eth.Contract(abi, address);
    return contract;
}

// Get Token Price
const getTokenPrice = async (coingecko_token_id) => {
    let data;
    try {
        data = await CoinGeckoClient.simple.price({
            ids: coingecko_token_id,
            vs_currencies: ["usd"],
        });
        return data.data[coingecko_token_id]["usd"];
    } catch (err) {
        console.log("Error in getTokenPrice(): ", err);
    }
    return;
}

// Get vipDVG's total supply
const getxDVGTotalSupply = async() => {
    try {
        xDVGTotalSupply = await xDVGContract.methods.totalSupply().call();
    } catch(err) {
        console.log("Error in getxDVGTotalSupply(): ", err);
    }
}

// DVG's balance of vipDVG contract
const getDVGBalanceOfxDVG = async() => {
    try {
        dvgBalanceOfVipDVG = await dvgContract.methods.balanceOf(xDVGContractInfo.address).call();
    } catch (err) {
        console.log("Error in getDVGBalanceOfxDVG(): ", err)
    }
}

// xDVGPrice Formula :  xDVG price = ( DVG amount of xDVG SC * DVG price) / xDVG amount
const getxDVGPrice = async (xDVGAmount) => {
    return (dvgBalanceOfxDVG * dvgPrice) / xDVGAmount;
}

// APR calculation Formula : (xDVG's total supply * xDVG price) / (DVG.balanceOf(xDVG) * DVG price)
const getxDVGAPR = async (xDVGAmount) => {
    await getxDVGTotalSupply();
    await getDVGBalanceOfxDVG();
    dvgPrice = await getTokenPrice(dvgContractInfo.tokenId);
    xDVGPrice = await getxDVGPrice(xDVGAmount);

    console.log("total supply: ", xDVGTotalSupply);
    console.log("balance: ", dvgBalanceOfxDVG);
    console.log("dvg price: ", dvgPrice);
    console.log("xDVG price", xDVGPrice);

    const apr = (xDVGTotalSupply * xDVGPrice) / (dvgBalanceOfxDVG * dvgPrice);
    console.log("apr", apr);

    return apr;
}

module.exports.getxDVGStake = async(req, res) => {
    if(req.params.amount == null || req.params.amount == "") {
        res.status(200).json({
            message: "xDVG amount is empty.",
            body: null
        })
    }

    try {
        // Get vipDVG contract
        xDVGContractInfo = getContractInfo("vipDVG");
        xDVGContract = await getContract(xDVGContractInfo);

        // Get DVG contract
        dvgContractInfo = getContractInfo("DVG");
        dvgContract = await getContract(dvgContractInfo);
         
        let apr = await getxDVGAPR(req.params.amount);

        if(!apr || isNaN(apr)) {
            apr = 0.00;
        }

        const result = { apr, dvgPrice };
        
        res.status(200).json({
            message: 'Successful Response',
            body: result
        });

    } catch (err) {
        res.status(200).json({
            message: err.message,
            body: null
        });
    }
    return;
};