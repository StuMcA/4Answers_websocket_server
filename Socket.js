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
  // console.log(player);

  io.emit('idReturned', socket.client.id);
  socket.join('room1');
  // io.emit("confirm", 'test')
  
  // Gets start game message
  socket.on('start game', () => {
    // Fetch question
    newGame.fetchQuestion(io);
    // io.emit('idReturned', socket.client.id);


  })

  socket.on('playerInput', (data) => {
    // let playerFound = newGame.findPlayerById(data.userId);
    // console.log(newGame.playerFound);
    newGame.calculateRoundScore(data.input, data.userId, io);
    newGame.addToTotalScore(data.userId);
    io.emit('roundScore', player.roundScore);
    setTimeout(() => {
      newGame.nextRound();
      newGame.fetchQuestion(io);
    }, 6000)
    
  })

  // socket.on('nextRound', () => {
  //   newGame.nextRound();
  //   newGame.fetchQuestion(io);
  // })

});
httpServer.listen(3001);