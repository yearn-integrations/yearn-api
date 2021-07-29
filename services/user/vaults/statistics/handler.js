"use strict";

require("dotenv").config();
const BigNumber = require("bignumber.js");
const {
  getTransactionsByNetwork,
  isSupportedNetwork
} = require("../transactions/handler");
const _ = require("lodash");
const contractHelper = require("../../../../utils/contract");
const chainLinkHelper = require("../../../../utils/chainlinkHelper");
const constant = require("../../../../utils/constant");

let contracts;

const getContract = async(abi, contractAddress) => {
  return await contractHelper.getContract(abi, contractAddress);
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

const getVaultStatistics = async (contractAddress, transactions, userAddress) => {
  const findVault = (vault) => {
    if (vault.vaultAddress == null) return false;
    return vault.vaultAddress.toLowerCase() === contractAddress;
  }

  const transactionsForVault = _.find(transactions, findVault);
 
  // Get User Deposit Amount
  const vault = Object.values(contracts.farmer).find(contract => contract.address.toLowerCase() === contractAddress.toLowerCase());
  const type = vault.contractType;

  const vaultContract = await contractHelper.getContract(vault.abi, vault.address, vault.network);
  const strategyContract = await contractHelper.getContract(vault.strategyABI, vault.strategyAddress, vault.network);

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
    const usdtToUsdPrice = await chainLinkHelper.getEthereumUSDTUSDPrice();
    const pool = await vaultContract.methods.getTotalValueInPool().call(); 
    const totalSupply = await vaultContract.methods.totalSupply().call(); 
    const poolInUSD = (pool * usdtToUsdPrice) / (10 ** 20); // The reason to divide 20: pool in 18 , price feed in 8 , ( 18 + 8 ) / 20 =  6 decimals
  
    depositedAmount = (depositedShares * poolInUSD) / totalSupply;
    depositedAmount = new BigNumber(depositedAmount);
  } else if (type === 'moneyPrinter') {
    const usdtToUsdPrice = await chainLinkHelper.getPolygonUSDTUSDPrice();
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

  const usdVaultsCategory = [
    "citadel",
    "elon",
    "cuban",
    "daoFaang",
    "moneyPrinter"
  ];

  if(usdVaultsCategory.includes(type)) {
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

const getVaultsStatistics = async (userAddress, network) => {
  // Get all user transactions
  const transactions = await getTransactionsByNetwork(userAddress, network);

  const vaultAddressesForUser = transactions.map(t => t.vaultAddress);
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
  const network = req.params.network || '';

  if (userAddress === '' || network === "") {
    res.status(200).json({
      message: 'User Address / Network is empty.',
      body: null
    });
    return;
  }
  
  if(!isSupportedNetwork(network)) {
    res.status(200).json({
      message: `Please pass either 'all', '${constant.ETHEREUM}' or '${constant.POLYGON}'`,
      body: null
    });
    return;
  }
  
  contracts = contractHelper.getContractsFromDomain();
  const vaultsStatistics = await getVaultsStatistics(userAddress, network);
  res.status(200).json({
    message: '',
    body: vaultsStatistics
  });
};


module.exports = {
  getVaultsStatistics,
  getContract,
  getPricePerFullShare,
  getBalanceOf,
  getTotalSupply,
  handler
}
