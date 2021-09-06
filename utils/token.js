const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

module.exports.getTokenPriceInUSD = async(tokenId) => {
    try {
        if(tokenId  === "") {
            throw(`Missing token ID.`);
        }
        const data = await this.findTokenPrice(tokenId, "usd");
        return data[tokenId]["usd"];
    } catch (err) {
        console.error(`Error in findTokenPrice(): `, err);
    }
}

module.exports.getTokenHistoricalPriceInUSD = async(tokenId, date) => {
    try {
        if(!tokenId || tokenId === undefined) {
            throw(`Missing token ID`);
        }
        if(!date || date === undefined) {
            throw(`Missing Date`);
        }
        const data = await CoinGeckoClient.coins.fetchHistory(tokenId, {date: date});
      
        return (Object.keys(data.data).length !== 0) 
            ? data.data["market_data"]["current_price"]["usd"]
            : 1;
    } catch(err) {
        console.error(`Error in getTokenHistoricalPriceInUSD(), ${tokenId}: `, err);
    }
}

module.exports.findTokenPrice = async(tokenIds, currencies) => {
    try {
        if( !tokenIds || 
            !currencies || 
            tokenIds === undefined || 
            currencies === undefined
        ) {
            throw(`Missing token ids / currencies`); 
        }

        let tokens = Array.isArray(tokenIds)
            ? tokenIds
            : [tokenIds];

        let vsCurrencies = Array.isArray(tokenIds) 
            ?  currencies
            : [currencies];

        const data = await CoinGeckoClient.simple.price({
            ids: tokens,
            vs_currencies: vsCurrencies
        });

        return data.data;
    } catch (err) {
        console.error(`Error in findTokenPrice(): `, err);
    }
}
