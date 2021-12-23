"use strict";

require("dotenv").config();
const fetch = require("node-fetch");
const { pluck, uniq } = require("ramda/dist/ramda");
const subgraphUrl = process.env.SUBGRAPH_ENDPOINT;
const polygonSubgraphUrl = process.env.POLYGON_SUBGRAPH_ENDPOINT;
const constant = require("../../../../utils/constant");
const _ = require("lodash");
const {
  testContracts,
  mainContracts
} = require('../../../../config/serverless/domain');

module.exports.handler = async (req, res) => {
  const userAddress = req.params.userAddress || '';
  if (userAddress === '') {
    res.status(200).json({
      message: 'User Address is empty.',
      body: null
    });
  } else {
    const transactions = await getTransactions(userAddress);
    const contentMapping = (data) => {
      data.contractAddress = data.vaultAddress;
      delete data.vaultAddress;

      const transactionMapping = (tx) => {
        delete tx.transaction;
        tx.timestamp = Number(tx.timestamp);
        return tx;
      }

      data.deposits.map(transactionMapping);
      data.withdrawals.map(transactionMapping);
      data.transfersIn.map(transactionMapping);
      data.transfersOut.map(transactionMapping);
      return data;
    }

    transactions.map(contentMapping);
    res.status(200).json({
      message: '',
      body: transactions
    });
  }
};

const getGraphTransactions = async (userAddress, network) => {
  const query = `
  { 
      deposits: deposits (where: {account: "${userAddress}"}) {
        transactionAddress: transaction {
          id
        }
        vaultAddress: farmer {
          id
        }
        amount
        amountInUSD
        transaction {
          timestamp
        }
      }
      withdrawals (where: {account: "${userAddress}"}) { 
        transactionAddress: transaction {
          id
        }
        vaultAddress: farmer {
          id
        }
        amount
        amountInUSD
        transaction {
          timestamp
        }
      }
      transfersIn: transfers(where: {to: "${userAddress}", from_not: "0x0000000000000000000000000000000000000000"}) {
        transactionAddress: transaction {
          id
        }
        transaction {
          timestamp
        }
        vaultAddress: farmer {
          id
        }
        amount
        amountInUSD
        shares: value
      }
      transfersOut: transfers(where: {from: "${userAddress}", to_not: "0x0000000000000000000000000000000000000000"}) {
        transactionAddress: transaction {
          id
        }
        shares: value
        transaction {
          timestamp
        }
        vaultAddress: farmer {
          id
        }
        amount
        amountInUSD
      }
    }
  `;

  let url = "";
  switch(network){
    case constant.ETHEREUM: 
      url = subgraphUrl;
      break;
    case constant.POLYGON:
      url = polygonSubgraphUrl;
      break;
    default:
      break;
  }
  const response = await fetch(url , {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  
  const responseJson = await response.json();
  const graphTransactions = responseJson.data;
  return graphTransactions;
};

const getVaultAddressesForUserWithGraphTransactions = (
  userAddress,
  graphTransactions
) => {
  const {
    deposits,
    withdrawals,
    transfersIn,
    transfersOut,
  } = graphTransactions;


  const txMapping = (tx) => {
    tx.vaultAddress = tx.vaultAddress.id;
    tx.transactionAddress = tx. transactionAddress.id;
    tx.timestamp = tx.transaction.timestamp;

    return {
      ...tx
    };
  }

  deposits.map(txMapping);
  withdrawals.map(txMapping);
  transfersIn.map(txMapping);
  transfersOut.map(txMapping);

  const vaultAddressesForUser = uniq([
    ...pluck("vaultAddress", deposits),
    ...pluck("vaultAddress", withdrawals),
    ...pluck("vaultAddress", transfersIn),
    ...pluck("vaultAddress", transfersOut),
  ]);

  return vaultAddressesForUser;
};

const getVaultAddressesForUser = async (userAddress) => {
  const ethereumTransactions = await getGraphTransactions(userAddress.toLowerCase(), constant.ETHEREUM);
  const polygonTransactions = await getGraphTransactions(userAddress.toLowerCase(), constant.POLYGON);

  let vaultAddressesForUser = [];
  const ethereumAddresses = getVaultAddressesForUserWithGraphTransactions(
    userAddress,
    ethereumTransactions
  );
  vaultAddressesForUser = vaultAddressesForUser.concat(ethereumAddresses);

  const polygonAddresses = getVaultAddressesForUserWithGraphTransactions(
    userAddress,
    polygonTransactions
  );
  vaultAddressesForUser = vaultAddressesForUser.concat(polygonAddresses);

  return vaultAddressesForUser;
};

const getTransactions = async (userAddress) => {
  let deposits = [];
  let withdrawals = [];
  let transfersIn = [];
  let transfersOut = [];

  const ethereumTransactions = await getGraphTransactions(userAddress, constant.ETHEREUM);
  if(ethereumTransactions) {
    deposits = deposits.concat(ethereumTransactions.deposits);
    withdrawals = withdrawals.concat(ethereumTransactions.withdrawals);
    transfersIn = transfersIn.concat(ethereumTransactions.transfersIn);
    transfersOut = transfersOut.concat(ethereumTransactions.transfersOut);
  }

  const polygonTransactions = await getGraphTransactions(userAddress, constant.POLYGON);
  if(polygonTransactions) {
    deposits = deposits.concat(polygonTransactions.deposits);
    withdrawals = withdrawals.concat(polygonTransactions.withdrawals);
    transfersIn = transfersIn.concat(polygonTransactions.transfersIn);
    transfersOut = transfersOut.concat(polygonTransactions.transfersOut);
  }

  // let { deposits, withdrawals, transfersIn, transfersOut } = graphTransactions;
  // const injectAmountIntoTransfer = (transfer) => {
  //   const amount = (transfer.balance * transfer.shares) / transfer.totalSupply;
  //   const newTransfer = {
  //     ...transfer,
  //     amount,
  //   };
  //   return newTransfer;
  // };
  // transfersIn = transfersIn.map(injectAmountIntoTransfer);
  // transfersOut = transfersOut.map(injectAmountIntoTransfer);

  // Get all the vaults the address has interacted with.
  let vaultAddresses = [];
  const ethereumAddresses = getVaultAddressesForUserWithGraphTransactions(
    userAddress,
    ethereumTransactions
  );
  vaultAddresses = vaultAddresses.concat(ethereumAddresses);
  const polygonAddresses = getVaultAddressesForUserWithGraphTransactions(
    userAddress,
    polygonTransactions
  )
  vaultAddresses = vaultAddresses.concat(polygonAddresses);
 
  const farmers = process.env.PRODUCTION == '' ? Object.values(testContracts.farmer) : Object.values(mainContracts.farmer);

  const removeVaultAddressField = (deposit) => _.omit(deposit, "vaultAddress");

  const getTransactionsByVaultAddress = (vaultAddress) => {
    const findItemByVaultAddress = (item) => item.vaultAddress === vaultAddress;
    const findVault = (vault) => vault.address.toLowerCase() === vaultAddress.toLowerCase();

    const depositsToVault = deposits
      .filter(findItemByVaultAddress)
      .map(removeVaultAddressField);

    const withdrawalsFromVault = withdrawals
      .filter(findItemByVaultAddress)
      .map(removeVaultAddressField);

    const transfersIntoVault = transfersIn
      .filter(findItemByVaultAddress)
      .map(stripUnneededTransferFields);

    const transfersOutOfVault = transfersOut
      .filter(findItemByVaultAddress)
      .map(stripUnneededTransferFields);

    const farmer = farmers.find(findVault);

    //TODO Change dynamic address
    const vaultTransactions = {
      vaultAddress: farmer == null ? "" : farmer.address,
      // vaultAddress: process.env.PRODUCTION != null && process.env.PRODUCTION != '' ? prodContract.prodYfUSDTContract : devContract.devYfUSDTContract,
      deposits: depositsToVault.map(correctTransactionAddress),
      withdrawals: withdrawalsFromVault.map(correctTransactionAddress),
      transfersIn: transfersIntoVault.map(correctTransactionAddress),
      transfersOut: transfersOutOfVault.map(correctTransactionAddress),
    };

    return vaultTransactions;
  };

  const transactionsByVault = vaultAddresses.map(getTransactionsByVaultAddress);
  return transactionsByVault;
};

function correctTransactionAddress(item) {
  return {
    ...item,
    transactionAddress: item.transactionAddress.slice(0, 66),
  };
}

function stripUnneededTransferFields(transfer) {
  return _.omit(transfer, [
    "vaultAddress",
    "shares",
    "pricePerFullShare",
    "totalSupply",
    "balance",
  ]);
}

module.exports.getTransactions = getTransactions;

module.exports.getVaultAddressesForUser = getVaultAddressesForUser;
