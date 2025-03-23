import { useCallback } from 'react';

export const useDragInteraction = (
    isGridModeRef,
    dragStartXRef,
    dragStartYRef,
    targetOffsetXRef,
    targetOffsetYRef,
    dragVelocityXRef,
    dragVelocityYRef,
    positionHistoryRef,
    canvasRef,
    setIsDragging
) => {

    const handleMouseDown = useCallback((e) => {
        // Don't initiate dragging in grid mode
        if (isGridModeRef.current) return;

        setIsDragging(true);

        // Store initial drag position
        dragStartXRef.current = e.clientX - targetOffsetXRef.current;
        dragStartYRef.current = e.clientY - targetOffsetYRef.current;

        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing';
        }

        // Add initial velocity if completely at rest
        if (Math.abs(dragVelocityXRef.current) < 0.1 && Math.abs(dragVelocityYRef.current) < 0.1) {
            dragVelocityXRef.current = 0.1;
            dragVelocityYRef.current = 0.1;
        }

        // Reset position history
        positionHistoryRef.current = [];
    }, [canvasRef, isGridModeRef, dragStartXRef, dragStartYRef, targetOffsetXRef, targetOffsetYRef, dragVelocityXRef, dragVelocityYRef, positionHistoryRef, setIsDragging]);

    const handleMouseMove = useCallback((e) => {
        if (!setIsDragging) return;

        // Only allow dragging in non-grid mode
        if (!isGridModeRef.current) {
            // In free mode, allow both horizontal and vertical movement
            const newTargetX = e.clientX - dragStartXRef.current;
            const newTargetY = e.clientY - dragStartYRef.current;

            targetOffsetXRef.current = newTargetX;
            targetOffsetYRef.current = newTargetY;
        }
        // In grid mode, don't respond to drag
    }, [isGridModeRef, dragStartXRef, dragStartYRef, targetOffsetXRef, targetOffsetYRef]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);

        if (canvasRef.current) {
            canvasRef.current.style.cursor = isGridModeRef.current ? 'default' : 'grab';
        }

        if (!isGridModeRef.current) {
            // In free mode, maintain the inertia effect (original behavior)
            dragVelocityXRef.current *= 0.5;
            dragVelocityYRef.current *= 0.5;
        }
    }, [canvasRef, isGridModeRef, dragVelocityXRef, dragVelocityYRef, setIsDragging]);

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    };
};