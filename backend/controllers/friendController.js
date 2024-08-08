// controllers/FriendController.js
const friendService = require('../services/FriendService');
const {
  InternalErrorResponse,
  SuccessResponse,
} = require('../core/apiResponse');

const getFriends = async (req, res) => {
  try {

    const friends = await friendService.getFriends(req.user.email);
    return new SuccessResponse("Retreived friends",friends).send(res);
  } catch (error) {
    console.error(error);
    return new InternalErrorResponse("There was a problem getting list of friends").send(res);
  }
};

module.exports = {
  getFriends
};
