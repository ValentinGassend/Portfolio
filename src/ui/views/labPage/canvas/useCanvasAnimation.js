import {useRef, useEffect, useState, useCallback} from 'react';
import {createNonOverlappingImages} from './createNonOverlappingImages.jsx';
import drawCanvas from './drawCanvas.jsx';
import {MAX_HISTORY} from '../constants.js';

// Custom hook to handle the canvas animation and interaction
export const useCanvasAnimation = ({
                                       canvasRef,
                                       offscreenCanvasRef,
                                       animationFrameRef,
                                       projectImageRef,
                                       projectImageLoaded,
                                       backgroundLoaded,
                                       setImagesLoaded,
                                       setTotalImages,
                                       prevOffsetXRef,
                                       prevOffsetYRef
                                   }) => {
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Store current images in a ref to avoid dependency issues in the animation loop
    const imagesRef = useRef([]);

    // Interactive state refs
    const dragStartXRef = useRef(0);
    const dragStartYRef = useRef(0);
    const offsetXRef = useRef(0);
    const offsetYRef = useRef(0);
    const targetOffsetXRef = useRef(0);
    const targetOffsetYRef = useRef(0);
    const dragVelocityXRef = useRef(0);
    const dragVelocityYRef = useRef(0);
    const lastDragXRef = useRef(0);
    const lastDragYRef = useRef(0);

    // Effect strength and fisheye refs
    const effectStrengthRef = useRef(0);
    const fisheyeStrengthRef = useRef(0);

    // Position history for trail effect
    const positionHistoryRef = useRef([]);

    // Debug info
    const debugInfoRef = useRef({
        visibleTiles: 0,
        visibleInstances: 0,
        offsetX: 0,
        offsetY: 0,
        velocityMagnitude: 0,
        effectStrength: 0
    });

    // Update the imagesRef when images state changes
    useEffect(() => {
        imagesRef.current = images;
    }, [images]);

    // Initialize images when project image is loaded
    useEffect(() => {
        if (projectImageLoaded && backgroundLoaded && images.length === 0) {
            // Define the pattern size for repetition - use window size
            const patternWidth = window.innerWidth;
            const patternHeight = window.innerHeight;

            const newImages = createNonOverlappingImages(
                projectImageRef,
                patternWidth,
                patternHeight,
                40 // imageCount
            );

            setTotalImages(newImages.length);
            setImagesLoaded(newImages.length);
            setImages(newImages);
        }
    }, [projectImageLoaded, backgroundLoaded, images.length, projectImageRef, setImagesLoaded, setTotalImages]);

    // The animation function that uses refs instead of state to avoid re-renders
    const animate = useCallback(() => {
        if (!canvasRef.current || !offscreenCanvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const offscreenCtx = offscreenCanvasRef.current.getContext('2d');

        if (!ctx || !offscreenCtx) return;

        // Define the pattern size for repetition - use window size
        const patternWidth = window.innerWidth;
        const patternHeight = window.innerHeight;

        // Smoothly transition to target offset with improved easing
        offsetXRef.current += (targetOffsetXRef.current - offsetXRef.current) * 0.066;
        offsetYRef.current += (targetOffsetYRef.current - offsetYRef.current) * 0.066;

        // Calculate velocity with smoother response
        if (isDragging) {
            // Smoother during drag - reacts more gradually
            dragVelocityXRef.current = dragVelocityXRef.current * 0.6 + (targetOffsetXRef.current - lastDragXRef.current) * 0.5; // smoother transition
            dragVelocityYRef.current = dragVelocityYRef.current * 0.6 + (targetOffsetYRef.current - lastDragYRef.current) * 0.5;

            // Gradually increase effect strength (more slowly for a smoother transition)
            effectStrengthRef.current = Math.min(effectStrengthRef.current + 0.08, 1.5); // Slower and more progressive rise

            // Increase fisheye effect more smoothly
            fisheyeStrengthRef.current = Math.min(fisheyeStrengthRef.current + 0.035, 0.5); // Softer
        } else {
            // Even more gradual for release - maintains the effect longer
            if (Math.abs(dragVelocityXRef.current) > 1.0 || Math.abs(dragVelocityYRef.current) > 1.0) {
                // Higher velocities: slow down more gently to keep effect visible longer
                dragVelocityXRef.current *= 0.99; // Very slow decay for inertia
                dragVelocityYRef.current *= 0.99;
            } else {
                // Lower velocities: still slow decay
                dragVelocityXRef.current *= 0.975; // More pronounced but still gentle decay
                dragVelocityYRef.current *= 0.975;
            }

            // Threshold to stop very small movements
            if (Math.abs(dragVelocityXRef.current) < 0.05) dragVelocityXRef.current = 0;
            if (Math.abs(dragVelocityYRef.current) < 0.05) dragVelocityYRef.current = 0;

            // Very gradual reduction of effects for a smooth transition
            fisheyeStrengthRef.current = Math.max(fisheyeStrengthRef.current - 0.01, 0); // Slower decay
            effectStrengthRef.current = Math.max(effectStrengthRef.current - 0.008, 0); // Even slower decay
        }

        // Calculate velocity magnitude for debug and effects
        const velocityMagnitude = Math.sqrt(
            dragVelocityXRef.current * dragVelocityXRef.current +
            dragVelocityYRef.current * dragVelocityYRef.current
        );

        // Update position history for trail effect
        if (positionHistoryRef.current.length >= MAX_HISTORY) {
            positionHistoryRef.current.shift(); // Remove oldest position
        }

        positionHistoryRef.current.push({
            x: offsetXRef.current,
            y: offsetYRef.current,
            velocityX: dragVelocityXRef.current,
            velocityY: dragVelocityYRef.current,
            magnitude: velocityMagnitude
        });

        // Store last position for velocity calculation
        lastDragXRef.current = targetOffsetXRef.current;
        lastDragYRef.current = targetOffsetYRef.current;

        // Update tracking refs
        prevOffsetXRef.current = offsetXRef.current;
        prevOffsetYRef.current = offsetYRef.current;

        // Draw everything using the current images from ref
        const {updatedImages, debugInfo} = drawCanvas({
            canvas,
            offscreenCanvas: offscreenCanvasRef.current,
            ctx,
            offscreenCtx,
            images: imagesRef.current,
            offsetX: offsetXRef.current,
            offsetY: offsetYRef.current,
            dragVelocityX: dragVelocityXRef.current,
            dragVelocityY: dragVelocityYRef.current,
            effectStrength: effectStrengthRef.current,
            fisheyeStrength: fisheyeStrengthRef.current,
            patternWidth,
            patternHeight
        });

        // Store debug info
        if (debugInfo) {
            debugInfoRef.current = debugInfo;
        }

        // Update images with new opacity values - but use setTimeout to avoid React state update inside animation frame
        if (updatedImages) {
            // Use a zero-timeout to break the synchronous state update in requestAnimationFrame
            setTimeout(() => {
                setImages(updatedImages);
            }, 0);
        }

        // Continue animation
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [isDragging, canvasRef, offscreenCanvasRef, animationFrameRef, prevOffsetXRef, prevOffsetYRef]);

    // Setup animation loop
    useEffect(() => {
        if (!canvasRef.current || !offscreenCanvasRef.current || images.length === 0) return;

        // Start animation
        animationFrameRef.current = requestAnimationFrame(animate);

        // Cleanup animation properly
        return () => {
            if (typeof animationFrameRef.current === 'number') {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [canvasRef, offscreenCanvasRef, animationFrameRef, animate, images.length]);

    // Event handlers for mouse/touch interaction
    const handleMouseDown = useCallback((e) => {
        setIsDragging(true);
        dragStartXRef.current = e.clientX - targetOffsetXRef.current;
        dragStartYRef.current = e.clientY - targetOffsetYRef.current;

        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing';
        }

        // Add a small initial velocity if starting from rest
        // This ensures the effect begins to show immediately
        if (Math.abs(dragVelocityXRef.current) < 0.1 && Math.abs(dragVelocityYRef.current) < 0.1) {
            dragVelocityXRef.current = 0.1;
            dragVelocityYRef.current = 0.1;
        }

        // Reset position history
        positionHistoryRef.current = [];
    }, [canvasRef]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        // Calculate new target offset
        targetOffsetXRef.current = e.clientX - dragStartXRef.current;
        targetOffsetYRef.current = e.clientY - dragStartYRef.current;
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab';
        }

        // Moderately reduce speed for inertia effect
        dragVelocityXRef.current *= 0.5;
        dragVelocityYRef.current *= 0.5;
    }, [canvasRef]);

    // Touch event handlers (for mobile devices)
    const handleTouchStart = useCallback((e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            handleMouseDown({clientX: touch.clientX, clientY: touch.clientY});
        }
    }, [handleMouseDown]);

    const handleTouchMove = useCallback((e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            handleMouseMove({clientX: touch.clientX, clientY: touch.clientY});

            // Prevent scroll/zoom on touch devices
            e.preventDefault();
        }
    }, [handleMouseMove]);

    const handleTouchEnd = useCallback(() => {
        handleMouseUp();
    }, [handleMouseUp]);

    // Setup event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set initial cursor style
        canvas.style.cursor = 'grab';

        // Add event listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove, {passive: false});
        window.addEventListener('touchend', handleTouchEnd);

        // Cleanup event listeners
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [
        canvasRef,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    ]);

    return {
        images,
        isDragging,
        debugInfo: debugInfoRef.current
    };
};