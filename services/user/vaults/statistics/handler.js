"use strict";

require("dotenv").config();
const fetch = require("node-fetch");
const { pluck, uniq } = require("ramda/dist/ramda");
const BigNumber = require("bignumber.js");
const subgraphUrl = process.env.SUBGRAPH_ENDPOINT;
const Web3 = require("web3");
const web3 = new Web3(process.env.WEB3_ENDPOINT);
const archiveNodeUrl = process.env.ARCHIVENODE_ENDPOINT;
const archiveNodeWeb3 = new Web3(archiveNodeUrl);
const delay = require("delay");
const earnABIContract = require('../../../../config/abi').earnABIContract;
const vaultABIContract = require('../../../../config/abi').vaultABIContract;
const yfUSDTABIContract = require('../../../../config/abi').yfUSDTABIContract;
const {
  devContract,
  prodContract,
  testContracts,
  mainContracts
} = require('../../../../config/serverless/domain');

const {
  getTransactions,
  getVaultAddressesForUser,
} = require("../transactions/handler");
const _ = require("lodash");
const contractHelper = require("../../../../utils/contract");
const constant = require("../../../../utils/constant");

const getVaultContract = (vaultAddress) => {
  const abi = getMinimalVaultABI();
  const contract = new web3.eth.Contract(abi, vaultAddress);
  return contract;
};

const getContract = (abi, contractAddress) => {
  const contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
};

const getDepositedShares = async (vaultContract, userAddress) => {
  const balance = await vaultContract.methods.balanceOf(userAddress).call();
  return balance;
};

const getPricePerFullShare = async (contract) => {
  const pricePerFullShare = await contract.methods
    .getPricePerFullShare()
    .call();
  return pricePerFullShare;
};

const getBalanceOf = async (contract, address) => {
  const balance = await contract.methods
    .balanceOf(address)
    .call();
  return balance;
};

const getTotalSupply = async (contract) => {
  const totalSupply = await contract.methods
    .totalSupply()
    .call();
  return totalSupply;
};

// Get USDT <-> USD Price
const getPriceFromChainLink = async (contract) => {
  let price = 0;
  try {
    price = await contract.methods.latestAnswer().call();
  } catch (ex) { }
  await delay(500);
  return price;
};

const getVaultStatistics = async (contractAddress, transactions, userAddress) => {
  const findVault = (vault) => {
    if (vault.vaultAddress == null) return false;
    return vault.vaultAddress.toLowerCase() === contractAddress;
  }

  const transactionsForVault = _.find(transactions, findVault);
 
  // Get User Deposit Amount
  let strategyContract;
  let vaultContract;

  const contracts = (process.env.PRODUCTION != null && process.env.PRODUCTION != '') 
    ? mainContracts
    : testContracts;

  const vault = Object.values(contracts.farmer).find(contract => contract.address.toLowerCase() === contractAddress.toLowerCase());
  
  if(!vault) {
    // Return empty object, if subgraph's vault address cannot match with domain.js farmer
    return {
      contractAddress,
      message: "No vault found.",
    };
  }

  const type = vault.contractType;

  if(vault.network === constant.ETHEREUM) {
    vaultContract = await contractHelper.getEthereumContract(vault.abi, vault.address);
    strategyContract = await contractHelper.getEthereumContract(vault.strategyABI, vault.strategyAddress);
  } else if (vault.network === constant.POLYGON) {
    vaultContract = await contractHelper.getPolygonContract(vault.abi, vault.address);
    strategyContract = await contractHelper.getPolygonContract(vault.strategyABI, vault.strategyAddress);
  }

  const depositedShares = await getDepositedShares(vaultContract, userAddress);

  let depositedAmount = new BigNumber(0);
  if (type === 'yearn') {
    const earnDepositAmount = await strategyContract.methods.getEarnDepositBalance(userAddress).call();
    const vaultDepositAmount = await strategyContract.methods.getVaultDepositBalance(userAddress).call();
    depositedAmount = new BigNumber(earnDepositAmount)
      .plus(vaultDepositAmount);
  } else if (type === 'compound') {
    depositedAmount = await strategyContract.methods.getCurrentBalance(userAddress).call();
    depositedAmount = new BigNumber(depositedAmount);
  } else if (type === 'citadel' || type === 'elon' || type === 'cuban') {
    const pool = await vaultContract.methods.getAllPoolInUSD().call();
    const totalSupply = await vaultContract.methods.totalSupply().call(); 
    depositedAmount = (depositedShares * pool) / totalSupply;
    depositedAmount = new BigNumber(depositedAmount);
  } else if (type === 'harvest') {
    depositedAmount = await strategyContract.methods.getCurrentBalance(userAddress).call();
    depositedAmount = new BigNumber(depositedAmount);
  } else if (type === 'daoFaang') {
    let usdtToUsdPriceFeedContract;
    const contractInfo = (process.env.PRODUCTION != '') ? mainContracts.chainLink.USDT_USD : testContracts.chainLink.USDT_USD;
    usdtToUsdPriceFeedContract = new archiveNodeWeb3.eth.Contract(contractInfo.abi, contractInfo.address);

    const usdtToUsdPrice = await getPriceFromChainLink(usdtToUsdPriceFeedContract);
    const pool = await vaultContract.methods.getTotalValueInPool().call(); 
    const totalSupply = await vaultContract.methods.totalSupply().call(); 
    const poolInUSD = (pool * usdtToUsdPrice) / (10 ** 20); // The reason to divide 20: pool in 18 , price feed in 8 , ( 18 + 8 ) / 20 =  6 decimals
  
    depositedAmount = (depositedShares * poolInUSD) / totalSupply;
    depositedAmount = new BigNumber(depositedAmount);
  } else if (type === 'moneyPrinter') {
    let usdtToUsdPriceFeedContract;
    const contractInfo = (process.env.PRODUCTION != '') ? mainContracts.polygonChainLink.USDT_USD : testContracts.polygonChainLink.USDT_USD;
    usdtToUsdPriceFeedContract = await contractHelper.getPolygonContract(contractInfo.abi, contractInfo.address);

    const usdtToUsdPrice = await getPriceFromChainLink(usdtToUsdPriceFeedContract);
    const pool = await vaultContract.methods.getValueInPool().call(); 
    const totalSupply = await vaultContract.methods.totalSupply().call();

    const poolInUSD = (pool * usdtToUsdPrice) / (10 ** 20); // The reason to divide 20: pool in 18 , price feed in 8 , ( 18 + 8 ) / 20 =  6 decimals
  
    depositedAmount = (depositedShares * poolInUSD) / totalSupply;
    depositedAmount = new BigNumber(depositedAmount);
  }

  const {
    deposits,
    withdrawals,
    transfersIn,
    transfersOut,
  } = transactionsForVault;

  const getSum = (data) => {
    const zero = new BigNumber(0);
    const sum = data.reduce(
      (dataItem, item) => {
        return dataItem.plus(item.amount);
      },
      zero,
      data
    );
    return sum;
  };

  const getSumForUSD = (data) => {
    const zero = new BigNumber(0);
    const sum = data.reduce(
      (dataItem, item) => {
        return dataItem.plus(item.amountInUSD ? item.amountInUSD : 0);
      },
      zero,
      data
    );
    return sum;
  }

  const totalDeposits = getSum(deposits);
  const totalWithdrawals = getSum(withdrawals);
  const totalTransferredIn = getSum(transfersIn);
  const totalTransferredOut = getSum(transfersOut);
 
  let earnings = 0;
  let totalDepositsInUSD = 0;
  let totalWithdrawalsInUSD = 0;
  let totalTransferredInUSD = 0;
  let totalTransferredOutInUSD = 0;

  if(type === "citadel" || type === "elon" || type === "cuban" || type === "daoFaang" || type === "moneyPrinter") {
    totalDepositsInUSD = getSumForUSD(deposits);
    totalWithdrawalsInUSD = getSumForUSD(withdrawals);
    totalTransferredInUSD = getSumForUSD(transfersIn);
    totalTransferredOutInUSD = getSumForUSD(transfersOut);
  
    let exactDepositedAmount = depositedAmount / 10 ** 6;
    exactDepositedAmount = new BigNumber(exactDepositedAmount);
    earnings = exactDepositedAmount
              .minus(totalDepositsInUSD)
              .plus(totalWithdrawalsInUSD)
              .minus(totalTransferredInUSD)
              .plus(totalTransferredOutInUSD)
  } else {
    earnings = depositedAmount
    .minus(totalDeposits)
    .plus(totalWithdrawals)
    .minus(totalTransferredIn)
    .plus(totalTransferredOut);
  } 

  const statistics = {
    contractAddress,
    totalDeposits: totalDeposits.toFixed(),
    totalDepositsInUSD: totalDepositsInUSD.toFixed(),
    totalWithdrawals: totalWithdrawals.toFixed(),
    totalWithdrawalsInUSD: totalWithdrawalsInUSD.toFixed(),
    totalTransferredIn: totalTransferredIn.toFixed(),
    totalTransferredInUSD: totalTransferredInUSD.toFixed(),
    totalTransferredOut: totalTransferredOut.toFixed(),
    totalTransferredOutInUSD: totalTransferredOutInUSD.toFixed(),
    depositedShares,
    depositedAmount: depositedAmount,
    earnings: earnings.toFixed(0),
  };
  return statistics;
};

const getVaultsStatistics = async (userAddress) => {
  const vaultAddressesForUser = await getVaultAddressesForUser(userAddress);
  const transactions = await getTransactions(userAddress);
  const getVaultStatisticsWithTransactions = async (vault) => {
    return await getVaultStatistics(vault, transactions, userAddress);
  }
    
  const vaultsStatistics = await Promise.all(
    vaultAddressesForUser.map(getVaultStatisticsWithTransactions)
  );
  return vaultsStatistics;
};

const handler = async (req, res) => {
  const userAddress = req.params.userAddress || '';
  if (userAddress === '') {
    res.status(200).json({
      message: 'User Address is empty.',
      body: null
    });
  } else {
    const vaultsStatistics = await getVaultsStatistics(req.params.userAddress);
    res.status(200).json({
      message: '',
      body: vaultsStatistics
    });
  }
};

function getMinimalVaultABI() {
  return [
    {
      constant: true,
      inputs: [{ type: "address", name: "arg0" }],
      name: "balanceOf",
      outputs: [{ type: "uint256", name: "out" }],
      payable: false,
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getPricePerFullShare",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      type: "function",
    },
  ];
}

module.exports = {
  getVaultsStatistics,
  getContract,
  getPricePerFullShare,
  getBalanceOf,
  getTotalSupply,
  handler
}
