const db = require("../../models/stake-pool.model");
const fetch = require("node-fetch");
const delay = require("delay");
const _ = require("lodash");

const delayTime = 500;

const fetchContractABI = async (address) => {
    let network = '';
    if (process.env.PRODUCTION == null || process.env.PRODUCTION == "") {
        network = '-kovan';
    }
	const url = `https://api${network}.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`;
	const resp = await fetch(url).then((res) => res.json());
	const metadata = resp.result;
	await delay(delayTime);
	return metadata;
};

const getPoolInfo = async (pool) => {
    const abi = await fetchContractABI(pool.contract_address);
    delete pool._id;
    Object.assign(pool, {
        abi,
    });
    return pool;
}

module.exports.getPools = async (req, res) => {
    try {
        const pls = [];
        const pools = await db.findAll();
        const poolSize = _.size(pools);
        for (idx = 0; idx < poolSize; idx++) {
            const pool = await getPoolInfo(pools[idx]);
            pls.push(pool);
        }

        res.status(200).json({
            message: 'Successful Response',
            body: {
                pools: pls,
            }
        });
    } catch (err) {
        res.status(200).json({
            message: err.message,
            body: null
        });
    }

    return;
}