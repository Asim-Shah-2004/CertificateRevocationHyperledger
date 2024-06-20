// const ipfsClient = require('ipfs-http-client');
// const ipfs = ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' });

const test = async (req, res) => {
    const message = req.body.message;
    res.send(message);                 
}

module.exports = { test };
