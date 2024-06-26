import { getIpfsInstance } from "../../services/ipfsServices/ipfsClientService.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";
import { getChaincode } from "../../services/hyperledgerServices/chaincodeService.js";
const helia = await getIpfsInstance();
const dag = dagJson(helia);

const createEntry = async (req, res) => {
    
  try {
    const {ABCID,name,DOB,college_name} = req.body
    const contract = await getChaincode("basic");
    const jsonData = {
        ABCID,
        name,
        DOB,
        college_name
    }
    let cid = await dag.add(jsonData)
    cid = cid.toString()
    console.log(cid);
    const response  = await contract.submitTransaction("addBlock",  ABCID , cid)
    console.log(response.toString());
    res.send({"message":true});
  } catch (err) {
    console.log("Error adding data to IPFS:", err);
    res.status(500).json({ message: "Failed to add data to IPFS", error: err.message });
  }
};

export default createEntry;
