import { MIN_SIZE, MAX_SIZE } from '../constants.js';
import { doesOverlap } from './canvasUtils.js';
import {createSplitChannelCanvas} from "../effects/createSplitChannelCanvas.jsx";
import {createColorShiftedCanvas} from "../effects/createColorShiftedCanvas.jsx";


// Create non-overlapping images for the scene
export const createNonOverlappingImages = (projectImageRefs, patternWidth, patternHeight) => {
    // Check if we have any loaded images
    if (!projectImageRefs.current ||
        (Array.isArray(projectImageRefs.current) && projectImageRefs.current.length === 0)) {
        console.error("No project images available");
        return [];
    }

    // Extract the actual image array - handle both formats of projectImageRefs
    const imageArray = Array.isArray(projectImageRefs.current)
        ? projectImageRefs.current
        : [projectImageRefs.current];

    console.log(`Creating projects from ${imageArray.length} loaded images`);

    const images = [];
    const existingRects = [];
    let attempts = 0;
    const maxAttempts = 1000;

    // Size range for normalizing the parallax factor
    const sizeRange = MAX_SIZE - MIN_SIZE;

    // Create one position for each loaded image
    const imageCount = imageArray.length;

    for (let i = 0; i < imageCount && attempts < maxAttempts; i++) {
        // Get the current image object
        const currentImage = imageArray[i];

        // Get the actual image element (handle both formats)
        const imgElement = currentImage.img || currentImage;

        // Extract meaningful name from filename
        // Remove extension and any path components
        const rawFilename = currentImage.filename || `project${i + 1}.webp`;
        const filename = rawFilename.split('/').pop(); // Remove any path components

        // Create a nice display name by:
        // 1. Removing the extension
        // 2. Replacing hyphens and underscores with spaces
        // 3. Capitalizing first letter of each word
        const displayName = filename
            .replace(/\.webp$/i, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, letter => letter.toUpperCase());

        // Calculate original aspect ratio from the image
        const originalWidth = imgElement.width || 1;
        const originalHeight = imgElement.height || 1;
        const aspectRatio = originalWidth / originalHeight;

        console.log(`Image "${filename}" - Original dimensions: ${originalWidth}x${originalHeight}, ratio: ${aspectRatio.toFixed(2)}`);

        // Choose a random size, respecting the original aspect ratio
        let width, height;

        // Decide if we constrain by width or height to stay within min/max bounds
        if (aspectRatio >= 1) {
            // Image is wider than tall or square - constrain by width first
            width = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
            height = width / aspectRatio;

            // Check if height is too small
            if (height < MIN_SIZE) {
                // Recalculate with height = MIN_SIZE
                height = MIN_SIZE;
                width = height * aspectRatio;
                // Check if width is too large now
                if (width > MAX_SIZE) {
                    width = MAX_SIZE;
                    height = width / aspectRatio;
                }
            }
        } else {
            // Image is taller than wide - constrain by height first
            height = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
            width = height * aspectRatio;

            // Check if width is too small
            if (width < MIN_SIZE) {
                // Recalculate with width = MIN_SIZE
                width = MIN_SIZE;
                height = width / aspectRatio;
                // Check if height is too large now
                if (height > MAX_SIZE) {
                    height = MAX_SIZE;
                    width = height * aspectRatio;
                }
            }
        }

        console.log(`Project tile dimensions: ${width.toFixed(0)}x${height.toFixed(0)}`);

        // Calculate parallax factor based on the larger dimension
        const largerDimension = Math.max(width, height);
        const sizeRatio = (largerDimension - MIN_SIZE) / sizeRange;
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
            console.warn(`Couldn't find position for image ${i}, skipping`);
            continue;
        }

        // Add to existing rectangles
        existingRects.push(newRect);

        // Create a placeholder image (canvas-generated) with project background
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = newRect.width;
        imageCanvas.height = newRect.height;
        const imageCtx = imageCanvas.getContext('2d');

        if (imageCtx && imgElement) {
            // Draw the project background image, properly scaled to fit
            imageCtx.drawImage(
                imgElement,
                0, 0, imgElement.width, imgElement.height, // Source rectangle
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
            imageCtx.fillText(displayName, newRect.width / 2, newRect.height / 2);

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
                size: Math.max(width, height), // Store the larger dimension for sorting
                sizeRatio: sizeRatio, // Normalized size ratio between 0 and 1
                name: displayName, // Use the formatted display name
                filename: filename, // Keep original filename for reference
                aspectRatio: aspectRatio, // Store the original aspect ratio
                sourceImageIndex: i // Store which image was used (for reference)
            });
        }
    }

    console.log(`Created ${images.length} project tiles from ${imageCount} images`);
    return images;
};