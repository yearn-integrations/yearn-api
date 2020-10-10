"use strict";

require("dotenv").config();
const { getYfiHistoricalMarketData } = require("./coingecko");
const moment = require("moment");

module.exports.handler = async (event) => {
  const queryParams = event.queryStringParameters;

  const to = queryParams?.to ? moment(queryParams.to) : moment();
  const from = queryParams?.from
    ? moment(queryParams.from)
    : to.clone().subtract("1", "months");

  if (!from.isValid()) {
    throw "Could not parse 'from' param as a valid date/time";
  }

  if (!to.isValid()) {
    throw "Could not parse 'to' param as a valid date/time";
  }

  if (from.isAfter(to)) {
    throw "From param must be earlier than to param.";
  }

  const vsCurrency = queryParams?.vsCurrency ?? "USD";

  const typeMapping = {
    price: "prices",
    marketcap: "market_caps",
    volume: "total_volumes",
    all: "all",
  };

  const requestedType = (function getRequestedType(path) {
    const parts = path.split("/");
    return parts[parts.length - 1];
  })(event.path);

  const historicalYfiMarketData = await getYfiHistoricalMarketData(
    from,
    to,
    typeMapping[requestedType],
    vsCurrency
  );

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(historicalYfiMarketData),
  };
};
