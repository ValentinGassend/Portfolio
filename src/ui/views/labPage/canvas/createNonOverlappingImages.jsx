import { MIN_SIZE, MAX_SIZE } from '../constants.js';
import { doesOverlap } from './canvasUtils.js';
import {createSplitChannelCanvas} from "../effects/createSplitChannelCanvas.jsx";
import {createColorShiftedCanvas} from "../effects/createColorShiftedCanvas.jsx";


// Create non-overlapping images for the scene
export const createNonOverlappingImages = (projectImageRef, patternWidth, patternHeight, imageCount) => {
    if (!projectImageRef.current) return [];

    const images = [];
    const existingRects = [];
    let attempts = 0;
    const maxAttempts = 1000;

    // Size range for normalizing the parallax factor
    const sizeRange = MAX_SIZE - MIN_SIZE;

    // Create random positions for images within the pattern
    for (let i = 0; i < imageCount && attempts < maxAttempts; i++) {
        // Random size between minSize and maxSize
        const width = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
        const height = width * (0.7 + Math.random() * 0.6); // Random aspect ratio

        // Calculate parallax factor based on size
        // Smaller projects are closer to the grid factor (0.7)
        // Larger projects are closer to 1.0 (no parallax)
        const sizeRatio = (width - MIN_SIZE) / sizeRange;
        const parallaxFactor = 0.7 + (sizeRatio * 0.3); // Between 0.7 and 1.0

        let found = false;
        let newRect = null;
        let attemptsForThisRect = 0;
        const maxAttemptsForRect = 50;

        // Try to find a non-overlapping position
        while (!found && attemptsForThisRect < maxAttemptsForRect) {
            // Random position within pattern boundaries with padding
            const x = Math.random() * (patternWidth - width - 40) + 20;
            const y = Math.random() * (patternHeight - height - 40) + 20;

            newRect = {
                x,
                y,
                width,
                height
            };

            if (!doesOverlap(newRect, existingRects)) {
                found = true;
            }

            attemptsForThisRect++;
            attempts++;
        }

        // If we couldn't find a suitable position, skip this image
        if (!found) {
            continue;
        }

        // Add to existing rectangles
        existingRects.push(newRect);

        // Create a placeholder image (canvas-generated) with project background
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = newRect.width;
        imageCanvas.height = newRect.height;
        const imageCtx = imageCanvas.getContext('2d');

        if (imageCtx && projectImageRef.current) {
            // Draw the project background image, properly scaled to fit
            imageCtx.drawImage(
                projectImageRef.current,
                0, 0, projectImageRef.current.width, projectImageRef.current.height, // Source rectangle
                0, 0, newRect.width, newRect.height // Destination rectangle
            );

            // Apply a slight overlay to make text more readable
            // Smaller projects have a darker overlay to enhance the depth effect
            const overlayAlpha = 0.3 + (0.2 * (1 - sizeRatio)); // Smaller projects have darker overlay (0.5 for smallest, 0.3 for largest)
            imageCtx.fillStyle = `rgba(0, 0, 0, ${overlayAlpha})`;
            imageCtx.fillRect(0, 0, newRect.width, newRect.height);

            // Add project label with proportional font size
            imageCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            imageCtx.font = `bold ${Math.round(newRect.width / 10)}px Arial`;
            imageCtx.textAlign = 'center';
            imageCtx.textBaseline = 'middle';
            imageCtx.fillText(`Project ${i + 1}`, newRect.width / 2, newRect.height / 2);

            // Create color-shifted versions for 3D effect
            const redCanvas = createColorShiftedCanvas(imageCanvas, 'r');
            const blueCanvas = createColorShiftedCanvas(imageCanvas, 'b');

            // Create split channel versions for chromatic aberration effect
            const { redCanvas: redSplitCanvas, greenCanvas: greenSplitCanvas, blueCanvas: blueSplitCanvas } =
                createSplitChannelCanvas(imageCanvas);

            // Add shadow canvas for depth perception
            const shadowCanvas = document.createElement('canvas');
            shadowCanvas.width = newRect.width + 20; // Larger to contain shadow
            shadowCanvas.height = newRect.height + 20;
            const shadowCtx = shadowCanvas.getContext('2d');

            // Draw shadow with size-dependent intensity
            // Larger projects have more pronounced shadows (more in foreground)
            const shadowOpacity = 0.2 + (sizeRatio * 0.2); // 0.2 for small projects, 0.4 for large ones
            const shadowBlur = 5 + (sizeRatio * 10); // 5px for small, 15px for large
            const shadowOffsetX = 2 + (sizeRatio * 8); // 2px for small, 10px for large
            const shadowOffsetY = 2 + (sizeRatio * 8); // 2px for small, 10px for large

            shadowCtx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
            shadowCtx.shadowBlur = shadowBlur;
            shadowCtx.shadowOffsetX = shadowOffsetX;
            shadowCtx.shadowOffsetY = shadowOffsetY;
            shadowCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            shadowCtx.fillRect(5, 5, newRect.width - 10, newRect.height - 10);

            // Add to images array
            images.push({
                canvas: imageCanvas,
                shadowCanvas: shadowCanvas, // Store shadow canvas
                redCanvas: redCanvas,
                blueCanvas: blueCanvas,
                redSplitCanvas,
                greenSplitCanvas,
                blueSplitCanvas,
                patternX: newRect.x,
                patternY: newRect.y,
                width: newRect.width,
                height: newRect.height,
                opacity: 0,
                visible: false,
                rotation: 0,
                parallaxFactor: parallaxFactor, // Parallax factor based on size
                size: width, // Store the actual size for sorting
                sizeRatio: sizeRatio // Normalized size ratio between 0 and 1
            });
        }
    }

    return images;
};