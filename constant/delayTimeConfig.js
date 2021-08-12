const jobDelayTime = {
    saveHistoricalApy: 3 * 60 * 1000, // 3 mins in milliseconds
    savePricePerFullShare: 5 * 60 * 1000, // 5 mins in milliseconds
    saveHistoricalTVL: 7 * 60 * 1000, // 7 mins
    saveVaultApy: 15 * 60 * 1000, // 15 mins
    saveABIPools: 18 * 60 * 1000, // 18 mins
    savePolygonVaultAPY: 5 * 60 * 1000, // 5 mins
}

module.exports = {
    jobDelayTime
}