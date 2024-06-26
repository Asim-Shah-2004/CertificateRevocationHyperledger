import { getBlock, getIpfsInstance } from "../../services/index.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

const getIPFSEntry = async (req, res) => {
  const { abcID } = req.body;
  try {
    const blockHash = await getBlock(abcID);
    if (blockHash == null) return res.status(404).send({ message: "Entry does not exist" });

    const cid = CID.parse(blockHash);
    const data = await dag.get(cid);

    if (!data) return res.status(500).json({ message: "Failed to retrieve data from IPFS" });

    res.status(200).json({ message: "Data fetched from IPFS", data: data });
    return data;
  } catch (err) {
    console.log("Error updating data on IPFS:", err);
    res.status(500).json({ message: "Failed to update data on IPFS", error: err.message });
  }
};

export default getIPFSEntry;
