const { getIpfsInstance } = require('../services/IpfsClinetService.js');

const HanldeAddCertificate = async (req, res) => {
    try {
        const { dagJson } = await import('@helia/dag-json')
        const helia = await getIpfsInstance()
        const dag = dagJson(helia);
        
        const { name, age, data } = req.body;
        const jsonData = { name, age, data };
        
        const cid = await dag.add(jsonData);
        res.status(200).json({ message: 'Data added to IPFS', cid: cid.toString() });
    } catch (error) {
        console.error('Error adding data to IPFS:', error);
        res.status(500).json({ message: 'Failed to add data to IPFS', error: error.message });
    }
};

module.exports = {HanldeAddCertificate}