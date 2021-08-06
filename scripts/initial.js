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
    { name: 'degen', contract_address: '0x2ad9f8d4c24652ea9f8a954f7e1fdb50a3be1dfd', symbol: 'daoCUB', }, 
    { name: 'advance', contract_address: '0x742a85daf742ca0213b06fdae449434e0448691e', symbol: 'daoSTO', },
    { name: 'advance', contract_address: '0x2Cc1507E6E3C844EEb77Db90d193489f1Ddfb299', symbol: 'hfUSDT'},
    { name: 'advance', contract_address: '0xd0f0858578C7780f2D65f6d81BC7DdBe166367cC', symbol: 'hfUSDC'},
    { name: 'advance', contract_address: '0xE4E6Ce7c1D9Ff44Db27f622aCcbB0753C2f48955', symbol: 'hfDAI'},
    { name: 'advance', contract_address: '0x3db93e95c9881bc7d9f2c845ce12e97130ebf5f2', symbol: 'daoMPT', },
    // TODO: add in mainnet contract addresss
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
    { name: 'degen', contract_address: '0x5c304a6cb105e1bff9805ca5cf072f1d2c3beac5', symbol: 'daoCUB', },
    { name: 'advance', contract_address: '0xd6af81e5288be43137debf969d7f2c03482c8cc1', symbol: 'daoSTO', },
    { name: 'advance', contract_address: '0x35880615bb18DA592FF0fEb0940ADE2c02249715', symbol: 'hfUSDT'},
    { name: 'advance', contract_address: '0x68b1C860300c4f7d577f08D8B3c3AEe23887b280', symbol: 'hfUSDC'},
    { name: 'advance', contract_address: '0x6D7e8fA90C1ffdC019d691BAFC18D6362FdEeCd7', symbol: 'hfDAI'},
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


db.special_event.insertMany([
    { startTime: 1622390400000, endTime: 1622444400000, threshold: 3000 },
    { startTime: 1622538000000, endTime: 1622541600000, threshold: 5000 },
    { startTime: 1622538900000, endTime: 1622540400000, threshold: 7000 },
    { startTime: 1622542200000, endTime: 1622543400000, threshold: 6000 },
    { startTime: 1622606400000, endTime: 1622610000000, threshold: 3000 }
]);