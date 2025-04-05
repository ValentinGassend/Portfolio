import {useCallback} from 'react';

export const usePositionTransition = (imagesRef, originalPositionsRef, initialPositionsRef, targetPositionsRef, isGridModeRef, calculateGridLayout, animationProgressRef, setIsTransitioning, setImages) => {
    // Store initial positions before any transformations
    const storeInitialPositions = useCallback((imgs) => {
        if (!originalPositionsRef.current || originalPositionsRef.current.length === 0) {
            originalPositionsRef.current = imgs.map(img => ({
                x: img.patternX, y: img.patternY, width: img.width, height: img.height, visible: img.visible || false
            }));

            initialPositionsRef.current = JSON.parse(JSON.stringify(originalPositionsRef.current));
        }
    }, [originalPositionsRef, initialPositionsRef]);

    // Improved function to get unique image indices by filtering duplicates
    const getUniqueVisibleIndices = useCallback((images) => {
        // Créer une map pour suivre les indices sources
        const sourceImageToIndexMap = new Map();
        const uniqueIndices = [];
        const projectGroups = new Map(); // Pour regrouper les éléments par projet

        // Première passe : identifier toutes les images visibles
        const visibleIndices = images
            .map((img, idx) => img.visible ? idx : -1)
            .filter(idx => idx !== -1);

        if (visibleIndices.length === 0) return {uniqueIndices: [], projectGroups: new Map()};

        // Deuxième passe : construire la correspondance des indices source
        // et identifier les groupes de projets
        for (let i = 0; i < images.length; i++) {
            const img = images[i];

            // Extraire le nom du projet à partir du nom de l'image
            const projectName = img.name ? img.name.split(' ')[0] : null;

            // Si nous avons un nom de projet valide, le regrouper
            if (projectName) {
                if (!projectGroups.has(projectName)) {
                    projectGroups.set(projectName, []);
                }
                projectGroups.get(projectName).push(i);
            }

            // Suivre la première occurrence de chaque image source
            if (img.sourceImageIndex !== undefined) {
                if (!sourceImageToIndexMap.has(img.sourceImageIndex)) {
                    sourceImageToIndexMap.set(img.sourceImageIndex, i);
                }
            }
        }

        // Pour chaque groupe de projet, sélectionner uniquement l'image principale
        projectGroups.forEach((indices, projectName) => {
            // Trier les indices par taille d'image (la plus grande d'abord)
            indices.sort((a, b) => {
                const imgA = images[a];
                const imgB = images[b];
                // Calculer la surface pour déterminer la taille
                const sizeA = imgA.width * imgA.height;
                const sizeB = imgB.width * imgB.height;
                return sizeB - sizeA; // Du plus grand au plus petit
            });

            // Ne garder que le premier élément (le plus grand) de chaque groupe
            if (indices.length > 0 && visibleIndices.includes(indices[0])) {
                uniqueIndices.push(indices[0]);

                // Marquer cet indice comme l'indice principal pour tous les éléments du groupe
                indices.forEach(idx => {
                    if (idx !== indices[0] && images[idx].sourceImageIndex !== undefined) {
                        sourceImageToIndexMap.set(images[idx].sourceImageIndex, indices[0]);
                    }
                });
            }
        });

        // Troisième passe : ajouter les images visibles qui n'appartiennent à aucun groupe
        for (const idx of visibleIndices) {
            const img = images[idx];
            const projectName = img.name ? img.name.split(' ')[0] : null;

            // Si cette image n'appartient à aucun groupe ou si le groupe n'a pas été traité
            if (!projectName || !projectGroups.has(projectName)) {
                // Si pas d'index source ou premier élément avec cet index source
                if (img.sourceImageIndex === undefined || sourceImageToIndexMap.get(img.sourceImageIndex) === idx) {
                    // Éviter les doublons
                    if (!uniqueIndices.includes(idx)) {
                        uniqueIndices.push(idx);
                    }
                }
            }
        }

        console.log(`Filtré ${visibleIndices.length} images visibles en ${uniqueIndices.length} éléments uniques`);

        return {
            uniqueIndices, projectGroups
        };
    }, []);
    // Improved transition function that eliminates duplicates
    const performNoTeleportTransition = useCallback((useGridLayout, resetPosition = false) => {
        console.log(`🔄 Starting smooth transition: ${useGridLayout ? "free → grid" : "grid → free"}`);

        // Use flags to prevent mode changes during animation
        let animationInProgress = true;
        const originalMode = isGridModeRef.current;
        const targetMode = useGridLayout;

        // Get current images and filter out duplicates
        const images = imagesRef.current;
        const {uniqueIndices, projectGroups} = getUniqueVisibleIndices(images);

        let visibleIndices = uniqueIndices;

        if (visibleIndices.length === 0) {
            console.log("❌ No visible images, canceling transition");
            return;
        }

        console.log(`🔄 Transition: ${visibleIndices.length} unique projects retained out of ${images.length} total elements`);

        // Reset global flags that control grid layout behavior
        if (typeof window !== 'undefined') {
            window.useFinalGridPositions = false;
            window.isGridTransitioning = true;
        }

        // Save original camera state
        // Stockez la position initiale de la caméra pour la transition Grid → Free
        const originalCameraX = typeof window !== 'undefined' ? (window.offsetXRef?.current || 0) : 0;
        const originalCameraY = typeof window !== 'undefined' ? (window.offsetYRef?.current || 0) : 0;

        // IMPORTANT: Si on fait une transition grid → free, on mémorise les coordonnées originales
        // pour pouvoir y revenir progressivement
        if (!targetMode && typeof window !== 'undefined') {
            window._originalCameraX = originalCameraX;
            window._originalCameraY = originalCameraY;
            console.log(`📸 Saved original camera position: (${originalCameraX}, ${originalCameraY}) for smooth return`);
        }

        // Activate transition state
        setIsTransitioning(true);

        // Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Step 1: Calculate final positions WITHOUT changing the mode
        let finalPositions = {};

        if (targetMode) {
            // If transitioning to grid mode
            // Save original state
            const tempGridMode = isGridModeRef.current;

            // Temporarily switch to grid mode for calculation only
            isGridModeRef.current = true;

            // Force grid position reset for calculation
            const originalOffsetY = window._tempOffsetY = window._gridScrollOffset || 0;
            window._gridScrollOffset = 0;

            // Calculate grid positions with reset position
            const gridPositions = calculateGridLayout();

            // Get infiniteScrollRef from window context
            const infiniteScrollRef = window.infiniteScrollRef;

            // Immediately revert to original mode
            isGridModeRef.current = tempGridMode;

            if (gridPositions && gridPositions.length > 0) {
                // Get pattern height
                let patternHeight;

                if (infiniteScrollRef && infiniteScrollRef.current && infiniteScrollRef.current.patternHeight) {
                    patternHeight = infiniteScrollRef.current.patternHeight;
                    console.log("📏 Retrieved pattern height:", patternHeight);
                } else {
                    // Extract original positions (repeatIndex === 0)
                    const originalPositions = gridPositions.filter(pos => pos.repeatIndex === 0);

                    // Calculate pattern height manually
                    if (originalPositions.length > 0) {
                        // Find max Y position (y + height) among original positions
                        const maxY = Math.max(...originalPositions.map(pos => pos.y + pos.height));
                        // Find min Y position among original positions
                        const minY = Math.min(...originalPositions.map(pos => pos.y));
                        // Pattern height is the difference + spacing
                        patternHeight = maxY - minY;
                        console.log("📏 Calculated pattern height:", patternHeight);
                    } else {
                        // Default value if no calculation is possible
                        patternHeight = 500;
                        console.log("📏 Using default height:", patternHeight);
                    }
                }

                // Keep only positions with repeatIndex === 0 (eliminate all duplicates)
                const originalGridPositions = gridPositions.filter(pos => pos.repeatIndex === 0);

                // Create mapping for original positions
                const positionsByOriginalIndex = {};

                // Store only original positions
                originalGridPositions.forEach(pos => {
                    if (!positionsByOriginalIndex[pos.originalIndex]) {
                        positionsByOriginalIndex[pos.originalIndex] = pos;
                    }
                });

                // Calculate center of grid for original positions
                const originalPositionsArray = Object.values(positionsByOriginalIndex);

                // If no original positions found, cancel transition
                if (originalPositionsArray.length === 0) {
                    console.log("❌ No original positions found, canceling");
                    setIsTransitioning(false);
                    return;
                }

                const gridItemsX = originalPositionsArray.map(pos => pos.x);
                const gridMaxX = Math.max(...gridItemsX.map((x, i) => x + originalPositionsArray[i].width));
                const gridMinX = Math.min(...gridItemsX);
                const gridWidth = gridMaxX - gridMinX;

                // Center grid horizontally relative to screen
                const gridCenterOffset = (screenWidth - gridWidth) / 2 - gridMinX;

                // Position visible elements
                visibleIndices.forEach(idx => {
                    const img = images[idx];
                    const originalGridPos = positionsByOriginalIndex[idx];

                    if (originalGridPos) {
                        // Original position found
                        finalPositions[idx] = {
                            x: originalGridPos.x + gridCenterOffset,
                            y: originalGridPos.y,
                            width: originalGridPos.width,
                            height: originalGridPos.height,
                            opacity: 1
                        };
                    }
                    const allIndices = Object.keys(images).map(Number);
                    const indicesToHide = allIndices.filter(idx => !visibleIndices.includes(idx));

                    // Pour chaque groupe de projet, ne conserver que l'élément principal
                    projectGroups.forEach((indices, projectName) => {
                        if (indices.length > 1) {
                            // Le premier élément (le plus grand) est conservé, les autres masqués
                            for (let i = 1; i < indices.length; i++) {
                                indicesToHide.push(indices[i]);
                            }
                        }
                    });

                    // Définir l'opacité à 0 pour tous les éléments à masquer
                    for (const idx of indicesToHide) {
                        if (images[idx]) {
                            images[idx] = {
                                ...images[idx], opacity: 0, visible: false
                            };
                        }
                    }
                });

                if (targetMode) {
                    // For grid mode, check for odd elements and give them special stable treatment
                    const impairElements = originalPositionsArray.filter(pos => pos.isImpairElement);

                    if (impairElements.length > 0) {
                        // There's an odd element, apply special treatment
                        impairElements.forEach(impairPos => {
                            // If this odd element is visible, stabilize its position
                            const idx = impairPos.originalIndex;

                            if (finalPositions[idx]) {
                                console.log("💫 Stabilizing odd element:", idx);

                                // Ensure stable central position
                                finalPositions[idx] = {
                                    ...finalPositions[idx],
                                    x: screenWidth / 2 - finalPositions[idx].width / 2,
                                    isStabilized: true // Mark as stabilized
                                };
                            }
                        });
                    }
                }
            }
        } else {
            visibleIndices.forEach(idx => {
                const initialPos = initialPositionsRef.current[idx];

                if (initialPos) {
                    finalPositions[idx] = {
                        ...initialPos, opacity: 1
                    };
                } else {
                    // Fallback - current position
                    finalPositions[idx] = {
                        x: images[idx].patternX,
                        y: images[idx].patternY,
                        width: images[idx].width,
                        height: images[idx].height,
                        opacity: 1
                    };
                }
            });
        }

        // Step 2: Remember starting positions
        const startPositions = {};

        // Determine if an element is visible on screen
        const isVisibleOnScreen = (img) => {
            const adjustedX = img.patternX;
            const adjustedY = img.patternY;

            return (adjustedX + img.width >= 0 && adjustedX <= screenWidth && adjustedY + img.height >= 0 && adjustedY <= screenHeight);
        };

        visibleIndices.forEach(idx => {
            const img = images[idx];

            // If image not visible on screen, give it a starting position just outside the screen in a random direction
            if (!isVisibleOnScreen(img)) {
                // Random direction (top, right, bottom, left)
                const direction = Math.floor(Math.random() * 4);
                let offScreenX, offScreenY;

                switch (direction) {
                    case 0: // top
                        offScreenX = Math.random() * screenWidth;
                        offScreenY = -img.height - 50;
                        break;
                    case 1: // right
                        offScreenX = screenWidth + 50;
                        offScreenY = Math.random() * screenHeight;
                        break;
                    case 2: // bottom
                        offScreenX = Math.random() * screenWidth;
                        offScreenY = screenHeight + 50;
                        break;
                    case 3: // left
                    default:
                        offScreenX = -img.width - 50;
                        offScreenY = Math.random() * screenHeight;
                        break;
                }

                startPositions[idx] = {
                    x: offScreenX, y: offScreenY, width: img.width, height: img.height, opacity: 0  // Start invisible for off-screen elements
                };
            } else {
                // For visible elements, use their current position
                startPositions[idx] = {
                    x: img.patternX, y: img.patternY, width: img.width, height: img.height, opacity: img.opacity || 1
                };
            }
        });

        // New: Calculate intermediate stacked position at screen center
        const intermediatePositions = {};
        const stackSpacing = 0; // Vertical spacing between stacked elements

        // Get screen center position
        const screenCenterX = screenWidth / 2;
        const screenCenterY = screenHeight / 2;

        // Sort elements by size (largest first)
        const sortedIndices = [...visibleIndices].sort((a, b) => {
            const sizeA = images[a].width * images[a].height;
            const sizeB = images[b].width * images[b].height;
            return sizeB - sizeA;
        });

        // Scale coefficient for stacking
        const stackScale = 0.75; // Reduce to 75% of original size
        const stackOverlap = 1.0; // 100% vertical overlap

        // Calculate total height of stack after reduction and overlap
        let totalStackHeight = sortedIndices.reduce((height, idx, i) => {
            const stackedHeight = images[idx].height * stackScale;
            // First element complete, others with overlap
            return height + (i > 0 ? stackedHeight * (1 - stackOverlap) + stackSpacing : stackedHeight);
        }, 0);

        // Starting Y position, centered relative to screen
        let stackY = screenCenterY - totalStackHeight / 2;

        // Assign stacked positions (always centered on screen)
        sortedIndices.forEach((idx, i) => {
            const img = images[idx];
            const stackedWidth = img.width * stackScale;
            const stackedHeight = img.height * stackScale;

            intermediatePositions[idx] = {
                // Always horizontally centered on screen
                x: screenCenterX - stackedWidth / 2, y: stackY, width: stackedWidth, height: stackedHeight, // Adjust opacity based on position in stack
                // Elements lower in stack are slightly more transparent
                opacity: Math.max(0.7, 0.95 - (i * 0.03))
            };

            // Advance Y position for next element with overlap
            stackY += stackedHeight * (1 - stackOverlap) + stackSpacing;
        });

        // Step 3: Animate in three phases: start → stacked center → destination
        let startTime = null;
        const PHASE_1_DURATION = 500; // ms - To center (slightly faster)
        const PHASE_2_DURATION = 0; // ms - Pause at center (slightly shorter)
        const PHASE_3_DURATION = 550; // ms - To destination
        const TOTAL_DURATION = PHASE_1_DURATION + PHASE_2_DURATION + PHASE_3_DURATION;

        // Save original canvas offsets for reset
        // These variables will be used if we transition from free to grid mode
        const originalOffsetX = window._canvasOffsetX || 0;
        const originalOffsetY = window._canvasOffsetY || 0;
        const needsCanvasRecentering = targetMode && !originalMode; // Transitioning from free to grid

        console.log("🔄 Starting three-phase animation", needsCanvasRecentering ? "with canvas recentering" : "");

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Determine current phase
            let phase = 1;
            let phaseProgress = 0;

            if (elapsed < PHASE_1_DURATION) {
                // Phase 1: start → center
                phase = 1;
                phaseProgress = elapsed / PHASE_1_DURATION;
            } else if (elapsed < PHASE_1_DURATION + PHASE_2_DURATION) {
                // Phase 2: pause at center
                phase = 2;
                phaseProgress = (elapsed - PHASE_1_DURATION) / PHASE_2_DURATION;
            } else {
                // Phase 3: center → destination
                phase = 3;
                phaseProgress = (elapsed - PHASE_1_DURATION - PHASE_2_DURATION) / PHASE_3_DURATION;
                phaseProgress = Math.min(phaseProgress, 1); // Limit to 1
            }

            // Easing function
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const easedProgress = easeInOutCubic(phaseProgress);

            // Progressively recenter canvas if transitioning from free to grid (phase 1)
            if (phase === 1 && window._updateCanvasOffset) {
                if (targetMode) {
                    // Transition Free → Grid: Recentrer vers (0, 0) comme avant
                    const newOffsetX = originalOffsetX * (1 - easedProgress);
                    const newOffsetY = originalOffsetY * (1 - easedProgress);
                    window._updateCanvasOffset(newOffsetX, newOffsetY);
                }
            }
            if (phase === 1 && window._updateCanvasOffset) {
                if (!targetMode) {

                    const newOffsetX = originalOffsetX * (1 - easedProgress);
                    const newOffsetY = originalOffsetY * (1 - easedProgress);
                    window._updateCanvasOffset(newOffsetX, newOffsetY);
                }
            }

            // Prepare new array for updated images
            // IMPORTANT: Create a complete copy to avoid modifying the original
            const updatedImages = [...images];

            // Reduce opacity of all duplicate elements
            // This step is critical to ensure duplicates disappear during transition
            if (typeof window !== 'undefined' && window.isGridTransitioning) {
                // Use our source tracking to identify and hide duplicates
                const processedSourceIndices = new Set();

                for (let i = 0; i < updatedImages.length; i++) {
                    const img = updatedImages[i];

                    // If not a visible index, low opacity
                    if (!visibleIndices.includes(i)) {
                        updatedImages[i] = {
                            ...img, opacity: Math.max(0, img.opacity - 0.1) // Gradually reduce
                        };
                        continue;
                    }

                    // For visible indices, check if it's a duplicate
                    if (img.sourceImageIndex !== undefined) {
                        if (processedSourceIndices.has(img.sourceImageIndex)) {
                            // It's a duplicate, reduce opacity
                            updatedImages[i] = {
                                ...img, opacity: 0
                            };
                        } else {
                            // It's the original, mark as processed
                            processedSourceIndices.add(img.sourceImageIndex);
                        }
                    }
                }
            }

            // Apply intermediate positions based on phase
            visibleIndices.forEach(idx => {
                const start = startPositions[idx];
                const middle = intermediatePositions[idx];
                const end = finalPositions[idx];

                let currentPos;

                if (phase === 1) {
                    // Phase 1: start → center
                    currentPos = {
                        x: start.x + (middle.x - start.x) * easedProgress,
                        y: start.y + (middle.y - start.y) * easedProgress,
                        width: start.width + (middle.width - start.width) * easedProgress,
                        height: start.height + (middle.height - start.height) * easedProgress,
                        opacity: start.opacity + (middle.opacity - start.opacity) * easedProgress
                    };
                } else if (phase === 2) {
                    // Phase 2: slight float at center
                    // Float amplitude depends on element size
                    const floatAmplitude = Math.min(5, middle.height * 0.02); // Max 5px or 2% of height
                    const floatOffset = Math.sin(phaseProgress * Math.PI * 2) * floatAmplitude;

                    // Slight pulse effect (zoom)
                    const pulseScale = 0; // ±1.5% pulse

                    currentPos = {
                        x: middle.x - (middle.width * pulseScale - middle.width) / 2, // Keep centered during pulse
                        y: middle.y + floatOffset,
                        width: middle.width * pulseScale,
                        height: middle.height * pulseScale,
                        opacity: middle.opacity
                    };
                } else {
                    // Phase 3: center → destination
                    currentPos = {
                        x: middle.x + (end.x - middle.x) * easedProgress,
                        y: middle.y + (end.y - middle.y) * easedProgress,
                        width: middle.width + (end.width - middle.width) * easedProgress,
                        height: middle.height + (end.height - middle.height) * easedProgress,
                        opacity: middle.opacity + (end.opacity - middle.opacity) * easedProgress
                    };
                    if (currentPos && end.isStabilized) {
                        // Keep odd element horizontally centered throughout the transition
                        currentPos.x = screenCenterX - currentPos.width / 2;
                    }
                }

                updatedImages[idx] = {
                    ...updatedImages[idx],
                    patternX: currentPos.x,
                    patternY: currentPos.y,
                    width: currentPos.width,
                    height: currentPos.height,
                    opacity: currentPos.opacity
                };
            });

            // Update display with new positions
            setImages(updatedImages);
            imagesRef.current = updatedImages;

            // Continue animation until the end
            if (elapsed < TOTAL_DURATION) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete - apply exact final positions
                const finalUpdatedImages = [...images];

                // IMPORTANT: NE PAS forcer immédiatement la caméra à (0,0) pour grid → free
                // Enlever ou modifier ce bloc :
                /*
                if (!targetMode && typeof window !== 'undefined' && window._updateCanvasOffset) {
                    // Forcer une dernière fois la position de la caméra à (0, 0)
                    window._updateCanvasOffset(0, 0);
                    console.log("📸 Camera position reset to (0, 0) for free mode");
                }
                */

                // Update images with exact final positions
                visibleIndices.forEach(idx => {
                    finalUpdatedImages[idx] = {
                        ...finalUpdatedImages[idx],
                        patternX: finalPositions[idx].x,
                        patternY: finalPositions[idx].y,
                        width: finalPositions[idx].width,
                        height: finalPositions[idx].height,
                        opacity: targetMode ? 0.9 : 1,
                    };
                });

                // Keep opacity at 0 for all duplicates
                if (targetMode) {
                    const sourceIndicesInTransition = new Set(visibleIndices
                        .map(idx => finalUpdatedImages[idx].sourceImageIndex)
                        .filter(idx => idx !== undefined));

                    // Process all images
                    for (let i = 0; i < finalUpdatedImages.length; i++) {
                        // Skip visible indices (already updated)
                        if (visibleIndices.includes(i)) continue;

                        const img = finalUpdatedImages[i];

                        // If it's a duplicate of a processed image, make it invisible
                        if (img.sourceImageIndex !== undefined && sourceIndicesInTransition.has(img.sourceImageIndex)) {
                            finalUpdatedImages[i] = {
                                ...img, opacity: 0
                            };
                        }
                    }
                }
                // if (!targetMode) { // Si on va vers le mode free
                //     if (typeof window !== 'undefined' && window._updateCanvasOffset) {
                //         window._updateCanvasOffset(0, 0);
                //     }
                // }

                setImages(finalUpdatedImages);
                imagesRef.current = finalUpdatedImages;

                // Indicate animation is complete
                animationInProgress = false;

                // Clean up global transition flags
                if (typeof window !== 'undefined') {
                    // Explicitly reset transition control flags
                    window.isGridTransitioning = false;

                    // Also clean up temporary variables that are no longer needed
                    window._tempOffsetY = undefined;
                    window._gridScrollOffset = undefined;
                    window._canvasOffsetX = undefined;
                    window._canvasOffsetY = undefined;
                    window._updateCanvasOffset = undefined;
                }

                // ONLY NOW change the mode
                console.log(`✅ Animation complete, changing mode to ${targetMode ? "grid" : "free"}`);
                isGridModeRef.current = targetMode;

                // For grid mode, definitive solution to avoid any visual offset:
                // Force grid layout to use EXACTLY the final positions from the transition
                if (targetMode) {
                    if (typeof window !== 'undefined') {
                        window.useFinalGridPositions = true;
                    }

                    setTimeout(() => {
                        console.log("🔒 Locking final positions for perfect transition");

                        // Disable transition flag
                        if (typeof window !== 'undefined') {
                            window.isGridTransitioning = false;
                        }

                        // Recalculate layout with locked positions
                        const gridPositions = calculateGridLayout();

                        // Force complete layout recalculation once transition is complete
                        if (typeof calculateGridLayout === 'function') {
                            // Calculate new layout to ensure everything is correctly positioned
                            const newGridPositions = calculateGridLayout();
                            console.log("🔄 Final layout recalculation after transition");
                        }

                        // End transition
                        setTimeout(() => {
                            setIsTransitioning(false);
                            console.log("✅ Transition complete, grid mode active with preserved positions");

                            // Disable position locking after a short delay to allow
                            // normal scrolling afterward
                            setTimeout(() => {
                                if (typeof window !== 'undefined') {
                                    window.useFinalGridPositions = false;
                                }
                            }, 500);
                        }, 100);
                    }, 50);
                } else {
                    // Free mode, end immediately
                    setIsTransitioning(false);

                    // Disable flags
                    if (typeof window !== 'undefined') {
                        window.isGridTransitioning = false;
                        window.useFinalGridPositions = false;

                        // IMPORTANT: Définir le flag pour le retour progressif au lieu de forcer la position
                        window._justCompletedGridToFreeTransition = true;
                        console.log("✅ Transition complete, setting gradual return flag for smooth camera reset");
                    }

                    console.log("✅ Transition complete, free mode active");
                }
            }
        };

        // Start animation
        requestAnimationFrame(animate);

    }, [imagesRef, calculateGridLayout, initialPositionsRef, setImages, setIsTransitioning, isGridModeRef, getUniqueVisibleIndices]);

    // Update images layout based on mode (grid or free)
    // Dans usePositionTransition.js, modifiez la fonction updateImagesLayout

    const updateImagesLayout = useCallback((useGridLayout) => {
        // If we're already in the requested mode, no need to transition
        if (isGridModeRef.current === useGridLayout) {
            return;
        }

        console.log(`🔄 Transition: ${useGridLayout ? "to grid" : "to free"}`);

        // Transition from free mode to grid mode
        if (useGridLayout) {
            // Store current canvas positions for animation
            if (typeof window !== 'undefined') {
                // Save current canvas state for animation
                window._canvasOffsetX = window.offsetXRef?.current || 0;
                window._canvasOffsetY = window.offsetYRef?.current || 0;

                // Define function to update offsets during animation
                window._updateCanvasOffset = (x, y) => {
                    if (window.offsetXRef && window.offsetYRef) {
                        window.offsetXRef.current = x;
                        window.offsetYRef.current = y;
                        window.targetOffsetXRef.current = x;
                        window.targetOffsetYRef.current = y;
                    }
                };

                // Emit event to reset grid scrolling before transition
                const resetEvent = new CustomEvent('resetGridPosition', {detail: {immediate: true}});
                window.dispatchEvent(resetEvent);
            }

            // Short delay to allow position to reset
            setTimeout(() => {
                // Ensure initial positions are stored
                if (imagesRef.current.length > 0) {
                    storeInitialPositions(imagesRef.current);
                }

                // Use no-teleport transition
                performNoTeleportTransition(useGridLayout, true);
            }, 50);
        } else {
            // Transition from grid mode to free mode
            if (typeof window !== 'undefined') {
                // Save current canvas state for animation
                window._canvasOffsetX = window.offsetXRef?.current || 0;
                window._canvasOffsetY = window.offsetYRef?.current || 0;

                // Define function to update offsets during animation
                window._updateCanvasOffset = (x, y) => {
                    if (window.offsetXRef && window.offsetYRef) {
                        window.offsetXRef.current = x;
                        window.offsetYRef.current = y;
                        window.targetOffsetXRef.current = x;
                        window.targetOffsetYRef.current = y;
                    }
                };
            }

            // Ensure initial positions are stored
            if (imagesRef.current.length > 0) {
                storeInitialPositions(imagesRef.current);
            }

            // Use no-teleport transition
            performNoTeleportTransition(useGridLayout, false);
        }
    }, [storeInitialPositions, performNoTeleportTransition, isGridModeRef, imagesRef]);

    return {storeInitialPositions, updateImagesLayout};
};