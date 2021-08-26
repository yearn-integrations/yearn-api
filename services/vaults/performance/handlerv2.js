"use strict";

require("dotenv").config();
const performanceDb = require("../../../models/performance.model");

const delay = require("delay");
const ethers = require("ethers");
const BigNumber = require("bignumber.js");

const url = process.env.ARCHIVENODE_ENDPOINT_2;
let provider = new ethers.providers.JsonRpcProvider(url);

const EthDater = require("ethereum-block-by-date");
const dater = new EthDater(provider);

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const contractHelper = require("../../../utils/contract");
const dateTimeHelper = require("../../../utils/dateTime");
const constant = require("../../../utils/constant");

let contracts;

const ETF_STRATEGIES = constant.ETF_STRATEGIES;

const getTokenPrice = async(tokenId, date) => {
    try {
        const data = await CoinGeckoClient.coins.fetchHistory(tokenId, {
            date: date,
        });

        if (Object.keys(data.data).length != 0) {
            return data.data["market_data"]["current_price"]["usd"];
        } else {
            return 1;
        }
    } catch (err){
        console.error(`[performance/handlerv2] getTokenPrice(): `, err);
    }
}

const getTotalSupply = async(etf, vault, block) => {
    try {
        if(etf === "daoMPT") {
          return await vault.methods.totalSupply().call(undefined, block);
        }
        return await vault.totalSupply({ blockTag: block });
    } catch (err) {
        console.error(`[performance/handlerv2] getTotalSupply(): `, err);
    }
}

const getTotalPool = async(etf, vault, block) => {
    try {
        if(etf === "daoSTO") {
          return await vault.getTotalValueInPool({ blockTag: block });
        }
        if(etf === "daoMPT") {
          return await vault.methods.getValueInPool().call(undefined, 16318498);
        }
        // daoELO, daoCDV, daoCUB using this
        return await vault.getAllPoolInUSD({ blockTag: block });
    } catch (err) {
        console.error(`[performance/handlerv2] getTotalPool(): `, err);
    }
}

const calcLPTokenPriceUSD = (etf, totalSupply, totalPool, network) => {
    if (totalSupply == 0) {
        return 0;
    }

    let lpPrice;
    if(network === constant.ETHEREUM) {
       // These strategies having total pool value in 6 decimals, need to magnify the value
      const etfs = ["daoCDV", "daoELO", "daoCUB"];
      let newTotalPool = etfs.includes(etf)
          ? totalPool.mul(ethers.BigNumber.from("1000000000000"))
          : totalPool;
      lpPrice = newTotalPool.mul(ethers.BigNumber.from("1000000000000000000")).div(totalSupply);
      lpPrice = ethers.utils.formatEther(lpPrice);
    } else if(network === constant.POLYGON) {
      lpPrice = (new BigNumber(totalPool)).dividedBy(totalSupply);
    }
  
    return lpPrice;
}

const calculatePerformance = (initial, current) => {
    return initial == 0 ? 0 : current / initial - 1;
}

const getSearchRange = async (firstBlock, lastBlock, network) => {
    let firstTimestamp = await getUnixTime(firstBlock, network);
    firstTimestamp = firstTimestamp + (86400 - (firstTimestamp % 86400));
    firstTimestamp *= 1000;
    let lastTimestamp = await getUnixTime(lastBlock, network);
    lastTimestamp = lastTimestamp - (lastTimestamp % 86400);
    lastTimestamp *= 1000;

    let days; 
    if(network === constant.ETHEREUM) {
      days = await dater.getEvery(
        "days", // Period, required. Valid value: years, quarters, months, weeks, days, hours, minutes
        firstTimestamp, // Start date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        lastTimestamp, // End date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        1, // Duration, optional, integer. By default 1.
        true // Block after, optional. Search for the nearest block before or after the given date. By default true.
      );
    } else if (network === constant.POLYGON) {
      days = await contractHelper.getEveryPolygon(
        "days", // Period, required. Valid value: years, quarters, months, weeks, days, hours, minutes
        firstTimestamp, // Start date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        lastTimestamp, // End date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        1, // Duration, optional, integer. By default 1.
        true // Block after, optional. Search for the nearest block before or after the given date. By default true.
      );
    }
    return days;
}

const getUnixTime = async (block, network) => {
  const blockInfo = (network === constant.ETHEREUM) 
  ? (await provider.getBlock(block))
  : (await contractHelper.getPolygonBlockInfo(block))
  return blockInfo.timestamp;
}

const getNextUpdateBlock = async (dateTime, network) => {
  let nearestDateTime = dateTime - (dateTime % 86400000); // round down to midnight
  
  if(network === constant.ETHEREUM) {
    let url = process.env.ARCHIVENODE_ENDPOINT_2;
    // Using ethers.js
    let provider = new ethers.providers.JsonRpcProvider(url);
  
    let dater = new EthDater(
      provider // Web3 object, required.
    );

    let block = await dater.getDate(
      nearestDateTime, // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
      true // Block after, optional. Search for the nearest block before or after the given date. By default true.
    );
    return [block];
  } else if (network === constant.POLYGON) {
    const block = await contractHelper.getPolygonBlockByTimeline(nearestDateTime);
    return [block];
  }
}

// If want to add new strategy.
// 1. Check and add for "pnl" property in contract.farmers.strategyId
// 2. Check getTotalPool(), getTotalSupply(), calcLPTokenPriceUSD() in current document
const syncHistoricalPerformance = async (dateTime) => {
     
  contracts = contractHelper.getContractsFromDomain();
  
  for (const etf of ETF_STRATEGIES) {
    console.log(`[Performance PNL] Processing ${etf}`);
    const etfContractInfo = contracts["farmer"][etf];
    const { abi, address, network } = etfContractInfo;

    let vault;
    if(network === constant.ETHEREUM) {
      vault = new ethers.Contract(address, abi, provider);
    } else if (network === constant.POLYGON) {
      vault = await contractHelper.getPolygonContract(abi, address);
    }
     

    // Get latest record
    let latestEntry = await performanceDb.findLatest(etf);
    let dates;

    let basePrice = {};
    let inceptionPrice = {};
    let currentPrice = {};
    let performance = {};
    let latestRecord = {};

    let pnlSeries = [];
    pnlSeries = etfContractInfo.pnl;

    if (latestEntry.length !== 0) {
      latestRecord = latestEntry[0];
      const latestUpdateDate = latestRecord.date;

      if (dateTime) {
        dates = await getNextUpdateBlock(dateTime, network); // Round down to nearest 0:00 UTC day
        if (dates[0].date === latestUpdateDate) {
          continue;
        }
      } else {
        continue;
      }
    } else {
      const startBlock = etfContractInfo.inceptionBlock;
      const latestBlock = (network === constant.ETHEREUM) 
        ? await provider.getBlockNumber()
        : await contractHelper.getPolygonCurrentBlockNumber();
      dates = await getSearchRange(startBlock, latestBlock, network);
    }

    pnlSeries.forEach(p => {
      const attributeName = `${p.db}_inception_price`;
      basePrice[p.db] = latestRecord[attributeName] !== undefined ? latestRecord[attributeName] : 0;
      inceptionPrice[p.db] = latestRecord[attributeName] !== undefined? latestRecord[attributeName] : 0;
    });

    for (const date of dates) {
      try {
        const totalSupply = await getTotalSupply(etf, vault, date.block);
        await delay(1000);
        const totalPool = await getTotalPool(etf, vault, date.block);

        currentPrice["lp"] = calcLPTokenPriceUSD(etf, totalSupply, totalPool, network);
        if (basePrice["lp"] === 0) {
          basePrice["lp"] = currentPrice["lp"];
          inceptionPrice["lp"] = basePrice["lp"];
        }
        
        const data = {
          date: date.date,
          date: date.date,
          time_stamp: date.timestamp,
          block: date.block,
          total_supply: totalSupply.toString(),
          total_pool_usd: totalPool.toString(),
          lp_token_price_usd:  currentPrice["lp"].toString(),
          lp_inception_price: inceptionPrice["lp"].toString(),
        };

        for(let i = 0; i < pnlSeries.length; i++) {
          const seriesName = pnlSeries[i].db;

          if(seriesName !== 'lp') {
            const tokenId = pnlSeries[i].tokenId;
            const formatDate = dateTimeHelper.formatDate(new Date(date.date));

            await delay(5000); // Add 5 seconds delay to prevent coin gecko timeout
            currentPrice[seriesName] = await getTokenPrice(tokenId, formatDate);

            if(currentPrice[seriesName] > 0 && basePrice[seriesName] === 0) {
              basePrice[seriesName] = currentPrice[seriesName];
              inceptionPrice[seriesName] = basePrice[seriesName];
            }

            // Add to data
            data[`${seriesName}_price`] = currentPrice[seriesName].toString();
            data[`${seriesName}_inception_price`] = inceptionPrice[seriesName].toString();
          }

          // Performance Calculation
          performance[seriesName] = calculatePerformance(basePrice[seriesName], currentPrice[seriesName]);
          data[`${seriesName}_performance`] = performance[seriesName].toString();          
        }

        await performanceDb.add(etf, data);
        console.log(`${etf} Data for ${date.date} saved to db.`);
      } catch (err) {
        console.error(`Error in syncHistoricalPerformance(): `, err);
      }
    }
  }
}

const savePerformance = async (dateTime) => {
    await syncHistoricalPerformance(dateTime);
};

module.exports = {
    savePerformance
}


