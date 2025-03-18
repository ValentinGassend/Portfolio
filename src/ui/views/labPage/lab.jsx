import React, { useEffect, useRef, useState } from "react";
import Overlay from "../../components/Overlay.jsx";

const Lab = () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [totalImages, setTotalImages] = useState(0);
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [projectImageLoaded, setProjectImageLoaded] = useState(false);
    const backgroundImageRef = useRef(null);
    const projectImageRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasDimensions();

        // Grid parameters
        const gridSize = 50;
        const lineWidth = 1;
        const lineColor = 'rgba(30, 30, 255, 0.3)';

        // Define the pattern size for repetition - use window size
        const patternWidth = window.innerWidth;
        const patternHeight = window.innerHeight;

        // Interactive state
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let offsetX = 0;
        let offsetY = 0;
        let targetOffsetX = 0;
        let targetOffsetY = 0;
        let dragVelocityX = 0;
        let dragVelocityY = 0;
        let lastDragX = 0;
        let lastDragY = 0;

        // Debug info
        let debugInfo = {
            visibleTiles: 0,
            visibleInstances: 0,
            offsetX: 0,
            offsetY: 0
        };

        // Images gallery
        const images = [];
        const imageCount = 40;
        setTotalImages(imageCount);

        // Load both images just once to avoid reloading issues
        const loadImages = () => {
            // Load the project background image if not already loaded
            if (!projectImageRef.current) {
                const projectImg = new Image();
                projectImg.crossOrigin = "Anonymous";
                projectImg.src = "https://fastly.picsum.photos/id/192/200/300.jpg?hmac=UAXa6z_MKaSlyDXrwECLl6XBp0jzyV3C2eSvsfMi_uc";

                projectImg.onload = () => {
                    projectImageRef.current = projectImg;
                    setProjectImageLoaded(true);
                };

                projectImg.onerror = (err) => {
                    console.error("Failed to load project image:", err);
                    setProjectImageLoaded(true); // Continue anyway
                };
            }

            // Continue with other initialization
            setBackgroundLoaded(true);
        };

        // Start loading images
        loadImages();

        // Function to check if a rectangle overlaps with any existing rectangles
        const doesOverlap = (rect, existingRects, minDistance = 20) => {
            for (const existing of existingRects) {
                // Check if rectangles are too close to each other
                if (
                    rect.x < existing.x + existing.width + minDistance &&
                    rect.x + rect.width + minDistance > existing.x &&
                    rect.y < existing.y + existing.height + minDistance &&
                    rect.y + rect.height + minDistance > existing.y
                ) {
                    return true;
                }
            }
            return false;
        };

        // Create images with non-overlapping layout
        const createNonOverlappingImages = () => {
            // Only proceed if all necessary resources are loaded
            if (!projectImageLoaded || images.length > 0) return;

            const existingRects = [];
            let attempts = 0;
            const maxAttempts = 1000;

            // Create random positions for images within the pattern
            for (let i = 0; i < imageCount && attempts < maxAttempts; i++) {
                // Random size between 100px and 250px
                const width = 100 + Math.random() * 150;
                const height = width * (0.7 + Math.random() * 0.6); // Random aspect ratio

                let found = false;
                let newRect = null;
                let attemptsForThisRect = 0;
                const maxAttemptsForRect = 50;

                // Try to find a non-overlapping position
                while (!found && attemptsForThisRect < maxAttemptsForRect) {
                    // Random position within pattern boundaries with padding
                    const x = Math.random() * (patternWidth - width - 40) + 20;
                    const y = Math.random() * (patternHeight - height - 40) + 20;

                    newRect = {
                        x,
                        y,
                        width,
                        height
                    };

                    if (!doesOverlap(newRect, existingRects)) {
                        found = true;
                    }

                    attemptsForThisRect++;
                    attempts++;
                }

                // If we couldn't find a suitable position, skip this image
                if (!found) {
                    continue;
                }

                // Add to existing rectangles
                existingRects.push(newRect);

                // Create a placeholder image (canvas-generated) with project background
                const imageCanvas = document.createElement('canvas');
                imageCanvas.width = newRect.width;
                imageCanvas.height = newRect.height;
                const imageCtx = imageCanvas.getContext('2d');

                if (imageCtx && projectImageRef.current) {
                    // Draw the project background image, properly scaled to fit
                    imageCtx.drawImage(
                        projectImageRef.current,
                        0, 0, projectImageRef.current.width, projectImageRef.current.height, // Source rectangle
                        0, 0, newRect.width, newRect.height // Destination rectangle
                    );

                    // Apply a slight overlay to make text more readable
                    imageCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    imageCtx.fillRect(0, 0, newRect.width, newRect.height);

                    // Add project label
                    imageCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    imageCtx.font = `bold ${Math.round(newRect.width/10)}px Arial`;
                    imageCtx.textAlign = 'center';
                    imageCtx.textBaseline = 'middle';
                    imageCtx.fillText(`Project ${i+1}`, newRect.width/2, newRect.height/2);
                }

                // Add to images array
                images.push({
                    canvas: imageCanvas,
                    patternX: newRect.x,  // Original position within the pattern
                    patternY: newRect.y,
                    width: newRect.width,
                    height: newRect.height,
                    opacity: 0, // Start with 0 opacity for fade-in effect
                    visible: false, // Track if image is visible in viewport
                });

                // Signal that this image is "loaded"
                setImagesLoaded(i + 1);
            }

            // If we couldn't place all images, update the totalImages count
            if (images.length < imageCount) {
                setTotalImages(images.length);
            }
        };

        // Create layout when project image is loaded
        if (projectImageLoaded && backgroundLoaded) {
            createNonOverlappingImages();
        }

        // Function to determine if a specific position is visible in the viewport
        const isInViewport = (x, y, width, height) => {
            return (
                x + width >= 0 &&
                x <= canvas.width &&
                y + height >= 0 &&
                y <= canvas.height
            );
        };

        // Draw the grid and images with repeating pattern
        const drawCanvas = () => {
            if (!ctx) return;

            // Clear canvas with transparency
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw grid directly over transparent background
            // For grid, calculate offset without any wrapping (truly infinite grid)
            const offsetGridX = offsetX % gridSize;
            const offsetGridY = offsetY % gridSize;

            // Draw vertical grid lines
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;

            for (let x = (offsetGridX < 0 ? offsetGridX + gridSize : offsetGridX); x < canvas.width; x += gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }

            // Draw horizontal grid lines
            for (let y = (offsetGridY < 0 ? offsetGridY + gridSize : offsetGridY); y < canvas.height; y += gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }

            ctx.stroke();

            // If we don't have images yet, don't try to draw them
            if (images.length === 0) {
                // Draw loading message if we're still loading
                if (!projectImageLoaded || !backgroundLoaded) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.font = '14px Arial';
                    ctx.fillText('Loading resources...', 20, 50);
                }
                return;
            }

            // Calculate movement effect scale for animations
            const velocityScale = Math.min(1, Math.sqrt(dragVelocityX * dragVelocityX + dragVelocityY * dragVelocityY) / 10);

            // Reset debug counters
            debugInfo.visibleTiles = 0;
            debugInfo.visibleInstances = 0;
            debugInfo.offsetX = Math.round(offsetX);
            debugInfo.offsetY = Math.round(offsetY);

            // Keep track of which images are visible in any tile
            const visibleImages = new Set();

            // Calculate how many repetitions we need
            // Use Math.floor and ceiling to ensure we cover the whole viewport
            const startTileX = Math.floor((-offsetX - canvas.width) / patternWidth);
            const endTileX = Math.ceil((-offsetX + canvas.width) / patternWidth);
            const startTileY = Math.floor((-offsetY - canvas.height) / patternHeight);
            const endTileY = Math.ceil((-offsetY + canvas.height) / patternHeight);

            // Draw all necessary tiles
            for (let tileY = startTileY; tileY <= endTileY; tileY++) {
                for (let tileX = startTileX; tileX <= endTileX; tileX++) {
                    // Calculate tile position with offset
                    const tilePixelX = tileX * patternWidth + offsetX;
                    const tilePixelY = tileY * patternHeight + offsetY;

                    // Skip tiles that are completely outside viewport
                    if (!isInViewport(tilePixelX, tilePixelY, patternWidth, patternHeight)) {
                        continue;
                    }

                    debugInfo.visibleTiles++;

                    // Draw all images for this tile
                    images.forEach((image, index) => {
                        const imgX = image.patternX + tilePixelX;
                        const imgY = image.patternY + tilePixelY;

                        // Check if image is in viewport
                        if (isInViewport(imgX, imgY, image.width, image.height)) {
                            debugInfo.visibleInstances++;
                            visibleImages.add(index);

                            // Get current opacity for this image
                            let opacity = image.opacity;

                            if (opacity > 0) {
                                // Apply lightweight effect when dragging
                                if (isDragging && velocityScale > 0.1) {
                                    // Save context state
                                    ctx.save();

                                    // Calculate image center for transformations
                                    const centerX = imgX + image.width / 2;
                                    const centerY = imgY + image.height / 2;

                                    // Translate to center
                                    ctx.translate(centerX, centerY);

                                    // Subtle scale effect based on drag velocity
                                    const scaleEffect = 1 - velocityScale * 0.04;
                                    ctx.scale(scaleEffect, scaleEffect);

                                    // Subtle rotation effect based on drag direction
                                    const rotationEffect = (dragVelocityX * 0.002) * velocityScale;
                                    ctx.rotate(rotationEffect);

                                    // Set opacity
                                    ctx.globalAlpha = opacity;

                                    // Draw image at transformed position
                                    ctx.drawImage(
                                        image.canvas,
                                        -image.width / 2,
                                        -image.height / 2,
                                        image.width,
                                        image.height
                                    );

                                    // Add white border
                                    ctx.globalAlpha = opacity * 0.8;
                                    ctx.strokeStyle = '#ffffff';
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(
                                        -image.width / 2,
                                        -image.height / 2,
                                        image.width,
                                        image.height
                                    );

                                    // Restore context
                                    ctx.restore();
                                } else {
                                    // Regular drawing without effects
                                    ctx.globalAlpha = opacity;
                                    ctx.drawImage(
                                        image.canvas,
                                        imgX,
                                        imgY,
                                        image.width,
                                        image.height
                                    );

                                    // Add white border
                                    ctx.globalAlpha = opacity * 0.8;
                                    ctx.strokeStyle = '#ffffff';
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(
                                        imgX,
                                        imgY,
                                        image.width,
                                        image.height
                                    );
                                }

                                // Reset alpha
                                ctx.globalAlpha = 1;
                            }
                        }
                    });
                }
            }

            // Update image visibility and opacity
            images.forEach((image, index) => {
                const isVisible = visibleImages.has(index);

                // Update visibility flag
                image.visible = isVisible;

                // Update opacity based on visibility
                if (isVisible) {
                    image.opacity = Math.min(image.opacity + 0.05, 1); // Fade in
                } else {
                    image.opacity = Math.max(image.opacity - 0.05, 0); // Fade out
                }
            });

            // Add a hint for dragging
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '14px Arial';
            ctx.fillText('Drag to explore the infinite gallery', 20, 30);

            // Show loading status if not all images are loaded
            if (imagesLoaded < totalImages) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.font = '14px Arial';
                ctx.fillText(`Loading projects: ${imagesLoaded}/${totalImages}`, 20, 50);
            }

            // Display debug info
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '12px monospace';
            ctx.fillText(`Offset: (${debugInfo.offsetX}, ${debugInfo.offsetY}) | Tiles: ${debugInfo.visibleTiles} | Images: ${debugInfo.visibleInstances}`, 20, canvas.height - 20);
        };

        // Animation loop for smooth effects
        const animate = () => {
            // Smoothly transition to target offset
            offsetX += (targetOffsetX - offsetX) * 0.1;
            offsetY += (targetOffsetY - offsetY) * 0.1;

            // Calculate drag velocity (for effects)
            if (isDragging) {
                dragVelocityX = targetOffsetX - lastDragX;
                dragVelocityY = targetOffsetY - lastDragY;
            } else {
                // Gradually reduce velocity when not dragging
                dragVelocityX *= 0.95;
                dragVelocityY *= 0.95;
            }

            // Store last position for velocity calculation
            lastDragX = targetOffsetX;
            lastDragY = targetOffsetY;

            // Draw everything
            drawCanvas();

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Start animation
        animate();

        // Event handlers
        const handleMouseDown = (e) => {
            isDragging = true;
            dragStartX = e.clientX - targetOffsetX;
            dragStartY = e.clientY - targetOffsetY;
            canvas.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            // Calculate new target offset
            targetOffsetX = e.clientX - dragStartX;
            targetOffsetY = e.clientY - dragStartY;

            // No limits needed for infinite scrolling
        };

        const handleMouseUp = () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        };

        const handleResize = () => {
            setCanvasDimensions();
        };

        // Touch event handlers (for mobile devices)
        const handleTouchStart = (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });

                // Prevent scroll/zoom on touch devices
                e.preventDefault();
            }
        };

        const handleTouchEnd = () => {
            handleMouseUp();
        };

        // Set initial cursor style
        canvas.style.cursor = 'grab';

        // Add event listeners
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        // Cleanup function
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [backgroundLoaded, projectImageLoaded]);

    return (
        <>
            <Overlay />
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    display: 'block',
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1,
                    touchAction: 'none', // Prevent browser handling of touch gestures
                    background: 'transparent'  // Make canvas background transparent
                }}
            />
        </>
    );
};

export default Lab;