require("dotenv").config();
const AWS = require("aws-sdk");
// const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const db = require('../../../models/vault.model');
const _ = require("lodash");
const fetch = require("node-fetch");
const Web3 = require("web3");
const web3 = new Web3(process.env.MAIN_WEB3_ENDPOINT);
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const yRegistryAbi = require("./abis/yRegistry");
const yRegistryAddress = "0x3ee41c098f9666ed2ea246f4d2558010e59d63a0";
const delay = require("delay");
const delayTime = 500;

const tokenSymbolAliases = {
	"yDAI+yUSDC+yUSDT+yTUSD": "yCRV",
	crvRenWSBTC: "crvBTC",
	"yDAI+yUSDC+yUSDT+yBUSD": "crvBUSD",
};

const symbolAliases = {
	"yyDAI+yUSDC+yUSDT+yTUSD": "yUSD",
};

const vaultAliases = {
	"0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c": "yUSD Vault",
};

const vaultIcons = {
	"yDAI+yUSDC+yUSDT+yTUSD":
		"https://assets.coingecko.com/coins/images/12210/large/yUSD.png?1600166557",
};

const fetchContractMetadata = async (address) => {
	const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${etherscanApiKey}`;
	const resp = await fetch(url).then((res) => res.json());
	const metadata = resp.result[0];
	await delay(delayTime);
	return metadata;
};

const fetchContractName = async (address) => {
	const metadata = await fetchContractMetadata(address);
	const contractName = metadata.ContractName;
	return contractName;
};

const fetchAbi = async (address) => {
	const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${etherscanApiKey}`;
	const resp = await fetch(url).then((res) => res.json());
	const abi = JSON.parse(resp.result);
	await delay(delayTime);
	return abi;
};

const getContract = async (address) => {
	const abi = await fetchAbi(address);
	const contract = new web3.eth.Contract(abi, address);
	await delay(delayTime);
	return contract;
};

const callContractMethod = async (contract, method) => {
	try {
		const result = await contract.methods[method]().call();
		await delay(delayTime);
		return result;
	} catch (err) {
		console.log("err", method);
	}
};

const saveVault = async (vault) => {
	await db.add(vault).catch((err) => console.log('err', err));
	console.log(`Saved ${vault.name}`);
};

module.exports.handler = async () => {
	const registryContract = new web3.eth.Contract(
		yRegistryAbi,
		yRegistryAddress
	);
	const vaultAddresses = await registryContract.methods.getVaults().call();
	await delay(delayTime);

	const vaultInfo = await registryContract.methods.getVaultsInfo().call();
	await delay(delayTime);

	const getVault = async (vaultAddress, idx) => {
		try {
			const controllerAddress = vaultInfo.controllerArray[idx];
			const strategyAddress = vaultInfo.strategyArray[idx];
			const vaultContract = await getContract(vaultAddress);
			const controllerContract = await getContract(controllerAddress);
			const strategyContract = await getContract(strategyAddress);
			const vaultName = await callContractMethod(vaultContract, "name");
			const vaultSymbol = await callContractMethod(vaultContract, "symbol");
			const tokenSymbol = vaultSymbol.substring(1);
			const tokenAddress = vaultInfo.tokenArray[idx];
			const tokenName = vaultName.substring(6);
			const decimals = parseInt(
				await callContractMethod(vaultContract, "decimals"),
				10
			);

			const tokenInfo = await fetch(
				`https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`
			).then((res) => res.json());
			
			if (tokenInfo) {
				const tokenSymbolAlias = tokenSymbolAliases[tokenSymbol] || tokenSymbol;
				const symbolAlias = symbolAliases[vaultSymbol] || `y${tokenSymbolAlias}`;
				const vaultAlias =
					vaultAliases[vaultAddress] || `${tokenSymbolAlias} Vault`;
				const tokenIcon = tokenInfo.image ? tokenInfo.image.large : '';
				const vaultIcon = vaultIcons[tokenSymbol];
				const vault = {
					address: vaultAddress,
					name: vaultName,
					vaultAlias,
					vaultIcon,
					symbol: vaultSymbol,
					symbolAlias,
					controllerAddress: controllerAddress,
					controllerName: await fetchContractName(controllerAddress),
					strategyAddress: strategyAddress,
					strategyName: await fetchContractName(strategyAddress),
					tokenAddress: tokenAddress,
					tokenName: tokenName,
					tokenSymbol: tokenSymbol,
					tokenSymbolAlias,
					tokenIcon: tokenIcon,
					decimals: decimals,
					wrapped: vaultInfo.isWrappedArray[idx],
					delegated: vaultInfo.isDelegatedArray[idx],
					timestamp: Date.now(),
				};
				await saveVault(vault);
				return vault;
			}
		} catch (err) {}

		return;
	};

	const vaults = [];
	let idx = 0;
	const nbrVaults = _.size(vaultAddresses);
	for (idx = 0; idx < nbrVaults; idx++) {
		const vaultAddress = vaultAddresses[idx];
		const vault = await getVault(vaultAddress, idx);
		vaults.push(vault);
	}
};
