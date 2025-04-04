import { useCallback } from 'react';

export const useWheelInteraction = (
    isGridModeRef,
    calculateGridLayout,
    infiniteScrollRef,
    gridScrollOffsetRef,
    targetOffsetYRef,
    wheelEventOccurredRef
) => {
    // Wheel handler function
    const handleWheel = useCallback((e) => {
        // Only handle wheel events if grid mode is active
        if (!isGridModeRef.current) return;

        // Prevent default browser scroll
        e.preventDefault();

        // Mark that a wheel event occurred
        wheelEventOccurredRef.current = true;

        // Apply factor to adjust scroll speed
        const scrollFactor = 2.5;

        // Calculate the current grid positions to determine layout dimensions
        if (typeof calculateGridLayout === 'function') {
            const gridPositions = calculateGridLayout();

            // Get pattern height and calculate content boundaries
            const patternHeight = infiniteScrollRef.current.patternHeight || 0;

            // Define scroll limits - only scroll within content height
            // Calculate maximum scroll amount (negative value to scroll down)
            const maxScrollOffset = 0; // Top limit always 0
            const minScrollOffset = patternHeight !== 0 ? -patternHeight + window.innerHeight / 2 : -1000;

            // Calculate the new potential scroll offset
            const delta = e.deltaY / scrollFactor;
            const newScrollOffset = gridScrollOffsetRef.current - delta;

            // Apply limits to scroll
            if (newScrollOffset > maxScrollOffset) {
                gridScrollOffsetRef.current = maxScrollOffset;
            } else if (newScrollOffset < minScrollOffset) {
                gridScrollOffsetRef.current = minScrollOffset;
            } else {
                gridScrollOffsetRef.current = newScrollOffset;
            }

            // Update target position with bounded value
            targetOffsetYRef.current = gridScrollOffsetRef.current;

            // Store limits in infiniteScrollRef for other components to access
            infiniteScrollRef.current.maxOffset = maxScrollOffset;
            infiniteScrollRef.current.minOffset = minScrollOffset;
        }
    }, [isGridModeRef, calculateGridLayout, infiniteScrollRef, gridScrollOffsetRef, targetOffsetYRef, wheelEventOccurredRef]);

    return { handleWheel };
};