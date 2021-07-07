const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path'); 
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3030;
// Peer
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);


app.get( '/teams-webrtc', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get( '/main+:room', (req, res) => {
  res.render('main',{ roomId: req.params.room });
});

app.get( '/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId ,userName,state) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId , state);
     
    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message , userName, userId);
    });
    
    if(state ==="in-meet")
    {
      socket.on("disconnect", (reason)=>{
        socket.broadcast.emit("user-disconnected", userId ); 
    });

      socket.on('waved', (userId) => {
      io.to(roomId).emit('toggleWave', userId);
    });
  }
  
  });
});

server.listen( PORT , () => console.log(`Server listening to port ${PORT}`));