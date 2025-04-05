import { useCallback } from 'react';
import { isInViewport } from './canvasUtils.js';

export const useHoverDetection = (
    canvasRef,
    imagesRef,
    offsetYRef,
    isGridModeRef,
    calculateGridLayout,
    isDragging,
    setHoveredProject
) => {
    // Helper function to detect if a point is inside an image
    const isPointInImage = useCallback((x, y, imgX, imgY, imgWidth, imgHeight) => {
        return x >= imgX && x <= imgX + imgWidth && y >= imgY && y <= imgY + imgHeight;
    }, []);

    // Find which image (if any) is under the clicked point
    const findClickedProject = useCallback((x, y) => {
        if (!canvasRef.current) return null;

        const canvas = canvasRef.current;

        // Convert window coordinates to canvas coordinates
        const canvasRect = canvas.getBoundingClientRect();
        const canvasX = x - canvasRect.left;
        const canvasY = y - canvasRect.top;

        // Special case for grid mode
        if (isGridModeRef.current) {
            // Get current grid positions
            const gridPositions = calculateGridLayout();
            if (!gridPositions || gridPositions.length === 0) return null;

            // Sort positions by size (larger first)
            const sortedPositions = [...gridPositions].sort((a, b) => {
                const imgA = imagesRef.current[a.originalIndex % imagesRef.current.length];
                const imgB = imagesRef.current[b.originalIndex % imagesRef.current.length];
                return imgB.size - imgA.size;
            });

            // Check each grid position
            for (const pos of sortedPositions) {
                const image = imagesRef.current[pos.originalIndex % imagesRef.current.length];
                if (!image) continue;

                // Adjust Y position with current scroll offset
                const imgY = pos.y + offsetYRef.current;

                // Check if the point is in the image
                if (canvasX >= pos.x && canvasX <= pos.x + pos.width &&
                    canvasY >= imgY && canvasY <= imgY + pos.height) {

                    // Project found
                    if (canvasRef.current) {
                        canvasRef.current.style.cursor = 'pointer';
                    }

                    const projectInfo = {
                        ...image,
                        index: pos.originalIndex,
                        name: image.name || `Project ${pos.originalIndex + 1}`
                    };

                    setHoveredProject(projectInfo);
                    return projectInfo;
                }
            }

            // No project found in grid mode
            if (canvasRef.current) {
                canvasRef.current.style.cursor = 'default';
            }

            setHoveredProject(null);
            return null;
        }

        // Free mode - correction de l'utilisation des coordonnées pour résoudre le décalage
        const patternWidth = window.innerWidth;
        const patternHeight = window.innerHeight;

        // Récupérer les offsets depuis useCanvasAnimation via window
        // C'est crucial d'avoir accès aux mêmes offsets que ceux utilisés pour le rendu
        let offsetX, offsetY;

        // Tenter d'accéder aux offsets globaux (si disponibles via window)
        if (typeof window !== 'undefined' && window.offsetXRef && window.offsetYRef) {
            offsetX = window.offsetXRef.current;
            offsetY = window.offsetYRef.current;
        } else {
            // IMPORTANT: Si window.offsetXRef n'est pas disponible, utiliser prevOffsetXRef et prevOffsetYRef
            // qui sont les références externes passées à useCanvasAnimation
            offsetX = window.__prevOffsetXRef || offsetYRef.current;
            offsetY = window.__prevOffsetYRef || offsetYRef.current;
        }

        // Enregistrer les références pour un accès plus facile (pour debug)
        if (typeof window !== 'undefined') {
            window.__HOVER_DETECTION = {
                offsetX,
                offsetY,
                local: offsetYRef.current
            };
        }

        // Calcul des tuiles visibles avec les offsets corrects
        const startTileX = Math.floor((-offsetX - canvas.width) / patternWidth);
        const endTileX = Math.ceil((-offsetX + canvas.width) / patternWidth);
        const startTileY = Math.floor((-offsetY - canvas.height) / patternHeight);
        const endTileY = Math.ceil((-offsetY + canvas.width) / patternHeight);

        // Collect all visible images, largest first
        const visibleImagesData = [];
        const processedSourceIndices = new Set(); // To avoid duplicates

        for (let tileY = startTileY; tileY <= endTileY; tileY++) {
            for (let tileX = startTileX; tileX <= endTileX; tileX++) {
                // Pour chaque tuile, collecter les images visibles comme dans l'implémentation d'origine
                imagesRef.current.forEach((image, index) => {
                    // Apply parallax factor specific to each image
                    const parallaxFactor = image.parallaxFactor || 1;
                    const imgOffsetX = offsetX * parallaxFactor;
                    const imgOffsetY = offsetY * parallaxFactor;

                    // Calculate position with this offset
                    const tilePixelX = tileX * patternWidth + imgOffsetX;
                    const tilePixelY = tileY * patternHeight + imgOffsetY;

                    const imgX = image.patternX + tilePixelX;
                    const imgY = image.patternY + tilePixelY;

                    // Vérifier si l'image est visible dans le viewport
                    if (isInViewport(imgX, imgY, image.width, image.height, canvas.width, canvas.height)) {
                        visibleImagesData.push({
                            image,
                            x: imgX,
                            y: imgY,
                            width: image.width,
                            height: image.height,
                            size: image.size || image.width,
                            index
                        });
                    }
                });
            }
        }

        // Sort images by size in descending order to prioritize larger ones
        visibleImagesData.sort((a, b) => b.size - a.size);

        // Check for projects under the pointer
        for (const imgData of visibleImagesData) {
            if (isPointInImage(canvasX, canvasY, imgData.x, imgData.y, imgData.width, imgData.height)) {
                // Once a project is found, apply cursor style directly
                if (canvasRef.current) {
                    canvasRef.current.style.cursor = 'pointer';
                }

                const projectInfo = {
                    ...imgData.image,
                    index: imgData.index,
                    name: imgData.image.name || `Project ${imgData.index + 1}`
                };

                // Update hovered project state
                setHoveredProject(projectInfo);

                return projectInfo;
            }
        }

        // If no project is found, reset cursor style
        if (canvasRef.current) {
            canvasRef.current.style.cursor = isDragging ? 'grabbing' : 'grab';
        }

        // Reset hovered project state
        setHoveredProject(null);

        return null;
    }, [canvasRef, isPointInImage, isDragging, offsetYRef, isGridModeRef, calculateGridLayout, imagesRef, setHoveredProject]);

    return { findClickedProject, isPointInImage };
};