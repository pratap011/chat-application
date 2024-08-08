const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

const viewRequests = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User not found');
    }
    let userRequests= await FriendRequest.find({ to: user._id });
    const finalRequests = await Promise.all(
        userRequests.map(async (request) => {
          const userReq = await User.findOne({ _id: request.from });
          return {
            requestId: request._id, // Optionally include the request ID
            fromUser: userReq,
            date: request.date, // Optionally include the date of the request
            status: request.status // Optionally include the status of the request
          };
        })
      );
    return finalRequests;

  } catch (e) {
    console.error(e);
    throw new Error('There was an issue in fetching friend requests!');
  }
};

const addRequest = async (from, to) => {
  try {
    const fromUser = await User.findOne({ email: from });
    const toUser = await User.findOne({ email: to });

    if (!fromUser) {
      throw new Error("The user sending the friend request doesn't exist!");
    }
    if (!toUser) {
      throw new Error("The user you want to send a friend request to doesn't exist!");
    }

    const newFriendReq = new FriendRequest({
      from: fromUser._id,
      to: toUser._id,
      date: new Date(),
      status: 'pending'
    });

    await newFriendReq.save();
    return "Friend request sent successfully!";
  } catch (e) {
    console.error(e);
    throw new Error('There was an error in sending the friend request: ' + e.message);
  }
};

const acceptRequest= async (email,senderEmail)=>{
  try{
    const user=await User.findOne({email});
    const sender=await User.findOne({email:senderEmail});
    console.log("sender:" +user);
    const request=await FriendRequest.findOne({from:sender._id,to:user._id});
    if(!request){
      throw new Error("No such request exists");
      }
      request.status="accepted";
      await request.save();
      await User.findByIdAndUpdate(
        user._id,
        { $push: { friends: sender._id } },
        { new: true, useFindAndModify: false }
      );
      await User.findByIdAndUpdate(
        sender._id ,
        { $push: { friends: user._id } },
        { new: true, useFindAndModify: false }
      );

      return "Request accepted successfully";

  }
  catch(e){
    console.error(e);
    throw new Error('There was an error in accepting the friend request: ' + e.message);
  }


};

module.exports = {
  viewRequests,
  addRequest,
  acceptRequest
};





