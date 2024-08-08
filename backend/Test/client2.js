
const io = require('socket.io-client');
const socket = io('http://localhost:3001', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjgyNGY4Zjc1NWZlYWQxNGM5NDFhYzIiLCJlbWFpbCI6InJha3NoYTEyM0BnbWFpbC5jb20iLCJpYXQiOjE3MjExNTAwMzIsImV4cCI6MTcyMTIzNjQzMn0.iyLFDBeEtcph9Sf2gXZoQ8mErDK_Y84YcLkuHHbXmqI' 
  }
});

socket.on('connect', () => {
  console.log('User1 connected to server');

  // Send a private message to user2 after connecting

  setTimeout(()=>{
    socket.emit('private message', {
        to: 'tejas@gmail.com',
        message: 'Hello thejas, this is Raksha!'
      });
    });
  },2000)



socket.on('private message', (data) => {
  console.log('User1 received private message:', data);
});


socket.on('disconnect', () => {
  console.log('User1 disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('User1 connection error:', error.message);
});