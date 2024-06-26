import { getChaincode } from "../services/chaincodeService.js";

// Test function to interact with the chaincode
const test = async (req, res) => {
  const contract = await getChaincode("basic");
  console.log(contract);

  try {
    // Create a new entry
    let result = await contract.submitTransaction("createEntry", "2022600055", "Asim Shah", "MyCollege");
    console.log("Create Entry Result:", result.toString());

    console.log(result);

    // Find the created entry
    result = await contract.evaluateTransaction("findEntry", "2022600055");
    console.log("Find Entry Result:", result.toString());

    console.log(result);

    // Issue a certificate for the entry
    result = await contract.submitTransaction("issueCertificate", "2022600055", "certificateHash123", "1");
    console.log("Issue Certificate Result:", result.toString());

    console.log(result);

    // Wait for 70 seconds to allow certificate validity to expire
    console.log("Waiting for 70 seconds to allow certificate validity to expire...");
    await new Promise((resolve) => setTimeout(resolve, 70000));

    // Find the entry again after the certificate has expired
    result = await contract.evaluateTransaction("findEntry", "2022600055");
    console.log("Find Entry Result after expiry:", result.toString());

    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

export { test };
