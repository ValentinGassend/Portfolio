import {useRef, useEffect, useState, useCallback} from 'react';
import {createNonOverlappingImages} from './createNonOverlappingImages.jsx';
import drawCanvas from './drawCanvas.jsx';
import {MAX_HISTORY} from '../constants.js';
import {isInViewport} from './canvasUtils.js';
import {useGridLayout} from './useGridLayout.js';
import {useDragInteraction} from './useDragInteraction.js';
import {usePositionTransition} from './usePositionTransition.js';
import {useWheelInteraction} from './useWheelInteraction.js';
import {useHoverDetection} from './useHoverDetection.js';

// Custom hook to handle the canvas animation and interaction
export const useCanvasAnimation = ({
                                       canvasRef,
                                       offscreenCanvasRef,
                                       animationFrameRef,
                                       projectImageRef,
                                       projectImagesRef,
                                       projectImageLoaded,
                                       backgroundLoaded,
                                       setImagesLoaded,
                                       setTotalImages,
                                       prevOffsetXRef,
                                       prevOffsetYRef,
                                       gridLayoutActive
                                   }) => {
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [hoveredProject, setHoveredProject] = useState(null);

    // Store current images in a ref to avoid dependency issues in the animation loop
    const imagesRef = useRef([]);
    const wheelEventOccurredRef = useRef(false);
    const wheelSetupCompleteRef = useRef(false);
    const lastProgressRef = useRef(0);
    const lastForceUpdateTimeRef = useRef(Date.now());

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

    // Grid scroll ref
    const gridScrollOffsetRef = useRef(0);

    // Effect strength and fisheye refs
    const effectStrengthRef = useRef(0);
    const fisheyeStrengthRef = useRef(0);

    // Position history for trail effect
    const positionHistoryRef = useRef([]);

    // Debug info
    const debugInfoRef = useRef({
        visibleTiles: 0, visibleInstances: 0, offsetX: 0, offsetY: 0, velocityMagnitude: 0, effectStrength: 0
    });

    // Position references
    const originalPositionsRef = useRef([]);
    const targetPositionsRef = useRef([]);
    const initialPositionsRef = useRef([]);

    // Transition state
    const [isTransitioning, setIsTransitioning] = useState(false);
    const animationProgressRef = useRef(0);

    // Grid mode reference
    const isGridModeRef = useRef(false);

    // Infinite scroll ref
    const infiniteScrollRef = useRef({
        totalRows: 1000, itemsPerRow: 2, rowHeight: 500, virtualOffset: 0, lastScrollPos: 0
    });

    // Exposer les références globalement pour l'animation de transition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Exposer les références pour les animations de transition
            window.offsetXRef = offsetXRef;
            window.offsetYRef = offsetYRef;
            window.targetOffsetXRef = targetOffsetXRef;
            window.targetOffsetYRef = targetOffsetYRef;
        }

        return () => {
            // Nettoyage
            if (typeof window !== 'undefined') {
                window.offsetXRef = null;
                window.offsetYRef = null;
                window.targetOffsetXRef = null;
                window.targetOffsetYRef = null;
            }
        };
    }, [offsetXRef, offsetYRef, targetOffsetXRef, targetOffsetYRef]);

    // Gestionnaire d'événement pour réinitialiser la position du grid
    useEffect(() => {
        const handleResetGridPosition = (event) => {
            const immediate = event.detail?.immediate === true;

            console.log("⚙️ Réinitialisation de la position du grid", immediate ? "(immédiat)" : "");

            // Stocker temporairement la position actuelle
            window._tempOffsetY = offsetYRef.current;
            window._gridScrollOffset = gridScrollOffsetRef.current;

            // Réinitialiser les positions
            if (immediate) {
                // Réinitialisation immédiate (pour les transitions)
                offsetYRef.current = 0;
                targetOffsetYRef.current = 0;
                gridScrollOffsetRef.current = 0;
            } else {
                // Réinitialisation progressive (pour une utilisation manuelle)
                // On garde le offset actuel mais on réinitialise la cible
                targetOffsetYRef.current = 0;
                gridScrollOffsetRef.current = 0;
            }
        };

        // Ajouter l'écouteur d'événement
        window.addEventListener('resetGridPosition', handleResetGridPosition);

        // Nettoyage
        return () => {
            window.removeEventListener('resetGridPosition', handleResetGridPosition);
        };
    }, [offsetYRef, targetOffsetYRef, gridScrollOffsetRef]);

    // Import and use sub-hooks
    const {calculateGridLayout} = useGridLayout(canvasRef, imagesRef, infiniteScrollRef, offsetYRef, debugInfoRef, images);

    const {
        storeInitialPositions, updateImagesLayout
    } = usePositionTransition(imagesRef, originalPositionsRef, initialPositionsRef, targetPositionsRef, isGridModeRef, calculateGridLayout, animationProgressRef, setIsTransitioning, setImages);

    // Ajout de la fonction d'aide pour forcer une mise à jour cohérente des images
    const forceUpdateImages = useCallback((updatedImages) => {
        // Met à jour les références et l'état des images
        imagesRef.current = updatedImages;
        setImages(updatedImages);
    }, [setImages]);

    // Modification du comportement de la roue pour améliorer l'expérience en mode grille
    // Dans useCanvasAnimation.js, modifions la fonction handleWheel

    const handleWheel = useCallback((e) => {
        // Plus sensible en mode grille
        if (isGridModeRef.current) {
            e.preventDefault();
            wheelEventOccurredRef.current = true;

            // Facteur pour ajuster la vitesse de défilement (plus rapide en mode grille)
            const scrollFactor = 1.5;

            // Calculer le delta
            const delta = e.deltaY / scrollFactor;

            // MODIFICATION: Obtenir les limites de défilement
            const minOffset = infiniteScrollRef.current.minOffset || -Infinity;
            const maxOffset = infiniteScrollRef.current.maxOffset || 0;

            // Calculer la nouvelle valeur potentielle
            const newOffset = gridScrollOffsetRef.current - delta;

            // MODIFICATION: Vérifier si le défilement est possible dans cette direction
            if ((delta > 0 && gridScrollOffsetRef.current > minOffset) || (delta < 0 && gridScrollOffsetRef.current < maxOffset)) {
                // Le défilement est possible, mettre à jour la position
                gridScrollOffsetRef.current = Math.max(minOffset, Math.min(maxOffset, newOffset));
                targetOffsetYRef.current = gridScrollOffsetRef.current;

                // Ajouter un léger effet visuel pour le défilement
                // effectStrengthRef.current = Math.min(0.2, effectStrengthRef.current + Math.abs(delta) * 0.001);
            }
        }
    }, [isGridModeRef, gridScrollOffsetRef, targetOffsetYRef, wheelEventOccurredRef, effectStrengthRef, infiniteScrollRef]);

    const {
        findClickedProject, isPointInImage
    } = useHoverDetection(canvasRef, imagesRef, offsetYRef, isGridModeRef, calculateGridLayout, isDragging, setHoveredProject);

    const {
        handleMouseDown, handleMouseMove, handleMouseUp
    } = useDragInteraction(isGridModeRef, dragStartXRef, dragStartYRef, targetOffsetXRef, targetOffsetYRef, dragVelocityXRef, dragVelocityYRef, positionHistoryRef, canvasRef, setIsDragging);

    // Optimisation du rendu pendant les transitions
    const optimizeRenderDuringTransition = useCallback(() => {
        if (isTransitioning) {
            // Réduire les effets visuels pendant les transitions pour une meilleure performance
            fisheyeStrengthRef.current = 0;
            effectStrengthRef.current = Math.min(effectStrengthRef.current, 0.2);

            // Réduire les vitesses pendant les transitions
            dragVelocityXRef.current *= 0.9;
            dragVelocityYRef.current *= 0.9;
        }
    }, [isTransitioning, fisheyeStrengthRef, effectStrengthRef, dragVelocityXRef, dragVelocityYRef]);

    // Update the imagesRef when images state changes
    useEffect(() => {
        imagesRef.current = images;
    }, [images]);

    // This useEffect ensures we store initial positions when images first load
    useEffect(() => {
        if (images.length > 0 && !originalPositionsRef.current.length) {
            storeInitialPositions(images);
        }
    }, [images, storeInitialPositions]);

    // Modifiez l'effet qui gère l'activation de la grille
    useEffect(() => {
        if (images.length > 0 && updateImagesLayout && !isTransitioning) {
            console.log("Déclenchement de la mise à jour de layout:", gridLayoutActive);
            updateImagesLayout(gridLayoutActive);
        }
    }, [gridLayoutActive, images.length, updateImagesLayout, isTransitioning]);

    // Effect for cursor style based on hover and drag states
    useEffect(() => {
        if (!canvasRef.current) return;

        if (hoveredProject) {
            canvasRef.current.style.cursor = 'pointer';
        } else {
            canvasRef.current.style.cursor = isDragging ? 'grabbing' : (isGridModeRef.current ? 'default' : 'grab');
        }
    }, [hoveredProject, isDragging, canvasRef, isGridModeRef]);

    // Initialize images when project image is loaded
    useEffect(() => {
        if (projectImageLoaded && backgroundLoaded && images.length === 0) {
            // Define the pattern size for repetition - use window size
            const patternWidth = window.innerWidth;
            const patternHeight = window.innerHeight;

            // Create images based on loaded resources
            const newImages = createNonOverlappingImages(projectImagesRef || projectImageRef, patternWidth, patternHeight);

            // Set the total and loaded count to match the actual created images
            setTotalImages(newImages.length);
            setImagesLoaded(newImages.length);
            setImages(newImages);
        }
    }, [projectImageLoaded, backgroundLoaded, images.length, projectImageRef, projectImagesRef, setImagesLoaded, setTotalImages]);

    // Define animation function before using it in useEffect
    const animate = useCallback(() => {
        if (!canvasRef.current || !offscreenCanvasRef.current) return;

        // Appliquer l'optimisation de rendu pendant les transitions
        optimizeRenderDuringTransition();

        // Détection de défilement actif en mode grille
        const isActiveGridScroll = isGridModeRef.current &&
            Math.abs(gridScrollOffsetRef.current - offsetYRef.current) > 0.5;

        if (wheelEventOccurredRef.current && isGridModeRef.current) {
            // Reset the flag
            wheelEventOccurredRef.current = false;

            // Increase responsiveness in this case
            offsetYRef.current += (targetOffsetYRef.current - offsetYRef.current) * 0.4;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const offscreenCtx = offscreenCanvasRef.current.getContext('2d');

        if (!ctx || !offscreenCtx) return;

        // Define the pattern size for repetition - use window size
        const patternWidth = window.innerWidth;
        const patternHeight = window.innerHeight;

        // Handle different behaviors for grid mode vs free mode
        if (isGridModeRef.current) {
            // Faster transition for grid mode
            const diff = gridScrollOffsetRef.current - offsetYRef.current;
            // Use exponential transition - faster for large movements
            const factor = Math.min(1, Math.abs(diff) * 0.01);
            offsetYRef.current += diff * Math.max(0.2, factor * 0.8);

            // Force horizontal coordinates to zero
            offsetXRef.current = 0;
            targetOffsetXRef.current = 0;
            dragVelocityXRef.current = 0;

            // Generate artificial velocity for visual effects
            const deltaY = offsetYRef.current - prevOffsetYRef.current;

            // MODIFICATION: Seulement générer une vélocité si ce n'est pas un défilement actif
            dragVelocityYRef.current = isActiveGridScroll ? 0 : deltaY * 2;

            // MODIFICATION: Désactiver tout effet visuel pendant le défilement en mode grille
            if (isActiveGridScroll) {
                effectStrengthRef.current = 0;
            } else {
                // Subtle visual effect based on movement (seulement quand on ne défile pas)
                effectStrengthRef.current = Math.abs(deltaY) > 0.5 ?
                    Math.min(Math.abs(deltaY) * 0.05, 0.1) :
                    Math.max(effectStrengthRef.current - 0.01, 0);
            }

            // Disable fisheye effect in grid mode
            fisheyeStrengthRef.current = 0;
        } else {
            // MODIFICATION: Après une transition grid → free, forcer la position à (0, 0)
            // Détectez si nous venons de terminer une transition de grid → free
            if (typeof window !== 'undefined' &&
                window._justCompletedGridToFreeTransition === true &&
                !isTransitioning) {

                // Réinitialiser progressivement vers (0, 0) pendant quelques trames
                const resetSpeed = 0.2; // Facteur de vitesse

                offsetXRef.current = offsetXRef.current * (1 - resetSpeed);
                offsetYRef.current = offsetYRef.current * (1 - resetSpeed);
                targetOffsetXRef.current = targetOffsetXRef.current * (1 - resetSpeed);
                targetOffsetYRef.current = targetOffsetYRef.current * (1 - resetSpeed);

                // Si suffisamment proche de zéro, forcer à exactement zéro et supprimer le flag
                if (Math.abs(offsetXRef.current) < 0.1 && Math.abs(offsetYRef.current) < 0.1) {
                    offsetXRef.current = 0;
                    offsetYRef.current = 0;
                    targetOffsetXRef.current = 0;
                    targetOffsetYRef.current = 0;
                    window._justCompletedGridToFreeTransition = false;
                    console.log("🔄 Camera position smoothly reset to (0, 0)");
                }
            } else {
                // Free mode - original behavior
                // Smoothly transition to target offset with improved easing
                offsetXRef.current += (targetOffsetXRef.current - offsetXRef.current) * 0.066;
                offsetYRef.current += (targetOffsetYRef.current - offsetYRef.current) * 0.066;

                // Calculate velocity with smoother response
                if (isDragging) {
                    // Smoother during drag - reacts more gradually
                    dragVelocityXRef.current = dragVelocityXRef.current * 0.6 + (targetOffsetXRef.current - lastDragXRef.current) * 0.5;
                    dragVelocityYRef.current = dragVelocityYRef.current * 0.6 + (targetOffsetYRef.current - lastDragYRef.current) * 0.5;

                    // Gradually increase effect strength
                    effectStrengthRef.current = Math.min(effectStrengthRef.current + 0.08, 1.5);

                    // Increase fisheye effect more smoothly
                    fisheyeStrengthRef.current = Math.min(fisheyeStrengthRef.current + 0.035, 0.5);
                } else {
                    // Even more gradual for release - maintains the effect longer
                    if (Math.abs(dragVelocityXRef.current) > 1.0 || Math.abs(dragVelocityYRef.current) > 1.0) {
                        // Higher velocities: slow down more gently to keep effect visible longer
                        dragVelocityXRef.current *= 0.99;
                        dragVelocityYRef.current *= 0.99;
                    } else {
                        // Lower velocities: still slow decay
                        dragVelocityXRef.current *= 0.975;
                        dragVelocityYRef.current *= 0.975;
                    }

                    // Threshold to stop very small movements
                    if (Math.abs(dragVelocityXRef.current) < 0.05) dragVelocityXRef.current = 0;
                    if (Math.abs(dragVelocityYRef.current) < 0.05) dragVelocityYRef.current = 0;

                    // Very gradual reduction of effects for a smooth transition
                    fisheyeStrengthRef.current = Math.max(fisheyeStrengthRef.current - 0.01, 0);
                    effectStrengthRef.current = Math.max(effectStrengthRef.current - 0.008, 0);
                }
            }
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

        // Modifier pour utiliser les positions interpolées pendant la transition
        let imagesToDraw = [...imagesRef.current];

        // Draw everything using the current images or transition images
        const {updatedImages, debugInfo} = drawCanvas({
            canvas,
            offscreenCanvas: offscreenCanvasRef.current,
            ctx,
            offscreenCtx,
            images: imagesToDraw,
            offsetX: offsetXRef.current,
            offsetY: offsetYRef.current,
            dragVelocityX: dragVelocityXRef.current,
            dragVelocityY: dragVelocityYRef.current,
            effectStrength: effectStrengthRef.current,
            fisheyeStrength: fisheyeStrengthRef.current,
            patternWidth,
            patternHeight,
            isGridMode: isGridModeRef.current,
            calculateGridLayout,
            isTransitioning: isTransitioning // Passer l'état de la transition
        });

        // Store debug info
        if (debugInfo) {
            debugInfoRef.current = debugInfo;
        }

        // Update images with new opacity values - but use setTimeout to avoid React state update inside animation frame
        if (updatedImages && !isTransitioning) {
            // Use a zero-timeout to break the synchronous state update in requestAnimationFrame
            setTimeout(() => {
                setImages(updatedImages);
            }, 0);
        }

        // Continue animation
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [isDragging, canvasRef, offscreenCanvasRef, animationFrameRef, prevOffsetXRef, prevOffsetYRef, isTransitioning, calculateGridLayout, optimizeRenderDuringTransition]);

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

    // Setup wheel event handling
    useEffect(() => {
        // Only run this once when the canvas is available
        if (wheelSetupCompleteRef.current || !canvasRef.current) return;

        // Mark as completed immediately to avoid multiple executions
        wheelSetupCompleteRef.current = true;

        // Add event listeners - important to set passive: false to prevent default scrolling
        window.addEventListener('wheel', handleWheel, {passive: false});
        canvasRef.current.addEventListener('wheel', handleWheel, {passive: false});

        // Cleanup function
        return () => {
            if (!wheelSetupCompleteRef.current) return;

            window.removeEventListener('wheel', handleWheel);

            if (canvasRef.current) {
                canvasRef.current.removeEventListener('wheel', handleWheel);
            }

            // Reset to allow reconfiguration if needed
            wheelSetupCompleteRef.current = false;
        };
    }, [handleWheel, canvasRef]);

    // Export the event handlers to be used by the parent component
    const setDragHandlers = {
        mouseDown: handleMouseDown, mouseMove: handleMouseMove, mouseUp: handleMouseUp
    };

    return {
        images,
        isDragging,
        hoveredProject,
        debugInfo: debugInfoRef.current,
        findClickedProject,
        setDragHandlers,
        updateImagesLayout,
        isTransitioning,
        forceUpdateImages  // Exporter la nouvelle fonction
    };
};