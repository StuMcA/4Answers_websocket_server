import fetch from 'node-fetch'

class Game {
    constructor() {
        this.players = [];
        this.gameRound = 1;
        this.question = {};
        // this.showScore = false;
        this.endGame = false;
        this.playerInput = 0;
        this.selectedPlayer = null;
    }

    getRandomNumber = (maxNumber) => {
        return Math.floor(Math.random() * (maxNumber + 1));
    }

    fetchQuestion = (ioServer) => {
        fetch(`https://quest-questions-answers-api.herokuapp.com/${this.gameRound}`)
        .then(res => res.json())
        .then(data => {
            const randomQuestionIndex = this.getRandomNumber(data.length - 1)
            this.question = data[randomQuestionIndex];
            this.question.roundNumber = this.gameRound;
            ioServer.emit('question', this.question);
        });
    }

    nextRound = () => {
        // this.calculateRoundScore();
        // this.ShowScore = true;
        if (this.gameRound === 4) {
            this.endOfGame = true;
        }
        else {
            // this.ShowScore = false;
            this.gameRound = this.gameRound + 1;
        }
    
    }


    calculateRoundScore = (input, playerId, ioServer) => {
        this.selectedPlayer = this.findPlayerById(playerId);
        this.selectedPlayer.roundScore = (input / Math.max(input, 1) ) * (10000 - (Math.abs(this.question.answer - input) * (10 ** (4 - this.gameRound))));
    }

    addToTotalScore = (playerId) => {
        let player = this.findPlayerById(playerId);
        player.totalScore = (player.totalScore + player.roundScore);
    }

    findPlayerById = (id) => {
        let foundPlayer;
        for (let player of this.players) {
            if ( player.id === id) {
                foundPlayer = player;
            }
          }
        return foundPlayer;

    }

}

export default Game;