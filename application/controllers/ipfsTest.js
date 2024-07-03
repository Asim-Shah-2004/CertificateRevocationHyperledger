import { getChaincode} from "../services/index.js";
import {connectToHyperledger} from '../services/index.js'
const test = async (req, res) => {
    const {network2} = await connectToHyperledger()
    const contract = await network2.getContract('basic');
    const response = await contract.submitTransaction("checkAuthority", 'orange');
    console.log(response.toString());
    return res.send({"messgae" : response.toString()});
};

export { test };