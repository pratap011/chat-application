const express = require('express');
const {getAllMessages}=require('../controllers/messageController')
const router=express.Router();

router.get("/getmessages",getAllMessages);

module.exports=router;