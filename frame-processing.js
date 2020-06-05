var Jimp = require('jimp');

// User-Defined Function to read the images
async function main() {
    const image = await Jimp.read
    ('./images/test_4.png');
    //https://media.geeksforgeeks.org/wp-content/uploads/20190328185307/gfg28.png
// invert function
    image.invert()
        .write('./images/inverted.png');
}

main();
console.log("Image Processing Completed");



