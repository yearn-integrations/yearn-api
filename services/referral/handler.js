const db = require("../../models/referrals.model");

//Creates referral system
//1. (Influencer)Address 2. Referral Code

//2. Deposit => a)Amount b)Referral c)Timestamp
//3. Withdrawal => a)Amount b) Timestamp

module.exports.seeAllReferrals = async (req, res) => {
  try {
    const result = await db.findAll();
    setTimeout(() => {
      console.log("hi");
    }, 3000);
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
    const referralInfo = await db.findOne(req.params.referral.toLowerCase());

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
    const result = await db.addReferral(req.params);
    res.status(200).json({
      message: "Successful Response",
      body: req.params,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      body: null,
    });
  }
};
