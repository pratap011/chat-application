// routes/friendRoutes.js
const express = require('express');
const FriendController = require('../controllers/FriendController');


const router = express.Router();

router.get('/friends', FriendController.getFriends);

module.exports = router;
