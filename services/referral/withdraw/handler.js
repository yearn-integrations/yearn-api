const db = require("../../../models/referral-withdrawal.model");
const moment = require("moment");

module.exports.addWithdrawalAmount = async (req, res) => {
  try {
    if (
      !req.body ||
      !req.body.address ||
      !req.body.amount ||
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
      if (!req.body.transactionId) {
        res.status(200).json({
          message: "Missing Transaction ID.",
          body: null,
        });
      }
    } else {
      const now = moment().valueOf();
      await db.withdrawAmount({
        _id: req.body.transactionId,
        amount: req.body.amount,
        address: req.body.address,
        timestamp: now,
        status: "pending",
      });

      res.status(200).json({
        message: "Withdraw Success!",
        body: null,
      });
      return;
    }
  } catch (err) {
    res.status(200).json({
      message: err.message,
      body: null,
    });
    return;
  }
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
