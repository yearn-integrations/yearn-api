// Mainnet Contracts
db.vault_categories.insertMany([
    { name: 'expert', network:"ethereum", contract_address: '0x8fe826cc1225b03aa06477ad5af745aed5fe7066', symbol: 'daoCDV',deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''  },
    { name: 'degen', network:"ethereum", contract_address: '0x2d9a136cf87d599628bcbdfb6c4fe75acd2a0aa8', symbol: 'daoELO',deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''  },
    { name: 'degen', network:"ethereum", contract_address: '0x2ad9f8d4c24652ea9f8a954f7e1fdb50a3be1dfd', symbol: 'daoCUB' ,deposit: true, withdraw: true, depositMessage: '', withdrawMessage: '' },
    { name: 'advance', network:"ethereum", contract_address: '0x742a85daf742ca0213b06fdae449434e0448691e', symbol: 'daoSTO',deposit: true, withdraw: true, depositMessage: '', withdrawMessage: '' },
    { name: 'advance', network:"polygon", contract_address: '0x3db93e95c9881bc7d9f2c845ce12e97130ebf5f2', symbol: 'daoMPT',deposit: true, withdraw: true, depositMessage: '', withdrawMessage: '' },
    { name: 'basic', network:"ethereum", contract_address: '0x5b3ae8b672a753906b1592d44741f71fbd05ba8c', symbol: 'daoMVF', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'expert', network:"ethereum", contract_address: '0xcc6c417e991e810477b486d992faaca1b7440e76', symbol: 'daoCDV2', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"ethereum", contract_address: '0xd0b14644b0f91239075ed8a415769c4e20d37cf9', symbol: 'daoSTO2', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"avalanche", contract_address: '0xa4dcbe792f51e13fc0e6961bbec436a881e73194', symbol: 'daoAXA', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"avalanche", contract_address: '0x6fd8c0c6cafb7b99c47bbe332cae42b32017cd58', symbol: 'daoAXS', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"avalanche", contract_address: '0x8b8d29166729b31b482df6055eaddcb944d4a1d8', symbol: 'daoASA', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"avalanche", contract_address: '0xa236fa927dc61d9566faf62b29d287405c5e49fc', symbol: 'daoA2S', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'degen', network:"bsc", contract_address: '0x5e5d75c2d1eec055e8c824c6c4763b59d5c7f065', symbol: 'daoDEGEN' ,deposit: true, withdraw: true, depositMessage: '', withdrawMessage: '' }, // Update this later
    { name: 'advance', network:"bsc", contract_address: '0xb9e35635084b8b198f4bf4ee787d5949b46338f1', symbol: 'daoSAFU', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"ethereum", contract_address: '0xae6637a2e583295654989adcfb3221691bb490ef', symbol: 'daoTAS', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
]);


db.stake_pool.insertMany([
    {
        name: 'vipDVG',
        label: 'vipDVG LP',
        contract_address: '', // TODO: Update to mainnet address
        status: 'A',
        pid: '7',
        category: 'Basic',
        tokenId: 'xDVG', 
        symbol: 'xDVG',
        startBlock: 12770000,
        deposit: false,
        withdraw: true,
        emergencyWithdraw: true,
    },
    {
        name: 'ETH<->DVG',
        label: 'Uniswap DVG-ETH LP',
        contract_address: '', // TODO: Update to mainnet address
        status: 'A',
        pid: '8',
        category: 'Basic',
        tokenId: 'ethDVG',
        symbol: 'ethDVG',
        startBlock: 12770000,
        deposit: false,
        withdraw: true,
        emergencyWithdraw: true,
    },
    {
        name: 'daoCDV',
        label: 'DAO Citadel LP',
        contract_address: '0x8fe826cc1225b03aa06477ad5af745aed5fe7066',
        status: 'A',
        pid: '9',
        category: 'Expert',
        tokenId: 'ethereum',
        symbol: 'daoCDV',
        startBlock: 12770000,
        deposit: false,
        withdraw: true,
        emergencyWithdraw: true,
    },
    {
        name: "daoSTO",
        label: "DAO FAANG Stonk",
        contract_address: '0x742a85daf742ca0213b06fdae449434e0448691e',
        status: 'A',
        pid: '3',
        category: 'Advance',
        tokenId: 'tether',
        symbol: 'daoSTO',
        startBlock: 12770000,
        deposit: false,
        withdraw: true,
        emergencyWithdraw: true,
    }
]);

db.daomine_pool.insertMany([
    {
        name: 'vipDVD',
        label: 'vipDVD LP',
        contract_address: '0x4bb18f377a9d2dd62a6af7d78f6e7673e0e0f648', // TODO: Update to mainnet address
        status: 'A',
        pid: '0',
        category: 'Basic',
        tokenId: 'xDVD', 
        symbol: 'xDVD',
        startBlock: 26524610,
        deposit: true,
        withdraw: true,
        emergencyWithdraw: false,
        compound: true,
        harvest: true,
    },
]);

// Testnet Contracts
db.vault_categories.insertMany([
    { name: 'expert', network:"ethereum", contract_address: '0x626c25ca5b86277f395c0e40dbdf51f2a302ab43', symbol: 'daoCDV', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: '' },
    { name: 'degen', network:"ethereum", contract_address: '0xf03fa8553379d872b4e2bafbc679409fb82604c2', symbol: 'daoELO', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: '' }, 
    { name: 'degen', network:"ethereum", contract_address: '0x5c304a6cb105e1bff9805ca5cf072f1d2c3beac5', symbol: 'daoCUB', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: '' }, 
    { name: 'advance', network:"ethereum", contract_address: '0xd6af81e5288be43137debf969d7f2c03482c8cc1', symbol: 'daoSTO', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: '' },
    { name: 'advance', network:"ethereum", contract_address: '0x4f0bc6bd6beb231087781336bacd5613527ac63c', symbol: 'daoMPT', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'expert', network:"ethereum", contract_address: '0xb2953c89615069fa6c14f3db3a09b7ecc077f533', symbol: 'daoMVF', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'expert', network:"ethereum", contract_address: '0xc5719b5e85c30eb6a49d3c1b8058ae2435146c88', symbol: 'daoCDV2', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"ethereum", contract_address: '0xb8e43526d2fee347f88e690ee86d047895472d04', symbol: 'daoSTO2', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"avalanche", contract_address: '0x0b0e5b52e14152308f9f952ff19c67ebeb7560bb', symbol: 'daoAXA', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"avalanche", contract_address: '0xdf9fc6774937bf42602be1f80ab3da8a0b2a8594', symbol: 'daoAXS', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"avalanche", contract_address: '0x0d79f121fd1eb213e5dbde11edbe7744ecb51352', symbol: 'daoASA', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"avalanche", contract_address: '	0x89d6fd8ba3eaf76687cf7b3d10f914cc445eaec1', symbol: 'daoA2S', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'degen', network:"bsc", contract_address: '0x56f2005c3fec21dd3c21899fbceb1aae5b4bc5da', symbol: 'daoDEGEN' ,deposit: true, withdraw: true, depositMessage: '', withdrawMessage: '' },
    { name: 'basic', network:"bsc", contract_address: '0x81390703430015a751f967694d5ccb8745fda254', symbol: 'daoSAFU', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
    { name: 'advance', network:"ethereum", contract_address: '0xd0b14644b0f91239075ed8a415769c4e20d37cf9', symbol: 'daoSTO2', deposit: true, withdraw: true, depositMessage: '', withdrawMessage: ''},
]);

db.xdvg_token.insert({
    name: 'USDT',
    contract_address: '0x07de306FF27a2B630B1141956844eB1552B956B5'
});

db.stake_pool.insertMany([
    {
        name: 'vipDVG',
        label: 'vipDVG LP',
        contract_address: '0x3aa8e8b6d3562a1e7acb0dddd02b27896c00c424',
        status: 'A',
        pid: '7',
        category: 'Basic',
        tokenId: 'xDVG', 
        symbol: 'xDVG',
        startBlock: 25721857,
        deposit: false,
        withdraw: true,
        emergencyWithdraw: true,
    },
    {
        name: 'ETH<->DVG',
        label: 'Uniswap DVG-ETH LP',
        contract_address: '0x0a15e37442e2a41a3a51a9eff7fe1dce0e96f0bb',
        status: 'A',
        pid: '8',
        category: 'Basic',
        tokenId: 'ethDVG',
        symbol: 'ethDVG',
        startBlock: 25721857,
        deposit: false,
        withdraw: true,
        emergencyWithdraw: true,
    },
    {
        name: 'daoCDV',
        label: 'DAO Citadel LP',
        contract_address: '0x626c25ca5b86277f395c0e40dbdf51f2a302ab43',
        status: 'A',
        pid: '9',
        category: 'Expert',
        tokenId: 'ethereum',
        symbol: 'daoCDV',
        startBlock: 25721857,
        deposit: false,
        withdraw: true,
        emergencyWithdraw: true,
    },
    {
        name: "daoSTO",
        label: "DAO FAANG Stonk LP",
        contract_address: '0xd6af81e5288be43137debf969d7f2c03482c8cc1', 
        status: 'A',
        pid: '11',
        category: 'Advance',
        tokenId: 'tether',
        symbol: 'daoSTO',
        startBlock: 25721857,
        deposit: false,
        withdraw: true,
        emergencyWithdraw: true,
    },
]);

db.daomine_pool.insertMany([
    {
        name: 'vipDVD',
        label: 'vipDVD LP',
        contract_address: '0x4bb18f377a9d2dd62a6af7d78f6e7673e0e0f648',
        status: 'A',
        pid: '0',
        category: 'Basic',
        tokenId: 'xDVD', 
        symbol: 'xDVD',
        startBlock: 26524610,
        deposit: true,
        withdraw: true,
        emergencyWithdraw: false,
        compound: true,
        harvest: true,
    },
    {
        name: 'daoCDV',
        label: 'DAO Citadel LP',
        contract_address: '0x626c25ca5b86277f395c0e40dbdf51f2a302ab43',
        status: 'A',
        pid: '2',
        category: 'Expert',
        tokenId: 'ethereum', 
        symbol: 'daoCDV',
        startBlock: 26670259,
        deposit: true,
        withdraw: true,
        emergencyWithdraw: false,
        compound: true,
        harvest: true,
    },
    {
        name: 'daoSTO',
        label: 'DAO FAANG Stonk LP',
        contract_address: '0xd6af81e5288be43137debf969d7f2c03482c8cc1',
        status: 'A',
        pid: '3',
        category: 'Advance',
        tokenId: 'tether', 
        symbol: 'daoSTO',
        startBlock: 26670264,
        deposit: true,
        withdraw: true,
        emergencyWithdraw: false,
        compound: true,
        harvest: true,
    },
    {
        name: 'ETH<->DVD',
        label: 'Uniswap DVD-ETH LP',
        contract_address: '0xf8098e1a33e5445322171c0acf785bd35def54fa',
        status: 'A',
        pid: '4',
        category: 'Basic',
        tokenId: 'ethDVD', 
        symbol: 'ethDVD',
        startBlock: 26678186,
        deposit: true,
        withdraw: true,
        emergencyWithdraw: false,
        compound: true,
        harvest: true,
    },
]);


db.special_event.insertMany([
    { startTime: 1622390400000, endTime: 1622444400000, threshold: 3000 },
    { startTime: 1622538000000, endTime: 1622541600000, threshold: 5000 },
    { startTime: 1622538900000, endTime: 1622540400000, threshold: 7000 },
    { startTime: 1622542200000, endTime: 1622543400000, threshold: 6000 },
    { startTime: 1622606400000, endTime: 1622610000000, threshold: 3000 }
]);

db.tokens.insertMany([
    { tokenId: 'huobi-token', symbol: 'HBTC'},
    { tokenId: 'ethereum', symbol: 'ETH'},
    { tokenId: 'wrapped-bitcoin', symbol: 'WBTC'},
    { tokenId: 'defipulse-index', symbol: 'DPI'},
    { tokenId: 'dai', symbol: 'DAI'},
    { tokenId: 'mirrored-facebook', symbol: 'MFB'},
    { tokenId: 'mirrored-amazon', symbol: 'MAMZN'},
    { tokenId: 'mirrored-apple', symbol: 'MAAPL'},
    { tokenId: 'mirrored-netflix', symbol: 'MNFLX'},
    { tokenId: 'mirrored-google', symbol: 'MGOOGL'},
    { tokenId: 'terrausd', symbol: 'UST'},
    { tokenId: 'rendoge', symbol: 'RENDOGE'},
    { tokenId: 'matic-network', symbol: 'MATIC'},
    { tokenId: 'aave', symbol: 'AAVE'},
    { tokenId: 'sushi', symbol: 'SUSHI'},
    { tokenId: 'axie-infinity', symbol: 'AXS'},
    { tokenId: 'injective-protocol', symbol: 'INJ'},
    { tokenId: 'alchemix', symbol: 'ALCX'},
    { tokenId: 'mirrored-tesla', symbol: 'MTSLA'},
    { tokenId: 'bitcoin', symbol: 'BTC'},
    { tokenId: 'tether', symbol: 'USDT'},
    { tokenId: 'aave-dai', symbol: 'ADAI'},
    { tokenId: 'aave-usdc', symbol: 'AUSDC'},
    { tokenId: 'aave-usdt', symbol: 'AUSDT'},
    { tokenId: 'tether', symbol: 'USDT'},
    { tokenId: 'smooth-love-potion', symbol: 'SLP'},
    { tokenId: 'illuvium', symbol: 'ILV'},
    { tokenId: 'aavegotchi', symbol: 'GHST'},
    { tokenId: 'revv', symbol: 'REVV'},
    { tokenId: 'metaverse-index', symbol: 'MVI'},
    { tokenId: 'mirrored-microsoft', symbol: 'MMSFT'}, // TODO:Remember to add this for DaoStonks
    { tokenId: 'mirrored-twitter', symbol: 'MTWTR'}, // TODO:Remember to add this for DaoStonks
]);

db.airdrop.insertMany([
    {address: "", amount: "", signature: ""}
]);

db.airdrop_event.insertMany([
    {address: "0xbcf5cef54bca1b0591ee487bac567e7182bf8c7d", active: true}
]);

// script to update currencies property for each strategy
// testnet
db.vault_categories.updateMany(
	{ network: "ethereum" },
	{ $set: {
		currencies: [
			{ label: "USDT", address: "0x07de306ff27a2b630b1141956844eb1552b956b5", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 0 },
			{ label: "USDC", address: "0xb7a4f3e9097c08da09517b5ab877f7a917224ede", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 1 },
			{ label: "DAI", address: "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 2 },
		]
	}}
);

db.vault_categories.updateMany(
	{ network: "polygon" },
	{ $set: {
		currencies: [
			{ label: "USDT", address: "0xbd21a10f619be90d6066c941b04e340841f1f989", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 0 },
			{ label: "USDC", address: "0x2058a9d7613eee744279e3856ef0eada5fcbaa7e", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 1 },
			{ label: "DAI", address: "0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 2 },
		]
	}}
);

db.vault_categories.updateMany(
	{ network: "bsc" },
	{ $set: {
		currencies: [
			{ label: "USDT", address: "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 0 },
			{ label: "USDC", address: "0x64544969ed7ebf5f083679233325356ebe738930", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 1 },
			{ label: "DAI", address: "0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 2 },
		]
	}}
);

db.vault_categories.updateMany(
	{ network: "avalanche" },
	{ $set: {
		currencies: [
			{ label: "USDT", address: "0xE01A4D7de190f60F86b683661F67f79F134E0582", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 0 },
			{ label: "USDC", address: "0xA6cFCa9EB181728082D35419B58Ba7eE4c9c8d38", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 1 },
			{ label: "DAI", address: "0x3bc22AA42FF61fC2D01E87c2Fa4268D0334b1a4c", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 2 },
		]
	}}
);

// Mainnet
db.vault_categories.updateMany(
	{ network: "ethereum" },
	{ $set: {
		currencies: [
			{ label: "USDT", address: "0xdac17f958d2ee523a2206206994597c13d831ec7", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 0 },
			{ label: "USDC", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 1 },
			{ label: "DAI", address: "0x6b175474e89094c44da98b954eedeac495271d0f", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 2 },
		]
	}}
);

db.vault_categories.updateMany(
	{ network: "polygon" },
	{ $set: {
		currencies: [
			{ label: "USDT", address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 0 },
			{ label: "USDC", address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 1 },
			{ label: "DAI", address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 2 },
		]
	}}
);

db.vault_categories.updateMany(
	{ network: "bsc" },
	{ $set: {
		currencies: [
			{ label: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 0 },
			{ label: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 1 },
			{ label: "DAI", address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 2 },
		]
	}}
);

db.vault_categories.updateMany(
	{ network: "avalanche" },
	{ $set: {
		currencies: [
			{ label: "USDT", address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 0 },
			{ label: "USDC", address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 1 },
			{ label: "DAI", address: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70", enabledDeposit: true, enabledWithdraw: true, tokenIndex: 2 },
		]
	}}
);

db.stableCoins.insertMany([
    {
        "name": "Tether USD",
        "symbol": "USDT",
        "address": "0x07de306ff27a2b630b1141956844eb1552b956b5",
        "network": "kovan",
        "decimals": 6,
        "abi": [
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_upgradedAddress",
                        "type": "address"
                    }
                ],
                "name": "deprecate",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "deprecated",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_evilUser",
                        "type": "address"
                    }
                ],
                "name": "addBlackList",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "upgradedAddress",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "balances",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "maximumFee",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "_totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "unpause",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_maker",
                        "type": "address"
                    }
                ],
                "name": "getBlackListStatus",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "allowed",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "paused",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "who",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "pause",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "getOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "newBasisPoints",
                        "type": "uint256"
                    },
                    {
                        "name": "newMaxFee",
                        "type": "uint256"
                    }
                ],
                "name": "setParams",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "issue",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "redeem",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "name": "remaining",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "basisPointsRate",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "isBlackListed",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_clearedUser",
                        "type": "address"
                    }
                ],
                "name": "removeBlackList",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "MAX_UINT",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_blackListedUser",
                        "type": "address"
                    }
                ],
                "name": "destroyBlackFunds",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "name": "_initialSupply",
                        "type": "uint256"
                    },
                    {
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "name": "_symbol",
                        "type": "string"
                    },
                    {
                        "name": "_decimals",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "Issue",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "Redeem",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "newAddress",
                        "type": "address"
                    }
                ],
                "name": "Deprecate",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "feeBasisPoints",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "maxFee",
                        "type": "uint256"
                    }
                ],
                "name": "Params",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "_blackListedUser",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "_balance",
                        "type": "uint256"
                    }
                ],
                "name": "DestroyedBlackFunds",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "_user",
                        "type": "address"
                    }
                ],
                "name": "AddedBlackList",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "_user",
                        "type": "address"
                    }
                ],
                "name": "RemovedBlackList",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "Pause",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "Unpause",
                "type": "event"
            }
        ]
    },
    {
        "name": "USD Coin",
        "symbol": "USDC",
        "address": "0xb7a4f3e9097c08da09517b5ab877f7a917224ede",
        "network": "kovan",
        "decimals": 6,
        "abi": [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_initialAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_tokenName",
                        "type": "string"
                    },
                    {
                        "internalType": "uint8",
                        "name": "_decimalUnits",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "_tokenSymbol",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "allocateTo",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "dst",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "src",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "dst",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    },
    {
        "name": "Dai Stablecoin",
        "symbol": "DAI",
        "address": "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
        "network": "kovan",
        "decimals": 18,
        "abi": [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "chainId_",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "src",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "guy",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": true,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "bytes4",
                        "name": "sig",
                        "type": "bytes4"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "usr",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "arg1",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "arg2",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "LogNote",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "src",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "dst",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "DOMAIN_SEPARATOR",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "PERMIT_TYPEHASH",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "usr",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "usr",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "burn",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "guy",
                        "type": "address"
                    }
                ],
                "name": "deny",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "usr",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "mint",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "src",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "dst",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "move",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "nonces",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "holder",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiry",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "allowed",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint8",
                        "name": "v",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "r",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "s",
                        "type": "bytes32"
                    }
                ],
                "name": "permit",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "usr",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "pull",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "usr",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "push",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "guy",
                        "type": "address"
                    }
                ],
                "name": "rely",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "dst",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "src",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "dst",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wad",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "version",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "wards",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ]
    }
]);

db.strategies.insertMany([
    {
        "name": "DAO Metaverse",
        "symbol": "daoMVF",
        "vaultAddress": "0xcBb69E3621ce4EB0d99B60f0E0430dCD5f52fC95",
        "decimals": 18,
        "feeDecimals": 18,
        "address": "0xf4655e971cc76b6daa78b4615dc2be4446e67e53",
        "abi": [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "currentWatermark",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "lastWatermark",
                        "type": "uint256"
                    }
                ],
                "name": "AdjustWatermark",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "currentWatermark",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "lastWatermark",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "fee",
                        "type": "uint256"
                    }
                ],
                "name": "CollectProfitAndUpdateWatermark",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "AXSETHCurrentPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "SLPETHCurrentPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "ILVETHCurrentPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "GHSTETHCurrentPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "REVVETHCurrentPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "MVICurrentPool",
                        "type": "uint256"
                    }
                ],
                "name": "CurrentComposition",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "EmergencyWithdraw",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "AXSETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "InvestAXSETH",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "GHSTAmt",
                        "type": "uint256"
                    }
                ],
                "name": "InvestGHSTETH",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "ILVETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "InvestILVETH",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "MVIAmt",
                        "type": "uint256"
                    }
                ],
                "name": "InvestMVI",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "REVVETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "InvestREVVETH",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "SLPETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "InvestSLPETH",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "Reimburse",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "AXSETHTargetPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "SLPETHTargetPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "ILVETHTargetPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "GHSTETHTargetPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "REVVETHTargetPool",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "MVITargetPool",
                        "type": "uint256"
                    }
                ],
                "name": "TargetComposition",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "Withdraw",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "lpTokenAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "WithdrawAXSETH",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "GHSTAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "WithdrawGHSTETH",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "lpTokenAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "WithdrawILVETH",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "lpTokenAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "WithdrawMVI",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "lpTokenAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "WithdrawREVVETH",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "lpTokenAmt",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "WithdrawSLPETH",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "AXSETHVault",
                "outputs": [
                    {
                        "internalType": "contract IDaoL1Vault",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "GHSTETHVault",
                "outputs": [
                    {
                        "internalType": "contract IDaoL1VaultUniV3",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "ILVETHVault",
                "outputs": [
                    {
                        "internalType": "contract IDaoL1Vault",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "SLPETHVault",
                "outputs": [
                    {
                        "internalType": "contract IDaoL1Vault",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "signs",
                        "type": "bool"
                    }
                ],
                "name": "adjustWatermark",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "admin",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "collectProfitAndUpdateWatermark",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "fee",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "communityWallet",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "emergencyWithdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bool",
                        "name": "includeVestedILV",
                        "type": "bool"
                    }
                ],
                "name": "getAllPool",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getCurrentCompositionPerc",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "percentages",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_AXSETHVault",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_SLPETHVault",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_ILVETHVault",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_GHSTETHVault",
                        "type": "address"
                    }
                ],
                "name": "initialize",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "name": "invest",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "profitFeePerc",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "farmIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "reimburse",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "renounceOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_profitFeePerc",
                        "type": "uint256"
                    }
                ],
                "name": "setProfitFeePerc",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_vault",
                        "type": "address"
                    }
                ],
                "name": "setVault",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "strategist",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "treasuryWallet",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "vault",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "watermark",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "withdraw",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "WETHAmt",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ],
        "risk": "Expert",
        "type": "metaverse",
        "infoLink": "https://daoventures.gitbook.io/daoventures/products/strategies/dao-citadel-vault",
        "strategyName": "DAO Metaverse: USDT USDC DAI",
        "info": "Ride the growth of NFT and gamefi ecosystems.",
        "description": "Investors can gain exposure to the booming NFT and gaming sector with this product that invests in the most successful metaverse tokens.",
        "priceId": "daoMVF_price",
        "isPopularItem": true,
        "happyHourEnabled": true,
        "performanceId": "daoMVF",
        "logoFormat": "png",
        "group": "Expert",
        "tvlKey": "daoMVF_tvl",
        "network": "kovan",
        "coinsAccepted": "USDT/USDC/DAI",
        "erc20addresses": [
            "0x07de306ff27a2b630b1141956844eb1552b956b5",
            "0xb7a4f3e9097c08da09517b5ab877f7a917224ede",
            "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa"
        ],
        "tokens": ["USDT", "USDC", "DAI"],
        "vaultInfo": {
            "name": "DAO L2 Metaverse-Farmer",
            "address": "0xcBb69E3621ce4EB0d99B60f0E0430dCD5f52fC95",
            "symbol": "daoMVF",
            "abi": [
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "value",
                            "type": "uint256"
                        }
                    ],
                    "name": "Approval",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "caller",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "depositAmt",
                            "type": "uint256"
                        }
                    ],
                    "name": "Deposit",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "shareMint",
                            "type": "uint256"
                        }
                    ],
                    "name": "DistributeLPToken",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "Invest",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Paused",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "farmIndex",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "Reimburse",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "Reinvest",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "admin",
                            "type": "address"
                        }
                    ],
                    "name": "SetAdminWallet",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "biconomy",
                            "type": "address"
                        }
                    ],
                    "name": "SetBiconomy",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "communityWallet",
                            "type": "address"
                        }
                    ],
                    "name": "SetCommunityWallet",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "oldCustomNetworkFeePerc",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "newCustomNetworkFeePerc",
                            "type": "uint256"
                        }
                    ],
                    "name": "SetCustomNetworkFeePerc",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "oldCustomNetworkFeeTier",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "newCustomNetworkFeeTier",
                            "type": "uint256"
                        }
                    ],
                    "name": "SetCustomNetworkFeeTier",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256[]",
                            "name": "oldNetworkFeePerc",
                            "type": "uint256[]"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256[]",
                            "name": "newNetworkFeePerc",
                            "type": "uint256[]"
                        }
                    ],
                    "name": "SetNetworkFeePerc",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256[]",
                            "name": "oldNetworkFeeTier2",
                            "type": "uint256[]"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256[]",
                            "name": "newNetworkFeeTier2",
                            "type": "uint256[]"
                        }
                    ],
                    "name": "SetNetworkFeeTier2",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "profitFeePerc",
                            "type": "uint256"
                        }
                    ],
                    "name": "SetProfitFeePerc",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "strategistWallet",
                            "type": "address"
                        }
                    ],
                    "name": "SetStrategistWallet",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "treasuryWallet",
                            "type": "address"
                        }
                    ],
                    "name": "SetTreasuryWallet",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "value",
                            "type": "uint256"
                        }
                    ],
                    "name": "Transfer",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "fees",
                            "type": "uint256"
                        }
                    ],
                    "name": "TransferredOutFees",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Unpaused",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "caller",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "withdrawAmt",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "tokenWithdraw",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "sharesBurn",
                            "type": "uint256"
                        }
                    ],
                    "name": "Withdraw",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "admin",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        }
                    ],
                    "name": "allowance",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "approve",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "balanceOf",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "collectProfitAndUpdateWatermark",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "communityWallet",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "customNetworkFeePerc",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "customNetworkFeeTier",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "decimals",
                    "outputs": [
                        {
                            "internalType": "uint8",
                            "name": "",
                            "type": "uint8"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "subtractedValue",
                            "type": "uint256"
                        }
                    ],
                    "name": "decreaseAllowance",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "contract IERC20Upgradeable",
                            "name": "token",
                            "type": "address"
                        }
                    ],
                    "name": "deposit",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "depositAmt",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "emergencyWithdraw",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "fees",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bool",
                            "name": "includeVestedILV",
                            "type": "bool"
                        }
                    ],
                    "name": "getAllPool",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getAllPoolInUSD",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getPricePerFullShare",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "addedValue",
                            "type": "uint256"
                        }
                    ],
                    "name": "increaseAllowance",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "ticker",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "_treasuryWallet",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_communityWallet",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_admin",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_strategist",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_biconomy",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_strategy",
                            "type": "address"
                        }
                    ],
                    "name": "initialize",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "invest",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "forwarder",
                            "type": "address"
                        }
                    ],
                    "name": "isTrustedForwarder",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "name",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "networkFeePerc",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "networkFeeTier2",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "paused",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "percKeepInVault",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "farmIndex",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "reimburse",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "reinvest",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_admin",
                            "type": "address"
                        }
                    ],
                    "name": "setAdmin",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_biconomy",
                            "type": "address"
                        }
                    ],
                    "name": "setBiconomy",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_communityWallet",
                            "type": "address"
                        }
                    ],
                    "name": "setCommunityWallet",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_percentage",
                            "type": "uint256"
                        }
                    ],
                    "name": "setCustomNetworkFeePerc",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_customNetworkFeeTier",
                            "type": "uint256"
                        }
                    ],
                    "name": "setCustomNetworkFeeTier",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "_networkFeePerc",
                            "type": "uint256[]"
                        }
                    ],
                    "name": "setNetworkFeePerc",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "_networkFeeTier2",
                            "type": "uint256[]"
                        }
                    ],
                    "name": "setNetworkFeeTier2",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "profitFeePerc",
                            "type": "uint256"
                        }
                    ],
                    "name": "setProfitFeePerc",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_strategist",
                            "type": "address"
                        }
                    ],
                    "name": "setStrategist",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_treasuryWallet",
                            "type": "address"
                        }
                    ],
                    "name": "setTreasuryWallet",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "strategist",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "strategy",
                    "outputs": [
                        {
                            "internalType": "contract IStrategy",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "symbol",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "totalSupply",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "recipient",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "transfer",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "recipient",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "transferFrom",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "transferOutFees",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "USDTAmt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "USDCAmt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "DAIAmt",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "treasuryWallet",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "trustedForwarder",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "versionRecipient",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "pure",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "share",
                            "type": "uint256"
                        },
                        {
                            "internalType": "contract IERC20Upgradeable",
                            "name": "token",
                            "type": "address"
                        }
                    ],
                    "name": "withdraw",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        }
    }
])
