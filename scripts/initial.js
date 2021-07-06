// Mainnet Contracts
db.vault_categories.insertMany([
    { name: 'advance', contract_address: '0x4F0C1c9bA6B9CCd0BEd6166e86b672ac8EE621F7', symbol: 'yUSDT' },
    { name: 'advance', contract_address: '0x9f0230FbDC0379E5FefAcca89bE03A42Fec5fb6E', symbol: 'yUSDC' },
    { name: 'advance', contract_address: '0x2bFc2Da293C911e5FfeC4D2A2946A599Bc4Ae770', symbol: 'yDAI' },
    { name: 'advance', contract_address: '0x2C8de02aD4312069355B94Fb936EFE6CFE0C8FF6', symbol: 'yTUSD' },
    { name: 'basic', contract_address: '0xEeCe6AD323a93d4B021BDAaC587DCC04b5cf0a78', symbol: 'cUSDT' },
    { name: 'basic', contract_address: '0xd1D7f950899C0269a7F2aad5E854cdc3a1350ba9', symbol: 'cUSDC', },
    { name: 'basic', contract_address: '0x43C20638C3914Eca3c96e9cAc8ebE7d652Be45c6', symbol: 'cDAI', },
    { name: 'expert', contract_address: '0x8fe826cc1225b03aa06477ad5af745aed5fe7066', symbol: 'daoCDV', },
    { name: 'degen', contract_address: '0x2d9a136cf87d599628bcbdfb6c4fe75acd2a0aa8', symbol: 'daoELO', },
    { name: 'advance', contract_address: '0x742a85daf742ca0213b06fdae449434e0448691e', symbol: 'daoSTO', },
    // TODO: add in mainnet contract addresss
    // { name: 'basic', contract_address: '', symbol: 'hfUSDT'},
    // { name: 'basic', contract_address: '', symbol: 'hfUSDC'},
    // { name: 'basic', contract_address: '', symbol: 'hfDAI'},
]);

db.stake_pool.insertMany([
    {
        name: 'dvmUSDT',
        label: 'Yearn Fighter USDT LP',
        contract_address: '0x4f0c1c9ba6b9ccd0bed6166e86b672ac8ee621f7',
        status: 'A',
        pid: '0',
        category: 'Advance',
        tokenId: 'tether',
        symbol: 'USDT'
    },
    {
        name: 'dvmUSDC',
        label: 'Yearn Fighter USDC LP',
        contract_address: '0x9f0230fbdc0379e5fefacca89be03a42fec5fb6e',
        status: 'A',
        pid: '1',
        category: 'Advance',
        tokenId: 'usd-coin',
        symbol: 'USDC'
    },
    {
        name: 'dvmDAI',
        label: 'Yearn Fighter DAI LP',
        contract_address: '0x2bfc2da293c911e5ffec4d2a2946a599bc4ae770',
        status: 'A',
        pid: '2',
        category: 'Advance',
        tokenId: 'dai',
        symbol: 'DAI'
    },
    {
        name: 'dvmTUSD',
        label: 'Yearn Fighter TUSD LP',
        contract_address: '0x2c8de02ad4312069355b94fb936efe6cfe0c8ff6',
        status: 'A',
        pid: '3',
        category: 'Advance',
        tokenId: 'true-usd',
        symbol: 'TUSD'
    },
    {
        name: 'dvlUSDT',
        label: 'Compound Fighter USDT LP',
        contract_address: '0xeece6ad323a93d4b021bdaac587dcc04b5cf0a78',
        status: 'A',
        pid: '4',
        category: 'Basic',
        tokenId: 'tether',
        symbol: 'USDT'
    },
    {
        name: 'dvlUSDC',
        label: 'Compound Fighter USDC LP',
        contract_address: '0xd1d7f950899c0269a7f2aad5e854cdc3a1350ba9',
        status: 'A',
        pid: '5',
        category: 'Basic',
        tokenId: 'usd-coin',
        symbol: 'USDC'
    }, 
    {
        name: 'dvlDAI',
        label: 'Compound Fighter DAI LP',
        contract_address: '0x43c20638c3914eca3c96e9cac8ebe7d652be45c6',
        status: 'A',
        pid: '6',
        category: 'Basic',
        tokenId: 'dai',
        symbol: 'DAI'
    },
    {
        name: 'vipDVG',
        label: 'vipDVG LP',
        contract_address: '', // TODO: Update to mainnet address
        status: 'A',
        pid: '7',
        category: 'Basic',
        tokenId: 'xDVG', 
        symbol: 'xDVG'
    },
    {
        name: 'ETH<->DVG',
        label: 'Uniswap DVG-ETH LP',
        contract_address: '', // TODO: Update to mainnet address
        status: 'A',
        pid: '8',
        category: 'Basic',
        tokenId: 'ethDVG',
        symbol: 'ethDVG'
    },
    {
        name: 'daoCDV',
        label: 'DAO Citadel LP',
        contract_address: '0x8fe826cc1225b03aa06477ad5af745aed5fe7066',
        status: 'A',
        pid: '9',
        category: 'Expert',
        tokenId: 'ethereum',
        symbol: 'daoCDV'
    },
    {
        name: 'daoELO',
        label: 'Elon\'s APE LP',
        contract_address: '0x2d9a136cf87d599628bcbdfb6c4fe75acd2a0aa8',
        status: 'A',
        pid: '10',
        category: 'Basic',
        tokenId: 'ethereum',
        symbol: 'daoELO'
    },
    {
        name: "daoSTO",
        label: "DAO FAANG Stonk",
        contract_address: '0x742a85daf742ca0213b06fdae449434e0448691e',
        status: 'A',
        pid: '11',
        category: 'Basic',
        tokenId: 'tether',
        symbol: 'daoSTO'
    }
]);

// Testnet Contracts
db.vault_categories.insertMany([
    { name: 'advance', contract_address: '0x6B150E9BD70E216775c8b73270E64e870a3110c1', symbol: 'yUSDT' },
    { name: 'advance', contract_address: '0x6E15e283dc430eca010Ade8b11b5B377902d6e56', symbol: 'yUSDC' },
    { name: 'advance', contract_address: '0x2428bFD238a3632552B343297c504F60283009eD', symbol: 'yDAI' },
    { name: 'advance', contract_address: '0xEcCb98c36bfc8c49c6065d1cD90bcf1c6F02D4AD', symbol: 'yTUSD' },
    { name: 'basic', contract_address: '0x5d102e0bdf2037899e1ff2e8cc50987108533c52', symbol: 'cUSDT' },
    { name: 'basic', contract_address: '0x05ab7659e6ef9ba1a5f790b402fd1688f01b003e', symbol: 'cUSDC', },
    { name: 'basic', contract_address: '0x47e565b1e23cda3d6bb69e7ae398b884f5addc7d', symbol: 'cDAI', },
    { name: 'expert', contract_address: '0x626c25ca5b86277f395c0e40dbdf51f2a302ab43', symbol: 'daoCDV', },
    { name: 'degen', contract_address: '0xf03fa8553379d872b4e2bafbc679409fb82604c2', symbol: 'daoELO', },
    { name: 'advance', contract_address: '0xd6af81e5288be43137debf969d7f2c03482c8cc1', symbol: 'daoSTO', },
    { name: 'basic', contract_address: '0xb41a49de82e95dc1e028839c3440ac97f9a7832c', symbol: 'hfUSDT'},
    { name: 'basic', contract_address: '0x54783464848b35d6fb9bba37c1ddd23ac3b1a11a', symbol: 'hfUSDC'},
    { name: 'basic', contract_address: '0x0f89ee5b95d1d5cfb10f29775d816fc6d8adb9fc', symbol: 'hfDAI'},
]);

db.xdvg_token.insert({
    name: 'USDT',
    contract_address: '0x07de306FF27a2B630B1141956844eB1552B956B5'
});

db.stake_pool.insertMany([
    {
        name: 'dvmUSDT',
        label: 'Yearn Fighter USDT LP',
        contract_address: '0x6b150e9bd70e216775c8b73270e64e870a3110c1',
        status: 'A',
        pid: '0',
        category: 'Advance',
        tokenId: 'tether',
        symbol: 'USDT'
    },
    {
        name: 'dvmUSDC',
        label: 'Yearn Fighter USDC LP',
        contract_address: '0x6e15e283dc430eca010ade8b11b5b377902d6e56',
        status: 'A',
        pid: '1',
        category: 'Advance',
        tokenId: 'usd-coin',
        symbol: 'USDC'
    },
    {
        name: 'dvmDAI',
        label: 'Yearn Fighter DAI LP',
        contract_address: '0x2428bfd238a3632552b343297c504f60283009ed',
        status: 'A',
        pid: '2',
        category: 'Advance',
        tokenId: 'dai',
        symbol: 'DAI'
    },
    {
        name: 'dvmTUSD',
        label: 'Yearn Fighter TUSD LP',
        contract_address: '0xeccb98c36bfc8c49c6065d1cd90bcf1c6f02d4ad',
        status: 'A',
        pid: '3',
        category: 'Advance',
        tokenId: 'true-usd',
        symbol: 'TUSD'
    },
    {
        name: 'dvlUSDT',
        label: 'Compound Fighter USDT LP',
        contract_address: '0x5d102e0bdf2037899e1ff2e8cc50987108533c52',
        status: 'A',
        pid: '4',
        category: 'Basic',
        tokenId: 'tether',
        symbol: 'USDT'
    },
    {
        name: 'dvlUSDC',
        label: 'Compound Fighter USDC LP',
        contract_address: '0x05ab7659e6ef9ba1a5f790b402fd1688f01b003e',
        status: 'A',
        pid: '5',
        category: 'Basic',
        tokenId: 'usd-coin',
        symbol: 'USDC'
    }, 
    {
        name: 'dvlDAI',
        label: 'Compound Fighter DAI LP',
        contract_address: '0x47e565b1e23cda3d6bb69e7ae398b884f5addc7d',
        status: 'A',
        pid: '6',
        category: 'Basic',
        tokenId: 'dai',
        symbol: 'DAI'
    },
    {
        name: 'vipDVG',
        label: 'vipDVG LP',
        contract_address: '0x3aa8e8b6d3562a1e7acb0dddd02b27896c00c424',
        status: 'A',
        pid: '7',
        category: 'Basic',
        tokenId: 'xDVG', 
        symbol: 'xDVG'
    },
    {
        name: 'ETH<->DVG',
        label: 'Uniswap DVG-ETH LP',
        contract_address: '0x0a15e37442e2a41a3a51a9eff7fe1dce0e96f0bb',
        status: 'A',
        pid: '8',
        category: 'Basic',
        tokenId: 'ethDVG',
        symbol: 'ethDVG'
    },
    {
        name: 'daoCDV',
        label: 'DAO Citadel LP',
        contract_address: '0x626c25ca5b86277f395c0e40dbdf51f2a302ab43',
        status: 'A',
        pid: '9',
        category: 'Expert',
        tokenId: 'ethereum',
        symbol: 'daoCDV'
    },
    {
        name: 'daoELO',
        label: 'Elon\'s APE LP',
        contract_address: '0xf03fa8553379d872b4e2bafbc679409fb82604c2',
        status: 'A',
        pid: '10',
        category: 'Basic',
        tokenId: 'ethereum',
        symbol: 'daoELO'
    },
    {
        name: "daoSTO",
        label: "DAO FAANG Stonk",
        contract_address: '0xd6af81e5288be43137debf969d7f2c03482c8cc1', 
        status: 'A',
        pid: '11',
        category: 'Advance',
        tokenId: 'tether',
        symbol: 'daoSTO'
    }
]);

db.special_event.insertMany([
    { startTime: 1622390400000, endTime: 1622444400000, threshold: 3000 },
    { startTime: 1622538000000, endTime: 1622541600000, threshold: 5000 },
    { startTime: 1622538900000, endTime: 1622540400000, threshold: 7000 },
    { startTime: 1622542200000, endTime: 1622543400000, threshold: 6000 },
    { startTime: 1622606400000, endTime: 1622610000000, threshold: 3000 }
]);