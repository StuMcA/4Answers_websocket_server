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
let player = null;
let playerInputCount = 0;

io.on("connection", (socket) => {
  // console.log(player);
  // io.emit("confirm", 'test')
  
  // Gets start game message
  socket.on('start game', () => {
    newGame.endGame = false;
    newGame.gameRound = 1;
    for (player of newGame.players) {
      player.roundScore = 0;
      player.totalScore = 0;
    }
    player = new Player(socket.client.id, "Tom", "room");
    newGame.players.push(player);
    io.emit('idReturned', socket.client.id);
    socket.join('room1');
    // Fetch question
    newGame.fetchQuestion(io);
    // io.emit('idReturned', socket.client.id);


  })

  socket.on('playerInput', (data) => {
      playerInputCount += 1;
      newGame.calculateRoundScore(data.input, data.userId, io);
      newGame.addToTotalScore(data.userId);
      io.emit('roundScore', player.roundScore);
      if (playerInputCount == 2) {
        setTimeout(() => {
          newGame.nextRound(io);
          newGame.fetchQuestion(io);
        }, 6000)
      }
    })

  // socket.on('nextRound', () => {
  //   newGame.nextRound();
  //   newGame.fetchQuestion(io);
  // })

});
httpServer.listen(3001);