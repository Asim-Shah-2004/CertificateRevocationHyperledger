import {getChaincode} from "../index.js"

const getBlock = async (ABCID) => {
    const contract = await getChaincode("basic");
    try {
        const block = await contract.evaluateTransaction("getBlock", ABCID);
        const blockData = JSON.parse(block.toString());
        return blockData.hash ? blockData.hash : null;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export default getBlock;
