const socketService = require('../services/socketService');

module.exports=(io)=>{
    io.use(socketService.authenticateSocket);
    io.on('connection',(socket)=>{
        console.log(`User with socket ID ${socket.id} has connected!`);
        socketService.handleConnection(socket,io);
    })

    io.on('disconnect',(socket)=>{
        socketService.handleDisconnection(socket);
    })
}
