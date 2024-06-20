const { getIpfsInstance } = require('../services/IpfsClinetService.js');

const HandleGetCertificate = async (req, res) => {
    try {
        const { dagJson } = await import('@helia/dag-json');
        const { CID } = await import('multiformats/cid');
        const helia = await getIpfsInstance();
        const dag = dagJson(helia);

        const { cid } = req.body;

        if (!cid) {
            return res.status(400).json({ message: 'CID is required' });
        }

        
        let validCid;
        try {
            validCid = CID.parse(cid);
        } catch (err) {
            console.error('Invalid CID format:', err);
            return res.status(400).json({ message: 'Invalid CID format' });
        }

        console.log('Fetching data for CID:', validCid.toString());

        let jsonData;
        try {
            console.log(validCid);
            jsonData = await dag.get(validCid);
        } catch (err) {
            console.error('Error during dag.get:', err);
            throw new Error('Failed to retrieve data from IPFS');
        }

        console.log('Data retrieved:', jsonData);
        res.status(200).json({ message: 'Data retrieved from IPFS', data: jsonData });
    } catch (error) {
        console.error('Error in HandleGetCertificate:', error);
        res.status(500).json({ message: 'Failed to retrieve data from IPFS', error: error.message });
    }
};

module.exports = {HandleGetCertificate}