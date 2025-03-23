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
                        calculateGridLayout,
                        isTransitioning
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
        isGridMode: isGridMode,
        isTransitioning: isTransitioning
    };

    // 4. Collect all visible images with their calculated positions
    const visibleImagesData = [];
    const visibleIndices = new Set();

    // ⚠️ Important: En mode transition, toujours utiliser l'approche libre pour le rendu
    // afin d'éviter toute téléportation liée au changement de mode
    if (isGridMode && !isTransitioning) {
        // Mode grille - mais uniquement si pas en transition
        const drawnCombinations = new Set();
        const gridPositions = calculateGridLayout();

        if (gridPositions && gridPositions.length > 0) {
            // Séparer les positions originales et les duplications
            const originalPositions = gridPositions.filter(pos => pos.repeatIndex === 0);
            const duplicatePositions = gridPositions.filter(pos => pos.repeatIndex !== 0);

            // D'abord afficher les positions originales
            originalPositions.forEach((position) => {
                const image = images[position.originalIndex % images.length];
                if (!image) return;

                // Position de l'image
                const imgX = position.x;
                const imgY = position.y + offsetY;

                // Vérifier si l'image est visible
                if (isInViewport(imgX, imgY, position.width, position.height, canvas.width, canvas.height)) {
                    debugInfo.visibleInstances++;
                    visibleIndices.add(position.originalIndex);

                    // Ajouter l'image au rendu
                    visibleImagesData.push({
                        image,
                        x: imgX,
                        y: imgY,
                        width: position.width,
                        height: position.height,
                        size: image.size || position.width,
                        velocity: {
                            x: 0,
                            y: dragVelocityY * 0.5
                        },
                        opacity: image.opacity,
                        index: position.originalIndex,
                        repeatIndex: 0,
                        isOriginal: true
                    });
                }
            });

            // Puis afficher les duplications
            duplicatePositions.forEach((position) => {
                const originalIndex = position.originalIndex;
                const repeatIndex = position.repeatIndex;
                const originalImage = images[originalIndex % images.length];
                if (!originalImage) return;

                // Clé unique pour cette duplication
                const projectKey = `${originalImage.filename || 'img'}-${repeatIndex}`;
                if (drawnCombinations.has(projectKey)) return;
                drawnCombinations.add(projectKey);

                // Position de la duplication
                const imgX = position.x;
                const imgY = position.y + offsetY;

                // Vérifier si la duplication est visible
                if (isInViewport(imgX, imgY, position.width, position.height, canvas.width, canvas.height)) {
                    debugInfo.visibleInstances++;

                    // Calculer l'opacité basée sur l'image originale
                    const originalOpacity = originalImage.opacity || 0;

                    // Opacité basée sur la distance et l'opacité de l'original
                    let displayOpacity = 0;

                    if (originalOpacity > 0.8) {
                        // Fadeout progressif en fonction de la distance
                        const distanceFactor = Math.max(0, 1 - (Math.abs(repeatIndex) * 0.15));
                        // Fade in progressif
                        const fadeInFactor = Math.min(1, (originalOpacity - 0.8) * 5);
                        displayOpacity = originalOpacity * distanceFactor * fadeInFactor;
                    }

                    // Créer une version modifiée de l'image avec l'opacité ajustée
                    const adjustedImage = {
                        ...originalImage,
                        opacity: displayOpacity
                    };

                    // Ajouter la duplication
                    visibleImagesData.push({
                        image: adjustedImage,
                        x: imgX,
                        y: imgY,
                        width: position.width,
                        height: position.height,
                        size: adjustedImage.size || position.width,
                        velocity: {
                            x: 0,
                            y: dragVelocityY * 0.5 * Math.max(0.5, 1 - Math.abs(repeatIndex) * 0.1)
                        },
                        opacity: displayOpacity,
                        index: originalIndex,
                        repeatIndex: repeatIndex,
                        isOriginal: false
                    });
                }
            });
        }
    } else {
        // Mode libre OU mode en transition
        // Dans les deux cas, utiliser l'approche standard de répétition des tuiles
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
                                x: dragVelocityX * parallaxFactor,
                                y: dragVelocityY * parallaxFactor
                            },
                            opacity: image.opacity,
                            index,
                            isOriginal: true
                        });
                    }
                });
            }
        }
    }

    // 5. Sort images by size and type
    if (isGridMode && !isTransitioning) {
        // En mode grille (hors transition):
        // 1. D'abord les originaux (grandes d'abord)
        // 2. Ensuite les duplications (par distance de répétition, puis par taille)
        visibleImagesData.sort((a, b) => {
            // Priorité aux images originales
            if (a.isOriginal !== b.isOriginal) {
                return a.isOriginal ? -1 : 1;
            }

            // Si ce sont des duplications, trier par index de répétition
            if (!a.isOriginal && 'repeatIndex' in a && 'repeatIndex' in b) {
                const absA = Math.abs(a.repeatIndex);
                const absB = Math.abs(b.repeatIndex);
                if (absA !== absB) {
                    return absA - absB;
                }
            }

            // Finalement par taille
            return b.size - a.size;
        });
    } else {
        // En mode libre ou transition:
        // Dessiner les petites images d'abord (grandes par-dessus)
        visibleImagesData.sort((a, b) => a.size - b.size);
    }

    // 6. Draw images in the sorted order
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
            imageData.opacity,
            isGridMode && !isTransitioning // N'utiliser le rendu "grille" que si on n'est pas en transition
        );
    }

    // 7. Apply color trail effect if needed
    if (velocityMagnitude > 0.3 || effectStrength > 0.05) {
        // Adjust effect strength based on mode
        const adjustedStrength = isGridMode ? effectStrength * 0.3 : effectStrength;

        applyGlobalColorTrail(
            offscreenCtx,
            offscreenCanvas,
            offsetX,
            offsetY,
            isGridMode ? 0 : dragVelocityX, // No horizontal effect in grid mode
            dragVelocityY,
            adjustedStrength
        );
    }

    // 8. Update image visibility - skip during transition
    const updatedImages = !isTransitioning ? images.map((image, index) => {
        const isVisible = visibleIndices.has(index);

        // Gradually adjust opacity
        let newOpacity = image.opacity;
        if (isVisible) {
            // Fade in
            newOpacity = Math.min(image.opacity + 0.05, 1);
        } else {
            // Fade out
            newOpacity = Math.max(image.opacity - 0.05, 0);
        }

        return {
            ...image,
            visible: isVisible,
            opacity: newOpacity
        };
    }) : images; // During transition, don't modify opacity automatically

    // 9. Apply fisheye effect if needed
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