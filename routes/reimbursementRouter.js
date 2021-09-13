const express = require("express");
const router = express.Router();

const reimbursementAddresses = require("../services/reimbursement/handler");

router.get("/dvg", (req, res) => {
    try {
        reimbursementAddresses.handler(req, res);
    } catch (err) {
        console.error(`Error while getting /dvg`, err);
    }
});

router.get("/dvg/:address", (req, res) => {
    try {
        reimbursementAddresses.handler(req, res);
    } catch (err) {
        console.error(`Error while getting /dvg/address`, err);
    }
});

module.exports = router;