"use strict";

require("dotenv").config();
const _ = require("lodash");
const db = require("../../models/reimbursement-addresses.model");
const whiteList = require("./whitelist.js");
const ethers = require("ethers");

module.exports.saveAddresses = async () => {

  try {
    await db.drop();
  } catch {
    console.log("collection not created yet")
  }

  const signerWallet = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY);

  console.log(`Signer address: ${signerWallet.address}`);

  const totalCount = whiteList.length;
  let data;
  let user;
  let allowedAmount;
  let signature;
  let message;
  for (var i = 0; i < totalCount; i++) {
    user = whiteList[i][0];
    allowedAmount = whiteList[i][1];

    message = ethers.utils.solidityKeccak256(
      ["address", "uint256"],
      [user, allowedAmount]
    );
    signature = await signerWallet.signMessage(ethers.utils.arrayify(message));

    data = {
      address: user.toLowerCase(),
      amount: allowedAmount,
      signatureMessage: signature,
    }
    await db.add(data);
  }
  console.log("done")
}

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