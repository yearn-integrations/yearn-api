const TOKEN_COINGECKO_ID = {
    HBTC: "huobi-token",
    ETH: "ethereum",
    WBTC: "wrapped-bitcoin",
    DPI: "defipulse-index",
    DAI: "dai",
    MFB: "mirrored-facebook",
    MAMZN: "mirrored-amazon",
    MAAPL: "mirrored-apple",
    MNFLX: "mirrored-netflix",
    MGOOGL: "mirrored-google",
    UST: "terrausd",
    RENDOGE: "rendoge",
    MATIC: "matic-network",
    AAVE: "aave",
    SUSHI: "sushi",
    AXS: "axie-infinity",
    INJ: "injective-protocol",
    ALCX: "alchemix",
    MTSLA: "mirrored-tesla",
}

const DAOCDV_ASSET_DISTRIBUTION = {
    HBTC: { percent: 30, tokenId: TOKEN_COINGECKO_ID.HBTC },
    ETH: { percent: 35, tokenId: TOKEN_COINGECKO_ID.ETH }, 
    WBTC: { percent: 15, tokenId: TOKEN_COINGECKO_ID.WBTC }, 
    DPI: { percent: 15, tokenId: TOKEN_COINGECKO_ID.DPI }, 
    DAI: { percent: 5, tokenId: TOKEN_COINGECKO_ID.DAI },
};

const ETF_STRATEGIES = [
    "daoSTO",
    "daoCDV"
];

module.exports = {
    // Network Category
    ETHEREUM: "ethereum",
    POLYGON: "polygon",

    // Tokens
    ETH: "ETH",
    USDT: "USDT",
    USDC: "USDC",
    DAI: "DAI",
    TUSD: "TUSD",

    // Currency
    USD: "USD",

    DAOCDV_ASSET_DISTRIBUTION,
    TOKEN_COINGECKO_ID,
    ETF_STRATEGIES
}
