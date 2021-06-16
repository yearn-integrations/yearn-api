const db = require("../../../models/special-event.model");

// Check user's eligibility for special event
const checkEligibilityForEvent = async(amount) => {
    const eventList = await db.getCurrentEvent();

    // Check any existing event
    if(eventList.length <= 0) {
        return "No ongoing event found.";
    }

    const currentEvent = eventList[0];

    // Check deposited amount
    if(amount < currentEvent.threshold) {
        return "Deposited amount is less than threshold. Threshold: " + currentEvent.threshold;
    }

    return "Valid";
}

module.exports.handler = async(req, res) => {
    if(req.params.amount === null || req.params.amount === "") {
        res.status(200).json({
            message: "Amount is empty",
            body: null
        });
    }

    const result = await checkEligibilityForEvent(req.params.amount);

    res.status(200).json({
        message: "Successful response",
        body: result
    })
}