const db = require("../../../models/airdrop.model");
const eventDb = require("../../../models/airdrop-event.model");

const getAirdropAddress = async(req, res) => {
    let result = { active: false, info: null };
    let message = "Successful Response";

    try {
        if(!req.params.address ||
            req.params.address === undefined ||
            req.params.address === "") {
            throw(`Missing address for airdrop`);
        }

        if(!req.params.airdropAddress || 
            req.params.airdropAddress === undefined || 
            req.params.airdropAddress === "") {
            throw(`Missing address for airdrop contract`);
        }

        const userAddress = req.params.address;
        const airdropAddress = req.params.airdropAddress;

        // Find on going event
        const airdropEvent = await eventDb.findOne(airdropAddress);
       
        if(airdropEvent !== undefined && airdropEvent !== null) {
            result.active = airdropEvent.active;

            // On going airdrop, i.e. result.active = true
            if(result.active) {
                const airdropInfo = await db.findOne(userAddress);
                if(airdropInfo !== null) {
                    delete airdropInfo._id;
                    result.info = airdropInfo;
                }
            }
        }
    } catch (err) {
        console.error(`Error in getAirdropAddress(): `, err);
        message = err;
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