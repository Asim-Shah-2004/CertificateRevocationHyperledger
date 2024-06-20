const { getIpfsInstance } = require('../services/IpfsClinetService.js');

const HandleAddCertificate = async (req, res) => {
    try {
        const { dagJson } = await import('@helia/dag-json');
        const helia = await getIpfsInstance();
        const dag = dagJson(helia);

        const { name, age, data } = req.body;
        if (!name || !age || !data) {
            return res.status(400).json({ message: 'Name, age, and data are required' });
        }

        const jsonData = { name, age, data };
        const cid = await dag.add(jsonData);
        res.status(200).json({ message: 'Data added to IPFS', cid: cid.toString() });
    } catch (error) {
        console.error('Error adding data to IPFS:', error);
        res.status(500).json({ message: 'Failed to add data to IPFS', error: error.message });
    }
};

const HandleGetCertificate = async (req, res) => {
    try {
        const { dagJson } = await import('@helia/dag-json');
        const { CID } = await import('multiformats/cid');
        const helia = await getIpfsInstance();
        const dag = dagJson(helia);

        const { cid } = req.query;
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

        let jsonData;
        try {
            jsonData = await dag.get(validCid);
        } catch (err) {
            console.error('Error during dag.get:', err);
            throw new Error('Failed to retrieve data from IPFS');
        }

        res.status(200).json({ message: 'Data retrieved from IPFS', data: jsonData });
    } catch (error) {
        console.error('Error in HandleGetCertificate:', error);
        res.status(500).json({ message: 'Failed to retrieve data from IPFS', error: error.message });
    }
};

module.exports = { HandleAddCertificate, HandleGetCertificate };
