const express = require("express");
const router = express.Router();

const daomine = require("../services/staking/handler");
const stakeVIP = require("../services/staking/vipdvg/handler");

// const stakeVIP = require("./services/staking/xdvg/handler"); // Might need to remove

// DAOmine pools
router.get("/get-pools", (req, res) => {
    try {
        daomine.getPools(req, res);
    } catch (err) {
        console.error(`Error while getting /get-pools`, err);
    }
});

// Emergency Withdraw Snapshot
router.get("/emergency-withdraw-snapshot", (req, res) => {
    try {
        daomine.snapshotEmergency(req, res);
    } catch (err) {
        console.error(`Error while getting /emergency-withdraw-snapshot`, err);
    }
});

// DAOvip DVG
router.get("/get-xdvg-stake", (req, res) => {
    try {
        stakeVIP.getxDVGStake(req, res);
    } catch (err) {
        console.error(`Error while getting /get-xdvg-stake`, err);
    }
});

// DAOvip DVD
router.get("/get-xdvd-stake", (req, res) => {
    try {
        stakeVIP.getxDVDStake(req, res);
    } catch (err) {
        console.error(`Error while getting /get-xdvd-stake`, err);
    }
});

module.exports = router;