const deposit = require("../deposit/handler");
const withdraw = require("../withdraw/handler");

const getPendingDeposits = async (req, res) => {
  const result = await deposit.getAll({ status: "pending" });
  const resultId = result;
};

const getGraphTransactions = async (userAddress, network) => {
  const query = `
  { 
      deposits: deposits (where: {account: "${userAddress}"}) {
        transactionAddress: transaction {
          id
        }
    }
  `;

  let url = "";
  switch (network) {
    case constant.ETHEREUM:
      url = subgraphUrl;
      break;
    case constant.POLYGON:
      url = polygonSubgraphUrl;
      break;
    default:
      break;
  }
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ query }),
  });

  const responseJson = await response.json();
  const graphTransactions = responseJson.data;
  return graphTransactions;
};
