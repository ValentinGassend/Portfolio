import { useCallback } from 'react';

export const useGridLayout = (
    canvasRef,
    imagesRef,
    infiniteScrollRef,
    offsetYRef,
    debugInfoRef,
    images
) => {
    // Improved function to group projects with complete duplicate filtering
    const groupProjects = (images) => {
        // Create a Set to track already processed source images
        const processedSourceIndices = new Set();

        // Define the primary groups
        const groups = {
            'Project 1': ['Project 1', 'How'],
            'Year': ['Year', 'What', 'Why'],
            'Preview': ['Preview'],
            'Other': []
        };

        const groupedImages = [];
        const processedIndices = new Set();

        // First, identify and filter out duplicates based on sourceImageIndex
        const uniqueImages = images.filter((img, index) => {
            if (img.sourceImageIndex === undefined) return true;

            if (!processedSourceIndices.has(img.sourceImageIndex)) {
                processedSourceIndices.add(img.sourceImageIndex);
                return true;
            }

            return false;
        });

        // Then process the groups with the filtered unique images
        Object.values(groups).forEach(groupMembers => {
            const groupImages = uniqueImages.filter((img, index) =>
                groupMembers.some(member =>
                    img.name && img.name.includes(member) && !processedIndices.has(index)
                )
            );

            // Sort group images by size (larger first)
            groupImages.sort((a, b) => (b.width * b.height) - (a.width * a.height));

            groupImages.forEach(img => {
                const imgIndex = uniqueImages.indexOf(img);
                if (imgIndex !== -1) {
                    groupedImages.push(img);
                    processedIndices.add(imgIndex);
                }
            });
        });

        // Add remaining unique images not processed yet
        uniqueImages.forEach((img, index) => {
            if (!processedIndices.has(index)) {
                groupedImages.push(img);
            }
        });

        return groupedImages;
    };

    // Function to calculate grid layout positions
    const calculateGridLayout = useCallback(() => {
        if (images.length === 0) return [];
        const canvas = canvasRef.current;
        if (!canvas) return [];

        // Check if we're using direct image positions during transition
        const isUsingDirectImagePositions = window.useFinalGridPositions === true && window.isGridModeRef?.current;

        if (isUsingDirectImagePositions && imagesRef.current && imagesRef.current.length > 0) {
            // Filter out any duplicate positions based on sourceImageIndex
            const seenSourceIndices = new Set();

            const filteredPositions = imagesRef.current
                .map((img, idx) => {
                    // Skip if this is a duplicate
                    if (img.sourceImageIndex !== undefined && seenSourceIndices.has(img.sourceImageIndex)) {
                        return null;
                    }

                    // Mark this source index as seen
                    if (img.sourceImageIndex !== undefined) {
                        seenSourceIndices.add(img.sourceImageIndex);
                    }

                    return {
                        x: img.patternX,
                        y: img.patternY,
                        width: img.width,
                        height: img.height,
                        originalIndex: idx,
                        name: img.name
                    };
                })
                .filter(position => position !== null);

            debugInfoRef.current = {
                ...debugInfoRef.current,
                usingDirectPositions: true,
                positionsCount: filteredPositions.length
            };

            return filteredPositions.map(pos => ({
                ...pos,
                repeatIndex: 0,
                isVisible: true
            }));
        }

        // Group projects with improved duplicate filtering
        const groupedImages = groupProjects(images);

        // Canvas dimensions
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Grid parameters
        const horizontalSpacing = 50;
        const verticalSpacing = 50;
        const targetHeight = 200;
        const columnCount = 2;
        const topMargin = 100; // Top margin of 100px

        // Calculate rows
        const baseImagesCount = groupedImages.length;
        const fullRows = Math.floor(baseImagesCount / columnCount);
        const remainingProjects = baseImagesCount % columnCount;
        const totalRows = remainingProjects > 0 ? fullRows + 1 : fullRows;

        // Base positions for projects
        const baseGridPositions = [];

        // Position each project
        for (let row = 0; row < totalRows; row++) {
            const isLastRow = row === fullRows;
            const colsInThisRow = isLastRow && remainingProjects > 0 ? remainingProjects : columnCount;

            const rowY = topMargin + row * (targetHeight + verticalSpacing);

            const rowSizes = [];
            for (let col = 0; col < colsInThisRow; col++) {
                const imgIndex = row * columnCount + col;

                // Ensure we don't go out of bounds
                if (imgIndex >= groupedImages.length) continue;

                const img = groupedImages[imgIndex];

                const aspectRatio = img.width / img.height;
                const newHeight = targetHeight;
                const newWidth = aspectRatio * newHeight;

                rowSizes.push({
                    width: newWidth,
                    height: newHeight,
                    index: imgIndex,
                    name: img.name
                });
            }

            // Calculate total row width
            const totalRowWidth = rowSizes.reduce((sum, size) => sum + size.width, 0) +
                (colsInThisRow - 1) * horizontalSpacing;

            // Center horizontally
            let currentX = (canvasWidth - totalRowWidth) / 2;

            // Position each image
            for (let i = 0; i < rowSizes.length; i++) {
                const size = rowSizes[i];
                const img = groupedImages[size.index];

                baseGridPositions.push({
                    x: currentX,
                    y: rowY,
                    width: size.width,
                    height: size.height,
                    originalIndex: size.index,
                    name: size.name,
                    // Store source image index to help with duplicate detection
                    sourceImageIndex: img.sourceImageIndex
                });

                currentX += size.width + horizontalSpacing;
            }
        }

        // Calculate total content height
        const maxY = baseGridPositions.length > 0
            ? baseGridPositions[baseGridPositions.length - 1].y + targetHeight
            : topMargin;

        // Add extra margin at bottom for aesthetics
        const patternHeight = maxY + verticalSpacing;

        // Update scroll references
        infiniteScrollRef.current.rowHeight = targetHeight + verticalSpacing;
        infiniteScrollRef.current.patternHeight = patternHeight;

        // Set scroll limits
        infiniteScrollRef.current.maxOffset = 0; // Upper limit (always 0, top margin already included in positioning)
        // Adjust lower limit to account for extra margin and display all content
        infiniteScrollRef.current.minOffset = -patternHeight + window.innerHeight - 50; // Lower limit with margin

        // Generate positions for fixed grid display
        const gridPositions = [];

        // Get current scroll position
        const currentScroll = offsetYRef.current;

        // Map the original indices to actual image indices
        const originalToActualIndex = new Map();
        groupedImages.forEach((img, i) => {
            // Find this image in the original images array
            const actualIndex = images.findIndex(origImg =>
                origImg === img ||
                (origImg.sourceImageIndex === img.sourceImageIndex && origImg.sourceImageIndex !== undefined)
            );
            if (actualIndex !== -1) {
                originalToActualIndex.set(i, actualIndex);
            }
        });

        // Apply scroll offset to all base positions
        baseGridPositions.forEach((basePos) => {
            // Convert from grouped index to actual image index
            const actualIndex = originalToActualIndex.get(basePos.originalIndex) ?? basePos.originalIndex;

            gridPositions.push({
                ...basePos,
                y: basePos.y,
                originalIndex: actualIndex,
                repeatIndex: 0,
                isVisible: true
            });
        });

        // Add debug info
        debugInfoRef.current = {
            ...debugInfoRef.current,
            patternHeight,
            totalRows,
            basePositionsCount: baseGridPositions.length,
            gridPositionsCount: gridPositions.length,
            currentScroll: currentScroll,
            maxScroll: infiniteScrollRef.current.maxOffset,
            minScroll: infiniteScrollRef.current.minOffset,
            topMargin: 100,
            uniqueImagesCount: groupedImages.length
        };

        return gridPositions;
    }, [images, canvasRef, offsetYRef, infiniteScrollRef, debugInfoRef]);

    return { calculateGridLayout };
};