require("dotenv").config();
const express=require('express');
const app=express();
const http=require('http');
const bodyParser=require('body-parser');
const socketIo=require('socket.io');
const mongoose=require('mongoose');
const friendRoute=require('./routes/friendRoute');
const authRoutes=require('./routes/authentication');
const friendRequestRoutes=require('./routes/friendRequestRoute');
const messageRoute=require('./routes/MessageRoute');
const authMiddleware=require('./middlewares/authMiddleware');
const socketHandler=require('./sockets/socketHandler');
const redisClient=require('./utils/redisClient');
const User=require('./models/User');
const cors=require('cors');

process.on('uncaughtException', (e) => {
    console.error(e);
  });

  
const server=http.createServer(app);
const io=socketIo(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


socketHandler(io);
app.use(bodyParser.json());
app.use(cors());
const DB_URI=process.env.DB_URI;
  

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


app.use("/auth/api",authRoutes);
app.use("/friend/api",authMiddleware,friendRequestRoutes);
app.use("/friends",authMiddleware,friendRoute);
app.use("/messages",authMiddleware,messageRoute);

app.get("/message" ,authMiddleware,(req,res)=>{
    res.send(req.user);
})



io.on('connection',(socket)=>{
    console.log(`A user just joined with user ID ${socket.id}`);
    socket.on('message',(msg)=>{
        console.log(msg);
        io.emit('message',msg);
    })

    socket.on('private',(sid,source,msg)=>{
        mes=`The user with socket id ${source} sent:`+msg
        socket.to(sid).emit('private',mes);
    })

    socket.on('disconnect',()=>{
        console.log("User disconnected!");
    })
});


server.listen(process.env.SERVER_PORT ,(err,res)=>{
    console.log("The server was started successfully!")
})
