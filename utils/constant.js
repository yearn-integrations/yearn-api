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
    BTC: "bitcoin",
}

const DAOCDV_ASSET_DISTRIBUTION = {
    ETH: { percent: 35, tokenId: TOKEN_COINGECKO_ID.ETH }, 
    HBTC: { percent: 30, tokenId: TOKEN_COINGECKO_ID.HBTC },
    WBTC: { percent: 15, tokenId: TOKEN_COINGECKO_ID.WBTC }, 
    DPI: { percent: 15, tokenId: TOKEN_COINGECKO_ID.DPI }, 
    DAI: { percent: 5, tokenId: TOKEN_COINGECKO_ID.DAI },
};

const DAOSTO_ASSET_DISTRIBUTION = {
    UST: { percent: 50, tokenId: TOKEN_COINGECKO_ID.UST },
    MAAPL: { percent: 15, tokenId: TOKEN_COINGECKO_ID.MAAPL },
    MGOOGL: { percent: 12.5, tokenId: TOKEN_COINGECKO_ID.MGOOGL },
    MAMZN: { percent: 12.5, tokenId: TOKEN_COINGECKO_ID.MAMZN },
    MFB: { percent: 7.5, tokenId: TOKEN_COINGECKO_ID.MFB},
    MNFLX: { percent: 2.5, tokenId: TOKEN_COINGECKO_ID.MNFLX},
};

const DAOCUB_ASSET_DISTRIBUTION = {
    RENDOGE: { percent: 15, tokenId: TOKEN_COINGECKO_ID.RENDOGE },
    MATIC: { percent: 15, tokenId: TOKEN_COINGECKO_ID.MATIC },
    AAVE: { percent: 14, tokenId: TOKEN_COINGECKO_ID.AAVE },
    SUSHI: { percent: 14, tokenId: TOKEN_COINGECKO_ID.SUSHI },
    AXS: { percent: 14, tokenId: TOKEN_COINGECKO_ID.AXS},
    INJ: { percent: 14, tokenId: TOKEN_COINGECKO_ID.INJ},
    ALCX: { percent: 14, tokenId: TOKEN_COINGECKO_ID.ALCX},
};

const DAOELO_ASSET_DISTRIBUTION = {
    MTSLA: { percent: 33.33, tokenId: TOKEN_COINGECKO_ID.MTSLA },
    WBTC: { percent: 33.33, tokenId: TOKEN_COINGECKO_ID.WBTC },
    RENDOGE: { percent: 33.33, tokenId: TOKEN_COINGECKO_ID.RENDOGE},
}

const CONTRACT_IDS = {
    DAOCDV: "daoCDV",
    DAOELO: "daoELO",
    DAOCUB: "daoCUB",
    DAOSTO: "daoSTO", 
}

const ETF_STRATEGIES = [
    CONTRACT_IDS.DAOSTO,
    CONTRACT_IDS.DAOCDV,
    // CONTRACT_IDS.DAOCUB,
    // CONTRACT_IDS.DAOELO
];

const STRATEGY_TYPE = {
    YEARN: "yearn",
    COMPOUND: "compound",
    CITADEL: "citadel",
    ELON: "elon",
    CUBAN: "cuban",
    FAANG: "daoFaang",
    HARVEST: "harvest",
    MONEYPRINTER: "moneyPrinter",
}

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

    // Strategy ID
    // DAOCDV: "daoCDV",
    // DAOELO: "daoELO",
    // DAOCUB: "daoCUB",
    // DAOSTO: "daoSTO",

    DAOCDV_ASSET_DISTRIBUTION,
    DAOSTO_ASSET_DISTRIBUTION,
    DAOCUB_ASSET_DISTRIBUTION,
    DAOELO_ASSET_DISTRIBUTION,
    TOKEN_COINGECKO_ID,
    ETF_STRATEGIES,
    STRATEGY_TYPE
}
