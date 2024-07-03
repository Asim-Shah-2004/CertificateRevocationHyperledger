import {connectToHyperledger} from "../index.js"


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
