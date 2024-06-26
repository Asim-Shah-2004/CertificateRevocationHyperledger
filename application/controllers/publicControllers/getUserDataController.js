import { getIPFSEntryService } from "../../services/index.js";

const getUserData = async (req, res) => {
  try {
    const { abcID } = req.body;
    const data = await getIPFSEntryService(abcID);

    if (data == null) return res.status(500).json({ message: "Failed to retrieve data from IPFS" });

    const newData = {
      name: data.name,
      dob: data.dob,
      college_name: data.college_name,
      course: data.course,
      credits: data.credits,
      is_revoked: data.is_revoked,
    };

    res.status(200).json({ message: "Data fetched from IPFS", data: newData });
    return newData;
  } catch (err) {
    console.log("Error updating data on IPFS:", err);
    res.status(500).json({ message: "Failed to update data on IPFS", error: err.message });
  }
};

export default getUserData;
