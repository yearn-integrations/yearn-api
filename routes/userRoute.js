const express = require("express");
const router = express.Router();

const userStatistics = require("../services/user/vaults/statistics/handler");
const userTransactions = require("../services/user/vaults/transactions/handler");
const reimburse = require("../services/user/reimburse/handler");
const airdrop = require("../services/user/airdrop/handler");

// Transaction Statistic for each strategy by user wallet 
router.get("/:userAddress/:network/vaults/statistics", (req, res) => {
    try {
        userStatistics.handler(req, res);
    } catch (err) {
        console.error(`Error while getting /network/vaults/statistics`, err);
    }
});

// Transactions for each strategy by user wallet 
router.get("/:userAddress/:network/vaults/transactions", (req, res) => {
    try {
        userTransactions.handler(req, res);
    } catch (err) {
        console.error(`Error while getting /network/vaults/statistics`, err);
    }
});

// DVG to DVD upgrade
router.get("/reimburse-address/:address", (req, res) => {
    try{
        reimburse.getReimburseAddress(req, res);
    } catch(err) {
        console.error(`Error while getting /reimburse-address/address: `, err);
    }
});

// Update reimbursed DVG amount by user wallet
router.post("/reimburse-address/update", (req, res) => {
    try{
        reimburse.updateReimburseAddressClaimAmount(req, res);
    } catch(err) {
        console.error(`Error while getting /reimburse-address/update: `, err);
    }
})

// Airdrop
router.get("/airdrop/:address",(req, res) => {
    try{
        airdrop.getAirdropAddress(req, res);
    } catch(err) {
        console.error(`Error while getting /airdrop/:address`, err);
    }
});

module.exports = router;