import {connectToHyperledger} from "../index.js"

// Function to get a specific chaincode from Hyperledger network
const getChaincode = async (name) => {
  try {
    const {network1} = await connectToHyperledger();
    const chaincode = await network1.getContract(name);
    return chaincode;
  } catch (error) {
    console.error(`Error : ${error}`);
  }
};

export default getChaincode;
