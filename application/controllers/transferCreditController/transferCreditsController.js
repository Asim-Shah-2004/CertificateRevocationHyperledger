import { getBlock, getChaincode, getIpfsInstance } from "../../services/index.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

const transferCredits = async (req, res) => {
  const { abcID, institutionID, creditsToTransfer, minimumCreditsRequired } = req.body;
  console.log(abcID);
  const contract = await getChaincode("basic");

  try {
    const blockHash = await getBlock(abcID);
    console.log(blockHash);
    if (blockHash == null) return res.status(404).send({ message: "Entry does not exist" });
   
    const cid = CID.parse(blockHash);
    let data = await dag.get(cid);

    if (!data) return res.status(500).json({ message: "Failed to retrieve data from IPFS" });

  
    if (data.credits >= minimumCreditsRequired && data.credits >= creditsToTransfer) {
      data.credits -= creditsToTransfer;

      const updatedCID = await dag.add(data);
      const response = await contract.submitTransaction("updateBlock", abcID, updatedCID.toString());

      console.log(response.toString());
      console.log(data);
      res.status(200).json({ message: `Transferred ${creditsToTransfer} credits successfully`, cid: updatedCID.toString() });

    } else {
      res.status(400).json({ message: "Insufficient credits to transfer" });
    }

  } catch (err) {
    console.log("Error transferring credits:", err);
    res.status(500).json({ message: "Failed to transfer credits", error: err.message });
  }
};

export default transferCredits;
