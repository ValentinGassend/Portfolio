import { COLOR_PALETTE } from '../constants.js';
import { drawGrid, isInViewport } from './canvasUtils.js';
import {drawImageWithColorTrail} from "../effects/drawImageWithColorTrail.jsx";
import {applyGlobalColorTrail} from "../effects/applyGlobalColorTrail.jsx";
import {applyFisheye} from "../effects/applyFisheye.jsx";


// Main function to draw the canvas
const drawCanvas = ({
                               canvas,
                               offscreenCanvas,
                               ctx,
                               offscreenCtx,
                               images,
                               offsetX,
                               offsetY,
                               dragVelocityX,
                               dragVelocityY,
                               effectStrength,
                               fisheyeStrength,
                               patternWidth,
                               patternHeight
                           }) => {
    if (!ctx || !offscreenCtx) return { visibleTiles: 0, visibleInstances: 0 };

    // Clear the canvas
    offscreenCtx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. First, draw the background
    offscreenCtx.fillStyle = COLOR_PALETTE.neutral1;
    offscreenCtx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw the grid with the fixed parallax factor for the grid
    const gridParallaxFactor = 0.7;
    drawGrid(offscreenCtx, offsetX * gridParallaxFactor, offsetY * gridParallaxFactor, canvas.width, canvas.height);

    // Calculate the magnitude of velocity
    const velocityMagnitude = Math.sqrt(dragVelocityX * dragVelocityX + dragVelocityY * dragVelocityY);

    // Update debug counters
    let debugInfo = {
        visibleTiles: 0,
        visibleInstances: 0,
        offsetX: Math.round(offsetX),
        offsetY: Math.round(offsetY),
        velocityMagnitude: Math.round(velocityMagnitude * 100) / 100,
        effectStrength: Math.round(effectStrength * 100) / 100
    };

    // 3. Calculate visible tiles
    const startTileX = Math.floor((-offsetX - canvas.width) / patternWidth);
    const endTileX = Math.ceil((-offsetX + canvas.width) / patternWidth);
    const startTileY = Math.floor((-offsetY - canvas.height) / patternHeight);
    const endTileY = Math.ceil((-offsetY + canvas.width) / patternHeight);

    // 4. Collect all visible images with their calculated positions
    const visibleImagesData = [];
    const visibleIndices = new Set();

    for (let tileY = startTileY; tileY <= endTileY; tileY++) {
        for (let tileX = startTileX; tileX <= endTileX; tileX++) {
            debugInfo.visibleTiles++;

            // For each tile, collect visible images
            images.forEach((image, index) => {
                // Apply the parallax factor specific to each image
                const imgOffsetX = offsetX * image.parallaxFactor;
                const imgOffsetY = offsetY * image.parallaxFactor;

                // Calculate the position with this new offset
                const tilePixelX = tileX * patternWidth + imgOffsetX;
                const tilePixelY = tileY * patternHeight + imgOffsetY;

                const imgX = image.patternX + tilePixelX;
                const imgY = image.patternY + tilePixelY;

                if (isInViewport(imgX, imgY, image.width, image.height, canvas.width, canvas.height)) {
                    debugInfo.visibleInstances++;
                    visibleIndices.add(index);

                    // Add the image to the list of visible images with its position
                    visibleImagesData.push({
                        image,
                        x: imgX,
                        y: imgY,
                        width: image.width,
                        height: image.height,
                        size: image.size || image.width, // Use the size for sorting
                        velocity: {
                            x: dragVelocityX * image.parallaxFactor,
                            y: dragVelocityY * image.parallaxFactor
                        },
                        opacity: image.opacity,
                        index // Keep the original index for updating properties
                    });
                }
            });
        }
    }

    // 5. Sort images by size (small to large so that large ones are on top)
    visibleImagesData.sort((a, b) => a.size - b.size);

    // 6. Draw images in the sorted order (small first, large last)
    for (const imageData of visibleImagesData) {
        // Draw the image with trail if necessary
        drawImageWithColorTrail(
            offscreenCtx,
            imageData.image,
            imageData.x,
            imageData.y,
            imageData.width,
            imageData.height,
            imageData.velocity,
            imageData.opacity
        );
    }

    // 7. If the speed is sufficient or if the effect is still visible, apply the effect
    if (velocityMagnitude > 0.3 || effectStrength > 0.05) {
        // Pass effectStrength to the function to properly control the intensity
        applyGlobalColorTrail(
            offscreenCtx,
            offscreenCanvas,
            offsetX,
            offsetY,
            dragVelocityX,
            dragVelocityY,
            effectStrength
        );
    }

    // 8. Update the visibility of images
    const updatedImages = images.map((image, index) => {
        const isVisible = visibleIndices.has(index);
        const opacity = isVisible
            ? Math.min(image.opacity + 0.05, 1) // Fade in
            : Math.max(image.opacity - 0.05, 0); // Fade out

        return {
            ...image,
            visible: isVisible,
            opacity
        };
    });

    // 10. Apply the fisheye effect if necessary
    if (fisheyeStrength > 0.01) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = COLOR_PALETTE.neutral1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        applyFisheye(offscreenCtx, ctx, fisheyeStrength);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvas, 0, 0);
    }

    return { updatedImages, debugInfo };
};

export default drawCanvas;