
const getChaincode = require('../services/chainocdeService.js')

const test = async (req, res) => {
    const contract = await getChaincode('basic')      
    console.log(contract);
    try{

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
    }catch(error){
        console.log(error);
    }
           
}

module.exports = { test };
