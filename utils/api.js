const axios = require('axios');

const pushSlackErrorAlert = (method, url, err) => {
  const requestBody = {
    text: url !== "" ? `API Error - ${err}\nMethod - ${method}\nSource <${url}|${url}>` : `API Error - ${err}\nMethod - ${method}`
  };

  const request = {
    method: "post",
    url: process.env.SLACK_HOOK_URL,
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