const express = require("express");
const router = express.Router();

const vaultsApy = require("../services/vaults/apy/handler");
const vaultsPrice = require("../services/vaults/price/handler");
const vaultsTvl = require("../services/vaults/tvl/handler");
const vaultsCategory = require("../services/vaults/category/handler");
const vaultsHistoricalAPY = require("../services/vaults/apy/save/historical-handle");
const vaultAssetDistribution = require("../services/vaults/distribution/handler");
const vaultsPerformance = require("../services/vaults/performance/handler");

const performanceApy = require("../services/vaults/performance-apy/handler");
const allFarmers = require("../services/vaults/all/handler");

// Latest APY for each strategy
router.get("/apy", (req, res) => {
    try {
        vaultsApy.handler(res);
    } catch (err) {
        console.error(`Error while getting /apy`, err);
    }
});

// Consolidate Data for each strategy
router.get("/:network/all", (req, res) => {
    try {
        allFarmers.handler(req, res);
    } catch (err) {
        console.error(`Error while getting /network/all`, err);
    }
});

// Asset Distribution for each ETF-typed strategies
router.get("/:farmerId/distribution", (req, res) => {
    try {
        vaultAssetDistribution.handler(req, res);
    } catch (err) {
        console.error(`Error while getting /farmerId/distribution`, err);
    }
});

// Vault Category
router.get("/category", (req, res) => {
    try {
        vaultsCategory.getVaultCategory(req, res);
    } catch (err) {
        console.error(`Error while getting /category`, err);
    }
});

// Get Historical Price Per Full Share by day and strategy type
router.get("/price/:farmer/:days", (req, res) => {
    try {
        vaultsPrice.handleHistoricialPrice(req, res);
    } catch (err) {
        console.error(`Error while getting /price/farmer/days`, err);
    }
});

// Get Historical Price Per Full Share by day and network type
router.get("/price/:network/all/:days", (req, res) => {
    try {
        vaultsPrice.handleAllHistoricialPrice(req, res);
    } catch (err) {
        console.error(`Error while getting /price/network/all/:days`, err);
    }
});

// Get Historical Chart Data by strategy type
router.get("/performance-apy/:strategy/:days", (req, res) => {
    try {
        performanceApy.handler(req, res)
    } catch (err) {
        console.error(`Error while getting /performance-apy/strategy/days`, err);
    }
});

// Get Historical APY by strategy type and day
router.get("/historical-apy/:contractAddress/:days", (req, res) => {
    try {
        vaultsHistoricalAPY.handleHistoricialAPY(req, res);
    } catch (err) {
        console.error(`Error while getting /historical-apy/contractAddress/days`, err);
    }
});

// Get Historical APY by network type and day
router.get("/historical-apy/:network/all/:days", (req, res) => {
    try {
        vaultsHistoricalAPY.handleAllHistoricalAPY(req, res);
    } catch (err) {
        console.error(`Error while getting historical-apy/network/all/:days`, err);
    }
});

// Total TVL
router.get("/tvl/total", (req, res) => {
    try {
        vaultsTvl.totalHandle(req, res);
    } catch (err) {
        console.error(`Error while getting /tvl/total`, err);
    }
});

// TVL by strategy type
router.get("/tvl/:farmer", (req, res) => {
    try {
        vaultsTvl.tvlHandle(req, res);
    } catch (err) {
        console.error(`Error while getting /tvl/farmer`, err);
    }
});

// TVL amount for each strategy type
router.get("/tvl/find/all", (req, res) => {
    try {
        vaultsTvl.getAllTVLHandler(req, res);
    } catch (err) {
        console.error(`Error while getting /tvl/find/all`, err);
    }
});

// Performance for strategy
router.get("/performance/:farmer", (req, res) => {
    try {
        vaultsPerformance.performanceHandle(req, res);
    } catch (err) {
        console.error(`Error while getting /performance/farmer`, err);
    }
});

// Performance by strategy and days
router.get("/performance/:farmer/:days", (req, res) => {
    try {
        vaultsPerformance.performanceHandle(req, res);
    } catch (err) {
        console.error(`Error while getting /performance/farmer/days`, err);
    }
});

// PNL for strategy
router.get("/pnl/:farmer", (req, res) => {
    try {
        vaultsPerformance.pnlHandle(req, res);
    } catch (err) {
        console.error(`Error while getting /pnl/farmer`, err);
    }
});

// PNL by strategy and days
router.get("/pnl/:farmer/:days", (req, res) => {
    try {
        vaultsPerformance.pnlHandle(req, res);
    } catch (err) {
        console.error(`Error while getting /pnl/farmer/days`, err);
    }
});

module.exports = router;