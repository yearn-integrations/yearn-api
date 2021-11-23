const stableCoinsModels =  require('../../../models/stable-coins');
const strategiesModels = require('../../../models/strategies');


const getStableCoins = async (req, res) => {
    try {

        const {network} = req.query;

        let coins = await stableCoinsModels.findByNetwork(network);

        res.send({
            data: coins
        });

    } catch (Err) {
        console.log(Err);
        res.status(500).send('Internal Server Error')
    }
}

const getStrategies = async (req, res) => {
    try {

        const {network} = req.query;

        let strategyList = await strategiesModels.findByNetwork(network);

        res.send({
            data: strategyList
        });

    } catch (Err) {
        console.log(Err);
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    getStableCoins,
    getStrategies
}