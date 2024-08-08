const io = require('socket.io-client');
const socket = io('http://localhost:3001', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjgxOTIzMjM1ZDRmYzE0OTRhZmJhM2EiLCJlbWFpbCI6InRlamFzQGdtYWlsLmNvbSIsImlhdCI6MTcyMTE1MDAwNiwiZXhwIjoxNzIxMjM2NDA2fQ.6xh3KZtWMICyqfZScLFa0c3k0_mIxkod8ykQnjashq0' // Replace with a valid token if using JWT
  }
});

socket.on('connect', () => {
  console.log('User1 connected to server');

  // Send a private message to user2 after connecting

  setTimeout(()=>{
    socket.emit('private message', {
      to: 'raksha123@gmail.com',
      message: 'Hello Raksha, this is thejas!'
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

