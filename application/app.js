'use strict';
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

async function main() {
    try {
        const ccp = buildCCPOrg1();
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
        const wallet = await buildWallet(Wallets, walletPath);
        await enrollAdmin(caClient, wallet, mspOrg1);
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

        const gateway = new Gateway();
        try {
            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true }
            });
            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);

            
            let result = await contract.submitTransaction('createEntry', '2022600055', 'Asim Shah', 'MyCollege');
            console.log('Create Entry Result:', result.toString());

            
            result = await contract.evaluateTransaction('findEntry', '2022600055');
            console.log('Find Entry Result:', result.toString());

            
            result = await contract.submitTransaction('issueCertificate', '2022600055', 'certificateHash123', '1');
            console.log('Issue Certificate Result:', result.toString());

            
            console.log('Waiting for 70 seconds to allow certificate validity to expire...');
            await new Promise(resolve => setTimeout(resolve, 70000));

            
            result = await contract.evaluateTransaction('findEntry', '2022600055');
            console.log('Find Entry Result after expiry:', result.toString());

        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        process.exit(1);
    }
}

main();
