const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
const roomCreators = new Map(); 
const roomParticipants = new Map(); 


io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on("room:call:end", ({ roomCreator, room }) => {
    // Notify both room creator and participants about the call ending
    io.to(room).emit("room:call:end", { roomCreator, room });
    
    // Clean up room-related mappings
    roomCreators.delete(room);
    roomParticipants.delete(room);

    console.log(`Call ended in room ${room} by initiator ${socket.id}`);
  });

  socket.on("room:join", (data) => {
    const { email, room } = data;

    // Check if the room is already created
    if (!roomCreators.has(room)) {
      // If not, set the current user as the creator
      roomCreators.set(room, socket.id);
      roomParticipants.set(room, [socket.id]);
      console.log("room creator: ",socket.id);
    } else {
      // If the room is already created, check if it's full
      const participants = roomParticipants.get(room);
      if (participants.length >= 2) {
        // If the room is full, send a message to the user and return
        console.log("Cannot join this room: ",room,socket.id);
        socket.emit("room:full", { message: "Room is full" });
        console.log("return back");
        return;
      }
      // If the room is not full, add the current user as a participant
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
