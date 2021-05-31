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
  console.log(socket);
  io.emit("confirm", 'test')
});
httpServer.listen(3001);