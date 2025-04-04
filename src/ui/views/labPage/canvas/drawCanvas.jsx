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
                        isTransitioning,
                        transitionProgress = 0 // Ajout d'un paramètre de progression de la transition
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

    // Créer un ensemble pour suivre les sourceImageIndex déjà traités
    const processedSourceIndices = new Set();

    // Si nous sommes en mode grille ou en transition vers le mode grille,
    // calculer les positions de la grille pour les utiliser
    const gridPositions = (isGridMode || isTransitioning) ? calculateGridLayout() : null;

    // Pendant la transition, on va afficher à la fois le mode libre et le mode grille
    // avec une opacité variable selon la progression de la transition
    if (isTransitioning) {
        // Afficher d'abord la version "mode libre" (avec filtrage des duplications)
        // mais seulement si nous ne sommes pas trop avancés dans la transition
        if (transitionProgress < 0.9) { // Afficher le mode libre jusqu'à 90% de la transition
            const startTileX = Math.floor((-offsetX - canvas.width) / patternWidth);
            const endTileX = Math.ceil((-offsetX + canvas.width) / patternWidth);
            const startTileY = Math.floor((-offsetY - canvas.height) / patternHeight);
            const endTileY = Math.ceil((-offsetY + canvas.width) / patternHeight);

            // On ne veut qu'une seule tuile pendant la transition pour éviter les duplications
            const centerTileX = Math.round((-offsetX) / patternWidth);
            const centerTileY = Math.round((-offsetY) / patternHeight);

            // Réinitialiser l'ensemble pour la partie mode libre
            processedSourceIndices.clear();

            for (let tileY = centerTileY; tileY <= centerTileY; tileY++) {
                for (let tileX = centerTileX; tileX <= centerTileX; tileX++) {
                    debugInfo.visibleTiles++;

                    // Pour chaque tuile, collecter les images visibles
                    images.forEach((image, index) => {
                        // Filtrer les duplications pendant la transition
                        if (image.sourceImageIndex !== undefined) {
                            if (processedSourceIndices.has(image.sourceImageIndex)) {
                                return;
                            }
                            processedSourceIndices.add(image.sourceImageIndex);
                        }

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

                            // Ajouter l'image à la liste des images visibles avec une opacité qui diminue
                            // pendant la transition
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
                                opacity: image.opacity * (1 - transitionProgress), // Diminue avec la progression
                                index,
                                isOriginal: true,
                                mode: 'free' // Marquer comme mode libre pour le tri
                            });
                        }
                    });
                }
            }
        }

        // Ensuite, afficher la version "mode grille" (si disponible)
        // avec une opacité qui augmente avec la progression de la transition
        if (gridPositions && gridPositions.length > 0 && transitionProgress > 0.1) { // Apparaît à partir de 10%
            // Réinitialiser l'ensemble pour la partie mode grille
            processedSourceIndices.clear();

            gridPositions.forEach((position) => {
                const image = images[position.originalIndex % images.length];
                if (!image) return;

                // Filtrer les duplications pour le mode grille aussi
                if (image.sourceImageIndex !== undefined) {
                    if (processedSourceIndices.has(image.sourceImageIndex)) {
                        return;
                    }
                    processedSourceIndices.add(image.sourceImageIndex);
                }

                // Position de l'image
                const imgX = position.x;
                const imgY = position.y + offsetY;

                // Vérifier si l'image est visible
                if (isInViewport(imgX, imgY, position.width, position.height, canvas.width, canvas.height)) {
                    debugInfo.visibleInstances++;
                    visibleIndices.add(position.originalIndex);

                    // Ajouter l'image au rendu avec une opacité qui augmente avec la progression
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
                        opacity: image.opacity * transitionProgress, // Augmente avec la progression
                        index: position.originalIndex,
                        repeatIndex: 0,
                        isOriginal: true,
                        mode: 'grid' // Marquer comme mode grille pour le tri
                    });
                }
            });
        }
    }
    // Mode grille standard (pas de transition)
    else if (isGridMode) {
        if (gridPositions && gridPositions.length > 0) {
            gridPositions.forEach((position) => {
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
        }
    }
    // Mode libre standard (pas de transition)
    else {
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

    // 5. Sort images by size, type and mode (pour la transition)
    if (isTransitioning) {
        // En transition: afficher d'abord le mode libre, puis le mode grille par-dessus
        visibleImagesData.sort((a, b) => {
            // D'abord par mode (libre puis grille)
            if (a.mode !== b.mode) {
                return a.mode === 'free' ? -1 : 1;
            }
            // Ensuite par taille
            return a.size - b.size;
        });
    } else if (isGridMode) {
        // En mode grille (hors transition)
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
        // En mode libre (hors transition)
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