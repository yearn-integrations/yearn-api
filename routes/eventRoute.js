const express = require("express");
const router = express.Router();

const specialEvent = require("../services/user/special-event/handler");

router.get("/verify", (req, res) => {
    try {
        specialEvent.handleVerifyEvent(req, res);
    } catch (err) {
        console.error(`Error while getting /event/verify`, err);
    }
});

router.get("/verify/:amount", (req, res) => {
    try {
        specialEvent.handler(req, res);
    } catch (err) {
        console.error(`Error while getting /event/verify/amount`, err);
    }
});

module.exports = router;