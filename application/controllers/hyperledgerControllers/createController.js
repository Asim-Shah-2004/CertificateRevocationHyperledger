import { dagJson } from "@helia/dag-json";
import { getChaincode, getIpfsInstance } from "../../services/index.js";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

const createIPFSEntry = async (req, res) => {
  try {
    const { abcID, name, dob, college_name ,course } = req.body;
    const contract = await getChaincode("basic");

    const jsonData = {
      abcID,
      name,
      dob,
      college_name,
      course,
      is_completed:false,
      is_revoked:false,
      revoked_reason:"",
      last_updated:new Date().toISOString()
    };

    let cid = await dag.add(jsonData);
    cid = cid.toString();
    console.log(cid);

    const response = await contract.submitTransaction("addBlock", abcID, cid);
    console.log(response.toString());
    res.status(200).json({ message: "Created Successfully", cid: cid });
  } catch (err) {
    console.log("Error adding data to IPFS:", err);
    res.status(500).json({ message: "Failed to add data to IPFS", error: err.message });
  }
};

export default createIPFSEntry;
