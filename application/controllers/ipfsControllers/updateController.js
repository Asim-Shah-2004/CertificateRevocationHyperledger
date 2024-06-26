import getBlock from "../../services/hyperledgerServices/getBlockService.js";
import { getIpfsInstance } from "../../services/ipfsServices/ipfsClientService.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

const updateIPFS = async (req, res) => {
  const { ABCID, permissions, credits, last_added, marks, certificates } = req.body;
  try {
    const blockHash = await getBlock(ABCID);
    if (blockHash == null) {
      return res.status(404).send({ message: "Entry does not exist" });
    }

    const cid = CID.parse(blockHash);
    const data = await dag.get(cid);
    

    console.log(data);    
    if (!data) {
      return res.status(500).json({ message: "Failed to retrieve data from IPFS" });
    }

    
    data.permissions = permissions || data.permissions;
    data.credits = credits || data.credits;
    data.last_added = last_added || data.last_added;
    data.marks = marks || data.marks;
    data.certificates = certificates || data.certificates;

    
    const updatedCid = await dag.add(data);

    res.status(200).json({ message: "Data updated on IPFS", cid: updatedCid.toString() });
  } catch (err) {
    console.log("Error updating data on IPFS:", err);
    res.status(500).json({ message: "Failed to update data on IPFS", error: err.message });
  }
};

export default updateIPFS;
