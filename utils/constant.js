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
    USDT: "tether",
    USDC: "usd-coin",
    DAI: "dai",
    ADAI: "aave-dai",
    AUSDC: "aave-usdc",
    AUSDT: "aave-usdt",
}

const TOKEN_CHART_COLOR = {
    BTC: "#F7931A",
    ETH: "#D7DBEC",
    USDT: "#26A17B",
    USDC: "#2775CA",
    DAI: "#F8BD60",
    TUSD: "#2B2E7F",
    MATIC: "#8247E5",
    DOGE: "#C25E33",
    BNB: "#F3DF2F",
}

const BACKUP_CHART_COLOR = [
    "#07F2C3",
    "#4BDFFF",
    "#07F249",
    "#C3F207",
    "#F20707",
    "#F24E07",
    "#F22307",
    "#F207A2",
    "#C307F2",
    "#6007F2"
];

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

const DAOMPT_ASSET_DISTRIBUTION = {
    USDC: { percent: 33.33, tokenId: TOKEN_COINGECKO_ID.USDC },
    USDT: { percent: 16.665, tokenId: TOKEN_COINGECKO_ID.USDT },
    DAI: { percent: 16.665, tokenId: TOKEN_COINGECKO_ID.DAI},
    ADAI: { percent: 11.11, tokenId: TOKEN_COINGECKO_ID.ADAI},
    AUSDC: { percent: 11.11, tokenId: TOKEN_COINGECKO_ID.AUSDC},
    AUSDT: { percent: 11.11, tokenId: TOKEN_COINGECKO_ID.AUSDT}, 
}

const CONTRACT_IDS = {
    DAOCDV: "daoCDV",
    DAOELO: "daoELO",
    DAOCUB: "daoCUB",
    DAOSTO: "daoSTO", 
    DAOMPT: "daoMPT"
}

const ETF_STRATEGIES = [
    CONTRACT_IDS.DAOSTO,
    CONTRACT_IDS.DAOCDV,
    CONTRACT_IDS.DAOCUB,
    CONTRACT_IDS.DAOELO,
    CONTRACT_IDS.DAOMPT,
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
    DAOMPT_ASSET_DISTRIBUTION,
    
    TOKEN_COINGECKO_ID,
    ETF_STRATEGIES,
    STRATEGY_TYPE,

    TOKEN_CHART_COLOR,
    BACKUP_CHART_COLOR
}
