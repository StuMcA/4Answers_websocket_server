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
let playerReadyCount = 0;

io.on("connection", (socket) => {
  // console.log(player);
  // io.emit("confirm", 'test')

  socket.on("playerReady", (data) => {
    if (data.playerReady) {
      playerReadyCount -= 1;
    } else {
      playerReadyCount += 1;
    }
    if (!data.playerCreated) {
      player = new Player(socket.client.id, data, "room");
      newGame.players.push(player);
      io.emit('idReturned', socket.client.id);
      socket.join('room1');
    }
    io.emit('playersReady', playerReadyCount);

  })

  const interval = setInterval(() => {
    if (playerReadyCount === 2) {
      io.emit('allReady');
      clearInterval(interval);
    }
  }, 500)
  
  // Gets start game message
  socket.on('start game', () => {
    newGame.endGame = false;
    newGame.gameRound = 1;
    for (player of newGame.players) {
      player.roundScore = 0;
      player.totalScore = 0;
    }
    
    // Fetch question
    newGame.fetchQuestion(io);
    // io.emit('idReturned', socket.client.id);


  })

  socket.on('playerInput', (data) => {
      newGame.calculateRoundScore(data.input, data.userId, io);
      newGame.addToTotalScore(data.userId);
      io.emit('roundScore', player.roundScore);
        setTimeout(() => {
          newGame.nextRound(io);
          newGame.fetchQuestion(io);
        }, 2500)
      
    })

  // socket.on('nextRound', () => {
  //   newGame.nextRound();
  //   newGame.fetchQuestion(io);
  // })

});
httpServer.listen(3001);