const fileSystem = require('./file.js');

compSet = function() {
    /**
     * Meta Data about the set
     */
    this.compOneUserName = "";
    this.compOneWins = 0;
    this.compTwoUserName = "";
    this.compTwoWins = 0;
    this.winCondition = 0;
    this.bestOf = 0;
    this.winner = "";
    this.gameNumber = 0;
    this.setComplete = false;

    this.writer = fileSystem.createWriter();


    /**
     * Sets the win condition and the best of games value for the set.
     * Sets must also be odd. If an even number is supplied, then it will default to the number 1 higher.
     * ex. 2 becomes 3
     *
     * @param bestOf
     */
    this.setUpBestOf = function (bestOf) {

        if (isOdd(bestOf)) {
            this.bestOf = bestOf;
        }
        else {
            this.bestOf = bestOf;
            this.bestOf++;
        }

        this.winCondition = calculateWinCondition(this.bestOf);
        this.calculateGameNumber();

        this.writer.writeDataToFile('set/best_of.txt', this.bestOf);
        this.writer.writeDataToFile('set/win_condition.txt', this.winCondition);
    };

    this.calculateGameNumber = function () {
        this.gameNumber = this.compOneWins + this.compTwoWins + 1;
        this.writer.writeDataToFile('set/game_number.txt', this.gameNumber);
    };

    /**
     * Sets the first competitors username and writes it to the file
     * @param compOneUserName
     */
    this.setCompOneUserName = function (compOneUserName) {
        this.compOneUserName = compOneUserName;
        this.writer.writeDataToFile('set/competitor_one_user_name.txt', this.compOneUserName);
    };

    /**
     * Sets the second competitors username and writes it to the file
     * @param compTwoUserName
     */
    this.setCompTwoUserName = function (compTwoUserName) {
        this.compTwoUserName = compTwoUserName;
        this.writer.writeDataToFile('set/competitor_two_user_name.txt', this.compTwoUserName);
    };

    /**
     * This function checks the wins of the competitors to see if the set is over.
     *
     * @returns {boolean}
     */
    this.compareWinsToWinCondition = function () {
        if (this.compOneWins >= this.winCondition ) {
            //ensure over clicks don't cause bad data
            this.compOneWins = this.winCondition;
            this.winner = this.compOneUserName;
            this.setComplete = true;
        }
        else if (this.compTwoWins >= this.winCondition ) {
            //ensure over clicks don't cause bad data
            this.compTwoWins = this.winCondition;
            this.winner = this.compTwoUserName;
            this.setComplete = true;
        }

        if (this.setComplete) {
            this.writer.writeDataToFile('set/winner.txt', this.winner + " Won!");
        }
        else {
            this.calculateGameNumber();
        }

        return this.setComplete;
    };

    /**
     * Increments the wins of the first competitor
     * @returns {boolean}
     */
    this.incrementCompOneWins = function () {
        this.compOneWins++;
        this.writer.writeDataToFile('set/competitor_one_wins.txt', this.compOneWins);
        return this.compareWinsToWinCondition();
    };

    /**
     * Increments the wins of the second competitor
     * @returns {boolean}
     */
    this.incrementCompTwoWins = function () {
        this.compTwoWins++;
        this.writer.writeDataToFile('set/competitor_two_wins.txt', this.compTwoWins);
        return this.compareWinsToWinCondition();
    };


    /**
     * Decrements the wins of the first competitor
     * @returns {boolean}
     */
    this.decrementCompOneWins = function () {
        this.compOneWins--;
        this.writer.writeDataToFile('set/competitor_one_wins.txt', this.compOneWins);
        return this.compareWinsToWinCondition();
    };

    /**
     * Decrements the wins of the second competitor
     * @returns {boolean}
     */
    this.decrementCompTwoWins = function () {
        this.compTwoWins--;
        this.writer.writeDataToFile('set/competitor_two_wins.txt', this.compTwoWins);
        return this.compareWinsToWinCondition();
    };

    /**
     * Helper method to calculate how many wins are required to win the set
     * @param bestOf
     * @returns {number}
     */
    let calculateWinCondition = function (bestOf) {
        return Math.ceil(bestOf / 2 );
    };

    /**
     * Helper method to determine if a number is odd
     * @param num
     * @returns {number}
     */
    function isOdd(num) { return num % 2;};


    /**
     * Creates and returns a json object of the set
     */
    this.getSetJson = function (set) {
        let response = JSON.stringify(set);
        response = response + "\r\n";
        return response;

    };

    /**
     * Resets the set back to its default state
     */
    this.clearSet = function (set) {
        if (set.setComplete) {
            this.writer.logEntireSet(set);
        }

        //Reset Values
        this.compOneUserName = "";
        this.compOneWins = 0;
        this.compTwoUserName = "";
        this.compTwoWins = 0;
        this.winCondition = 0;
        this.bestOf = 0;
        this.winner = "";
        this.gameNumber = 0;
        this.setComplete = false;

        //Reset logs
        this.writer.writeDataToFile('set/competitor_one_user_name.txt', "");
        this.writer.writeDataToFile('set/competitor_two_user_name.txt', "");
        this.writer.writeDataToFile('set/competitor_one_wins.txt', "");
        this.writer.writeDataToFile('set/competitor_two_wins.txt', "");
        this.writer.writeDataToFile('set/best_of.txt', "");
        this.writer.writeDataToFile('set/win_condition.txt', "");
        this.writer.writeDataToFile('set/winner.txt', "");
        this.writer.writeDataToFile('set/game_number.txt', "");
    };

    this.getC1Name = function () {
        return this.compTwoUserName;
    };

    this.getC2Name = function () {
        return this.compTwoUserName;
    };

};

module.exports = {
    createSet : function () {
        return new compSet();
    }
};

