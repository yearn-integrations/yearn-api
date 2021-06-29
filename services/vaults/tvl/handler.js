const _ = require("lodash");
const BigNumber = require("bignumber.js");
const db = require("../../../models/tvl.model");

const Web3 = require("web3");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT;
const archiveNodeWeb3 = new Web3(archiveNodeUrl);

const {
  testContracts,
  mainContracts,
} = require("../../../config/serverless/domain");

const getDecimals = async (contract) => {
  try {
    let decimals = await contract.methods.decimals().call();
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

const getBalance = async (contract, address) => {
  try {
    let balanceOf = await contract.methods.balanceOf(address).call();
    return balanceOf;
  } catch (err) {
    // Catch error
    console.log(err);
  }
};

const getTotalSupply = async (contract) => {
  try {
    let totalSupply = await contract.methods.totalSupply().call();
    return totalSupply;
  } catch (err) {
    // Catch error
    console.log(err);
  }
};

const getContract = (contractAbi, contractAddress) => {
  const contract = new archiveNodeWeb3.eth.Contract(contractAbi, contractAddress);
  return contract;
};

const getTokenContract = async (vault) => {
  const { abi, address } = vault;
  const contract = new archiveNodeWeb3.eth.Contract(abi, address);
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
    if (Object.keys(data.data).length != 0) {
      return data.data[coingecko_token_id]["usd"];
    } else {
      return 1;
    }
  } catch (err) {
    // Catch error, Default Value = 1
    console.log(err);
  }
};

const getxDVGPrice = async () => {
  // xDVG price = DVG amount of xDVG SC * DVG price / xDVG amount
  const contracts =
    process.env.PRODUCTION != null && process.env.PRODUCTION != ""
      ? mainContracts
      : testContracts;

  const DVGcontract = await getTokenContract(contracts.DVG);
  const xDVGcontract = await getTokenContract(contracts.vipDVG);
  const amountDVG = await getBalance(
    DVGcontract,
    contracts.vipDVG.address
  );
  const amountxDVG = await getTotalSupply(xDVGcontract);
  const priceDVG = await getTokenPrice(contracts.DVG.tokenId);

  const pricexDVG = amountxDVG == 0 ? 1 : (amountDVG * priceDVG) / amountxDVG;
  return pricexDVG;
};

/**
 * Get TVL of specified vault.
 * TVL = poolAmount * tokenPrice
 */
const getTVL = async (vault) => {
  const { 
    tokenId, 
    strategyABI, 
    strategyAddress,
    abi,
    address
  } = vault;
  let tvl;
  if (vault.contractType === 'citadel' || vault.contractType === 'elon') {
    const contract = await getTokenContract(vault);
    const usdPool = await contract.methods.getAllPoolInUSD().call();
    tvl = usdPool / 10 ** 6; // All pool in USD (6 decimals follow USDT)
  } else if(vault.contractType === 'daoFaang'){
    const contract = await getTokenContract(vault);
    const poolAmount = await contract.methods.getTotalValueInPool().call();
    const decimals = await contract.methods.decimals().call();
    tvl = poolAmount / 10 ** decimals;
  } else {
    const strategyContract = getContract(strategyABI, strategyAddress);
    const poolAmount = await getPoolAmount(strategyContract);
    const tokenPrice = await getTokenPrice(tokenId);
    let decimals = 0;

    if(vault.contractType === 'harvest') {
      const vaultContract = getContract(abi, address);
      decimals =  await getDecimals(vaultContract);
    } else {
      decimals = await getDecimals(strategyContract);
    }
    tvl = (poolAmount / 10 ** decimals) * tokenPrice;
  }
  
  return tvl;
};

/**
 * Get TVL of xDVG.
 * TVL = totalSupply * xDVG Price
 */
const getTVLxDVG = async (vault) => {
  const { tokenId } = vault;
  let tvl;
  const contract = await getTokenContract(vault);
  const totalSupply = await getTotalSupply(contract);
  const decimals = await getDecimals(contract);
  const tokenPrice = await getxDVGPrice(tokenId); // Not implemented yet

  tvl = (totalSupply / 10 ** decimals) * tokenPrice;
  return tvl;
};

// Get and Save all TVL of all Vaults
const getAllTVL = async () => {
  let vaults =
    process.env.PRODUCTION != null && process.env.PRODUCTION != ""
      ? mainContracts
      : testContracts;

  let tvls = Array();
  for (vault in vaults.farmer) {
    try {
      let _vault = vaults.farmer[vault];
      let tvl = await getTVL(_vault);
      tvls.push(tvl);
      await saveTVL(vault, tvl);
    } catch(err) {
      console.error(err);
    }
  }

  try {
    let _vault = vaults.vipDVG;
    let tvl = await getTVLxDVG(_vault);
    tvls.push(tvl);
    await saveTVL("xDVG", tvl);
  } catch (err) {
    console.error(err);
  }

  return tvls;
};

// Get Total TVL
const getTotalTVL = async (tvls) => {
  let totalTVL;
  try {
    const zero = new BigNumber(0);
    totalTVL = tvls.reduce(
      (a, b) => {
        return new BigNumber(a).plus(new BigNumber(b));
      }, 
      zero, 
      tvls
    );
    totalTVL = totalTVL.toFixed();
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
const saveTVL = async (name, tvl) => {
  await db
    .add(name + "_tvl", {
      tvl: tvl,
    })
    .catch((err) => console.log("err", err));
};

// Save All TVLs to database
module.exports.saveAllTVLhandler = async () => {
  const tvls = await getAllTVL();
  const totalTvl = await getTotalTVL(tvls);
  await saveTotalTVL(totalTvl);
};

/* HANDLERS */

module.exports.tvlHandle = async (req, res) => {
  // check if vault param is input
  if (req.params.farmer === null || req.params.farmer === "") {
    res.status(200).json({
      message: "Farmer is empty.",
      body: null,
    });
  }

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
    case db.daoCDVFarmer:
      collection = db.daoCDVFarmer;
      break;
    case db.daoELOFarmer:
      collection = db.daoELOFarmer;
      break;
    case db.daoSTOFarmer:
      collection = db.daoSTOFarmer;
      break;
    default:
      res.status(200).json({
        message: "Invalid Farmer",
        body: null,
      });
      return;
  }

  const result = await db.getTVL(collection, { limit: 1 });
  if (result) {
    res.status(200).json({
      message: `TVL for ${req.params.farmer}`,
      body: result,
    });
  }
  return;
};

module.exports.totalHandle = async (req, res) => {
  // Get and save all TVL
  const totalTvl = await db.getTotalTVL({ limit: 1 });

  delete totalTvl[0]._id;

  res.status(200).json({
    message: "Total TVL",
    body: totalTvl,
  });
  return;
}
