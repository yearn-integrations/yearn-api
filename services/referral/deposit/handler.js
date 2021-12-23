const db = require("../../../models/referral-deposit.model");
const dbReferral = require("../../../models/referrals.model");
const moment = require("moment");

isValidReferral = async (referral) => {
  const referralInfo = await dbReferral.checkReferral(referral);
  return referralInfo;
};

module.exports.getAll = async (req, res) => {
  try {
    let f = {};
    if (req.query) {
      f = req.query;
    }
    const result = await db.findAll(f);
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
    const result = await db.getTransaction(req.body.id);
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
  try {
    if (
      !req.body ||
      !req.body.address ||
      !req.body.amount ||
      !req.body.referral ||
      !req.body.transactionId
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
      if (!req.body.referral) {
        res.status(200).json({
          message: "Missing referral link.",
          body: null,
        });
      }
      if (!req.body.transactionId) {
        res.status(200).json({
          message: "Missing Transaction ID.",
          body: null,
        });
      }
    } else {
      const result = await isValidReferral(req.body.referral);
      if (result) {
        const now = moment().valueOf();
        await db.depositAmount({
          _id: req.body.transactionId,
          referral: req.body.referral,
          amount: req.body.amount,
          address: req.body.address,
          timestamp: now,
          status: "pending",
        });

        res.status(200).json({
          message: "Deposit Success!",
          body: null,
        });
        return;
      } else {
        res.status(200).json({
          message: "Referral link invalid",
        });
        return;
      }
    }
  } catch (err) {
    res.status(200).json({
      message: err.message,
      body: null,
    });
  }
};
