const express=require('express');
const router=express.Router();
const {addReqeust,viewRequest,acceptRequest}=require('../controllers/friendRequestController');


router.post("/sendrequest",addReqeust);
router.post("/viewrequests",viewRequest);
router.post("/acceptrequest",acceptRequest);

module.exports=router;