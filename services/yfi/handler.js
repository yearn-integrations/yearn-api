"use strict";

require("dotenv").config();
const { getYfiHistoricalMarketData } = require("./coingecko");
const moment = require("moment");
const _ = require("lodash");

module.exports.handler = async (event) => {
  const [from, to, requestedType, vsCurrency] = prepareRequestParams(event);

  const historicalYfiMarketData = await getYfiHistoricalMarketData(
    from,
    to,
    requestedType,
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

function prepareRequestParams(event) {
  const queryParams = event.queryStringParameters;

  let to = _.get(queryParams, "to", null);
  to = to ? moment(to) : moment();

  let from = _.get(queryParams, "from", null);
  from = from ? moment(from) : to.clone().subtract("1", "months");

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

  return [from, to, typeMapping[requestedType], vsCurrency];
}
