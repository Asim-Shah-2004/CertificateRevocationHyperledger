import { createHelia } from "helia";

let ipfsInstance = null;

const createIpfsInstance = async () => {
  if (!ipfsInstance) {
    ipfsInstance = await createHelia();
    console.log("IPFS instance created");
  }
  return ipfsInstance;
};

const getIpfsInstance = async () => {
  if (!ipfsInstance) await createIpfsInstance();
  return ipfsInstance;
};

export default getIpfsInstance;
