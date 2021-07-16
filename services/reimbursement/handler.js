"use strict";

require("dotenv").config();
const _ = require("lodash");
const db = require("../../models/reimbursement-addresses.model");
const whiteList = require("./whitelist.js");
const ethers = require("ethers");

module.exports.handler = async (req, res) => {
  const address = req.params.address;
  let result;

  // await saveAddresses();
  if (address) {
    result = await db.find(address);
  } else {
    result = await db.findAll();
  }

  if (result) {
    res.status(200).json({
      message: `Reimbursement Addresses Data with signatures`,
      body: result,
    });
  } else {
    res.status(200).json({
      message: `Address not in whitelist`,
      body: result,
    });
  }
};