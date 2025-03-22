import {COLOR_PALETTE} from '../constants.js';
import {drawGrid, isInViewport} from './canvasUtils.js';
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
                        patternHeight,
                        isGridMode,
                        calculateGridLayout // Ajouter ce paramètre
                    }) => {
    if (!ctx || !offscreenCtx) return {visibleTiles: 0, visibleInstances: 0};

    // Clear the canvas
    offscreenCtx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. First, draw the background
    offscreenCtx.fillStyle = COLOR_PALETTE.neutral1;
    offscreenCtx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw the grid with the fixed parallax factor for the grid
    const gridParallaxFactor = isGridMode ? 1.0 : 0.7;
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
        effectStrength: Math.round(effectStrength * 100) / 100,
        isGridMode: isGridMode
    };

    // 4. Collect all visible images with their calculated positions
    const visibleImagesData = [];
    const visibleIndices = new Set();
    const drawnProjects = new Set();
    const uniqueProjects = new Set();

    // Pour le mode grille, on veut juste montrer les projets une seule fois
    if (isGridMode) {
        // For infinite scroll, each item can be repeated multiple times
        const drawnCombinations = new Set(); // To track combinations already drawn

        // Get the grid layout positions from calculateGridLayout
        const gridPositions = calculateGridLayout();

        // If grid positions are available, use them directly
        if (gridPositions && gridPositions.length > 0) {
            gridPositions.forEach((position, idx) => {
                // Find the corresponding image
                const image = images[position.originalIndex % images.length];
                if (!image) return;

                // Create a unique key for this project+repeat combination
                const projectKey = `${image.filename}-${position.repeatIndex}`;

                // Skip if already drawn (avoid duplicates in same position)
                if (drawnCombinations.has(projectKey)) return;
                drawnCombinations.add(projectKey);

                // Apply the correct positioning from grid layout
                const imgX = position.x;
                const imgY = position.y + offsetY;

                // Check if image is in viewport
                if (isInViewport(imgX, imgY, position.width, position.height, canvas.width, canvas.height)) {
                    debugInfo.visibleInstances++;
                    visibleIndices.add(position.originalIndex);

                    // Add image to list of visible images
                    visibleImagesData.push({
                        image,
                        x: imgX,
                        y: imgY,
                        width: position.width,
                        height: position.height,
                        size: image.size || position.width,
                        velocity: {
                            x: 0,
                            y: dragVelocityY * 0.5 // Subtle effect
                        },
                        opacity: image.opacity,
                        index: position.originalIndex,
                        repeatIndex: position.repeatIndex
                    });
                }
            });
        } else {
            // Fallback to previous implementation if grid positions aren't available
            // (existing code for the old implementation)
        }
    }  else {
        // Mode libre - logique originale avec répétition des tuiles
        const startTileX = Math.floor((-offsetX - canvas.width) / patternWidth);
        const endTileX = Math.ceil((-offsetX + canvas.width) / patternWidth);
        const startTileY = Math.floor((-offsetY - canvas.height) / patternHeight);
        const endTileY = Math.ceil((-offsetY + canvas.width) / patternHeight);

        for (let tileY = startTileY; tileY <= endTileY; tileY++) {
            for (let tileX = startTileX; tileX <= endTileX; tileX++) {
                debugInfo.visibleTiles++;

                // Pour chaque tuile, collecter les images visibles
                images.forEach((image, index) => {
                    // Appliquer le facteur de parallaxe spécifique à chaque image
                    const parallaxFactor = image.parallaxFactor;
                    const imgOffsetX = offsetX * parallaxFactor;
                    const imgOffsetY = offsetY * parallaxFactor;

                    // Calculer la position avec ce décalage
                    const tilePixelX = tileX * patternWidth + imgOffsetX;
                    const tilePixelY = tileY * patternHeight + imgOffsetY;

                    const imgX = image.patternX + tilePixelX;
                    const imgY = image.patternY + tilePixelY;

                    if (isInViewport(imgX, imgY, image.width, image.height, canvas.width, canvas.height)) {
                        debugInfo.visibleInstances++;
                        visibleIndices.add(index);

                        // Ajouter l'image à la liste des images visibles
                        visibleImagesData.push({
                            image,
                            x: imgX,
                            y: imgY,
                            width: image.width,
                            height: image.height,
                            size: image.size || image.width,
                            velocity: {
                                x: dragVelocityX * parallaxFactor, y: dragVelocityY * parallaxFactor
                            },
                            opacity: image.opacity,
                            index
                        });
                    }
                });
            }
        }
    }

    // 5. Sort images by size (small to large in free mode, large to small in grid mode)
    if (isGridMode) {
        // En mode grille, dessiner les grandes images d'abord pour éviter les superpositions
        visibleImagesData.sort((a, b) => b.size - a.size);
    } else {
        // En mode libre, dessiner les petites images d'abord (grandes par-dessus)
        visibleImagesData.sort((a, b) => a.size - b.size);
    }

    // 6. Draw images in the sorted order
    for (const imageData of visibleImagesData) {
        // Draw the image with trail if necessary
        drawImageWithColorTrail(offscreenCtx, imageData.image, imageData.x, imageData.y, imageData.width, imageData.height, imageData.velocity, imageData.opacity, isGridMode);
    }

    // Le reste du code reste inchangé...
    // 7. If the speed is sufficient or if the effect is still visible, apply the effect
    if (velocityMagnitude > 0.3 || effectStrength > 0.05) {
        // Pass effectStrength to the function to properly control the intensity
        // In grid mode, reduce the effect strength significantly
        const adjustedStrength = isGridMode ? effectStrength * 0.3 : effectStrength;

        applyGlobalColorTrail(offscreenCtx, offscreenCanvas, offsetX, offsetY, isGridMode ? 0 : dragVelocityX, // No horizontal effect in grid mode
            dragVelocityY, adjustedStrength);
    }

    // 8. Update the visibility of images
    const updatedImages = images.map((image, index) => {
        const isVisible = visibleIndices.has(index);
        const opacity = isVisible ? Math.min(image.opacity + 0.05, 1) // Fade in
            : Math.max(image.opacity - 0.05, 0); // Fade out

        return {
            ...image, visible: isVisible, opacity
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

    return {updatedImages, debugInfo};
};

export default drawCanvas;