import { createHelia } from "helia";
import { FsBlockstore } from 'blockstore-fs'
import 'dotenv/config'
let ipfsInstance = null;

const createIpfsInstance = async () => {
  if (!ipfsInstance) {
    const blockstore = new FsBlockstore(process.env.BLOCKSTORE_PATH)
    ipfsInstance = await createHelia({blockstore});
    console.log(ipfsInstance);
    console.log("herr");
    console.log("IPFS instance created");
  }
  return ipfsInstance;
};

const getIpfsInstance = async () => {
  if (!ipfsInstance) await createIpfsInstance();
  return ipfsInstance;
};

export default getIpfsInstance;
