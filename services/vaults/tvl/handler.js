const _ = require("lodash");
const db = require("../../../models/tvl.model");

const Web3 = require("web3");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT;
const infuraMainnetUrl =
  `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
const infuraKovanUrl =
  `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`;
const infuraRinkebyUrl =
  `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`;
const infuraRopstenUrl =
  `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`;
const archiveNodeWeb3 = new Web3(archiveNodeUrl);

const infuraMainnetWeb3 = new Web3(infuraMainnetUrl);
const infuraKovanWeb3 = new Web3(infuraKovanUrl);
const infuraRinkebyWeb3 = new Web3(infuraRinkebyUrl);
const infuraRopstenWeb3 = new Web3(infuraRopstenUrl);

const {
  testContracts,
  mainContracts,
} = require("../../../config/serverless/domain");

const getDecimals = async (contract) => {
  try {
    let decimals = await contract.methods.decimals().call();
    // console.log("Decimals", decimals);
    return decimals;
  } catch (err) {
    // Catch error
    console.log(err);
  }
};

/**
 * Get pool amount from specified vault.
 */
const getPoolAmount = async (contract) => {
  try {
    let poolAmount = await contract.methods.pool().call();
    return poolAmount;
  } catch (err) {
    // Catch error
    console.log(err);
  }
};

const getContract = (vault) => {
  const { strategyABI, strategyAddress, network } = vault;
  let contract;

  // console.log(network);
  if (network === "main") {
    contract = new infuraMainnetWeb3.eth.Contract(strategyABI, strategyAddress);
  } else if (network === "kovan") {
    contract = new infuraKovanWeb3.eth.Contract(strategyABI, strategyAddress);
  } else if (network === "rinkeby") {
    contract = new infuraRinkebyWeb3.eth.Contract(strategyABI, strategyAddress);
  } else if (network === "ropsten") {
    contract = new infuraRopstenWeb3.eth.Contract(strategyABI, strategyAddress);
  }

  return contract;
};

/**
 * Get Token price from coingecko
 */
const getTokenPrice = async (coingecko_token_id) => {
  // console.log(coingecko_token_id);
  let data;
  try {
    data = await CoinGeckoClient.simple.price({
      ids: coingecko_token_id,
      vs_currencies: ["usd"],
    });
  } catch (err) {
    // Catch error
    console.log(err);
  }

  return data.data[coingecko_token_id]["usd"];
};

/**
 * Get TVL of specified vault.
 * TVL = poolAmount * tokenPrice
 */
const getTVL = async (vault) => {
  const { tokenId } = vault;
  let tvl;
  const contract = getContract(vault);
  const poolAmount = await getPoolAmount(contract);
  const decimals = await getDecimals(contract);
  const tokenPrice = await getTokenPrice(tokenId);

  tvl = (poolAmount / 10 ** decimals) * tokenPrice;
  console.log("TVL for", vault.name, tvl)
  return tvl;
};

// Get and Save all TVL of all Vaults
const getAllTVL = await = async () => {
  let vaults =
    process.env.PRODUCTION != null && process.env.PRODUCTION != ""
      ? mainContracts
      : testContracts; 

  let tvls = Array();
  //   console.log(vaults);
  for (vault in vaults.farmer) {
    // console.log(vaults.farmer[vault]);
    let _vault = vaults.farmer[vault];
    let tvl = await getTVL(_vault);
    tvls.push(tvl);

    await saveTVL(_vault, tvl);

    // console.log("TVL", tvl);
  }

  return tvls;
};

// Get Total TVL
const getTotalTVL = async (tvls) => {
  let totalTVL
  try{
    totalTVL = _.sum(tvls);
    console.log("Total TVL", totalTVL)
  } catch (err) {
    // Catch error
    console.log(err);
  }
  return totalTVL;
};

// Write to Total TVL to DB
const saveTotalTVL = async (totalTVL) => {
  await db
    .add("total_tvl", {
      tvl: totalTVL,
    })
    .catch((err) => console.log("err", err));
};

// Save TVL of specified Vault
const saveTVL = async (vault, tvl) => {
  const { name } = vault;

  await db
    .add(name + "_tvl", {
      tvl: tvl,
    })
    .catch((err) => console.log("err", err));
};

// const vault = testContracts.farmer.cUSDT;

// getPoolAmount(vault);
// const tvls = await ();

const getVaults = async () => {
  const vaults = await db.findAll();
  return vaults;
};

// Save All TVLs to database
module.exports.saveAllTVLhandler = async () => {
  const tvls = await getAllTVL();
  const totalTvl = await getTotalTVL(tvls);
  await saveTotalTVL(totalTvl);
};

// Read from DB
module.exports.getTotalTVLhandle = async () => {
  // Get and save all TVL
  const totalTvl = await db.getTotalTVL({limit: 1})

  res.status(200).json({
    message: "Total TVL",
    body: totalTvl,
  });
};

/* HANDLERS */

module.exports.getTVLhandle = async (req, res) => {
  // check if vault param is input
  console.log("get TVL handle");

  if (req.params.farmer === null || req.params.farmer === "") {
    res.status(200).json({
      message: "Farmer is empty.",
      body: null,
    });
  }

  const result = await db.getTVL(req.params.farmer + "_tvl", {limit: 1});
  if (result) {
    res.status(200).json({
      message: `TVL for ${req.params.farmer}`,
      body: result,
    });
  }
};

module.exports.getHistoricalTVLhandle = async (req, res) => {
  if (req.params.days == null || req.params.days == "") {
    res.status(200).json({
      message: "Days is empty.",
      body: null,
    });
  } else if (req.params.farmer == null || req.params.farmer == "") {
    res.status(200).json({
      message: "Farmer is empty.",
      body: null,
    });
  } else {
    let collection = "";

    switch (req.params.farmer) {
      case db.usdtFarmer:
        collection = db.usdtFarmer;
        break;
      case db.usdcFarmer:
        collection = db.usdcFarmer;
        break;
      case db.daiFarmer:
        collection = db.daiFarmer;
        break;
      case db.tusdFarmer:
        collection = db.tusdFarmer;
        break;
      case db.cUsdtFarmer:
        collection = db.cUsdtFarmer;
        break;
      case db.cUsdcFarmer:
        collection = db.cUsdcFarmer;
        break;
      case db.cDaiFarmer:
        collection = db.cDaiFarmer;
        break;
      default:
        res.status(200).json({
          message: "Invalid Farmer",
          body: null,
        });
        return;
    }
  }
};
