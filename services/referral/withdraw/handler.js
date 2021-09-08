const db = require("../../../models/referral-withdrawal.model");

module.exports.getAddress = async (req, res) => {
  try {
    const addressInfo = await db.findOne(req.params.address.toLowerCase());

    if (addressInfo != null) {
      delete addressInfo._id;
    }

    res.status(200).json({
      message: "Successful Response",
      body: addressInfo,
    });
  } catch (err) {
    res.status(200).json({
      message: err.message,
      body: null,
    });
  }
  return;
};

module.exports.addWithdrawalAmount = async (req, res) => {
  try {
    if (!req.body || !req.body.address || !req.body.amount) {
      if (!req.body.address) {
        res.status(200).json({
          message: "Missing user address.",
          body: null,
        });
      }
      if (!req.body.amount) {
        res.status(200).json({
          message: "Missing input amount.",
          body: null,
        });
      }
    }

    var today = new Date();
    var datetime =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      "-" +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();

    await db.withdrawAmount({
      referrer: req.body.referrer,
      amount: req.body.amount,
      address: req.body.address,
      timestamp: datetime,
    });

    res.status(200).json({
      message: "Withdrawal Success!",
      body: null,
    });

    return;
  } catch (err) {
    res.status(200).json({
      message: err.message,
      body: null,
    });
    return;
  }
};
