require('dotenv').config();
const { Server } = require("socket.io");

const port = process.env.PORT || 8000;
console.log("Ryunning on port number: ",port);

const io = new Server(port, {
  cors: true,
});
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
const roomCreators = new Map(); 
const roomParticipants = new Map(); 


io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);


  socket.on('code-change',({code})=>{
    socket.broadcast.emit('code-change',{code});
})

  socket.on('canvas-data', (data)=> {
    io.emit('canvas-data', data);
})

  socket.on("codeeditor:status" , ({status, room}) => {
    socket.to(room).emit("remotecodeeditor:status", {status: status});
  });

  socket.on("whiteboard:status" , ({status, room}) => {
    socket.to(room).emit("remotewhiteboard:status", {status: status});
  });

  socket.on("screenshare:status" , ({status, room}) => {
    socket.to(room).emit("remotescreenshare:status", {status: status});
  });

  socket.on("message", (data) => {
    data.fromMe = data.from === socket.id;
    io.to(data.room).emit("message", data);
  });

  socket.on("vedio:status", ({room, status}) => {
    socket.to(room).emit("remotevedio:status", {status: status});
  });

  socket.on("audio:status", ({room, status}) => {
    socket.to(room).emit("remoteaudio:status", {status: status});
  });

  socket.on("room:call:end", ({ roomCreator, room }) => {
    io.to(room).emit("room:call:end", { roomCreator, room });
    roomCreators.delete(room);
    roomParticipants.delete(room);
    console.log(`Call ended in room ${room} by initiator ${socket.id}`);
  });

  socket.on("room:join", (data) => {
    const { email, room } = data;
    if (!roomCreators.has(room)) {
      roomCreators.set(room, socket.id);
      roomParticipants.set(room, [socket.id]);
      console.log("room creator: ",socket.id);
    } else {
      const participants = roomParticipants.get(room);
      if (participants.length >= 2) {
        console.log("Cannot join this room: ",room,socket.id);
        socket.emit("room:full", { message: "Room is full" });
        console.log("return back");
        return;
      }
      participants.push(socket.id);
      roomParticipants.set(room, participants);
    }

    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    io.to(room).emit("room:creator", { creatorId : roomCreators.get(room)});
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
