import { COLOR_PALETTE, GRID_SIZE_X, GRID_SIZE_Y } from '../constants.js';

// Check if a rectangle overlaps with any existing rectangles
export const doesOverlap = (rect, existingRects, minDistance = 20) => {
    for (const existing of existingRects) {
        // Check if rectangles are too close to each other
        if (
            rect.x < existing.x + existing.width + minDistance &&
            rect.x + rect.width + minDistance > existing.x &&
            rect.y < existing.y + existing.height + minDistance &&
            rect.y + rect.height + minDistance > existing.y
        ) {
            return true;
        }
    }
    return false;
};

// Determine if a specific position is visible in the viewport
export const isInViewport = (x, y, width, height, canvasWidth, canvasHeight) => {
    return (
        x + width >= 0 &&
        x <= canvasWidth &&
        y + height >= 0 &&
        y <= canvasHeight
    );
};

// Draw the grid with parallax effect
export const drawGrid = (ctx, offsetX, offsetY, canvasWidth, canvasHeight) => {
    ctx.beginPath();
    // Use a more subtle grid color
    ctx.strokeStyle = `rgba(${parseInt(COLOR_PALETTE.neutral2.slice(1, 3), 16)}, ${parseInt(COLOR_PALETTE.neutral2.slice(3, 5), 16)}, ${parseInt(COLOR_PALETTE.neutral2.slice(5, 7), 16)}, 0.5)`;
    ctx.lineWidth = 4; // Thinner line

    // Parallax factor - the grid moves slower than the images
    // A value of 0.7 means the grid moves at 70% of the speed of the images
    const parallaxFactor = 0.7;

    // Apply parallax factor to offsets for the grid
    const gridOffsetX = offsetX * parallaxFactor;
    const gridOffsetY = offsetY * parallaxFactor;

    // Calculate the first visible grid point with parallax offset
    // Calculate modulo correctly for negative values
    const startGridX = ((gridOffsetX % GRID_SIZE_X) + GRID_SIZE_X) % GRID_SIZE_X;
    const startGridY = ((gridOffsetY % GRID_SIZE_Y) + GRID_SIZE_Y) % GRID_SIZE_Y;

    // Draw vertical lines with parallax offset
    for (let x = startGridX; x <= canvasWidth + GRID_SIZE_X; x += GRID_SIZE_X) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
    }

    // Draw horizontal lines with parallax offset
    for (let y = startGridY; y <= canvasHeight + GRID_SIZE_Y; y += GRID_SIZE_Y) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
    }

    ctx.stroke();
};

// Create a mask for images
export const createImagesMask = (ctx, canvas, images, offsetX, offsetY, patternWidth, patternHeight) => {
    // Create a canvas for the mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');

    // Fill the mask in white (areas to display)
    maskCtx.fillStyle = 'white';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // Calculate which tiles are visible
    const startTileX = Math.floor((-offsetX - canvas.width) / patternWidth);
    const endTileX = Math.ceil((-offsetX + canvas.width) / patternWidth);
    const startTileY = Math.floor((-offsetY - canvas.height) / patternHeight);
    const endTileY = Math.ceil((-offsetY + canvas.width) / patternHeight);

    // For each visible tile
    for (let tileY = startTileY; tileY <= endTileY; tileY++) {
        for (let tileX = startTileX; tileX <= endTileX; tileX++) {
            // Calculate the position of the tile
            const tilePixelX = tileX * patternWidth + offsetX;
            const tilePixelY = tileY * patternHeight + offsetY;

            // For each image in this tile
            images.forEach(image => {
                if (image.opacity > 0.1) { // Only mask visible images
                    // Image position
                    const imgX = image.patternX + tilePixelX;
                    const imgY = image.patternY + tilePixelY;

                    // Check if the image is visible in the viewport
                    if (imgX + image.width >= 0 && imgX <= canvas.width &&
                        imgY + image.height >= 0 && imgY <= canvas.height) {
                        // "Cut out" this area of the mask in black (area not to display)
                        maskCtx.fillStyle = 'black';
                        maskCtx.fillRect(imgX, imgY, image.width, image.height);
                    }
                }
            });
        }
    }

    return maskCanvas;
};
