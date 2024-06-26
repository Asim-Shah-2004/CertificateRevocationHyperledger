import { getIPFSEntryService } from "../../services/index.js";

const getIPFSEntry = async (req, res) => {
  try {
    const { abcID } = req.body;
    const data = await getIPFSEntryService(abcID);

    if (data == null) return res.status(500).json({ message: "Failed to retrieve data from IPFS" });

    res.status(200).json({ message: "Data fetched from IPFS", data: data });
    return data;
  } catch (err) {
    console.log("Error updating data on IPFS:", err);
    res.status(500).json({ message: "Failed to update data on IPFS", error: err.message });
  }
};

export default getIPFSEntry;
