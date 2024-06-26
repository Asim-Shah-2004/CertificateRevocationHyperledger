import { getIpfsInstance } from "../services/ipfsServices/ipfsClientService.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

// Handler function for adding a certificate to IPFS
const HandleAddCertificate = async (req, res) => {
  try {
    const { name } = req.body;

    // Create a JSON object with the provided data and add it to IPFS
    const jsonData = {
      "abc_id": "123456",
      "name": "John Doe",
      "dob": "1990-01-01",
      "college_name": "Example University",
      "permissions": [
        {
          "permission_type": "read",
          "granted_on": "2023-01-01T10:00:00Z",
          "entity": "Library"
        },
        {
          "permission_type": "write",
          "granted_on": "2023-02-01T11:00:00Z",
          "entity": "Admin"
        }
      ],
      "credits": 120,
      "last_added": "2024-06-26T14:00:00Z",
      "marks": [
        {
          "semester": 1,
          "marks_obtained": 85
        },
        {
          "semester": 2,
          "marks_obtained": 90
        },
        {
          "semester": 3,
          "marks_obtained": 88
        },
        {
          "semester": 4,
          "marks_obtained": 92
        },
        {
          "semester": 5,
          "marks_obtained": 87
        },
        {
          "semester": 6,
          "marks_obtained": 93
        }
      ],
      "certificates": [
        "U2FsdGVkX1+asdkjflkjasdlfkj",
        "U2FsdGVkX1+qwertyuiopasdfgh"
      ]
    };
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
