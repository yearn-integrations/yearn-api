const db = require("../../../models/special-event.model");

// Check user's eligibility for special event
const checkEligibilityForEvent = async(amount) => {

    const result = {
        amountAboveThreshold: true,
        happyHour: true,
        happyHourInfo: null,
        message: "",
    };

    const event = await getExistingEvent();

    // Check any existing event
    if(event.happyHour === false) {
        result.amountAboveThreshold = false,
        result.happyHour = false,
        result.happyHourInfo = null;
        result.message = "No ongoing event found."
        return result;
    }

    // Check deposited amount
    if(amount < event.threshold) {
        result.amountAboveThreshold = false,
        result.happyHour = true,
        result.happyHourInfo = event;
        result.message = "Below required deposit (" + event.threshold + ") for Happy Hour. Gas fee will be required."
        return result; 
    }

    result.happyHourInfo = event;
    result.message = "Gas fee is on us!";
    return result;
}

const getExistingEvent = async() => {
    const eventList = await db.getCurrentEvent();

    const result = {
        happyHour: false,
        startTime: null,
        endTime: null,
        threshold: null
    }

    if(eventList.length > 0) {
        const currentEvent = eventList[0];

        result.happyHour = true;
        result.startTime = currentEvent.startTime;
        result.endTime = currentEvent.endTime;
        result.threshold = currentEvent.threshold;

        return result;
    }

    return result;
}

module.exports.handleVerifyEvent = async(req, res) => {
    const result = await getExistingEvent();

    res.status(200).json({
        message: "Successful response",
        body: result
    })
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