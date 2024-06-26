import {connectToHyperledger} from "../index.js"

// Function to get a specific chaincode from Hyperledger network
const getChaincode = async (name) => {
  try {
    const network = await connectToHyperledger();
    const chaincode = await network.getContract(name);
    return chaincode;
  } catch (error) {
    console.error(`Error : ${error}`);
  }
};

export default getChaincode;
