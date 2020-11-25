const axios = require('axios');

const pushSlackErrorAlert = (method, url, err) => {
  const requestBody = {
    text: url !== "" ? `API Error - ${err}\nMethod - ${method}\nSource <${url}|${url}>` : `API Error - ${err}\nMethod - ${method}`
  };

  const request = {
    method: "post",
    url: "https://hooks.slack.com/services/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",
    headers: {
      "Content-Type": "application/json"
    },
    data: requestBody
  };
  axios(request)
};

module.exports = 
{
  pushSlackErrorAlert
};