import { getBlock, getChaincode, getIpfsInstance } from "../../services/index.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

const updateIPFSEntry = async (req, res) => {
  const { abcID, permissions, credits, last_added, marks, certificates } = req.body;
  const contract = await getChaincode("basic");

  try {
    const blockHash = await getBlock(abcID);
    if (blockHash == null) return res.status(404).send({ message: "Entry does not exist" });

    const cid = CID.parse(blockHash);
    const data = await dag.get(cid);
    console.log(data);

    if (!data) return res.status(500).json({ message: "Failed to retrieve data from IPFS" });

    data.permissions = permissions || data.permissions;
    data.credits = credits || data.credits;
    data.last_added = last_added || data.last_added;
    data.marks = marks || data.marks;
    data.certificates = certificates || data.certificates;

    const updatedCID = await dag.add(data);
    const resposne = await contract.submitTransaction("updateBlock", abcID, updatedCID);
    console.log(resposne.toString());
    res.status(200).json({ message: "Updated Successfully", cid: updatedCID });
  } catch (err) {
    console.log("Error updating data on IPFS:", err);
    res.status(500).json({ message: "Failed to update data on IPFS", error: err.message });
  }
};

export default updateIPFSEntry;
