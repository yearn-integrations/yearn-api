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