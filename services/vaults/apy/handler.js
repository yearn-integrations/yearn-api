const _ = require("lodash");
const ApyModel = require('../../../models/apy.model')

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
