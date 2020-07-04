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
        this.writer.appendDataToFile('streak/streak_log.txt', this.getStreakJson(streak));
    }

    this.clearLogFile = function (streak) {
        this.writer.writeDataToFile('streak/streak_log.txt', "");
    }

    this.calculateKingOfTheHill = function () {
        //Get data from the streak_log.txt file
        let streakLogTxt = fs.readFileSync(path.resolve('streak','streak_log.txt'), 'utf8');
        const data = JSON.parse(this.cleanUpJson(streakLogTxt));

        let leaderboard = new SortableMap();
        let response = [];

        //Filter thru data and get the highest streak per competitor. Removes duplicates
        let objectKeysArray = Object.keys(data);
        objectKeysArray.forEach(function(objKey) {
            let arenaStreak = data[objKey];
            // console.log(arenaStreak);

            if (leaderboard.has(arenaStreak.victor)) {
                if (arenaStreak.consecutiveWins > leaderboard.get(arenaStreak.victor)) {
                    leaderboard.set( arenaStreak.victor, arenaStreak.consecutiveWins );
                }
            }
            else {
                leaderboard.set( arenaStreak.victor, arenaStreak.consecutiveWins );
            }
        });
        //Remove placeholder that will always be in the logs
        leaderboard.delete("No Victor")
        //Sort data
        leaderboard.sort( (a, b) => a[1] - b[1] );

        console.log(leaderboard);

        //Update the repsonse to be user friendly
        response.push("-----------------------------------------------")
        for (const [key, value] of leaderboard.entries()) {
            response.push(key + " had a max streak of " + value);
        }
        response.push("-----------------------------------------------")
        response.push("|         Leaderbaord for " + this.getDate() + "         |")
        response.push("-----------------------------------------------")
        response.reverse();

        return response;
    }

    this.getStreakJson = function (streak) {
        let response = JSON.stringify(streak);
        response = response + "\r\n";
        response = response + ",";
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

    this.getDate = function() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today
    }

};

class SortableMap extends Map {
    sort(cmp = (a, b) => a[0].localeCompare(b[0])) {
        for (const [key, value] of [...this.entries()].sort(cmp)) {
            this.delete(key);
            this.set(key, value); // New keys are added at the end of the order
        }
    }
}

module.exports = {
    createStreak : function () {
        return new streak();
    }
};