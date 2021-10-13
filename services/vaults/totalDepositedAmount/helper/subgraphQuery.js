const fetch = require("node-fetch");
const subgraphUrl = process.env.SUBGRAPH_ENDPOINT;

module.exports.getLatestDistributeLPTokenEvent = async(strategyAddress) => {
    let events = [];

    try {
        if(!strategyAddress || strategyAddress === undefined || strategyAddress === "") {
            throw(`Missing strategy address`);
        }

        const query = `
        {
            distributeLPTokens(where: { farmer:"${strategyAddress}" } , orderBy: blockNumber, orderDirection: desc) {
                blockNumber,
                timestamp
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
            events = latestDistributeLPTokenEvent.distributeLPTokens;
        }
    } catch (err) {
        console.error(`Error in getLatestDistributeLPTokenEvent(): `, err);
    } finally { 
        return events;
    }
}


module.exports.getDepositEvents = async(startBlock, endBlock, strategyAddress) => {
    let result = [];

    try {
        if(!startBlock || startBlock === undefined || startBlock === "") {
            throw(`Missing start block`);
        }
        if(!strategyAddress || strategyAddress === undefined || strategyAddress === "") {
            throw(`Missing strategy address`);
        }

        const condition = `
            farmer: "${strategyAddress}",
            blockNumber_gt: ${startBlock}
            ${ endBlock === undefined ? "" : ", blockNumber_lte: " + endBlock}
        `;


        const query = `
            {
                transactions(where: { ${condition} }) {
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
        result = responseJson.data && responseJson.data.transactions
            ? responseJson.data.transactions
            : [];
    } catch(err) {
        console.error(`Error in getDepositEvents(): `, err);
    } finally {
        return result;
    }
}