var Jimp = require('jimp');
const {cv, cvTranslateError} = require('opencv-wasm');
let env = require('custom-env').env();
let path = require('path');
const Streamlink = require('streamlink');
var fs = require('fs');

frameProcessing = function() {
    this.invertImage = async function(imagePath) {
        const image = await Jimp.read(imagePath);
        image.invert()
            .write('./images/inverted.png');
        console.log("Image Inversion Completed");
    }

    this.crop = async function(x,y,w,h, imagePath) {
        // Read the image.
        const image = await Jimp.read(imagePath);
        await image.crop(x, y, w, h);
        // Save and overwrite the image
        await image.writeAsync(`images/cropped.png`);
        console.log("Image Cropping Completed");
    }

    this.whoWonTheMatch = async function () {
        let redResult = await this.templateMatching(true);
        let blueResult = await this.templateMatching(false);

        let redWon = this.calcVictor(redResult.maxLoc.x, redResult.maxVal, true);
        let blueWon = this.calcVictor(blueResult.maxLoc.x, blueResult.maxVal, false);

        if (!this.isEmpty(redWon) && redWon) {
            //incrementStreak
            console.log("Red Made it!");
        }

        if (!this.isEmpty(blueWon) && blueWon) {
            //Alert The Streamer that the streak must be changed
            //Eventually could do auto text recog on a cropped and inverted image to populate the streak victor
            console.log("Blue Made it!");
        }

    }


    this.templateMatching = async function(redROI) {

        try {
            // const imageSource = await Jimp.read('./images/arena_winner.png');
            const imageSource = await Jimp.read('./images/arena_winner.png');
            const imageTemplate = await Jimp.read('./images/small_winner_1.png');

            let src = cv.matFromImageData(imageSource.bitmap);
            let templ = cv.matFromImageData(imageTemplate.bitmap);
            let processedImage = new cv.Mat();
            let mask = new cv.Mat();

            if (redROI) {
                // console.log("red is true");
                let rect = new cv.Rect(500, 180, 100, 100); //the left side
                processedImage = src.roi(rect);
            }
            if (!redROI){
                // console.log("blue is true");
                let rect = new cv.Rect(675, 180, 75, 75); //the right side
                processedImage = src.roi(rect);
            }
            cv.matchTemplate(src, templ, processedImage, cv.TM_CCOEFF_NORMED, mask);
            let result = cv.minMaxLoc(processedImage, mask);
            return result;

            //The following commented code is for printing test images to verify the matching process
            // cv.threshold(processedImage, processedImage, 0.726, 1, cv.THRESH_BINARY);
            // processedImage.convertTo(processedImage, cv.CV_8UC1);
            //
            // let contours = new cv.MatVector();
            // let hierarchy = new cv.Mat();
            //
            // cv.findContours(processedImage, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            // for (let i = 0; i < contours.size(); ++i) {
            //     let countour = contours.get(i).data32S; // Contains the points
            //     let x = countour[0];
            //     let y = countour[1];
            //
            //     let color = new cv.Scalar(0, 255, 0, 255);
            //     let pointA = new cv.Point(x, y);
            //     let pointB = new cv.Point(x + templ.cols, y + templ.rows);
            //     cv.rectangle(src, pointA, pointB, color, 2, cv.LINE_8, 0);
            // }
            //
            // new Jimp({
            //     width: src.cols,
            //     height: src.rows,
            //     data: Buffer.from(src.data)
            // })
            //     .write('./images/template-matching.png');


            // console.log(result);
            // return result;
        } catch (err) {
            console.log(cvTranslateError(cv, err));
        }
    }

    this.isEmpty = function(str) {
        return (!str || 0 === str.length);
    }

    this.calcVictor = function(resultXValue, accuracy, red) {
        if (accuracy > 0.726) {
            var counts = [500, 700];
            var closest = counts.reduce(function (prev, curr) {
                return (Math.abs(curr - resultXValue) < Math.abs(prev - resultXValue) ? curr : prev);
            });
            if (closest === 500) {
                return red; //Red won
            }
            return !red; //Blue won
        }
        return ""; //Accuracy too low to do anything
    }

    this.createStreamFile = function () {

        var stream = new Streamlink(process.env.CHANNEL_URL);
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

}

module.exports = {
    createFrameProcessing: function () {
        return new frameProcessing();
    }
};