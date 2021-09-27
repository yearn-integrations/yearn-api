"use strict";

require("dotenv").config();
const fetch = require("node-fetch");
const subgraphUrl = process.env.SUBGRAPH_ENDPOINT;
const polygonSubgraphUrl = process.env.POLYGON_SUBGRAPH_ENDPOINT;

const db_deposit = require("../../../models/referral-deposit.model");
const db_withdraw = require("../../../models/referral-withdrawal.model");

const getPendingDeposits = async () => {
  const result = await db_deposit.findAll({ status: "pending" });
  let resultIds = [];
  result.forEach((element) => {
    resultIds.push(element._id);
  });

  return resultIds;
};

const getPendingWithdrawals = async () => {
  const result = await db_withdraw.findAll({ status: "pending" });
  let resultIds = [];
  result.forEach((element) => {
    resultIds.push(element._id);
  });

  return resultIds;
};

const getGraphTransactions = async () => {
  const query = `
  {
    withdrawals{
      id
      amountInUSD
    }
    deposits{
      id
      amountInUSD
    }
  }
  `;

  //Getting Polygon transactions
  const response = await fetch(polygonSubgraphUrl, {
    method: "POST",
    body: JSON.stringify({ query }),
  });

  const responseJson = await response.json();

  let graphTransactionsID = [];
  responseJson.data.deposits.forEach((element) => {
    graphTransactionsID.push([element.id, element.amountInUSD]);
  });
  responseJson.data.withdrawals.forEach((element) => {
    graphTransactionsID.push([element.id, element.amountInUSD]);
  });

  //Getting subgraph transactions

  const response_2 = await fetch(subgraphUrl, {
    method: "POST",
    body: JSON.stringify({ query }),
  });

  const responseJson_2 = await response_2.json();

  let graphTransactionsID_2 = [];
  responseJson_2.data.deposits.forEach((element) => {
    graphTransactionsID_2.push([element.id, element.amountInUSD]);
  });

  responseJson_2.data.withdrawals.forEach((element) => {
    graphTransactionsID_2.push([element.id, element.amountInUSD]);
  });

  //0x0023d5fedabdaa884411e433ff28baeac2eab72da8868d399bd3347132842b4e
  return [graphTransactionsID, graphTransactionsID_2];
};

module.exports.validator = async () => {
  let pendingDeposits = await getPendingDeposits();
  let graphIds = await getGraphTransactions();
  let pendingWithdrawals = await getPendingWithdrawals();

  for (const unit of graphIds[0]) {
    if (pendingDeposits.includes(unit[0])) {
      await db_deposit.updateStatus(unit[0], unit[1]);
    }
    if (pendingWithdrawals.includes(unit[0])) {
      await db_withdraw.updateStatus(unit[0], unit[1]);
    }
  }

  for (const unit of graphIds[1]) {
    if (pendingDeposits.includes(unit[0])) {
      await db_deposit.updateStatus(unit[0], unit[1]);
    }
    if (pendingWithdrawals.includes(unit[0])) {
      await db_withdraw.updateStatus(unit[0], unit[1]);
    }
  }

  return;
};
