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
    SLP: "smooth-love-potion",
    ILV: "illuvium",
    GHST: "aavegotchi",
    REVV: "revv",
    MVI: "metaverse-index",
    MMSFT: "mirrored-microsoft", // Remember to add this.
    MTWTR: "mirrored-twitter", // Remember to add this.
    BUNNY: "pancake-bunny",
    AUTO: "auto",
    EPS: "ellipsis",
    XVS: "venus",
    BNB: "binancecoin",
    XVS: "venus",
    CAKE: "pancakeswap-token",
    BUSD: "binance-usd",
    JOE: "joe",
    PNG: "pangolin",
    LYD: "lydia-finance",
    AVAX: "avalanche-2",
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

const DAOMVF_ASSET_DISTRIBUTION = {
    ETH: { percent: 37.5, tokenId: TOKEN_COINGECKO_ID.ETH },
    AXS: { percent: 10.0, tokenId: TOKEN_COINGECKO_ID.AXS },
    SLP: { percent: 7.5, tokenId: TOKEN_COINGECKO_ID.SLP},
    ILV: { percent: 10.0, tokenId: TOKEN_COINGECKO_ID.ILV},
    GHST: { percent: 5.0, tokenId: TOKEN_COINGECKO_ID.GHST},
    REVV: { percent: 5.0, tokenId: TOKEN_COINGECKO_ID.REVV},
    MVI: { percent: 25.0, tokenId: TOKEN_COINGECKO_ID.MVI},
}

const DAOCDV2_ASSET_DISTRIBUTION = {
    ETH: { percent: 35, tokenId: TOKEN_COINGECKO_ID.ETH }, 
    HBTC: { percent: 30, tokenId: TOKEN_COINGECKO_ID.HBTC },
    WBTC: { percent: 15, tokenId: TOKEN_COINGECKO_ID.WBTC }, 
    DPI: { percent: 15, tokenId: TOKEN_COINGECKO_ID.DPI }, 
    DAI: { percent: 5, tokenId: TOKEN_COINGECKO_ID.DAI },
};

const DAOSTO2_ASSET_DISTRIBUTION = {
    MMSFT: { percent: 14.3, tokenId: TOKEN_COINGECKO_ID.MMSFT },
    MTWTR: { percent: 14.3, tokenId: TOKEN_COINGECKO_ID.MTWTR},
    MTSLA: { percent: 14.3, tokenId: TOKEN_COINGECKO_ID.MTSLA },
    MGOOGL: { percent: 14.3, tokenId: TOKEN_COINGECKO_ID.MGOOGL },
    MAMZN: { percent: 14.3, tokenId: TOKEN_COINGECKO_ID.MAMZN },
    MAAPL: { percent: 14.3, tokenId: TOKEN_COINGECKO_ID.MAAPL },
    MNFLX: { percent: 14.3, tokenId: TOKEN_COINGECKO_ID.MNFLX},
};

const DAODEGEN_ASSET_DISTRIBUTION = {
    BUNNY: { percent: 25, tokenId: TOKEN_COINGECKO_ID.BUNNY},
    AUTO: { percent: 25, tokenId: TOKEN_COINGECKO_ID.AUTO},
    EPS: { percent: 25, tokenId: TOKEN_COINGECKO_ID.EPS},
    XVS: { percent: 25, tokenId: TOKEN_COINGECKO_ID.XVS}
};

const DAOSAFU_ASSET_DISTRIBUTION = {
    BTC: { percent: 45, tokenId: TOKEN_COINGECKO_ID.BTC },
    BNB: { percent: 35, tokenId: TOKEN_COINGECKO_ID.BNB },
    XVS: { percent: 7.5, tokenId: TOKEN_COINGECKO_ID.XVS },
    CAKE: { percent: 7.5, tokenId: TOKEN_COINGECKO_ID.CAKE},
    BUSD: { percent: 5, tokenId: TOKEN_COINGECKO_ID.BUSD}
};

const DAOTAS_ASSET_DISTRIBUTION = {
   BULLISH: {
        BTC: { percent: 50, tokenId: TOKEN_COINGECKO_ID.BTC },
        ETH: { percent: 50,  tokenId: TOKEN_COINGECKO_ID.ETH },
   },
   BEARISH: {
        USDC: { percent: 50, tokenId: TOKEN_COINGECKO_ID.USDC },
        ETH: { percent: 50,  tokenId: TOKEN_COINGECKO_ID.ETH },
   }
}

const DAOAXA_ASSET_DISTRIBUTION = {
    AVAX: { percent: 50, tokenId: TOKEN_COINGECKO_ID.AVAX },
    JOE: { percent: 22.5, tokenId: TOKEN_COINGECKO_ID.JOE },
    PNG: { percent: 22.5, tokenId: TOKEN_COINGECKO_ID.PNG },
    LYD: { percent: 5, tokenId: TOKEN_COINGECKO_ID.LYD },
};

const DAOAXS_ASSET_DISTRIBUTION = {
    JOE: { percent: 40, tokenId: TOKEN_COINGECKO_ID.JOE },
    PNG: { percent: 5, tokenId: TOKEN_COINGECKO_ID.PNG },
    LYD: { percent: 5, tokenId: TOKEN_COINGECKO_ID.LYD },
    USDT: { percent: 5, tokenId: TOKEN_COINGECKO_ID.USDT },
    USDC: { percent: 40, tokenId: TOKEN_COINGECKO_ID.USDC},
    DAI: { percent: 5, tokenId: TOKEN_COINGECKO_ID.DAI },
};

const DAOASA_ASSET_DISTRIBUTION = {
    AVAX: { percent: 50, tokenId: TOKEN_COINGECKO_ID.AVAX},
    DAI: { percent: 25, tokenId: TOKEN_COINGECKO_ID.DAI },
    USDC: { percent: 22.5, tokenId: TOKEN_COINGECKO_ID.USDC },
    USDT: { percent: 2.5, tokenId: TOKEN_COINGECKO_ID.USDT },
};

const DAOA2S_ASSET_DISTRIBUTION = {
    DAI: { percent: 33.33, tokenId: TOKEN_COINGECKO_ID.DAI },
    USDT: { percent: 33.33, tokenId: TOKEN_COINGECKO_ID.USDT },
    USDC: { percent: 33.33, tokenId: TOKEN_COINGECKO_ID.USDC },
};

const CONTRACT_IDS = {
    DAOCDV: "daoCDV",
    DAOELO: "daoELO",
    DAOCUB: "daoCUB",
    DAOSTO: "daoSTO", 
    DAOMPT: "daoMPT",
    DAOMVF: "daoMVF",
    DAOCDV2: "daoCDV2",
    DAOSTO2: "daoSTO2",
    DAODEGEN: "daoDEGEN",
    DAOSAFU: "daoSAFU",
    DAOTAS: "daoTAS",
    DAOAXA: "daoAXA",
    DAOAXS: "daoAXS",
    DAOASA: "daoASA",
    DAOA2S: "daoA2S"
}

const ETF_STRATEGIES = [
    CONTRACT_IDS.DAOSTO,
    CONTRACT_IDS.DAOCDV,
    CONTRACT_IDS.DAOCUB,
    CONTRACT_IDS.DAOELO,
    CONTRACT_IDS.DAOMPT,
    CONTRACT_IDS.DAOMVF,
    CONTRACT_IDS.DAOCDV2,
    CONTRACT_IDS.DAOSTO2,
    CONTRACT_IDS.DAODEGEN,
    CONTRACT_IDS.DAOSAFU,
    CONTRACT_IDS.DAOTAS,
    CONTRACT_IDS.DAOAXA,
    CONTRACT_IDS.DAOAXS,
    CONTRACT_IDS.DAOASA,
    CONTRACT_IDS.DAOA2S
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
    METAVERSE: "metaverse",
    CITADELV2: "citadelv2",
    DAOSTONKS: "daoStonks",
    DAODEGEN: "daoDegen",
    DAOSAFU: "daoSafu",
    TA: "daoTA",
    DAOAXA: "daoAXA",
    DAOAXS: "daoAXS",
    DAOASA: "daoASA",
    DAOA2S: "daoA2S",
}

module.exports = {
    // Network Category
    ETHEREUM: "ethereum",
    POLYGON: "polygon",
    BSC: "bsc",
    AVAX: "avalanche",

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
    DAOCDV2_ASSET_DISTRIBUTION,
    DAOSTO_ASSET_DISTRIBUTION,
    DAOCUB_ASSET_DISTRIBUTION,
    DAOELO_ASSET_DISTRIBUTION,
    DAOMPT_ASSET_DISTRIBUTION,
    DAOMVF_ASSET_DISTRIBUTION,
    DAOSTO2_ASSET_DISTRIBUTION,
    DAODEGEN_ASSET_DISTRIBUTION,
    DAOSAFU_ASSET_DISTRIBUTION,
    DAOTAS_ASSET_DISTRIBUTION,
    DAOAXA_ASSET_DISTRIBUTION,
    DAOAXS_ASSET_DISTRIBUTION,
    DAOASA_ASSET_DISTRIBUTION,
    DAOA2S_ASSET_DISTRIBUTION,
    
    TOKEN_COINGECKO_ID,
    ETF_STRATEGIES,
    STRATEGY_TYPE,

    TOKEN_CHART_COLOR,
    BACKUP_CHART_COLOR
}
