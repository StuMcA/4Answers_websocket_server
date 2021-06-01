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

    // Send question - done 

    // Periodically send timer, every second
    // When timer gets to zero

    // Get player input
    
    // Calculate scores

    // Send Scores

    // Add at one to round

    // If round 4 end game

    // Sends total scores


    
  })

  socket.on('playerInput', (data) => {
    console.log(data);
    let playerFound = newGame.findPlayerById(data.userId);
    newGame.calculateRoundScore(data.input, playerFound, io);
    newGame.addToTotalScore(playerFound);
    // newGame.fetchQuestion(io);
    console.log(playerFound.totalScore);

  })

});
httpServer.listen(3001);