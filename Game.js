import fetch from 'node-fetch'

class Game {
    constructor() {
        this.players = [];
        this.gameRound = 1;
        this.question = {};
        this.showScore = false;
        this.endGame = false;
        this.playerInput = 0;
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
            ioServer.emit('question', this.question)
        });
    }

    nextRound = () => {
        this.calculateRoundScore();
        this.ShowScore = true;
        if (this.gameRound === 4) {
            this.endOfGame = true;
            this.showResults = true;
        }
        setTimeout(() => {
            if (this.gameRound < 4) {
                this.ShowScore = false;
                this.gameRound = this.gameRound + 1;
                this.timeRemaining = (5 * 1000);
                this.playerInput = "";
            }

        }, 3000)
        
    }


    calculateRoundScore = (input, player, ioServer) => {
        player.roundScore = (input / Math.max(input, 1) ) * (10000 - (Math.abs(this.question.answer - input) * (10 ** (4 - this.gameRound))));
        ioServer.emit('roundScore', player.roundScore);
    }

    addToTotalScore = (player) => {
        player.totalScore = (player.totalScore + player.roundScore);
    }

    findPlayerById = (id) => {
        let player = {};
        for (player of this.players) {
            if ( player.id === id) {
              return player;
            }
          }
    }

}

export default Game;