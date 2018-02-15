function createGreyscaleColorMapping(pixels) {
    const {shape} = pixels;
    const greyscale = [];

    for (var i = 0; i < pixels.data.length / 4; i += 1) {
        const idx = i * 4;
        if (pixels.data[idx + 3] < 64) {
            greyscale.push(-1);
        } else {
            const avg =
                (pixels.data[idx] +
                    pixels.data[idx + 1] +
                    pixels.data[idx + 2]) /
                3;
            greyscale.push(avg);
        }
    }

    /**
     * Given a coordinate, returns the pixel values for that location as an
     * array.
     *
     * @param {number} x
     * @param {number} y
     * @returns The value for the requested pixel, or undefined if it should be
     * transparent.
     */
    function getPixelValue(x, y) {
        // pixels.shape contains the dimensions of the image.
        if (x < 0 || x >= shape[0] || y < 0 || y >= shape[1]) {
            return;
        }
        const pixelValue = greyscale[x + y * shape[0]];
        if (pixelValue === -1) {
            return;
        }
        const TOO_DARK_THRESHOLD = 32;
        return pixelValue < TOO_DARK_THRESHOLD
                ? TOO_DARK_THRESHOLD
                : pixelValue;
    }
    return getPixelValue;
}

module.exports = createGreyscaleColorMapping;