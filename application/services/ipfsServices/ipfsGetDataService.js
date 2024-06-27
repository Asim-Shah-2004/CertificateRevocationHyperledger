import getBlock from "../hyperledgerServices/getBlockService.js";
import getChaincode from "../hyperledgerServices/chaincodeService.js"
import getIpfsInstance from "./ipfsClientService.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

const checkAndUpdateValidity = async(data,abcID) => {
  const contract = await getChaincode('basic')
  const lastUpdatedTimestamp = new Date(data.last_updated).getTime();
  console.log(lastUpdatedTimestamp);
  const currentTimestamp = new Date().getTime();
  console.log(currentTimestamp);
  const diffInSeconds = (currentTimestamp - lastUpdatedTimestamp) / 1000;

  if (diffInSeconds > 1200000000000) {
    data.credits = 0;
    data.is_revoked = true;
    data.revoked_reason = "Validity period expired";
  }
  const updatedCID = await dag.add(data);
  console.log(data);
  await contract.submitTransaction("updateBlock", abcID, updatedCID.toString());
  return data
};

const getIPFSEntryService = async (abcID) => {
  const blockHash = await getBlock(abcID);
  if (blockHash == null) return null;

  const cid = CID.parse(blockHash);
  let data = await dag.get(cid);
  
  if (!data) return null;
  data = checkAndUpdateValidity(data,abcID)
  return data;
};

export default getIPFSEntryService;
