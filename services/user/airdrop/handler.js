const db = require("../../../models/airdrop.model");

const getAirdropAddress = async(req, res) => {
    let result = {};
    let message = "Successful Response";

    try {
        if(!req.params.address ||
            req.params.address === undefined ||
            req.params.address === "") {
            throw(`Missing address for airdrop`);
        }
        const userAddress = req.params.address;
        const airdropInfo = await db.findOne(userAddress);

        if(airdropInfo !== null) {
            delete airdropInfo._id;
        }

        result = airdropInfo;
    } catch (err) {
        console.error(`Error in getAirdropAddress(): `, err);
        message = err.message;
    } finally {
        res.status(200).json({
            message: message,
            body: result
        });
    }
}

module.exports = {
    getAirdropAddress
};