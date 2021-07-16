const db = require("../../../models/reimburse-address.model");

module.exports.getReimburseAddress = async (req, res) => {
    try {
        const addressInfo = await db.findOne(
            req.params.address.toLowerCase()
        );

        if (addressInfo != null) {
            delete addressInfo._id;
        }

        res.status(200).json({
            message: 'Successful Response',
            body: addressInfo,
        });
    } catch (err)  {
        res.status(200).json({
            message: err.message,
            body: null
        });
    }

    return;
}