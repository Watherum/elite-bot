let Tesseract = require('tesseract.js');
const {spawn, exec} = require('child_process');

textRecog = function () {
    this.parseTextFromStream = function (imagePath) {
        const { createWorker } = Tesseract;
        let invertedImage = (imagePath);

        const worker = createWorker({
            logger: m => console.log(m)
        });

        try {
            (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(invertedImage);
                console.log(text);
                await worker.terminate();
            })();
        }
        catch {

        }

    };

};

module.exports = {
    createTextRecognition: function () {
        return new textRecog();
    }
};