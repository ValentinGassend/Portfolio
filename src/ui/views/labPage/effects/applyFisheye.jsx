export const applyFisheye = (sourceCtx, destCtx, strength) => {
    const width = sourceCtx.canvas.width;
    const height = sourceCtx.canvas.height;

    // If the effect is too weak, don't apply it (optimization for performance)
    if (strength < 0.01) {
        destCtx.drawImage(sourceCtx.canvas, 0, 0);
        return;
    }

    // Parameters for the effect
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height) / 2;
    const maxDistortion = strength * 0.6; // Normal fisheye effect

    // OPTIMIZATION: Reduce resolution during processing
    // The stronger the fisheye effect, the more we can reduce the resolution
    // without it being perceptible
    const isDragging = strength > 0.4; // Approximate if dragging based on effect strength
    const scale = isDragging ? 0.5 : 0.75; // Reduce more during drag for better fluidity
    const scaledWidth = Math.floor(width * scale);
    const scaledHeight = Math.floor(height * scale);

    // Create a reduced image for processing
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = scaledWidth;
    tempCanvas.height = scaledHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(sourceCtx.canvas, 0, 0, width, height, 0, 0, scaledWidth, scaledHeight);

    let processedImageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight);

    // Destination at the correct size
    const destImageData = destCtx.createImageData(width, height);

    // OPTIMIZATION: Process one pixel out of two to speed up rendering
    // The human eye won't detect this difference during movement
    const step = isDragging ? 2 : 1; // Skip pixels during drag

    // For each pixel in the destination image
    for (let y = 0; y < height; y += step) {
        const scaledY = Math.floor(y * scale);

        for (let x = 0; x < width; x += step) {
            const scaledX = Math.floor(x * scale);

            // Calculate the normalized distance from the pixel to the center
            const dx = (x - centerX) / radius;
            const dy = (y - centerY) / radius;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate the distortion factor
            const distortionFactor = 1.0 - distance * maxDistortion;

            // Calculate the new coordinates
            let srcX = Math.floor((centerX + (x - centerX) * distortionFactor) * scale);
            let srcY = Math.floor((centerY + (y - centerY) * distortionFactor) * scale);

            // Ensure that coordinates are within bounds
            srcX = Math.max(0, Math.min(scaledWidth - 1, srcX));
            srcY = Math.max(0, Math.min(scaledHeight - 1, srcY));

            // Pixel transfer
            const destIndex = (y * width + x) * 4;
            const srcIndex = (srcY * scaledWidth + srcX) * 4;

            // Copy RGBA values directly
            destImageData.data[destIndex] = processedImageData.data[srcIndex];
            destImageData.data[destIndex + 1] = processedImageData.data[srcIndex + 1];
            destImageData.data[destIndex + 2] = processedImageData.data[srcIndex + 2];
            destImageData.data[destIndex + 3] = processedImageData.data[srcIndex + 3];

            // OPTIMIZATION: Fill neighboring pixels for the case where step > 1
            if (step > 1) {
                // Fill the pixel to the right if possible
                if (x + 1 < width) {
                    const rightIndex = destIndex + 4;
                    destImageData.data[rightIndex] = processedImageData.data[srcIndex];
                    destImageData.data[rightIndex + 1] = processedImageData.data[srcIndex + 1];
                    destImageData.data[rightIndex + 2] = processedImageData.data[srcIndex + 2];
                    destImageData.data[rightIndex + 3] = processedImageData.data[srcIndex + 3];
                }

                // Fill the pixel below if possible
                if (y + 1 < height) {
                    const bottomIndex = destIndex + width * 4;
                    destImageData.data[bottomIndex] = processedImageData.data[srcIndex];
                    destImageData.data[bottomIndex + 1] = processedImageData.data[srcIndex + 1];
                    destImageData.data[bottomIndex + 2] = processedImageData.data[srcIndex + 2];
                    destImageData.data[bottomIndex + 3] = processedImageData.data[srcIndex + 3];

                    // Fill the diagonal pixel
                    if (x + 1 < width) {
                        const diagIndex = bottomIndex + 4;
                        destImageData.data[diagIndex] = processedImageData.data[srcIndex];
                        destImageData.data[diagIndex + 1] = processedImageData.data[srcIndex + 1];
                        destImageData.data[diagIndex + 2] = processedImageData.data[srcIndex + 2];
                        destImageData.data[diagIndex + 3] = processedImageData.data[srcIndex + 3];
                    }
                }
            }
        }
    }

    // Free temporary resources
    tempCanvas = null;

    // Update the destination image
    destCtx.putImageData(destImageData, 0, 0);
};