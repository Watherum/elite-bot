const fileSystem = require('./file.js');
const fs = require('fs');
const path = require("path");

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
        this.writer.writeDataToFile('streak/wins.txt', "");
    };

    this.setWins = function(numberOfWins) {
        this.consecutiveWins = numberOfWins;
        this.writer.writeDataToFile('streak/wins.txt', this.consecutiveWins);
    }

    this.getVictor = function() {
        return this.victor;
    }

    this.getConsecutiveWins = function() {
        return this.consecutiveWins;
    }

    this.logStreak = function(streak) {
        console.log(this.isEmpty(streak.getVictor()));
        console.log(streak.getConsecutiveWins());
        this.writer.appendDataToFile('streak/streak_log.txt', this.getStreakJson(streak));
        this.writer.appendDataToFile('streak/streak_log.txt', ',');
    }

    this.calculateKingOfTheHill = function () {
        let streakLogTxt = fs.readFileSync(path.resolve('streak','streak_log.txt'), 'utf8');
        const data = JSON.parse(this.cleanUpJson(streakLogTxt));
        let maxStreakNumber = 0;
        let maxStreakVictor = 0;

        //TODO implement better handling for ties and multiway matches

        let objectKeysArray = Object.keys(data)
        objectKeysArray.forEach(function(objKey) {
            let arenaStreak = data[objKey];
            console.log(arenaStreak);
            if (arenaStreak.consecutiveWins > maxStreakNumber) {
                maxStreakNumber = arenaStreak.consecutiveWins;
                maxStreakVictor = arenaStreak.victor;
            }
        });
        return maxStreakVictor + ' is tonights Stream Champion with ' + maxStreakNumber + ' consecutive wins!';
    }

    this.getStreakJson = function (streak) {
        let response = JSON.stringify(streak);
        response = response + "\r\n";
        return response;
    };

    this.isEmpty = function(str) {
        return (!str || 0 === str.length);
    }

    this.cleanUpJson = function(text) {
        text = text.substring(0, text.length - 1);
        text = text.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
            // remove non-printable and other non-valid JSON chars
        text = text.replace(/[\u0000-\u0019]+/g,"");
        text = '[' + text + ']';
        return text;
    }

};

module.exports = {
    createStreak : function () {
        return new streak();
    }
};