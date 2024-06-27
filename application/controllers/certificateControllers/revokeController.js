import { getBlock,getChaincode,getIpfsInstance } from "../../services/index.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

const revokeEntry = async (req, res) => {
  const { abcID, reason } = req.body;
  const contract = await getChaincode('basic');

  try {
    const blockHash = await getBlock(abcID);
    if (blockHash == null) return res.status(404).send({ message: "Entry does not exist" });

    const cid = CID.parse(blockHash);
    const data = await dag.get(cid);

    if (!data) return res.status(500).json({ message: "Failed to retrieve data from IPFS" });

    data.is_revoked = true;
    data.revoked_reason = reason;
    data.credits = 0;
    const updatedCID = await dag.add(data);
    console.log("Updated data:", data);

    const response = await contract.submitTransaction("updateBlock", abcID, updatedCID.toString());
    console.log("Blockchain transaction response:", response.toString());

    res.status(200).json({ message: "Revoked Successfully", cid: updatedCID.toString() });
  } catch (err) {
    console.log("Error revoking data on IPFS:", err);
    res.status(500).json({ message: "Failed to revoke data on IPFS", error: err.message });
  }
};

export default revokeEntry;
