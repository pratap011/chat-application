const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redisClient');
const User = require('../models/User');
const Message = require('../models/Message');

const secret =process.env.JWT_SECRET_KEY;
const PREFIX=process.env.REDIS_PREFIX;

const activeUsers = new Map();

exports.authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return next(new Error("There has been a problem with authentication!"));
    }
    socket.user = decoded;
    next();
  });
}

exports.handleConnection = async (socket, io) => {
  activeUsers.set(socket.user.email, socket.id);
  socket.on('image',async ({buffer,fileName,to})=>{
    const toSocketId = activeUsers.get(to);
    console.log("Reached socket")
    if(toSocketId){
      io.to(toSocketId).emit('receive-image',{buffer,fileName,from:socket.user.email});
    } 
    else{
      
    }
  })


  socket.on('private message', async ({ to, message }) => {
    const toSocketId = activeUsers.get(to);
    if (toSocketId) {
      io.to(toSocketId).emit('private message', { from: socket.user.email, message });
    } else {
      //send mail here
    }
    const fromUser = await User.findOne({ email: socket.user.email });
    const toUser = await User.findOne({ email: to });

    const newMessage = new Message({
      from: fromUser._id,
      to: toUser._id,
      datetime: new Date(),
      content: message,
      deliveredStatus: true
    });
    await newMessage.save();

    const cacheKey = `${PREFIX}${socket.user.email}_${to}`;
    const messageJSON = JSON.stringify(newMessage);

      try{
          const lengthOfCache=await redisClient.lLen(cacheKey);
          if(lengthOfCache<30){
              await redisClient.lPush(cacheKey,messageJSON,10000);
              console.log("Message added to Redis successfully!");
          }
      }
      catch(e){
          console.log("error"+e);
      }
  });
}

exports.handleDisconnection = (socket) => {
  console.log(`User disconnected: ${socket.user.email}`);
  activeUsers.delete(socket.user.email);
};
