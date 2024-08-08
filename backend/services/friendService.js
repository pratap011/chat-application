// services/FriendService.js
const User = require('../models/User');

const getFriends = async (email) => {
  const user = await User.findOne({ email:email });
  const friends = await User.find({ _id: { $in: user.friends } });
  return friends;
  
};

module.exports = {
  getFriends
};
