import { useCallback } from 'react';
import { isInViewport } from './canvasUtils.js';

export const useGridLayout = (
    canvasRef,
    imagesRef,
    infiniteScrollRef,
    offsetYRef,
    debugInfoRef,
    images
) => {
    // Function to calculate grid layout positions
    const calculateGridLayout = useCallback(() => {
        if (images.length === 0) return [];

        const canvas = canvasRef.current;
        if (!canvas) return [];

        // Get canvas dimensions
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Grid parameters
        const horizontalSpacing = 100;     // Horizontal spacing between projects
        const verticalSpacing = horizontalSpacing;       // Vertical spacing between lines of projects
        const groupSpacing = verticalSpacing;         // Spacing between the repeated groups
        const targetHeight = 250;         // Target height for projects
        const columnCount = 2;            // Columns per row
        const baseImagesCount = images.length;

        // Store these values for infinite scroll
        infiniteScrollRef.current.itemsPerRow = columnCount;

        // Calculate positions for base images (single repetition)
        const baseGridPositions = [];

        // Calculate total height first to center vertically
        let totalHeight = 0;
        const rows = Math.ceil(baseImagesCount / columnCount);

        // Estimate height based on targetHeight and spacing
        const estimatedRowHeight = targetHeight + verticalSpacing;
        totalHeight = rows * estimatedRowHeight - verticalSpacing; // Subtract the last spacing

        // Calculate Y offset to center vertically
        const initialY = Math.max(0, (canvasHeight - totalHeight) / 2) - estimatedRowHeight / 2;
        let currentY = initialY; // Start with an offset that centers vertically

        // Go through images in pairs to create rows
        for (let i = 0; i < baseImagesCount; i += columnCount) {
            // Calculate dimensions while preserving aspect ratio
            const calculateSize = (img) => {
                const aspectRatio = img.width / img.height;
                let newHeight = targetHeight;
                let newWidth = newHeight * aspectRatio;
                return {width: newWidth, height: newHeight};
            };

            // Collect sizes for this row
            const sizes = [];
            const availableImages = [];
            for (let j = 0; j < columnCount && i + j < baseImagesCount; j++) {
                availableImages.push(images[i + j]);
                sizes.push(calculateSize(images[i + j]));
            }

            // Total width of the row with UNIFORM horizontal spacing
            const totalWidth = sizes.reduce((sum, size) => sum + size.width, 0) + ((sizes.length - 1) * horizontalSpacing);
            const startX = (canvasWidth - totalWidth) / 2;

            // Position of each image in the row
            let currentX = startX;
            availableImages.forEach((img, index) => {
                const size = sizes[index];
                baseGridPositions.push({
                    x: currentX, y: currentY, width: size.width, height: size.height, originalIndex: i + index
                });

                // Use constant horizontalSpacing between elements
                currentX += size.width + horizontalSpacing;
            });

            // Move to next row with UNIFORM vertical spacing
            const rowHeight = Math.max(...sizes.map(s => s.height));
            currentY += rowHeight + verticalSpacing;
        }

        // Recalculate the actual pattern height
        const patternHeight = currentY - initialY + (groupSpacing - verticalSpacing);
        infiniteScrollRef.current.rowHeight = patternHeight / Math.ceil(baseImagesCount / columnCount);
        infiniteScrollRef.current.patternHeight = patternHeight;

        // Now, create the complete layout with duplication for infinite scroll
        const gridPositions = [];

        // Calculate virtual offset (allows infinite scroll)
        const scrollOffset = offsetYRef.current;
        const virtualOffset = infiniteScrollRef.current.virtualOffset || 0;
        const adjustedScrollOffset = scrollOffset + virtualOffset;

        // Initialize topRepeats and totalRows if they don't exist yet
        if (infiniteScrollRef.current.topRepeats === undefined) {
            infiniteScrollRef.current.topRepeats = 0;
        }
        if (infiniteScrollRef.current.totalRows === undefined) {
            infiniteScrollRef.current.totalRows = 5;
        }

        // Number of repetitions needed to fill the view
        const visibleRows = Math.ceil(canvasHeight / infiniteScrollRef.current.rowHeight) + 5; // +5 to avoid visual jumps

        // Number of repetitions needed in each direction
        const requiredRepeatsDown = Math.max(infiniteScrollRef.current.totalRows, Math.ceil(visibleRows * 2));
        const requiredRepeatsUp = Math.max(infiniteScrollRef.current.topRepeats, Math.ceil(visibleRows * 2));

        // Calculate visible repetitions based on current offset
        const currentViewport = {
            top: -offsetYRef.current - canvasHeight,
            bottom: -offsetYRef.current + canvasHeight * 2
        };

        // Create repetitions above (negative repetitions)
        for (let repeat = -requiredRepeatsUp; repeat < 0; repeat++) {
            baseGridPositions.forEach((basePos, idx) => {
                // Y position with UNIFORM spacing between repetitions
                const repeatY = basePos.y + (repeat * patternHeight);

                // Only include positions that are within the visible area plus some padding
                if (repeatY + basePos.height + offsetYRef.current > -canvasHeight * 2 &&
                    repeatY + offsetYRef.current < canvasHeight * 3) {

                    gridPositions.push({
                        ...basePos,
                        y: repeatY,
                        originalIndex: basePos.originalIndex,
                        repeatIndex: repeat,
                        isVisible: true
                    });
                }
            });
        }

        // Create repetitions below (positive repetitions)
        for (let repeat = 0; repeat < requiredRepeatsDown; repeat++) {
            baseGridPositions.forEach((basePos, idx) => {
                // Y position with UNIFORM spacing between repetitions
                const repeatY = basePos.y + (repeat * patternHeight);

                // Only include positions that are within the visible area plus some padding
                if (repeatY + basePos.height + offsetYRef.current > -canvasHeight * 2 &&
                    repeatY + offsetYRef.current < canvasHeight * 3) {

                    gridPositions.push({
                        ...basePos,
                        y: repeatY,
                        originalIndex: basePos.originalIndex,
                        repeatIndex: repeat,
                        isVisible: true
                    });
                }
            });
        }

        // Add debug information for easy tracking
        debugInfoRef.current = {
            ...debugInfoRef.current,
            scrollOffset,
            virtualOffset,
            topRepeats: infiniteScrollRef.current.topRepeats,
            totalRows: infiniteScrollRef.current.totalRows,
            visibleProjects: gridPositions.length
        };

        return gridPositions;
    }, [images, canvasRef, offsetYRef, infiniteScrollRef, debugInfoRef]);

    return { calculateGridLayout };
};