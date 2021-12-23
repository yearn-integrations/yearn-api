"use strict";

require("dotenv").config();
const _ = require("lodash");
const historicalDb = require("../../../models/performance.model");
const moment = require("moment");
const ethers = require("ethers");
const EthDater = require("ethereum-block-by-date");
const {
  aggregatedContractAddress,
  testContracts,
  mainContracts,
} = require("../../../config/serverless/domain");

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

let url = process.env.ARCHIVENODE_ENDPOINT_2;

// Using ethers.js0.26
let provider = new ethers.providers.JsonRpcProvider(url);

let dater = new EthDater(
  provider // Web3 object, required.
);

let days;
let contracts;
let vault;
let BTC_AGGREGATOR_ADDR;
let ETH_AGGREGATOR_ADDR;

if (process.env.PRODUCTION != "") {
  contracts = mainContracts;
  BTC_AGGREGATOR_ADDR = "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c";
  ETH_AGGREGATOR_ADDR = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
} else {
  contracts = testContracts;
  BTC_AGGREGATOR_ADDR = "0x6135b13325bfc4b00278b4abc5e20bbce2d6580e";
  ETH_AGGREGATOR_ADDR = "0x9326bfa02add2366b30bacb125260af641031331";
}

// const ETF_STRATEGIES = ["daoCDV", "daoSTO", "daoELO"];
const ETF_STRATEGIES = ["daoCDV", "daoSTO"];

const aggregatorV3InterfaceABI = require("./AggregatorABI.json");

const BTCpriceFeed = new ethers.Contract(
  BTC_AGGREGATOR_ADDR,
  aggregatorV3InterfaceABI,
  provider
); // 8 DEcimals
const ETHpriceFeed = new ethers.Contract(
  ETH_AGGREGATOR_ADDR,
  aggregatorV3InterfaceABI,
  provider
); // 8 DEcimals

async function getTokenPrice(coingecko_token_id, date) {
  let data;
  try {
    data = await CoinGeckoClient.coins.fetchHistory(coingecko_token_id, {
      date: date,
    });
    if (Object.keys(data.data).length != 0) {
      return data.data["market_data"]["current_price"]["usd"];
    } else {
      return 1;
    }
  } catch (err) {
    // Catch error, Default Value = 1
  }
}

function getInceptionBlock(farmer) {
  if (process.env.PRODUCTION != "") {
    const farmers = {
      daoCDV: 12586420,
      daoSTO: 12932754,
      daoELO: 12722655,
      daoCUB: 12799447,
    };
    return farmers[farmer];
  } else {
    const farmers = {
      daoCDV: 25336169,
      daoSTO: 25867824,
      daoELO: 25413059,
      daoCUB: 25536976,
    };
    return farmers[farmer];
  }
}

async function getTotalSupply(etf, vault, block) {
  if (etf === "daoCDV" || etf === "daoSTO") {
    const totalSupply = await vault.totalSupply({ blockTag: block });
    return totalSupply;
  }
}

async function getTotalPool(etf, vault, block) {
  if (etf === "daoCDV") {
    const totalPool = await vault.getAllPoolInUSD({ blockTag: block });
    return totalPool;
  } else if (etf === "daoSTO") {
    const totalPool = await vault.getTotalValueInPool({ blockTag: block });
    return totalPool;
  }
}

// async function getBTCPriceChainlink(block) {
//   const price = (await BTCpriceFeed.latestRoundData({ blockTag: block }))
//     .answer;
//   return price;
// }

async function getBTCPriceCoinGecko(date) {
  date = new Date(date);

  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = date.getFullYear();

  let _date = dd + "-" + mm + "-" + yyyy;
  const price = await getTokenPrice("bitcoin", _date);

  return price;
}

// async function getETHPrice(block) {
//   const price = (await ETHpriceFeed.latestRoundData({ blockTag: block }))
//     .answer;
//   return price;
// }

async function getETHPriceCoinGecko(date) {
  date = new Date(date);
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = date.getFullYear();
  let _date = dd + "-" + mm + "-" + yyyy;

  const price = await getTokenPrice("ethereum", _date);

  return price;
}

function calcLPTokenPriceUSD(etf, totalSupply, totalPool) {
  if (etf === "daoCDV") {
    // totalSupply = await getTotalSupply(vault, date.block);
    // totalPool = await getTotalPool(vault, date.block);
    if (totalSupply != 0) {
      let lpPrice = totalPool
        .mul(ethers.BigNumber.from("1000000000000"))
        .mul(ethers.BigNumber.from("1000000000000000000"))
        .div(totalSupply);
      lpPrice = ethers.utils.formatEther(lpPrice);
      return lpPrice;
    } else {
      return 0;
    }
  } else if (etf === "daoSTO") {
    // totalSupply = await getTotalSupply(vault, date.block);
    // totalPool = await getTotalPool(vault, date.block);

    if (totalSupply != 0) {
      let lpPrice = totalPool
        .mul(ethers.BigNumber.from("1000000000000000000"))
        .div(totalSupply);
      lpPrice = ethers.utils.formatEther(lpPrice);
      return lpPrice;
    } else {
      return 0;
    }
  }
}

function calculatePerformance(initial, current) {
  if (initial == 0) {
    return 0;
  } else {
    let performance = current / initial - 1;
    return performance;
  }
}

async function getSearchRange(firstBlock, lastBlock) {
  let firstTimestamp = await getUnixTime(firstBlock);

  firstTimestamp = firstTimestamp + (86400 - (firstTimestamp % 86400));
  firstTimestamp *= 1000;
  let lastTimestamp = await getUnixTime(lastBlock);
  lastTimestamp = lastTimestamp - (lastTimestamp % 86400);
  lastTimestamp *= 1000;

  let days = await dater.getEvery(
    "days", // Period, required. Valid value: years, quarters, months, weeks, days, hours, minutes
    firstTimestamp, // Start date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
    lastTimestamp, // End date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
    1, // Duration, optional, integer. By default 1.
    true // Block after, optional. Search for the nearest block before or after the given date. By default true.
  );

  return days;
}

async function getNextUpdateBlock(dateTime) {
  let url = process.env.ARCHIVENODE_ENDPOINT_2;
  // Using ethers.js
  let provider = new ethers.providers.JsonRpcProvider(url);

  let dater = new EthDater(
    provider // Web3 object, required.
  );

  let nearestDateTime = dateTime - (dateTime % 86400000); // round down to midnight

  let block = await dater.getDate(
    nearestDateTime, // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
    true // Block after, optional. Search for the nearest block before or after the given date. By default true.
  );
  return [block];
}

async function getUnixTime(block) {
  return (await provider.getBlock(block)).timestamp;
}

async function syncHistoricalPerformance(dateTime) {
  // let results = [];

  // Get latest entry in database

  for (const etf of ETF_STRATEGIES) {
    let vaultAddress = contracts["farmer"][etf]["address"];
    let vaultABI = contracts["farmer"][etf]["abi"];
    vault = new ethers.Contract(vaultAddress, vaultABI, provider);
    let latestEntry = await historicalDb.findLatest(etf);
    let startBlock;
    let totalSupply;
    let totalPool;
    let btcPrice;
    let ethPrice;
    let lpTokenPriceUSD;
    let lpPerformance;
    let ethPerformance;
    let btcPerformance;
    let data;
    let basePrice = 0;
    let ethBasePrice = 0;
    let btcBasePrice = 0;
    let lpPriceInception = 0;
    let ethPriceInception = 0;
    let btcPriceInception = 0;
    let latestBlock;
    let dates;
    let latestUpdateDate;

    if (latestEntry.length != 0) {
      basePrice = latestEntry[0]["lp_inception_price"];
      btcBasePrice = latestEntry[0]["btc_inception_price"];
      ethBasePrice = latestEntry[0]["eth_inception_price"];
      lpPriceInception = basePrice;
      btcPriceInception = btcBasePrice;
      ethPriceInception = ethBasePrice;

      latestUpdateDate = latestEntry[0]["date"];
      if (dateTime) {
        dates = await getNextUpdateBlock(dateTime); // Round down to nearest 0:00 UTC day
        if (dates[0].date === latestUpdateDate) {
          continue;
        }
      } else {
        continue;
      }
    } else {
      startBlock = getInceptionBlock(etf);
      latestBlock = await provider.getBlockNumber();
      dates = await getSearchRange(startBlock, latestBlock);
    }

    for (const date of dates) {
      console.log("🚀 | syncHistoricalPerformance | basePrice", basePrice);
      console.log(
        "🚀 | syncHistoricalPerformance | btcBasePrice",
        btcBasePrice
      );
      console.log(
        "🚀 | syncHistoricalPerformance | ethBasePrice",
        ethBasePrice
      );
      try {
        totalSupply = await getTotalSupply(etf, vault, date.block);
        totalPool = await getTotalPool(etf, vault, date.block);
        btcPrice = await getBTCPriceCoinGecko(date.date);
        ethPrice = await getETHPriceCoinGecko(date.date);
        lpTokenPriceUSD = calcLPTokenPriceUSD(etf, totalSupply, totalPool);

        if (lpTokenPriceUSD > 0) {
          if (basePrice === 0) {
            basePrice = lpTokenPriceUSD;
            lpPriceInception = basePrice;
          }
          if (btcPrice > 0 && btcBasePrice === 0) {
            btcBasePrice = btcPrice;
            btcPriceInception = btcBasePrice;
          }
          if (ethPrice > 0 && ethBasePrice === 0) {
            ethBasePrice = ethPrice;
            ethPriceInception = ethBasePrice;
          }
        }
        lpPerformance = calculatePerformance(basePrice, lpTokenPriceUSD);
        btcPerformance = calculatePerformance(btcBasePrice, btcPrice);
        ethPerformance = calculatePerformance(ethBasePrice, ethPrice);

        data = {
          date: date.date,
          time_stamp: date.timestamp,
          block: date.block,
          total_supply: totalSupply.toString(),
          total_pool_usd: totalPool.toString(),
          btc_price: btcPrice.toString(),
          eth_price: ethPrice.toString(),
          lp_token_price_usd: lpTokenPriceUSD.toString(),
          lp_performance: lpPerformance,
          btc_performance: btcPerformance,
          eth_performance: ethPerformance,
          lp_inception_price: lpPriceInception.toString(),
          btc_inception_price: btcPriceInception.toString(),
          eth_inception_price: ethPriceInception.toString(),
        };

        historicalDb.add(etf, data);
      } catch (e) {}
    }
  }
}

module.exports.savePerformance = async (dateTime) => {
  await syncHistoricalPerformance(dateTime);
};

// module.exports.handler = async (event) => {
//   const performanceData = await syncHistoricalPerformance();

//   return {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Credentials": true,
//     },
//     body: JSON.stringify(performanceData),
//   };
// };

// Return just PNL of timeframe
module.exports.pnlHandle = async (req, res) => {
  try {
    if (
      req.params.days !== "30d" &&
      req.params.days !== "7d" &&
      req.params.days !== "1d" &&
      req.params.days !== undefined
    ) {
      res.status(200).json({
        message: "Days should be 30d, 7d, 1d or empty (all).",
        body: null,
      });
      return;
    }
    // check if vault param is input
    if (req.params.farmer === null || req.params.farmer === "") {
      res.status(200).json({
        message: "Vault input is empty",
        body: null,
      });
      return;
    }

    let startTime = -1;
    let collection = "";
    let result;
    let pnl;
    let lastDataIndex;

    switch (req.params.farmer) {
      case historicalDb.daoCDVFarmer:
        collection = historicalDb.daoCDVFarmer;
        break;
      // case historicalDb.daoELOFarmer:
      //   collection = historicalDb.daoELOFarmer;
      //   break;
      case historicalDb.daoSTOFarmer:
        collection = historicalDb.daoSTOFarmer;
        break;
      default:
        res.status(200).json({
          message: "Invalid Farmer",
          body: null,
        });
        return;
    }

    switch (req.params.days) {
      case "30d":
        startTime = moment().subtract(30, "days").unix();
        break;
      case "7d":
        startTime = moment().subtract(7, "days").unix();
        break;
      case "1d":
        startTime = moment().subtract(1, "days").unix();
        break;
    }

    if (startTime == -1) {
      result = await historicalDb.findAll(collection);
      if (result && result.length > 0) {
        lastDataIndex = result.length - 1;
        return res.status(200).json({
          message: `Performance Data for ${req.params.farmer}`,
          body: result[lastDataIndex]["lp_performance"],
        });
      } else {
        return res.status(200).json({
          message: `Performance Data for ${req.params.farmer}`,
          body: 0,
        });
      }
    } else {
      result = await historicalDb.findPerformanceWithTimePeriods(
        collection,
        startTime
      );
    }

    if (result && result.length > 0) {
      const basePrice = result[0]["lp_token_price_usd"];
      lastDataIndex = result.length - 1;
      pnl = calculatePerformance(
        basePrice,
        result[lastDataIndex]["lp_token_price_usd"]
      );
      return res.status(200).json({
        message: `Performance Data for ${req.params.farmer}`,
        body: pnl,
      });
    } else {
      return res.status(200).json({
        message: `Performance Data for ${req.params.farmer}`,
        body: 0,
      });
    }
  } catch (error) {
    return res.status(200).json({
      message: `Performance Data for ${req.params.farmer}`,
      body: 0,
    });
  }
};

module.exports.performanceHandle = async (req, res) => {
  try {
    if (
      req.params.days !== "30d" &&
      req.params.days !== "7d" &&
      req.params.days !== "1d" &&
      req.params.days !== undefined
    ) {
      res.status(200).json({
        message: "Days should be 30d, 7d, 1d or empty (all).",
        body: null,
      });
      return;
    }
    // check if vault param is input
    if (req.params.farmer === null || req.params.farmer === "") {
      res.status(200).json({
        message: "Vault input is empty",
        body: null,
      });
      return;
    }

    let startTime = -1;
    let collection = "";
    let result;

    switch (req.params.farmer) {
      case historicalDb.daoCDVFarmer:
        collection = historicalDb.daoCDVFarmer;
        break;
      // case historicalDb.daoELOFarmer:
      //   collection = historicalDb.daoELOFarmer;
      //   break;
      case historicalDb.daoSTOFarmer:
        collection = historicalDb.daoSTOFarmer;
        break;
      default:
        res.status(200).json({
          message: "Invalid Farmer",
          body: null,
        });
        return;
    }

    switch (req.params.days) {
      case "30d":
        startTime = moment().subtract(30, "days").unix();
        break;
      case "7d":
        startTime = moment().subtract(7, "days").unix();
        break;
      case "1d":
        startTime = moment().subtract(1, "days").unix();
        break;
    }

    if (startTime == -1) {
      result = await historicalDb.findAll(collection);
    } else {
      result = await historicalDb.findPerformanceWithTimePeriods(
        collection,
        startTime
      );

      if (result != null && result.length > 0) {
        const basePrice = result[0]["lp_token_price_usd"];
        const btcBasePrice = result[0]["btc_price"];
        const ethBasePrice = result[0]["eth_price"];
        result.forEach((data) => {
          data["lp_performance"] = calculatePerformance(
            basePrice,
            data["lp_token_price_usd"]
          );
          data["btc_performance"] = calculatePerformance(
            btcBasePrice,
            data["btc_price"]
          );
          data["eth_performance"] = calculatePerformance(
            ethBasePrice,
            data["eth_price"]
          );
        });
      }
    }

    if (result) {
      res.status(200).json({
        message: `Performance Data for ${req.params.farmer}`,
        body: result,
      });
    }
  } catch (err) {
    res.status(200).json({
      message: `Performance Data for ${req.params.farmer}`,
      body: null,
      error: err,
    });
  }
};
