const gifEncoder = require("gif-encoder");


/**
 * Generates a GIF of the given dimensions in the given output stream, calling
 * the generateFramesCallback function to actually add the frames for the GIF.
 * @param {number} width The width of the image
 * @param {number} height The height of the image
 * @param {stream.Writeable} outputStream The stream where the image is to
 * be written
 * @param {(addFrame:Function)=>void} generateFramesCallback The callback
 * responsible for creating frames. This receives an addFrame function that the
 * callback can use to add frames to the GIF.
 */
function outputGif(width, height, outputStream, generateFramesCallback) {
    const gif = new gifEncoder(width, height);
    gif.pipe(outputStream);

    gif.setDelay(50);
    gif.setRepeat(0);
    gif.setTransparent("0x00FF00");
    gif.writeHeader();
    gif.on("readable", function() {
        gif.read();
    });

    function addFrame(frameData) {
        gif.addFrame(frameData);
        gif.flushData();
    }

    generateFramesCallback(addFrame)

    gif.finish();
}

module.exports = outputGif;