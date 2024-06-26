import { createHelia } from "helia";

// Singleton pattern to ensure only one IPFS instance is created
let ipfsInstance = null;

// Function to create a new IPFS instance
const createIpfsInstance = async () => {
  if (!ipfsInstance) {
    ipfsInstance = await createHelia();
    console.log("IPFS instance created");
  }
  return ipfsInstance;
};

// Function to get the IPFS instance, creating it if necessary
const getIpfsInstance = async () => {
  if (!ipfsInstance) await createIpfsInstance();
  return ipfsInstance;
};

export { getIpfsInstance };
