const contractHelper = require("../../../utils/contract");
const constant = require("../../../utils/constant");
const tokenDb = require("../../../models/token.model");
const moment = require("moment");
const delay = require("delay");
const { getTokenPrice } = require("../performance/handler");

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

let contracts;
let delayTime = 5000;
let tokens = {};

const getStrategyUnderlyingAssets = (assetAddress) => {
    const farmers = contracts.farmer;

    switch(assetAddress) {
        case farmers["daoCDV"].address:
            return constant.DAOCDV_ASSET_DISTRIBUTION;
        default: 
            break;
    }
}

const getStartOfDay = (momentDate) => {
    return momentDate.startOf("day").format("DD-MM-YYYY");
}

const calculateChangePercentage = (oldPrice, newPrice) => {
    try {
        return (newPrice - oldPrice) / oldPrice * 100;
    } catch(err) { 
        console.error(`[distribution/handler] Error in calculateChangePercentage():`, err);
    }
}

module.exports.saveAssetsPrice = async() => {
    try {
        const assets = await tokenDb.findAll();
       
        if(assets.length <= 0) {
            throw "Assets not found in database!";
        }
        if(tokens === undefined) {
            throw "Token current price not found!";
        }

        const todayDate = getStartOfDay(moment(new Date()));
        const yesterdayDate = getStartOfDay(moment(new Date()).subtract(1, "day"));
    
        for(let i = 0; i < assets.length; i++) {
            const asset = assets[i];
    
            const todayPrice = await getTokenPrice(asset.tokenId, todayDate);
            delay(delayTime);
            const yesterdayPrice = await getTokenPrice(asset.tokenId, yesterdayDate);
           
            asset.currentPrice = todayPrice;
            asset.oneDayPrice = yesterdayPrice;
            asset.changePercentage = calculateChangePercentage(yesterdayPrice, todayPrice);

            await tokenDb.add(asset);
        }
    } catch (err) {
        console.error(`[distribution/handler] Error occur in saveAssetsPrice(): `, err);
    }
}

module.exports.getStrategyAssetDistribution = async(assetAddress) => {
    try {
        if(assetAddress === undefined || assetAddress === "") {
            throw `Missing Asset Address`;
        }

        contracts = contractHelper.getContractsFromDomain();
        const strategyUnderlyingAssets = getStrategyUnderlyingAssets(assetAddress);

        const underlyingAssetsIds = Object.values(strategyUnderlyingAssets).map(asset => asset.tokenId);
        const underlyingAssets = await tokenDb.findTokenByIds(underlyingAssetsIds);

        underlyingAssets.map(asset => {
            const assetSymbol = asset.symbol;
            const assetObject = strategyUnderlyingAssets[assetSymbol];

            assetObject.currentPrice = asset.currentPrice || 0.00;
            assetObject.oneDayPrice = asset.oneDayPrice || 0.00;
            assetObject.changePercentage = asset.changePercentage || 0.00;
            assetObject.timestamp = asset.timestamp;
           
            strategyUnderlyingAssets[assetSymbol] = assetObject;
        });

        return strategyUnderlyingAssets;
    } catch (error) {
        console.error(`Error occur in getStrategyAssetDistribution():`, error);
    }
}