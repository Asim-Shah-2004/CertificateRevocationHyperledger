import { getChaincode } from "../services/hyperledgerServices/chaincodeService.js";

// Test function to interact with the chaincode
const test = async (req, res) => {
  const contract = await getChaincode("basic");
  console.log(contract);

  try {
    // Create a new entry
    let result = await contract.submitTransaction("addBlock", "2022600049","xamxoamo");
    console.log("Added block:", result.toString());
    console.log(result);
    
    // Find the created entry
    result = await contract.evaluateTransaction("getBlock", "2022600049");
    console.log("Find Entry Result:", result.toString());
    console.log(result);

    return res.sendStatus(200)
  } catch (err) {
    console.log(err);
  }
};

export { test };
