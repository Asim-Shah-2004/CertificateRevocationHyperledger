import { getBlock, getChaincode, getIpfsInstance } from "../../services/index.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";

const helia = await getIpfsInstance();
const dag = dagJson(helia);

const updateMarks = (data, marks) => {
  data.marks = data.marks || [];

  if (marks && Array.isArray(marks)) {
    let totalCredits = 0;
    let isNewEntry = false;
    
    for (const mark of marks) {
      const existingSemIndex = data.marks.findIndex(m => m.sem_no === mark.sem_no);
      
      if (existingSemIndex > -1) {
        data.marks[existingSemIndex] = mark;
      } else {
        data.marks.push(mark);
        isNewEntry = true;
      }

      totalCredits += mark.subjects.reduce((sum, subject) => sum + subject.credits, 0);
    }

    data.credits = totalCredits;

    if (isNewEntry) {
      data.last_updated = new Date().toISOString();
    }
  }
};

const updateIPFSEntry = async (req, res) => {
  const { abcID, name, dob, college_name, course, marks, certificates ,is_completed } = req.body;
  const contract = await getChaincode("basic");
  try {
    const blockHash = await getBlock(abcID);
    if (blockHash == null) return res.status(404).send({ message: "Entry does not exist" });

    const cid = CID.parse(blockHash);
    let data = await dag.get(cid);

    if (!data) return res.status(500).json({ message: "Failed to retrieve data from IPFS" });

    if (data.is_revoked) {
      return res.status(400).json({ message: "Certificate is revoked", reason: data.revoked_reason });
    }


    if (name !== undefined && name !== null) data.name = name;
    if (dob !== undefined && dob !== null) data.dob = dob;
    if (college_name !== undefined && college_name !== null) data.college_name = college_name;
    if (course !== undefined && course !== null) data.course = course;
    if(is_completed=="true" || is_completed===true) data.is_completed = true    

    
    if (marks !== undefined && marks !== null) {
      updateMarks(data, marks);
    }

    if (certificates && Array.isArray(certificates)) {
      data.certificates = certificates;
    }
    const updatedCID = await dag.add(data);
    const response = await contract.submitTransaction("updateBlock", abcID, updatedCID.toString());
    console.log(response.toString());
    console.log(data);
    res.status(200).json({ message: "Updated Successfully", cid: updatedCID.toString() });
  } catch (err) {
    console.log("Error updating data on IPFS:", err);
    res.status(500).json({ message: "Failed to update data on IPFS", error: err.message });
  }
};

export default updateIPFSEntry;
