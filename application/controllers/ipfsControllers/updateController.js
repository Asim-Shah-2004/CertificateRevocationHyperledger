import getBlock from "../../services/hyperledgerServices/getBlockService.js";

const updateIPFS = async(req,res)=>{
    const {ABCID} = req.body
    try{
        try{
            const blockHash = await getBlock(ABCID)
            if(blockHash==null) return res.send({"message" : "entry does not exists"})
            res.send({"message":blockHash})
        }catch(err){
            console.log(err);
        }
    }catch(err){
        console.log(err);
    }
    
}

export default updateIPFS