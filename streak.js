const fileSystem = require('./file.js');

streak = function() {

    this.victor = "";
    this.consecutiveWins = 0;
    this.writer = fileSystem.createWriter();

    this.incrementWins = function () {
        this.consecutiveWins++;
        this.writer.writeDataToFile('streak/wins.txt', this.consecutiveWins);
    };

    this.decrementWins = function () {
        this.consecutiveWins--;
        this.writer.writeDataToFile('streak/wins.txt', this.consecutiveWins);
    };

    this.setVictor = function (username) {
        this.victor = username;
        this.writer.writeDataToFile('streak/victor.txt', this.victor);
    };

    this.resetStreak = function () {
        this.victor = "";
        this.consecutiveWins = 0;
        this.writer.writeDataToFile('streak/victor.txt', this.victor);
        this.writer.writeDataToFile('streak/wins.txt', this.consecutiveWins);
    };

    this.setWins = function(numberOfWins) {
        this.consecutiveWins = numberOfWins;
    }

};

module.exports = {
    createStreak : function () {
        return new streak();
    }
};