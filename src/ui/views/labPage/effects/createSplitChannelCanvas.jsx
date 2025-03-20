export const createSplitChannelCanvas = (sourceCanvas) => {
    // Prepare the three canvases - one for each channel (red, green, blue)
    const redCanvas = document.createElement('canvas');
    const greenCanvas = document.createElement('canvas');
    const blueCanvas = document.createElement('canvas');

    // Same dimensions as source canvas
    redCanvas.width = sourceCanvas.width;
    redCanvas.height = sourceCanvas.height;
    greenCanvas.width = sourceCanvas.width;
    greenCanvas.height = sourceCanvas.height;
    blueCanvas.width = sourceCanvas.width;
    blueCanvas.height = sourceCanvas.height;

    // Rendering contexts
    const redCtx = redCanvas.getContext('2d');
    const greenCtx = greenCanvas.getContext('2d');
    const blueCtx = blueCanvas.getContext('2d');

    // Get image data from source canvas
    redCtx.drawImage(sourceCanvas, 0, 0);
    greenCtx.drawImage(sourceCanvas, 0, 0);
    blueCtx.drawImage(sourceCanvas, 0, 0);

    // Modify data to isolate each channel with more intensity
    const redData = redCtx.getImageData(0, 0, redCanvas.width, redCanvas.height);
    const greenData = greenCtx.getImageData(0, 0, greenCanvas.width, greenCanvas.height);
    const blueData = blueCtx.getImageData(0, 0, blueCanvas.width, blueCanvas.height);

    // Red channel with more pronounced violet color
    for (let i = 0; i < redData.data.length; i += 4) {
        // Use pixel brightness to modulate color intensity
        const brightness = (redData.data[i] + redData.data[i + 1] + redData.data[i + 2]) / (3 * 255);

        // Apply purple color (based on accent1 but more vivid)
        redData.data[i] = Math.min(255, Math.round(180 * brightness * 1.5));    // More red
        redData.data[i + 1] = Math.min(255, Math.round(50 * brightness));       // Little green
        redData.data[i + 2] = Math.min(255, Math.round(255 * brightness * 1.5)); // Maximum blue

        // Apply opacity relative to brightness for better glow effect
        // Lighter parts are more visible, darker parts more transparent
        redData.data[i + 3] = Math.max(30, Math.min(255, redData.data[i + 3] * (0.6 + brightness * 0.6)));
    }

    // Green channel with more vivid green
    for (let i = 0; i < greenData.data.length; i += 4) {
        const brightness = (greenData.data[i] + greenData.data[i + 1] + greenData.data[i + 2]) / (3 * 255);

        // Vivid green (based on accent3 but more intense)
        greenData.data[i] = Math.min(255, Math.round(10 * brightness));         // Almost no red
        greenData.data[i + 1] = Math.min(255, Math.round(240 * brightness * 1.5)); // Maximum green
        greenData.data[i + 2] = Math.min(255, Math.round(70 * brightness));      // Little blue

        // Opacity relative to brightness as for red
        greenData.data[i + 3] = Math.max(30, Math.min(255, greenData.data[i + 3] * (0.6 + brightness * 0.6)));
    }

    // Blue channel (maintained for compatibility)
    for (let i = 0; i < blueData.data.length; i += 4) {
        const brightness = (blueData.data[i] + blueData.data[i + 1] + blueData.data[i + 2]) / (3 * 255);

        // Strong blue with minimal other colors
        blueData.data[i] = Math.min(255, Math.round(20 * brightness));           // Minimal red
        blueData.data[i + 1] = Math.min(255, Math.round(80 * brightness));       // Some green
        blueData.data[i + 2] = Math.min(255, Math.round(230 * brightness * 1.5)); // Strong blue

        // Adjust alpha
        blueData.data[i + 3] = Math.min(255, blueData.data[i + 3] * 0.9);
    }

    // Apply modified data
    redCtx.putImageData(redData, 0, 0);
    greenCtx.putImageData(greenData, 0, 0);
    blueCtx.putImageData(blueData, 0, 0);

    return {
        redCanvas,
        greenCanvas,
        blueCanvas
    };
};
