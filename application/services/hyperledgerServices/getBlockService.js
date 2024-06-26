import { getChaincode } from "./chaincodeService";

const getBlock = async()=>{
    const contract = await getChaincode("basic");
    
}

export default getBlock