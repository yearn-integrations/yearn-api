const db = require("../../models/referrals.model");

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

module.exports.addNewReferral = async (req, res) => {
  await db.addReferral(req.params);
  res.status(400).json({
    body: req.params,
  });
};
