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

        // Update target position directly
        const delta = e.deltaY / scrollFactor;
        gridScrollOffsetRef.current -= delta;
        targetOffsetYRef.current = gridScrollOffsetRef.current;

        // Calculate pattern height to determine scroll limits
        if (typeof calculateGridLayout === 'function') {
            const patternHeight = infiniteScrollRef.current.patternHeight || 0;

            // Initialize repeat counters if they don't exist yet
            if (infiniteScrollRef.current.topRepeats === undefined) {
                infiniteScrollRef.current.topRepeats = 0;
            }
            if (infiniteScrollRef.current.totalRows === undefined) {
                infiniteScrollRef.current.totalRows = 5;
            }

            // Detect scroll direction
            const isScrollingUp = delta < 0;
            const isScrollingDown = delta > 0;

            // If scrolling up and approaching the upper limit
            if (isScrollingUp && gridScrollOffsetRef.current > patternHeight * 0.5) {
                // Add repetitions above and shift offset
                infiniteScrollRef.current.topRepeats += 5;
                infiniteScrollRef.current.virtualOffset -= patternHeight * 5;
                gridScrollOffsetRef.current -= patternHeight * 5;
                targetOffsetYRef.current = gridScrollOffsetRef.current;
            }

            // If scrolling down and approaching the lower limit
            const totalRepeats = infiniteScrollRef.current.totalRows;
            if (isScrollingDown && gridScrollOffsetRef.current < -(patternHeight * totalRepeats * 0.7)) {
                // Add more rows when approaching the bottom
                infiniteScrollRef.current.totalRows += 5;
            }
        }
    }, [isGridModeRef, calculateGridLayout, infiniteScrollRef, gridScrollOffsetRef, targetOffsetYRef, wheelEventOccurredRef]);

    return { handleWheel };
};