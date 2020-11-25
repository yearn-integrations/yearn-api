const AWS = require("aws-sdk");
// const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const _ = require("lodash");
const ApyModel = require('../../../models/apy.model')

// const getVaultsApy = async () => {
//   const params = {
//     TableName: "vaultApy",
//   };
//   const entries = await db.scan(params).promise();
//   const apy = entries.Items;

//   const injectVaultAddress = (vault) => {
//     vault.vaultAddress = vault.address;
//     return vault;
//   };
//   const vaultAddress = _.map(apy, injectVaultAddress);
//   return apy;
// };

const getVaultsApy = async () => {
  const apy = await ApyModel.findAll();
  apy.forEach((v) => delete v._id)
  return apy;
};

exports.getVaultsApy = getVaultsApy;

exports.handler = async (res) => {
  const apy = await getVaultsApy();

  res.status(200).json({
    message: '',
    body: apy
  });
};
