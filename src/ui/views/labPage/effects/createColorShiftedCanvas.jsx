import {COLOR_PALETTE} from '../constants';
export const createColorShiftedCanvas = (sourceCanvas, colorChannel) => {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = sourceCanvas.width;
    newCanvas.height = sourceCanvas.height;
    const newCtx = newCanvas.getContext('2d');

    if (!newCtx) return sourceCanvas;

    // Draw the original canvas
    newCtx.drawImage(sourceCanvas, 0, 0);

    // Define accent colors
    const accentColors = [
        {hex: COLOR_PALETTE.accent1, r: 156, g: 65, b: 247},   // Purple
        {hex: COLOR_PALETTE.accent2, r: 194, g: 97, b: 64},    // Terracotta
        {hex: COLOR_PALETTE.accent3, r: 6, g: 186, b: 99},     // Green
        {hex: COLOR_PALETTE.accent4, r: 251, g: 208, b: 56}    // Yellow
    ];

    // Get image data
    const imageData = newCtx.getImageData(0, 0, newCanvas.width, newCanvas.height);
    const data = imageData.data;

    // Choose color based on color channel
    let chosenColor;
    if (colorChannel === 'r') {
        chosenColor = accentColors[3]; // Yellow for red
    } else if (colorChannel === 'g') {
        chosenColor = accentColors[2]; // Green for green
    } else if (colorChannel === 'b') {
        chosenColor = accentColors[0]; // Purple for blue
    } else {
        return sourceCanvas;
    }

    // Apply color shift
    for (let i = 0; i < data.length; i += 4) {
        // Preserve original brightness while shifting to accent color
        const brightness = data[i] / 255;
        data[i] = Math.round(chosenColor.r * brightness);
        data[i + 1] = Math.round(chosenColor.g * brightness);
        data[i + 2] = Math.round(chosenColor.b * brightness);

        // Reduce opacity slightly for better blending
        data[i + 3] = Math.max(data[i + 3] - 50, 0);
    }

    // Put the modified image data back
    newCtx.putImageData(imageData, 0, 0);

    return newCanvas;
};
