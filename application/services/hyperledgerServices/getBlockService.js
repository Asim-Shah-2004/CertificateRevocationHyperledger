import {getChaincode} from "../index.js"

const getBlock = async (abcID) => {
    const contract = await getChaincode("basic");
    try {
        const block = await contract.evaluateTransaction("getBlock", abcID);
        const blockData = JSON.parse(block.toString());
        return blockData.hash ? blockData.hash : null;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export default getBlock;
