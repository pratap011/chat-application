const friendService=require('../services/friendRequestService');
const {
    AuthFailureResponse,
    NotFoundResponse,
    ForbiddenResponse,
    BadRequestResponse,
    InternalErrorResponse,
    SuccessMsgResponse,
    FailureMsgResponse,
    SuccessResponse,
    AccessTokenErrorResponse,
    TokenRefreshResponse,
  } = require('../core/apiResponse');




const addReqeust=async (req,res)=>{
    const email = req.user.email;
    const to=req.body.to;
    console.log("---to----")
    console.log(to)
    try{
        let result=await friendService.addRequest(email,to);
        console.log(result)
        return new SuccessMsgResponse("Friend request sent!");
    }
    catch(e){
        new InternalErrorResponse('Something went wrong in the server').send(res);
    }
}

const viewRequest=async (req,res)=>{
    const email=req.user.email;
    try{
        let requests=await friendService.viewRequests(email);
        console.log(requests);
        res.status(200).json({request:requests});
    }
    catch(e){
        res.status(500).json({msg:e});
    }
}

const acceptRequest=async (req,res)=>{
    const email=req.user.email;
    const from=req.body.from;
    try{
        let result=await friendService.acceptRequest(email,from);
        console.log(result);
        return new SuccessMsgResponse("Friend request Accepted!");
        }
        catch(e){
            res.status(500).json({msg:e});
            }
}

module.exports={
    addReqeust,
    viewRequest,
    acceptRequest
}