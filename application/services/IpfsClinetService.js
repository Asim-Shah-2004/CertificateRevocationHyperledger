let ipfsInstance = null;

const createIpfsInstance = async () => {
    if (!ipfsInstance) {
        const { createHelia } = await import('helia');
        ipfsInstance = await createHelia();
        console.log('IPFS instance created');
    }
    return ipfsInstance;
};

const getIpfsInstance = async () => {
    if (!ipfsInstance) {
        await createIpfsInstance();
    }
    return ipfsInstance;
};

module.exports = { getIpfsInstance };
