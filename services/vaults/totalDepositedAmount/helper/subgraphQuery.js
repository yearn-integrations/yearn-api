const fetch = require("node-fetch");
const subgraphUrl = process.env.SUBGRAPH_ENDPOINT;

module.exports.getLatestDistributeLPTokenEvent = async(strategyAddress) => {
    let blockNumber = 0;

    try {
        if(!strategyAddress || strategyAddress === undefined || strategyAddress === "") {
            throw(`Missing strategy address`);
        }

        const query = `
        {
            distributeLPTokens(where: { farmer:"${strategyAddress}" } first: 1, orderBy: blockNumber, orderDirection: desc) {
                blockNumber
            }
        }
        `;
    
        const response = await fetch(subgraphUrl, {
            method: 'POST',
            body: JSON.stringify({query})
        });
        const responseJson = await response.json();
        const latestDistributeLPTokenEvent = responseJson.data;
        
        if(latestDistributeLPTokenEvent !== undefined && latestDistributeLPTokenEvent.distributeLPTokens) {
            blockNumber = latestDistributeLPTokenEvent.distributeLPTokens[0].blockNumber;
        }
    } catch (err) {
        console.error(`Error in getLatestDistributeLPTokenEvent(): `, err);
    } finally { 
        return blockNumber;
    }
}


module.exports.getDepositEvents = async(blockNumber, strategyAddress) => {
    let result = [];

    try {
        if(!blockNumber || blockNumber === undefined || blockNumber === "") {
            throw(`Missing block number`);
        }
        if(!strategyAddress || strategyAddress === undefined || strategyAddress === "") {
            throw(`Missing strategy address`);
        }

        const query = `
            {
                transactions(where: { blockNumber_gt: ${blockNumber}, farmer:"${strategyAddress}" }) {
                    deposits {
                        amountInUSD
                        amountAfterFee
                        fee
                        account {
                            id
                        }
                        farmer {
                            id
                        }
                    }
                }
            }
        `;
       
        const response = await fetch(subgraphUrl, {
            method: 'POST',
            body: JSON.stringify({query})
        });
        
        const responseJson = await response.json();
        result = responseJson.data.transactions;
    } catch(err) {
        console.error(`Error in getDepositEvents(): `, err);
    } finally {
        return result;
    }
}