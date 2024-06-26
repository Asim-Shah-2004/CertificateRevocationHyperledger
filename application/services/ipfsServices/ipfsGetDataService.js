import getBlock from "../hyperledgerServices/getBlockService.js";
import getIpfsInstance from "./ipfsClientService.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

const getIPFSEntryService = async (abcID) => {
  const blockHash = await getBlock(abcID);
  if (blockHash == null) return null;

  const cid = CID.parse(blockHash);
  const data = await dag.get(cid);

  if (!data) return null;

  return data;
};

export default getIPFSEntryService;
