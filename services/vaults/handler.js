const AWS = require("aws-sdk");
// const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const db = require('../../models/vault.model');
const _ = require("lodash");
const { injectDataIntoVaultAtKey } = require("../../utils/vaults");
const { getVaultsApy } = require("../vaults/apy/handler");

const getVaults = async () => {
  const vaults = await db.findAll();
  return vaults;
};

exports.getVaults = getVaults;

exports.handler = async (event) => {
  const allVaults = await getVaults();
  const queryParams = event.queryStringParameters;
  const showApy = _.get(queryParams, "apy") === "true";

  // Inject APY into vaults
  const apy = showApy && (await getVaultsApy());
  const injectApy = (vault) => {
    const newVault = injectDataIntoVaultAtKey(vault, apy, "apy");
    return newVault;
  };

  const vaultsWithData = _.chain(allVaults).map(injectApy);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(vaultsWithData),
  };
  return response;
};
