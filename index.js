const getPixels = require("get-pixels");
const createGreyscaleColorMapping = require("./lib/grayscale");
const orbitTransform = require("./lib/transforms/orbit");
const outputGif = require("./lib/gif");
const PARTY_PALATalette = require("./lib/party-palette");

const colours = PARTY_PALETTE;

// INPROGRESS(somewhatabstract): Make this generic and allow colouring rules and such.
function createImage(inputFilename, outputStream, palette, transforms, frameCount, options) {
    const offset = transforms
        .map(t => t(frameCount, options))
        .reduce((prev, current) => {});


    // TODO: Calculate each frame offsets for each transform and combine them
    //TODO: apply transforms, map colors, produce image.
}

/**
 * Writes a party version of the given input image to the specified output stream.
 * @param {string} inputFilename A GIF image file to be partified
 * @param {stream.Writable} outputStream The stream where the partified image is to be written
 * @param {number} partyRadius The radius used to animate movement in the output image
 */
function createPartyImage(inputFilename, outputStream, partyRadius) {
    // createImage(
    //     inputFilename,
    //      outputStream, PARTY_PALETTE, [orbitTransform], {
    //     partyRadius: partyRadius,
    // });

    //TODO(somewhatabstract): Add other variations to radius, like tilt (for bobbling side to side)
    const partyOffset = orbitTransform(PARTY_PALETTE.length, partyRadius);

    function processImage(err, pixels) {
        if (err) {
            console.error(`Invalid image path: ${err}`);
            return;
        }

        const { shape } = pixels;
        const [width, height] = shape;
        const getPixelValue = createGreyscaleColorMapping(pixels);

        //TODO(somewhatabstract): Allow colours array to be passed in so that we can have
        // things like a single colour of white to create a greyscale image.

        //TODO(somewhatabstract): Separate frame count from color count and then use some
        // mod arithmetic to map colour to frame. This will allow us to have
        // animated movement without necessarily lots of colour changes.
        outputGif(width, height, outputStream, addFrame => {
            //TODO(somewhatabstract): Move the process of colorizing to its own JS file.
            // All that refactoring should then make it easier to add tests.
            colours.forEach(function(c, colourIndex) {
                const offset = partyOffset[colourIndex];
                const p = [];

                // Map over each pixel in the image and determine what color that
                // pixel should be. We do that by transforming the pixel we're
                // writing according to our transforms, which maps it back to a
                // source pixel, which we can then look up in our coloring and
                // apply accordingly.
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const pixelValue = getPixelValue(
                            x + offset[0],
                            y + offset[1]
                        );

                        // If we don't want something here, then add a transparent
                        // pixel.
                        if (pixelValue) {
                            // Let's map to our current color.
                            p.push(pixelValue * c[0] / 255);
                            p.push(pixelValue * c[1] / 255);
                            p.push(pixelValue * c[2] / 255);
                            p.push(255);
                        } else {
                            // Assume a transparent pixel.
                            p.push(0);
                            p.push(255);
                            p.push(0);
                            p.push(0);
                        }
                    }
                }

                addFrame(p);
            });
        });
    }

    getPixels(inputFilename, processImage);
}

module.exports = createPartyImage;