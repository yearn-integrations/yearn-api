const _ = require("lodash");

const DEFAULT = {
  domainName: "api.yearn.tools",
  certificateName: "yearn.tools",
  stage: "${self:custom.currentStage}",
  createRoute53Record: true,
  basePath: "${self:custom.basePath}",
  endpointType: "regional",
  apiType: "rest",
  securityPolicy: "tls_1_2",
  autoDomain: true,
  // allowPathMatching: true, // enable only once when migrating from rest to http api migration
};

module.exports.prod = () => DEFAULT;

module.exports.staging = () => {
  return _.merge({}, DEFAULT, {
    domainName: `staging-${DEFAULT.domainName}`
  });
};

module.exports.dev = () => {
  return _.merge({}, DEFAULT, {
    domainName: `dev-${DEFAULT.domainName}`,
  });
};

const devEarnContract = "0x431691E15b74279c8FADCdD4c92bAe16E72DbbEF";
const devVaultContract = "0x7Cc77422B3EE0fd6c1544A9893802801Ba62C6eB";
const devYfUSDTContract = "0x4f6C84ed8bE874431e727881bF2D48C9BCB0228D";
const prodEarnContract = "0xe6354ed5bc4b393a5aad09f21c46e101e692d447";
const prodVaultContract = "0x2f08119c6f07c006695e079aafc638b8789faf18";
const prodYfUSDTContract = "0xE8c9F440677bDC8bA915734e6c7C1b232916877d";

module.exports.devContract = {
  devEarnContract,
  devVaultContract,
  devYfUSDTContract
};

module.exports.prodContract = {
  prodEarnContract,
  prodVaultContract,
  prodYfUSDTContract
}


