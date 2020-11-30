"use strict";

require("dotenv").config();
const fetch = require("node-fetch");
const { pluck, uniq } = require("ramda/dist/ramda");
const BigNumber = require("bignumber.js");
const subgraphUrl = process.env.SUBGRAPH_ENDPOINT;
const Web3 = require("web3");
const web3 = new Web3(process.env.WEB3_ENDPOINT);
const earnABIContract = require('../../../../config/abi').earnABIContract;
const vaultABIContract = require('../../../../config/abi').vaultABIContract;
const yfUSDTABIContract = require('../../../../config/abi').yfUSDTABIContract;
const {
  devContract,
  prodContract,
} = require('../../../../config/serverless/domain');

const {
  getTransactions,
  getVaultAddressesForUser,
} = require("../transactions/handler");
const _ = require("lodash");

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

const getVaultStatistics = async (contractAddress, transactions, userAddress) => {
  const findVault = (vault) => {
    return vault.vaultAddress.toLowerCase() === contractAddress;
  }
    
  const transactionsForVault = _.find(transactions, findVault);

  let earnAddress = "";
  let vaultAddress = "";
  let yfUSDTAddress = "";

  if (process.env.PRODUCTION != null && process.env.PRODUCTION != '') {
    earnAddress = prodContract.prodEarnContract;
    vaultAddress = prodContract.prodVaultContract;
    yfUSDTAddress = prodContract.prodYfUSDTContract;
  } else {
    earnAddress = devContract.devEarnContract;
    vaultAddress = devContract.devVaultContract;
    yfUSDTAddress = devContract.devYfUSDTContract;
  }

  const earnContract = getContract(earnABIContract, earnAddress);
  const vaultContract = getContract(vaultABIContract, vaultAddress);
  const farmerContract = getContract(yfUSDTABIContract, yfUSDTAddress);

  const depositedShares = await getDepositedShares(farmerContract, userAddress);
  const earnPricePerFullShare = await getPricePerFullShare(earnContract);
  const vaultPricePerFullShare = await getPricePerFullShare(vaultContract);
  const earnBalance = await getBalanceOf(earnContract, yfUSDTAddress);
  const vaultBalance = await getBalanceOf(vaultContract, yfUSDTAddress);
  const totalSupply = await getTotalSupply(farmerContract, yfUSDTAddress);
  const pricePerFullShare = (new BigNumber(earnPricePerFullShare).times(new BigNumber(earnBalance))
    .plus(new BigNumber(vaultPricePerFullShare).times(new BigNumber(vaultBalance))))
    .dividedBy(new BigNumber(totalSupply));

  const depositedAmount = new BigNumber(depositedShares)
    .times(pricePerFullShare)
    .dividedBy(10 ** 18);

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

  const totalDeposits = getSum(deposits);
  const totalWithdrawals = getSum(withdrawals);
  const totalTransferredIn = getSum(transfersIn);
  const totalTransferredOut = getSum(transfersOut);

  const earnings = depositedAmount
    .minus(totalDeposits)
    .plus(totalWithdrawals)
    .minus(totalTransferredIn)
    .plus(totalTransferredOut);

  const statistics = {
    contractAddress: yfUSDTAddress,
    totalDeposits: totalDeposits.toFixed(),
    totalWithdrawals: totalWithdrawals.toFixed(),
    totalTransferredIn: totalTransferredIn.toFixed(),
    totalTransferredOut: totalTransferredOut.toFixed(),
    depositedShares,
    depositedAmount: depositedAmount.toFixed(0),
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
