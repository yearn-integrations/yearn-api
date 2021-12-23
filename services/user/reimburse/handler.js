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

module.exports.updateReimburseAddressClaimAmount = async (req, res) => {
    try {
        if(!req.body || !req.body.address || !req.body.amount) {
            if(!req.body.address) {
                res.status(200).json({
                    message: "Missing user address.",
                    body: null,
                });
            }
            if(!req.body.amount) {
                res.status(200).json({
                    message: "Missing claimed amount.",
                    body: null,
                });
            }
        }
        
        await db.updateClaimAmount({
            amount: req.body.amount,
            address: req.body.address,
        });
       
        res.status(200).json({
            message: "Update Success!",
            body: null,
        });

        return;
    } catch (err) {
        res.status(200).json({
            message: err.message,
            body: null
        });
        return;
    }
}