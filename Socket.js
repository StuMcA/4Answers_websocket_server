import { createServer } from "http";
import { Server } from "socket.io";

import Game from './Game.js'
import Player from "./Player.js";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const newGame = new Game()

io.on("connection", (socket) => {
  const player = new Player(socket.client.id, "Tom", "room");
  newGame.players.push(player);

  io.emit('idReturned', socket.client.id);
  socket.join('room1');
  io.emit("confirm", 'test')
  // console.log("Client connected");
  
  // Gets start game message
  socket.on('start game', () => {
    // Fetch question
    newGame.fetchQuestion(io);

  })

  socket.on('playerInput', (data) => {
    console.log(data);
    let playerFound = newGame.findPlayerById(data.userId);
    newGame.calculateRoundScore(data.input, playerFound, io);
    newGame.addToTotalScore(playerFound);
    ioServer.emit('roundScore', player.roundScore);
    console.log(playerFound.totalScore);

  })

  socket.on('nextRound', () => {
    console.log("next round function");
    newGame.nextRound();
    newGame.fetchQuestion(io);
  })

});
httpServer.listen(3001);