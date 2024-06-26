import getBlock from "../../services/hyperledgerServices/getBlockService.js";
import { getIpfsInstance } from "../../services/ipfsServices/ipfsClientService.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats/cid";
const helia = await getIpfsInstance();
const dag = dagJson(helia);

const updateIPFS = async(req,res)=>{
    const {ABCID} = req.body
    try{
        try{
            const blockHash = await getBlock(ABCID)
            if(blockHash==null) return res.send({"message" : "entry does not exists"})
            const cid = CID.parse(blockHash);
            const data = await dag.get(cid)
            return res.send({"data":data})
        }catch(err){
            console.log(err);
        }
    }catch(err){
        console.log(err);
    }
    
}

export default updateIPFS