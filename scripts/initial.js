// Mainnet Contracts
db.vault_categories.insertMany([
    { name: 'advance', contract_address: '0x4F0C1c9bA6B9CCd0BEd6166e86b672ac8EE621F7', symbol: 'yUSDT' },
    { name: 'advance', contract_address: '0x9f0230FbDC0379E5FefAcca89bE03A42Fec5fb6E', symbol: 'yUSDC' },
    { name: 'advance', contract_address: '0x2bFc2Da293C911e5FfeC4D2A2946A599Bc4Ae770', symbol: 'yDAI' },
    { name: 'advance', contract_address: '0x2C8de02aD4312069355B94Fb936EFE6CFE0C8FF6', symbol: 'yTUSD' },
    { name: 'basic', contract_address: '0xEeCe6AD323a93d4B021BDAaC587DCC04b5cf0a78', symbol: 'cUSDT' },
    { name: 'basic', contract_address: '0xd1D7f950899C0269a7F2aad5E854cdc3a1350ba9', symbol: 'cUSDC', },
    { name: 'basic', contract_address: '0x43C20638C3914Eca3c96e9cAc8ebE7d652Be45c6', symbol: 'cDAI', },
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
]);

db.xdvg_token.insert({
    name: 'USDT',
    contract_address: '0x07de306FF27a2B630B1141956844eB1552B956B5'
});

db.stake_pool.insertMany([
    {
        name: 'dvmUSDT',
        contract_address: '0x6B150E9BD70E216775c8b73270E64e870a3110c1',
        status: 'A',
        pid: '0',
        category: 'advance',
        tokenId: 'tether'
    },
    {
        name: 'dvmUSDC',
        contract_address: '0x6E15e283dc430eca010Ade8b11b5B377902d6e56',
        status: 'A',
        pid: '1',
        category: 'advance',
        tokenId: 'usd-coin'
    },
    {
        name: 'dvmDAI',
        contract_address: '0x2428bFD238a3632552B343297c504F60283009eD',
        status: 'A',
        pid: '2',
        category: 'advance',
        tokenId: 'dai'
    },
    {
        name: 'dvmTUSD',
        contract_address: '0xEcCb98c36bfc8c49c6065d1cD90bcf1c6F02D4AD',
        status: 'A',
        pid: '3',
        category: 'advance',
        tokenId: 'true-usd'
    },
    {
        name: 'dvlUSDT',
        contract_address: '0x5d102e0bdf2037899e1ff2e8cc50987108533c52',
        status: 'A',
        pid: '4',
        category: 'basic',
        tokenId: 'tether'
    },
    {
        name: 'dvlUSDC',
        contract_address: '0x05ab7659e6ef9ba1a5f790b402fd1688f01b003e',
        status: 'A',
        pid: '5',
        category: 'basic',
        tokenId: 'usd-coin'
    }, 
    {
        name: 'dvlDAI',
        contract_address: '0x47e565b1e23cda3d6bb69e7ae398b884f5addc7d',
        status: 'A',
        pid: '6',
        category: 'basic',
        tokenId: 'dai'
    },
    {
        name: 'xDVG',
        contract_address: '0x3aa8e8B6D3562a1E7aCB0dddD02b27896C00c424',
        status: 'A',
        pid: '7',
        category: 'basic',
        tokenId: 'xDVG'
    },
    {
        name: 'ETH<->DVG',
        contract_address: '0x0A15e37442e2a41A3A51A9Eff7fE1DCE0E96f0bB',
        status: 'A',
        pid: '7',
        category: 'basic',
        tokenId: 'ethDVG'
    }
]);