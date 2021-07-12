const db = require("../../models/stake-pool.model");
const snapshot = require("../../models/emergency-withdraw.model");
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

module.exports.savePoolInfo = async () => {
    try {
        const pools = await db.findAll();
        const poolSize = _.size(pools);
        for (idx = 0; idx < poolSize; idx++) {
            if (pools[idx].status === 'A') {
                const pool = await getPoolInfo(pools[idx]);
                db.add(pool);
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.getPools = async (req, res) => {
    try {
        const pls = [];
        const pools = await db.findAll();
        const poolSize = _.size(pools);
        for (idx = 0; idx < poolSize; idx++) {
            if (pools[idx].status === 'A') {
                delete pools[idx]._id;
                pls.push(pools[idx]);
            }
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

module.exports.snapshotEmergency = async (req, res) => {
    try {
        const pools = await db.findAll();
        const poolSize = _.size(pools);
        let exist = false;
        for (idx = 0; idx < poolSize; idx++) {
            if (pools[idx].pid === req.body.pid) {
                exist = true;
            }
        }

        if (exist) {
            const prev = await snapshot.findOne({
                pid: req.body.pid,
                userAddress: req.body.userAddress.toLowerCase(),
            });

            if (prev == null && req.body.pendingDVG > 0) {
                await snapshot.add({
                    pid: req.body.pid,
                    userAddress: req.body.userAddress.toLowerCase(),
                    pendingDVG: req.body.pendingDVG,
                });
            }
            
            res.status(200).json({
                message: 'Successful Response',
                body: {}
            });
        }
    } catch (err) {
        res.status(200).json({
            message: err.message,
            body: null
        })
    }

    return;
}