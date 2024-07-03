import { connectToHyperledger } from '../services/index.js';

const checkAuthority = async (req, res, next) => {
  try {
    const { chaincode, msp, org } = req.headers;

    if (!chaincode || !msp || !org) {
      return res.status(400).send({ message: "Missing required headers: chaincode, msp, org" });
    }

    let network;
    if (org === "Org1") {
      const { network1 } = await connectToHyperledger();
      network = network1;
    } else if (org === "Org2") {
      const { network2 } = await connectToHyperledger();
      network = network2;
    } else {
      return res.status(400).send({ message: "Invalid org provided" });
    }

    const contract = await network.getContract(chaincode);
    const response = await contract.evaluateTransaction("checkAuthority", msp);
    
    if (response.toString() === "true") {
      next();
    } else {
      res.status(403).send({ message: "Access denied" });
    }
  } catch (error) {
    res.status(500).send({ message: `Error: ${error.message}` });
  }
};

export default checkAuthority;
