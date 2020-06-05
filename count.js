const fileSystem = require('./file.js');

count = function() {

    this.info = "";
    this.number = 0;
    this.writer = fileSystem.createWriter();

    this.incrementNumber = function () {
        this.number++;
        this.writer.writeDataToFile('count/number.txt', this.number);
    };

    this.decrementNumber = function () {
        this.number--;
        this.writer.writeDataToFile('count/number.txt', this.number);
    };

    this.resetCount = function () {
        this.info = "";
        this.number = 0;
        this.writer.writeDataToFile('count/info.txt', this.info);
        this.writer.writeDataToFile('count/number.txt', this.number);
    };

    this.setCountNumber = function(newNumber) {
        this.number = newNumber;
        this.writer.writeDataToFile('count/number.txt', this.number);
    }

    this.setInformation = function (info) {
        this.info = info;
        this.writer.writeDataToFile('count/info.txt', this.info);
    }
}

module.exports = {
    createCount : function () {
        return new count();
    }
};