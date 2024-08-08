const messageService=require('../services/messageService');


const getAllMessages=async(req,res)=>{
    try{
        const from=req.user.email;
        const to=req.query.to;
        const messages=await messageService.getMessages(from,to);
        res.status(200).json(messages);
        }catch(err){
            res.status(500).json({message:err.message});
            }
            
}

module.exports={
    getAllMessages
}