const moment = require("moment");
const fetch = require("node-fetch");

const coingeckoApiEndPoint = "https://api.coingecko.com/api/v3/";

async function getYfiHistoricalMarketData(
  from,
  to,
  type,
  vsCurrency,
  formatTimestamps = true
) {
  const response = await fetch(
    `${coingeckoApiEndPoint}/coins/yearn-finance/market_chart/range?vs_currency=${vsCurrency}&from=${from.unix()}&to=${to.unix()}`
  );

  let responseData = await response.json();

  // Format the response data, by filtering out unrequested data and labelling fields.
  if (type !== "all") {
    responseData = {
      [type]: responseData[type],
    };
  }

  const typesUsed = Object.keys(responseData);
  typesUsed.forEach((typeUsed) => {
    responseData[typeUsed] = responseData[typeUsed].map((item) => {
      let [timestamp, value] = item;
      return {
        timestamp: formatTimestamps ? moment(timestamp).format() : timestamp,
        value,
      };
    });
  });

  return responseData;
}

exports.getYfiHistoricalMarketData = getYfiHistoricalMarketData;
