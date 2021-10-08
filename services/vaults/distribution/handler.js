const delay = require("delay");

const tokenHelper = require("../../../utils/token");
const dateTimeHelper = require("../../../utils/dateTime");

const constant = require("../../../utils/constant");
const tokenDb = require("../../../models/token.model");

let delayTime = 10000;

const getStrategyUnderlyingAssets = (strategyId) => {
    return constant[`${strategyId.toUpperCase()}_ASSET_DISTRIBUTION`];
}

const calculateChangePercentage = (oldPrice, newPrice) => {
    try {
        return (newPrice - oldPrice) / oldPrice * 100;
    } catch(err) { 
        console.error(`[distribution/handler] Error in calculateChangePercentage():`, err);
    }
}

const getStrategyAssetDistribution = async(strategyId) => {
    try {
        if(strategyId === undefined || strategyId === "") {
            throw `Missing Strategy ID`;
        }

        const result = [];
        const strategyUnderlyingAssets = getStrategyUnderlyingAssets(strategyId);
        if(strategyUnderlyingAssets === undefined) {
            return result;
        }

        const underlyingAssetsIds = Object.values(strategyUnderlyingAssets).map(asset => asset.tokenId);
        const underlyingAssets = await tokenDb.findTokenByIds(underlyingAssetsIds);
          
        let index = 0; // To random assign chart color;
        underlyingAssets.map(asset => {
            const assetArray = [];
            const assetSymbol = asset.symbol;
            assetArray.push(assetSymbol);
    
            const assetObject = strategyUnderlyingAssets[assetSymbol];
            assetObject.currentPrice = asset.currentPrice || 0.00;
            assetObject.oneDayPrice = asset.oneDayPrice || 0.00;
            assetObject.changePercentage = asset.changePercentage || 0.00;
            assetObject.timestamp = asset.timestamp;
            assetObject.infoLink = `https://www.coingecko.com/en/coins/${assetObject.tokenId}`;
            
            // Representative color in chart
            let chartColor = constant.TOKEN_CHART_COLOR[assetSymbol];
            if(chartColor === undefined) {
                chartColor = constant.BACKUP_CHART_COLOR[index];
                index ++;
            }
            assetObject.color = chartColor;
           
            assetArray.push(assetObject);
            result.push(assetArray);
        });

        return result;
    } catch (error) {
        console.error(`Error occur in getStrategyAssetDistribution():`, error);
    }
}

const findAllStrategiesAssetDistribution = async() => {
    const etfStrategies = constant.ETF_STRATEGIES;
    const result = {};

    for(let i = 0 ; i < etfStrategies.length; i++) {
        const strategyId = etfStrategies[i];
        const strategyAssetDistribution = await getStrategyAssetDistribution(strategyId);
        result[strategyId] = strategyAssetDistribution;
    }

    return result;
}

const saveAssetsPrice = async() => {
    try {
        const assets = await tokenDb.findAll();

        const yesterdayDate = await dateTimeHelper.formatDate(
            dateTimeHelper.getStartOfDay(
                dateTimeHelper.subtractDay(1, new Date())
            )
        );
        const todayDate = new Date().getTime() // today date in timestamp

        const tokens = constant.TOKEN_COINGECKO_ID;
        const tokenIds = Object.values(tokens);
        const todayCoingeckoPrices = await tokenHelper.findTokenPrice(tokenIds, "usd");

        for(const key in tokens) {
            let asset;
            const coingeckoId = tokens[key];

            const todayPrice = todayCoingeckoPrices[coingeckoId].usd;
            let yesterdayPrice;
           
            // Find asset object
            if(assets.length > 0) {
                asset = assets.find(a => a.tokenId === coingeckoId);
            } 

            // If asset not found and is new entry
            if(asset === undefined) {
                asset ={};
                asset.tokenId = coingeckoId;
                asset.symbol = key;
            }

            // check if cronjob is run on same day, apply only on token cronjob which is not run for first time
            if(asset.timestamp !== undefined) {
                isCronjobRunOnSameDay = dateTimeHelper.isSame(todayDate, asset.timestamp, "day");
                yesterdayPrice = (isCronjobRunOnSameDay)
                    ? asset.oneDayPrice // pick today's yesterday price
                    : asset.currentPrice; // yesterday's current price has become today's yesterday price
            }

            if(yesterdayPrice === undefined || yesterdayPrice === null) {
                await delay(delayTime);
                yesterdayPrice =  await tokenHelper.getTokenHistoricalPriceInUSD(asset.tokenId, yesterdayDate);
            }
          
            asset.currentPrice = todayPrice;
            asset.oneDayPrice = yesterdayPrice;
            asset.changePercentage = calculateChangePercentage(yesterdayPrice, todayPrice);

            await tokenDb.add(asset);
        }
    } catch (err) {
        console.error(`[distribution/handler] Error occur in saveAssetsPrice(): `, err);
    }
}

module.exports.handler = async(req, res) => {
    try { 
        const farmer = req.params.farmerId === "" || req.params.farmerId === null
            ? "all"
            : req.params.farmerId;

        if(farmer === "all") {
            const strategiesAssetDistribution = await findAllStrategiesAssetDistribution();

            res.status(200).json({
                message: `Assets distribution for ${req.params.farmerId}`,
                body: strategiesAssetDistribution,
            });
            return;
        } else {
            const strategyId = req.params.farmerId;
            const strategyAssetDistribution = await getStrategyAssetDistribution(strategyId);
        
            res.status(200).json({
                message: `Asset distribution for ${req.params.farmerId}`,
                body: strategyAssetDistribution,
            });
        }
    } catch (err) {
        console.error(`[distribution/handler] Error in handler(): `, err);
    }
}

module.exports.findAllStrategiesAssetDistribution = findAllStrategiesAssetDistribution;
module.exports.saveAssetsPrice = saveAssetsPrice;
module.exports.getStrategyAssetDistribution = getStrategyAssetDistribution;

