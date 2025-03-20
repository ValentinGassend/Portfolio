import {useRef, useEffect, useState, useCallback} from 'react';
import {createNonOverlappingImages} from './createNonOverlappingImages.jsx';
import drawCanvas from './drawCanvas.jsx';
import {MAX_HISTORY} from '../constants.js';
import {isInViewport} from './canvasUtils.js';

// Custom hook to handle the canvas animation and interaction
export const useCanvasAnimation = ({
                                       canvasRef,
                                       offscreenCanvasRef,
                                       animationFrameRef,
                                       projectImageRef,
                                       projectImagesRef, // Add projectImagesRef to the parameters
                                       projectImageLoaded,
                                       backgroundLoaded,
                                       setImagesLoaded,
                                       setTotalImages,
                                       prevOffsetXRef,
                                       prevOffsetYRef
                                   }) => {
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    // Nouvel état pour le projet survolé
    const [hoveredProject, setHoveredProject] = useState(null);

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
        visibleTiles: 0, visibleInstances: 0, offsetX: 0, offsetY: 0, velocityMagnitude: 0, effectStrength: 0
    });

    // Update the imagesRef when images state changes
    useEffect(() => {
        imagesRef.current = images;
    }, [images]);

    // Helper function to detect if a point is inside an image
    const isPointInImage = useCallback((x, y, imgX, imgY, imgWidth, imgHeight) => {
        return x >= imgX && x <= imgX + imgWidth && y >= imgY && y <= imgY + imgHeight;
    }, []);

    // Find which image (if any) is under the clicked point
    const findClickedProject = useCallback((x, y) => {
        if (!canvasRef.current) return null;

        const canvas = canvasRef.current;

        // Convertir les coordonnées de la fenêtre en coordonnées du canvas
        const canvasRect = canvas.getBoundingClientRect();
        const canvasX = x - canvasRect.left;
        const canvasY = y - canvasRect.top;

        console.log("Canvas coordinates:", canvasX, canvasY);

        const patternWidth = window.innerWidth;
        const patternHeight = window.innerHeight;

        // Calcul des tuiles visibles
        const offsetX = offsetXRef.current;
        const offsetY = offsetYRef.current;
        const startTileX = Math.floor((-offsetX - canvas.width) / patternWidth);
        const endTileX = Math.ceil((-offsetX + canvas.width) / patternWidth);
        const startTileY = Math.floor((-offsetY - canvas.height) / patternHeight);
        const endTileY = Math.ceil((-offsetY + canvas.width) / patternHeight);

        // Collecter toutes les images visibles, les plus grandes d'abord
        const visibleImagesData = [];

        for (let tileY = startTileY; tileY <= endTileY; tileY++) {
            for (let tileX = startTileX; tileX <= endTileX; tileX++) {
                // Pour chaque tuile, collecter les images visibles
                imagesRef.current.forEach((image, index) => {
                    // Appliquer le facteur de parallaxe spécifique à chaque image
                    const imgOffsetX = offsetX * image.parallaxFactor;
                    const imgOffsetY = offsetY * image.parallaxFactor;

                    // Calculer la position avec ce décalage
                    const tilePixelX = tileX * patternWidth + imgOffsetX;
                    const tilePixelY = tileY * patternHeight + imgOffsetY;

                    const imgX = image.patternX + tilePixelX;
                    const imgY = image.patternY + tilePixelY;

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

        // Trier les images par taille dans l'ordre décroissant
        visibleImagesData.sort((a, b) => b.size - a.size);

        console.log("Visible images:", visibleImagesData.length);

        // Vérifier les projets sous le pointeur
        for (const imgData of visibleImagesData) {
            if (isPointInImage(canvasX, canvasY, imgData.x, imgData.y, imgData.width, imgData.height)) {
                console.log("Found clicked image:", imgData.index);

                // Une fois qu'un projet est trouvé, appliquer directement le style du curseur
                if (canvasRef.current) {
                    canvasRef.current.style.cursor = 'pointer';
                }

                const projectInfo = {
                    ...imgData.image,
                    index: imgData.index,
                    name: imgData.image.name || `Project ${imgData.index + 1}` // Use name from the image object if available
                };

                // Mettre à jour l'état du projet survolé
                setHoveredProject(projectInfo);

                return projectInfo;
            }
        }
        // Si aucun projet n'est trouvé, réinitialiser le style du curseur
        if (canvasRef.current) {
            canvasRef.current.style.cursor = isDragging ? 'grabbing' : 'grab';
        }

        // Réinitialiser l'état du projet survolé
        setHoveredProject(null);

        return null;
    }, [canvasRef, isPointInImage, isDragging]);

    useEffect(() => {
        if (!canvasRef.current) return;

        if (hoveredProject) {
            canvasRef.current.style.cursor = 'pointer';
        } else {
            canvasRef.current.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
    }, [hoveredProject, isDragging, canvasRef]);

    // Initialize images when project image is loaded
    useEffect(() => {
        if (projectImageLoaded && backgroundLoaded && images.length === 0) {
            // Define the pattern size for repetition - use window size
            const patternWidth = window.innerWidth;
            const patternHeight = window.innerHeight;

            // Instead of passing a fixed count (40), let the function use the actual number of images
            const newImages = createNonOverlappingImages(
                projectImagesRef || projectImageRef, // Use image array if available, fallback to single image
                patternWidth,
                patternHeight
                // No more imageCount parameter - we'll use exactly as many images as were loaded
            );

            // Set the total and loaded count to match the actual created images
            setTotalImages(newImages.length);
            setImagesLoaded(newImages.length);
            setImages(newImages);

            console.log(`Created ${newImages.length} projects from ${projectImagesRef.current?.length || 1} images`);
        }
    }, [projectImageLoaded, backgroundLoaded, images.length, projectImageRef, projectImagesRef, setImagesLoaded, setTotalImages]);

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
        const velocityMagnitude = Math.sqrt(dragVelocityXRef.current * dragVelocityXRef.current + dragVelocityYRef.current * dragVelocityYRef.current);

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

    // Event handlers for mouse/touch interaction
    const handleMouseDown = useCallback((e) => {
        setIsDragging(true);
        dragStartXRef.current = e.clientX - targetOffsetXRef.current;
        dragStartYRef.current = e.clientY - targetOffsetYRef.current;

        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing';
        }

        // Add a small initial velocity if starting from rest
        if (Math.abs(dragVelocityXRef.current) < 0.1 && Math.abs(dragVelocityYRef.current) < 0.1) {
            dragVelocityXRef.current = 0.1;
            dragVelocityYRef.current = 0.1;
        }

        // Reset position history
        positionHistoryRef.current = [];
    }, [canvasRef]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        const newTargetX = e.clientX - dragStartXRef.current;
        const newTargetY = e.clientY - dragStartYRef.current;

        // Calculate new target offset
        targetOffsetXRef.current = newTargetX;
        targetOffsetYRef.current = newTargetY;
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

    // Export the event handlers to be used by the parent component
    const setDragHandlers = {
        mouseDown: handleMouseDown, mouseMove: handleMouseMove, mouseUp: handleMouseUp
    };

    return {
        images,
        isDragging,
        hoveredProject, // Exposer l'état du projet survolé
        debugInfo: debugInfoRef.current,
        findClickedProject,
        setDragHandlers
    };
};