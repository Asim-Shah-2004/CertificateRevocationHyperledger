import { getIpfsInstance } from "../services/ipfsServices/ipfsClientService.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

// Handler function for adding a certificate to IPFS
const HandleAddCertificate = async (req, res) => {
  try {
    const { name, age, data } = req.body;

    console.log(req.body);

    if (!name || !age || !data) return res.status(400).json({ message: "Name, age, and data are required" });

    // Create a JSON object with the provided data and add it to IPFS
    const jsonData = { name, age, data };
    const cid = await dag.add(jsonData);
    res.status(200).json({ message: "Data added to IPFS", cid: cid.toString() });
  } catch (err) {
    console.log("Error adding data to IPFS:", err);
    res.status(500).json({ message: "Failed to add data to IPFS", error: err.message });
  }
};

// Handler function for retrieving a certificate from IPFS
const HandleGetCertificate = async (req, res) => {
  try {
    const { cid } = req.body;
    if (!cid) return res.status(400).json({ message: "CID is required" });

    // Check if CID is valid
    let validCID;
    try {
      validCID = CID.parse(cid);
    } catch (err) {
      console.log("Invalid CID format:", err);
      return res.status(400).json({ message: "Invalid CID format" });
    }

    // Retrieve data from IPFS using the valid CID
    let jsonData;
    try {
      jsonData = await dag.get(validCID);
    } catch (err) {
      console.log("Error during dag.get:", err);
      throw new Error("Failed to retrieve data from IPFS");
    }

    res.status(200).json({ message: "Data retrieved from IPFS", data: jsonData });
  } catch (error) {
    console.log("Error in HandleGetCertificate:", error);
    res.status(500).json({ message: "Failed to retrieve data from IPFS", error: error.message });
  }
};

export { HandleAddCertificate, HandleGetCertificate };
