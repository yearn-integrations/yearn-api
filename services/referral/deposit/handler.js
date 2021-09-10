const db = require("../../../models/referral-deposit.model");
const dbReferral = require("../../../models/referrals.model");

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
    res.status(400).json({
      message: err.message,
      body: null,
    });
  }

  return;
};

module.exports.checkReferral = async (req, res) => {
  try {
    const referralInfo = await dbReferral.findOne(
      req.params.referral.toLowerCase()
    );

    if (referralInfo != null) {
      delete referralInfo._id;
    }

    res.status(200).json({
      message: "Successful Response",
      body: referralInfo,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      body: null,
    });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const result = await db.findAll();
    res.status(200).json({
      message: "Successful Response",
      body: result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      body: null,
    });
    return;
  }
};

module.exports.getTransaction = async (req, res) => {
  try {
    const result = await db.getTransaction(req.params.id);
    res.status(200).json({
      message: "Successful Response",
      body: result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      body: null,
    });
    return;
  }
};

module.exports.addDepositAmount = async (req, res) => {
  /*
  try {
    if (
      !req.body ||
      !req.body.address ||
      !req.body.amount ||
      !req.body.referrer
    ) {
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
      if (!req.body.referrer) {
        res.status(200).json({
          message: "Missing referral link.",
          body: null,
        });
      }
    }
*/
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
  try {
    await db.depositAmount({
      referrer: req.body.referrer,
      amount: req.body.amount,
      address: req.body.address,
      timestamp: datetime,
    });

    res.status(200).json({
      message: "Deposit Success!",
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
