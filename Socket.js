import { createServer } from "http";
import { Server } from "socket.io";
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  socket.join('room');
  io.emit("confirm", 'test')
  console.log("Client connected");
  
  socket.on('tasty message', (msg) => {
    console.log(msg);
    io.emit('message', msg);
  })

});
httpServer.listen(3001);