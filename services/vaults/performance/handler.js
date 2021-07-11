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

const url = process.env.ARCHIVENODE_ENDPOINT;

// Using ethers.js
const provider = new ethers.providers.JsonRpcProvider(url);

const dater = new EthDater(
  provider // Web3 object, required.
);

let days;
let contracts;
let vault;
let BTC_AGGREGATOR_ADDR;
let ETH_AGGREGATOR_ADDR;
let INCEPTION_BLOCK;

if (process.env.PRODUCTION != "") {
  contracts = mainContracts;
  BTC_AGGREGATOR_ADDR = "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c";
  ETH_AGGREGATOR_ADDR = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
  INCEPTION_BLOCK = 12586420;
} else {
  contracts = testContracts;
  BTC_AGGREGATOR_ADDR = "0x6135b13325bfc4b00278b4abc5e20bbce2d6580e";
  ETH_AGGREGATOR_ADDR = "0x9326bfa02add2366b30bacb125260af641031331";
  INCEPTION_BLOCK = 25336169;
}

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

function getInceptionBlock(farmer) {
  if (process.env.PRODUCTION != "") {
    const farmers = {
      daoCDV: 12586420,
      daoSTO: 12766399,
      daoELO: 12722655,
      daoCUB: 12799447,
    };
    return farmers[farmers];
  } else {
    const farmers = {
      daoCDV: 25336169,
      daoSTO: 25867824,
      daoELO: 25413059,
      daoCUB: 25536976,
    };
    return farmers[farmers];
  }
}

async function getTotalSupply(block) {
  const totalSupply = await vault.totalSupply({ blockTag: block });
  return totalSupply;
}

async function getTotalPool(block) {
  const totalPool = await vault.getAllPoolInUSD({ blockTag: block });
  return totalPool;
}

async function getBTCPrice(block) {
  const price = (await BTCpriceFeed.latestRoundData({ blockTag: block }))
    .answer;
  return price;
}

async function getETHPrice(block) {
  const price = (await ETHpriceFeed.latestRoundData({ blockTag: block }))
    .answer;
  return price;
}

function calcLPTokenPriceUSD(totalPoolUSD, totalSupply) {
  if (totalSupply != 0) {
    return totalPoolUSD
      .mul(ethers.BigNumber.from("1000000000000"))
      .div(totalSupply);
  } else {
    return 0;
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

async function getUnixTime(block) {
  return (await provider.getBlock(block)).timestamp;
}

async function syncHistoricalPerformance() {
  // let results = [];

  const ETF_STRATEGIES = ["daoCDV", "daoSTO", "daoELO"];

  // Get latest entry in database

  ETF_STRATEGIES.forEach(async (etf) => {
    console.log("🚀 | syncHistoricalPerformance | etf", etf);
    let vaultAddress = contracts["farmer"][etf]["address"];
    let vaultABI = contracts["farmer"][etf]["abi"];
    vault = new ethers.Contract(vaultAddress, vaultABI, provider);
    const latestEntry = await historicalDb.findLatest(etf);
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

    if (latestEntry.length != 0) {
      startBlock = latestEntry[0].block;
      basePrice = latestEntry[0]["lp_inception_price"];
      btcBasePrice = latestEntry[0]["btc_inception_price"];
      ethBasePrice = latestEntry[0]["eth_inception_price"];
    } else {
      startBlock = getInceptionBlock(etf);
    }

    const latestBlock = await provider.getBlockNumber();

    const dates = await getSearchRange(startBlock, latestBlock);

    for (const date of dates) {
      try {
        totalSupply = await getTotalSupply(date.block);
        totalPool = await getTotalPool(date.block);
        btcPrice = await getBTCPrice(date.block);
        ethPrice = await getETHPrice(date.block);
        lpTokenPriceUSD = calcLPTokenPriceUSD(totalPool, totalSupply);
        if (lpTokenPriceUSD > 0 && basePrice == 0) {
          basePrice = lpTokenPriceUSD;
          lpPriceInception = basePrice;
        }
        if (btcPrice > 0 && btcBasePrice == 0) {
          btcBasePrice = btcPrice;
          btcPriceInception = btcBasePrice;
        }
        if (ethPrice > 0 && ethBasePrice == 0) {
          ethBasePrice = ethPrice;
          ethPriceInception = ethBasePrice;
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

        // console.log(data);
        historicalDb.add(etf, data);
      } catch (e) {
        console.log(e);
      }
    }
  });
}

module.exports.savePerformance = async (event) => {
  await syncHistoricalPerformance();
};

module.exports.handler = async (event) => {
  const performanceData = await syncHistoricalPerformance();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(performanceData),
  };
};

module.exports.performanceHandle = async (req, res) => {
  if (req.params.days == null || req.params.days == "") {
    res.status(200).json({
      message: "Days is empty.",
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
    case historicalDb.daoELOFarmer:
      collection = historicalDb.daoELOFarmer;
      break;
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
  if (result) {
    res.status(200).json({
      message: `Performance Data for ${req.params.farmer}`,
      body: result,
    });
  }
  return;
};
