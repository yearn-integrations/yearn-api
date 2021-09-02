const db = require("../../../models/vip-apy.model");
const contractHelper = require("../../../utils/contract");
const dateTimeHelper = require("../../../utils/dateTime");
const tokenHelper = require("../../../utils/token");

const {
    calculateVipDvdApr,
    calculateVipTokenApr,
    calculateAprPerDay,
    getVipTokenPrice,
    getVipTokenTVL
} = require("./calculation");


const getContracts = () => {
    return contractHelper.getContractsFromDomain();
}

const getContract = async (contractInfo) => {
    const { abi, address } = contractInfo;
    return await contractHelper.getContract(abi, address, null);
}

const getAPR = async (vipName) => {
    const apr = await db.findOne({
        name: vipName,
    });

    if (apr != null) {
        delete apr._id;
        delete apr.name;
    }
    return apr;
}

const addAPR = async (result, name) => {
    await db.add({...result, name });
    return;
}

const getVipDvgAPR = async(days) => {
    try {
        if(!days) {
            throw (`Missing days for APR info calculation`);
        }
        const contracts = contractHelper.getContractsFromDomain();
    
        const tokenInfo = contracts.DVG;
        const vipTokenInfo = contracts.vipDVG;
    
        const apr = await calculateVipTokenApr(tokenInfo, vipTokenInfo);
        const aprInfo = await calculateAprPerDay(apr, days);
    
        return { ...aprInfo, apr };
    } catch(err) {
        console.error(`Error in getVipDvgAPR():`, err);
    }
}

const getVipDvdAPR = async() => {
    try {
        return await calculateVipDvdApr();
    } catch (err) {
        console.error(`Error in getVipDvdAPR():`, err);
    }
}

const getVipTokenInfo = async(token, vipToken) => {
    try {
        if(!token || !vipToken) {
            throw(`Missing token / vip token info`);
            return;
        }
        const tokenContract = await contractHelper.getEthereumContract(token.abi, token.address);
        const vipTokenContract = await contractHelper.getEthereumContract(vipToken.abi, vipToken.address);

        const tokenPrice = await tokenHelper.getTokenPriceInUSD(token.tokenId);
        const tokenBalanceOfVipToken = await contractHelper.balanceOf(tokenContract, vipToken.address);
        const vipTotalSupply = await contractHelper.totalSupply(vipTokenContract);

        const vipTokenPrice = await getVipTokenPrice(
            vipTotalSupply,
            tokenBalanceOfVipToken,
            tokenPrice
        );
        const vipTokenTVL = await getVipTokenTVL(
            vipToken.decimals, 
            vipTotalSupply,
            vipTokenPrice
        );
        const apr = await getAPR(vipToken.name);
        
        const result = {
            ...apr,
            tokenPrice,
            vipTokenPrice: vipTokenPrice / tokenPrice,
            tvl: vipTokenTVL
        };
        return result;
    } catch (err) {
        console.error(`Error in getVipTokenInfo(): `, err);
    }
}

module.exports.getVipAPY = async () => {
    try {
        const contracts = getContracts();

        const oneDayAgoBlock = await contractHelper.getEthereumBlockNumberByTimeline(
            dateTimeHelper.toMillisecondsTimestamp(
                dateTimeHelper.subtractDay(1, new Date())
            )
        );
        const currentBlock = await contractHelper.getEthereumCurrentBlockNumber();
        const numberOfBlockInDay = currentBlock - oneDayAgoBlock;

        // VIP DVG
        const { lastMeasurement } = contracts.vipDVD;
        const days = (currentBlock - lastMeasurement) / numberOfBlockInDay;
        const vipDvgApr = await getVipDvgAPR(days);
        await addAPR(vipDvgApr, `vipDVG`);

        // VIP DVD
        const vipDvdApr = await getVipDvdAPR();
        await addAPR(vipDvdApr, `vipDVD`);
    } catch (err) {
        console.error(`Error in getVipAPY(): `, err);
    }
}

module.exports.getxDVGStake = async(req, res) => {
    try {
        const contracts = getContracts(); 

        const xDVGInfo = contracts["vipDVG"];
        const dvgInfo = contracts["DVG"];
         
        const result = await getVipTokenInfo(dvgInfo, xDVGInfo);
        const finalResult = {
            aprOneDay: result.aprOneDay,
            aprOneWeek: result.aprOneWeek,
            aprOneMonth: result.aprOneMonth,
            aprOneYear: result.aprOneYear,
            apr: result.apr,
            dvgPrice: result.tokenPrice,
            xDVGPrice: result.vipTokenPrice,
            tvl: result.tvl,
        };

        res.status(200).json({
            message: 'Successful Response',
            body: finalResult
        });

    } catch (err) {
        res.status(200).json({
            message: err.message,
            body: null
        });
    }
    return;
};

module.exports.getxDVDStake = async (req, res) => {
    try {
        const contracts = getContracts(); 

        const xDVDInfo = contracts["vipDVD"];
        const dvdInfo = contracts["DVD"];
         
        const result = await getVipTokenInfo(dvdInfo, xDVDInfo);
        const finalResult = {
            apr: result.apr,
            dvdPrice: result.tokenPrice,
            xDVDPrice: result.vipTokenPrice,
            tvl: result.tvl,
        };

        res.status(200).json({
            message: 'Successful Response',
            body: finalResult
        });

    } catch (err) {
        res.status(200).json({
            message: err.message,
            body: null
        });
    }
    return;
}

module.exports.getAPR = getAPR;