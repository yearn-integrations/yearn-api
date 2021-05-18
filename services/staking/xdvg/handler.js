const db = require("../../../models/xdvg-token.model");
const fetch = require("node-fetch");
const delay = require("delay");
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

module.exports.getVipDVGToken = async (req, res) => {
    try {
        const token = await db.find();
        let abi;
        if (token) {
            abi = await fetchContractABI(token.contract_address);
        }
    
        delete token._id;
        Object.assign(token, {
            abi,
        });
    
        res.status(200).json({
            message: 'Successful Response',
            body: {
                token,
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