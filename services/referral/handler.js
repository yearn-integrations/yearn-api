const db = require("../../models/referrals.model");

//Creates referral system
//1. (Influencer)Address 2. Referral Code

//2. Deposit => a)Amount b)Referral c)Timestamp d) User-Address
//3. Withdrawal => a)Amount b) Timestamp c) User-Address

module.exports.seeAllReferrals = async (req, res) => {
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
  }
};

module.exports.checkReferral = async (req, res) => {
  try {
    const referralInfo = await db.findOne(req.body.referral.toLowerCase());
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

module.exports.addNewReferral = async (req, res) => {
  try {
    if (!req.body || !req.body.address || !req.body.referral) {
      if (!req.body.address) {
        res.status(200).json({
          message: "Missing user address.",
          body: null,
        });
      }
      if (!req.body.referral) {
        res.status(200).json({
          message: "Missing referral link.",
          body: null,
        });
      }
    } else {
      await db.addReferral(req.body);
      res.status(200).json({
        message: "Successful Response",
        body: req.params,
      });
      return;
    }
  } catch (err) {
    res.status(200).json({
      message: err.message,
      body: null,
    });
  }
};
