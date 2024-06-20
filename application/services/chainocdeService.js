const connectToHyperledger = require('../services/hyperledgerNetworkService.js')

const getChaicode = async (name)=>{
    try{
        console.log(name);
        const network = await connectToHyperledger()
        const chaincode = await network.getContract(name)
        return chaincode
    }catch (error) {
        console.error(`Error : ${error}`);
    }
}

module.exports = getChaicode
