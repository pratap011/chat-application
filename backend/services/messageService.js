const Message = require('../models/Message');
const User = require('../models/User');
const redisClient = require('../utils/redisClient');


const getMessages = async (from, to) => {
  try {
    const fromUser = await User.findOne({ email: from });
    const toUser = await User.findOne({ email: to });

    console.log(fromUser, toUser);

    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    const cacheKeyFrom = `recentmessages_:${from}_${to}`;
    const cacheKeyTo=`recentmessages_:${to}_${from}`;
    let redismessagesFrom=[];
    let redismessagesTo=[];


    try{
      const redisFromdata=await redisClient.lRange(cacheKeyFrom,0,-1);
      redismessagesFrom=redisFromdata.map(data=>JSON.parse(data));
    }catch (redisError) {
      console.error('Error fetching messages from Redis for key1:', redisError);
    }

    try{
      const redisToData=await redisClient.lRange(cacheKeyTo,0,-1);
      redismessagesTo=redisToData.map(data=>JSON.parse(data));
    }
    catch(redisError){
      console.error('Error fetching messages from Redis for key2:', redisError);
    }
    

    
    let allRedisMessages=[...redismessagesFrom,...redismessagesTo];
    allRedisMessages.sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));

    if(allRedisMessages.length===0){
      const messages = await Message.find({
        $or: [
          { from: fromUser._id, to: toUser._id },
          { from: toUser._id, to: fromUser._id }
        ]
      }).sort({ datetime: 1 });
      


      const messagesFinal = messages.map((m) => {
        return {
          ...m.toObject(),
          fromEmail: m.from.equals(fromUser._id) ? from : to,
          toEmail: m.to.equals(toUser._id) ? to : from
        };
      });
      console.log("Messages from the Database!!!!")
      // console.log(messagesFinal);
      return messagesFinal;
    }


    let allRedisMessagesClean=allRedisMessages.filter((m)=> m!==undefined);
;    const allRedisMessagesFinal=allRedisMessagesClean.map((m)=>{
      return{
        ...m,
        fromEmail: m.from==fromUser._id ? from : to,
        toEmail: m.to==toUser._id? to : from
      }
    });
    
    console.log(allRedisMessagesFinal);
    return allRedisMessagesFinal;


  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

module.exports = {
  getMessages
};
