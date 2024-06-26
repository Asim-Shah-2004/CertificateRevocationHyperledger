import { getChaincode } from "../services/hyperledgerServices/chaincodeService.js";

// Test function to interact with the chaincode
const test = async (req, res) => {
  const contract = await getChaincode("basic");
  console.log(contract);

  try {
    // Create a new entry
    let result = await contract.submitTransaction("addBlock", "xmkmxalm","xamxoamo");
    console.log("added block:", result.toString());

    console.log(result);

    // Find the created entry
    result = await contract.evaluateTransaction("getBlock", "xmkmxalm");
    console.log("Find Entry Result:", result.toString());
    return res.sendStatus(200)
  } catch (err) {
    console.log(err);
  }
};

export { test };
