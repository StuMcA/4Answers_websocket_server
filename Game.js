class GameRoom {
    constructor(players) {
        this.players = players;
        this.gameRound = 1;
        this.question = {};
        this.timeRemaining = 5000
        this.showScore = false;
        this.endGame = false;
    }

    fetchQuestion = () => {
        fetch(`https://quest-questions-answers-api.herokuapp.com/${gameRound}`)
        .then(res => res.json())
        .then(data => {
            const randomQuestionIndex = getRandomNumber(data.length)
            setQuestion(data[randomQuestionIndex])
        });
    }

    

}