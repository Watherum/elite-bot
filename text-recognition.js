let env = require('custom-env').env();
let request = require("request");
let Tesseract = require('tesseract.js');
var fs = require('fs');
let path = require('path');
const {spawn, exec} = require('child_process');
const Streamlink = require('streamlink');


textRecog = function () {

    this.createStreamFile = function () {

        var stream = new Streamlink(process.env.VIDEO_URL);
        stream.output('./streams/' + Date.now() + '.flv').start();
        stream.getQualities();
        stream.quality("best");

        stream.on('quality', (data) => {
            console.log(data);
        });

        stream.on('err', (err) => {
            console.log(err);
        });

        stream.on('end', (o) => {
            console.log("Stream ended");
            console.log(o);
        });

        stream.on('log', (data) => {
            console.log(data);
        });

    };

    this.getStreamFile = function (directory) {

        // Check if directory exist or not right here

        let latest;

        let files = fs.readdirSync(directory);
        files.forEach(filename => {
            // Get the stat
            let stat = fs.lstatSync(path.join(directory, filename));
            // Pass if it is a directory
            if (stat.isDirectory())
                return;

            // latest default to first file
            if (!latest) {
                latest = {filename, mtime: stat.mtime};
                return;
            }
            // update latest if mtime is greater than the current latest
            if (stat.mtime > latest.mtime) {
                latest.filename = filename;
                latest.mtime = stat.mtime;
            }
        });

        // console.log(latest.filename); //useful for debugging
        return latest.filename;
    };

    this.parseTextFromStream = function () {
        const { createWorker } = Tesseract;
        this.createStreamFile();
        // let video = this.getStreamFile('./streams/.');
        let video = 'https://tesseract.projectnaptha.com/img/eng_bw.png';

        const worker = createWorker({
            logger: m => console.log(m)
        });

        try {
            (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(video);
                console.log(text);
                await worker.terminate();
            })();
        }
        catch {

        }
        //D:\Local Disk C\Red Ops\Websites\elite-bot\streams\eng_bw.png

    };

};

module.exports = {
    createTextRecognition: function () {
        return new textRecog();
    }
};