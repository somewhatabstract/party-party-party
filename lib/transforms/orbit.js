/**
 * Calculate offsets to make orbits around the center.
 * @param {number} frameCount Number of frames over which to complete an orbit
 * @param {number} orbitRadius The radius of the orbit from the origin
 */
function calcOrbitOffsets(frameCount, orbitRadius) {
    function getXOffset(frameIndex) {
        return orbitRadius * Math.sin(2 * Math.PI * (-frameIndex / frameCount));
    }

    function getYOffset(frameIndex) {
        return orbitRadius * Math.cos(2 * Math.PI * (-frameIndex / frameCount));
    }

    const frameOffsets = [];
    for (let i = 0; i < frameCount; i++) {
        const x = Math.round(getXOffset(i));
        const y = Math.round(getYOffset(i));
        frameOffsets.push([x, y])
    }
    return frameOffsets;
}

module.exports = calcOrbitOffsets;