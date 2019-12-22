const fs = require('fs');

writer = function() {
    /**
     * The following section handles writing the data in the set to the text files
     *
     * These files will be used to get the data on stream. OBS can read text from files
     */

    this.writeDataToFile = function (fileName , data) {
        fs.writeFile(fileName, data, (err) => {
            // In case of a error throw err.
            if (err) throw err;
        })
    };


    this.appendDataToFile = function (fileName , data) {
        fs.appendFile(fileName, data, (err) => {
            // In case of a error throw err.
            if (err) throw err;
        })
    };

    /**
     * Records the entire set to the set log.
     */
    this.logEntireSet = function (set) {
        this.appendDataToFile('set/set_log.txt', set.getSetJson(set));
    };


};

module.exports = {
    createWriter : function () {
        return new writer();
    }
};