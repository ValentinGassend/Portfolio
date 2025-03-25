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



    // Fonction de transition sans téléportation
    // Fonction de transition améliorée pour empiler les éléments au centre de l'écran
    const performNoTeleportTransition = useCallback((useGridLayout, resetPosition = false) => {
        console.log(`🔄 Démarrage de la transition fluide: ${useGridLayout ? "libre → grille" : "grille → libre"}`);

        // ⚠️ CRITIQUE: Utiliser des flags pour ne pas changer le mode pendant l'animation
        let animationInProgress = true;
        const originalMode = isGridModeRef.current;
        const targetMode = useGridLayout;

        // Bloquer la transition si aucune image n'est visible
        const images = imagesRef.current;
        const visibleIndices = images
            .map((img, idx) => img.visible ? idx : -1)
            .filter(idx => idx !== -1);

        if (visibleIndices.length === 0) {
            console.log("❌ Aucune image visible, annulation");
            return;
        }

        // Activer l'état de transition
        setIsTransitioning(true);

        // Obtenir les dimensions de l'écran
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Étape 1: Calculer les positions finales SANS changer le mode
        let finalPositions = {};

        if (targetMode) { // Si on va vers la grille
            // Sauvegarder l'état d'origine
            const tempGridMode = isGridModeRef.current;

            // Temporairement passer en mode grille pour le calcul seulement
            isGridModeRef.current = true;

            // Forcer une réinitialisation de la position du grid pour le calcul
            // Cela va faire en sorte que la grille soit bien centrée dans la vue dès le départ
            const originalOffsetY = window._tempOffsetY = window._gridScrollOffset || 0;
            window._gridScrollOffset = 0;

            // Calculer les positions de grille avec position réinitialisée
            const gridPositions = calculateGridLayout();

            // Immédiatement revenir au mode d'origine
            isGridModeRef.current = tempGridMode;

            if (gridPositions && gridPositions.length > 0) {
                // Filtrer uniquement les positions non dupliquées
                const originalPositions = gridPositions.filter(pos => pos.repeatIndex === 0);

                // Calculer le centre de la grille
                const gridItemsX = originalPositions.map(pos => pos.x);
                const gridItemsY = originalPositions.map(pos => pos.y);
                const gridMinX = Math.min(...gridItemsX);
                const gridMaxX = Math.max(...gridItemsX.map((x, i) => x + originalPositions[i].width));
                const gridWidth = gridMaxX - gridMinX;

                // Centrer la grille horizontalement par rapport à l'écran
                const gridCenterOffset = (screenWidth - gridWidth) / 2 - gridMinX;

                visibleIndices.forEach(idx => {
                    const img = images[idx];
                    const gridPos = originalPositions.find(pos => pos.originalIndex === idx);

                    if (gridPos) {
                        finalPositions[idx] = {
                            // Positionner au centre de l'écran, pas du canvas
                            x: gridPos.x + gridCenterOffset, // Conserver la position Y de la grille mais centrer verticalement
                            y: gridPos.y, width: gridPos.width, height: gridPos.height, opacity: 1
                        };
                    } else {
                        // Position par défaut toujours au centre de l'écran
                        finalPositions[idx] = {
                            x: screenWidth / 2 - img.width / 2,
                            y: screenHeight / 2 - img.height / 2,
                            width: img.width,
                            height: img.height,
                            opacity: 1
                        };
                    }
                });
            } else {
                // Fallback - layout grille basique, centré sur l'écran
                const cols = 2;
                const spacing = 30;
                const baseHeight = 200;

                // Calculer la largeur totale de la grille
                let maxWidth = 0;
                let totalRows = Math.ceil(visibleIndices.length / cols);

                // Calculer la largeur et hauteur maximales pour centrage
                let itemsByRow = [];
                for (let row = 0; row < totalRows; row++) {
                    let rowWidth = 0;
                    let rowItems = [];

                    for (let col = 0; col < cols; col++) {
                        const idx = row * cols + col;
                        if (idx < visibleIndices.length) {
                            const imgIdx = visibleIndices[idx];
                            const img = images[imgIdx];
                            const aspectRatio = img.width / img.height;
                            const targetHeight = baseHeight;
                            const targetWidth = targetHeight * aspectRatio;

                            rowWidth += targetWidth + (col > 0 ? spacing : 0);
                            rowItems.push({
                                index: imgIdx, width: targetWidth, height: targetHeight
                            });
                        }
                    }

                    maxWidth = Math.max(maxWidth, rowWidth);
                    itemsByRow.push(rowItems);
                }

                // Calculer la hauteur totale de la grille
                const totalHeight = totalRows * baseHeight + (totalRows - 1) * spacing;

                // Position de départ pour centrer la grille
                const startX = (screenWidth - maxWidth) / 2;
                const startY = (screenHeight - totalHeight) / 2;

                // Positionner chaque élément
                itemsByRow.forEach((rowItems, rowIndex) => {
                    // Calculer la largeur de cette rangée
                    const rowWidth = rowItems.reduce((sum, item, idx) => sum + item.width + (idx > 0 ? spacing : 0), 0);

                    // Centrer cette rangée
                    const rowStartX = (screenWidth - rowWidth) / 2;

                    let currentX = rowStartX;
                    rowItems.forEach((item) => {
                        finalPositions[item.index] = {
                            x: currentX,
                            y: startY + rowIndex * (baseHeight + spacing),
                            width: item.width,
                            height: item.height,
                            opacity: 1
                        };
                        currentX += item.width + spacing;
                    });
                });
            }
        } else { // Si on revient au mode libre
            visibleIndices.forEach(idx => {
                const initialPos = initialPositionsRef.current[idx];

                if (initialPos) {
                    finalPositions[idx] = {
                        ...initialPos, opacity: 1
                    };
                } else {
                    // Fallback - position actuelle
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

        // Étape 2: Mémoriser les positions de départ, mais assurons-nous qu'elles sont toujours
        // relatives à l'écran, pas au canvas
        const startPositions = {};

        // Déterminer si un élément est visible à l'écran
        const isVisibleOnScreen = (img) => {
            const adjustedX = img.patternX;
            const adjustedY = img.patternY;

            return (adjustedX + img.width >= 0 && adjustedX <= screenWidth && adjustedY + img.height >= 0 && adjustedY <= screenHeight);
        };

        visibleIndices.forEach(idx => {
            const img = images[idx];

            // Si l'image n'est pas visible à l'écran, lui donner une position de départ
            // juste en dehors de l'écran dans une direction aléatoire
            if (!isVisibleOnScreen(img)) {
                // Direction aléatoire (haut, bas, gauche, droite)
                const direction = Math.floor(Math.random() * 4);
                let offScreenX, offScreenY;

                switch (direction) {
                    case 0: // haut
                        offScreenX = Math.random() * screenWidth;
                        offScreenY = -img.height - 50;
                        break;
                    case 1: // droite
                        offScreenX = screenWidth + 50;
                        offScreenY = Math.random() * screenHeight;
                        break;
                    case 2: // bas
                        offScreenX = Math.random() * screenWidth;
                        offScreenY = screenHeight + 50;
                        break;
                    case 3: // gauche
                    default:
                        offScreenX = -img.width - 50;
                        offScreenY = Math.random() * screenHeight;
                        break;
                }

                startPositions[idx] = {
                    x: offScreenX, y: offScreenY, width: img.width, height: img.height, opacity: 0  // Démarrer invisible pour les éléments hors écran
                };
            } else {
                // Pour les éléments visibles, utiliser leur position actuelle
                startPositions[idx] = {
                    x: img.patternX, y: img.patternY, width: img.width, height: img.height, opacity: img.opacity || 1
                };
            }
        });

        // Nouveau: Calculer position intermédiaire empilée au centre de l'écran
        const intermediatePositions = {};
        const stackSpacing = 0; // Espace vertical entre les éléments empilés

        // Obtenir la position centrale de l'écran
        const screenCenterX = screenWidth / 2;
        const screenCenterY = screenHeight / 2;

        // Trier les éléments par taille (les plus grands d'abord)
        const sortedIndices = [...visibleIndices].sort((a, b) => {
            const sizeA = images[a].width * images[a].height;
            const sizeB = images[b].width * images[b].height;
            return sizeB - sizeA;
        });

        // Coefficient de réduction pour l'empilage
        const stackScale = 0.85; // Réduction à 85% de la taille d'origine
        const stackOverlap = 1.0; // 80% de chevauchement vertical

        // Calculer la hauteur totale de la pile après réduction et chevauchement
        let totalStackHeight = sortedIndices.reduce((height, idx, i) => {
            const stackedHeight = images[idx].height * stackScale;
            // Premier élément complet, les autres avec chevauchement
            return height + (i > 0 ? stackedHeight * (1 - stackOverlap) + stackSpacing : stackedHeight);
        }, 0);

        // Position Y de départ, centrée par rapport à l'écran
        let stackY = screenCenterY - totalStackHeight / 2;

        // Attribuer positions empilées (toujours centrées sur l'écran)
        sortedIndices.forEach((idx, i) => {
            const img = images[idx];
            const stackedWidth = img.width * stackScale;
            const stackedHeight = img.height * stackScale;

            intermediatePositions[idx] = {
                // Toujours centré horizontalement sur l'écran
                x: screenCenterX - stackedWidth / 2,
                y: stackY,
                width: stackedWidth,
                height: stackedHeight, // Ajuster l'opacité en fonction de la position dans la pile
                // Les éléments plus bas sont légèrement plus transparents
                opacity: Math.max(0.7, 0.95 - (i * 0.03))
            };

            // Avancer position Y pour l'élément suivant avec chevauchement
            stackY += stackedHeight * (1 - stackOverlap) + stackSpacing;
        });

        // Étape 3: Animer en trois phases: départ → centre empilé → destination
        let startTime = null;
        const PHASE_1_DURATION = 500; // ms - Vers le centre (légèrement plus rapide)
        const PHASE_2_DURATION = 350; // ms - Pause au centre (légèrement plus courte)
        const PHASE_3_DURATION = 550; // ms - Vers destination
        const TOTAL_DURATION = PHASE_1_DURATION + PHASE_2_DURATION + PHASE_3_DURATION;

        // Sauvegarder les décalages de canvas originaux pour la réinitialisation
        // Ces variables seront utilisées si nous passons du mode libre au mode grille
        const originalOffsetX = window._canvasOffsetX || 0;
        const originalOffsetY = window._canvasOffsetY || 0;
        const needsCanvasRecentering = targetMode && !originalMode; // Passage de libre à grille

        console.log("🔄 Début de l'animation en trois phases", needsCanvasRecentering ? "avec recentrage du canvas" : "");

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Déterminer la phase actuelle
            let phase = 1;
            let phaseProgress = 0;

            if (elapsed < PHASE_1_DURATION) {
                // Phase 1: départ → centre
                phase = 1;
                phaseProgress = elapsed / PHASE_1_DURATION;
            } else if (elapsed < PHASE_1_DURATION + PHASE_2_DURATION) {
                // Phase 2: pause au centre
                phase = 2;
                phaseProgress = (elapsed - PHASE_1_DURATION) / PHASE_2_DURATION;
            } else {
                // Phase 3: centre → destination
                phase = 3;
                phaseProgress = (elapsed - PHASE_1_DURATION - PHASE_2_DURATION) / PHASE_3_DURATION;
                phaseProgress = Math.min(phaseProgress, 1); // Limiter à 1
            }

            // Fonction d'easing
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const easedProgress = easeInOutCubic(phaseProgress);

            // Recentrer progressivement le canvas si on passe de libre à grille (phase 1)
            if (phase === 1 && needsCanvasRecentering && window._updateCanvasOffset) {
                // Calculer le décalage progressif vers le centre (0, 0)
                const newOffsetX = originalOffsetX * (1 - easedProgress);
                const newOffsetY = originalOffsetY * (1 - easedProgress);

                // Mettre à jour les positions du canvas via la fonction globale
                window._updateCanvasOffset(newOffsetX, newOffsetY);
            }

            // Appliquer les positions intermédiaires selon la phase
            const updatedImages = [...images];

            visibleIndices.forEach(idx => {
                const start = startPositions[idx];
                const middle = intermediatePositions[idx];
                const end = finalPositions[idx];

                let currentPos;

                if (phase === 1) {
                    // Phase 1: départ → centre
                    currentPos = {
                        x: start.x + (middle.x - start.x) * easedProgress,
                        y: start.y + (middle.y - start.y) * easedProgress,
                        width: start.width + (middle.width - start.width) * easedProgress,
                        height: start.height + (middle.height - start.height) * easedProgress,
                        opacity: start.opacity + (middle.opacity - start.opacity) * easedProgress
                    };
                } else if (phase === 2) {
                    // Phase 2: léger flottement au centre
                    // L'amplitude du flottement dépend de la taille de l'élément
                    const floatAmplitude = Math.min(5, middle.height * 0.02); // Max 5px ou 2% de la hauteur
                    const floatOffset = Math.sin(phaseProgress * Math.PI * 2) * floatAmplitude;

                    // Léger effet de pulsation (zoom)
                    const pulseScale = 1 + Math.sin(phaseProgress * Math.PI * 2) * 0.015; // ±1.5% de pulsation

                    currentPos = {
                        x: middle.x - (middle.width * pulseScale - middle.width) / 2, // Garder centré pendant la pulsation
                        y: middle.y + floatOffset,
                        width: middle.width * pulseScale,
                        height: middle.height * pulseScale,
                        opacity: middle.opacity
                    };
                } else {
                    // Phase 3: centre → destination
                    currentPos = {
                        x: middle.x + (end.x - middle.x) * easedProgress,
                        y: middle.y + (end.y - middle.y) * easedProgress,
                        width: middle.width + (end.width - middle.width) * easedProgress,
                        height: middle.height + (end.height - middle.height) * easedProgress,
                        opacity: middle.opacity + (end.opacity - middle.opacity) * easedProgress
                    };
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

            // Mettre à jour l'affichage avec les nouvelles positions
            setImages(updatedImages);
            imagesRef.current = updatedImages;

            // Continuer l'animation jusqu'à la fin
            if (elapsed < TOTAL_DURATION) {
                requestAnimationFrame(animate);
            } else {
                // Animation terminée - appliquer les positions exactes finales
                const finalUpdatedImages = [...images];

                visibleIndices.forEach(idx => {
                    finalUpdatedImages[idx] = {
                        ...finalUpdatedImages[idx],
                        patternX: finalPositions[idx].x,
                        patternY: finalPositions[idx].y,
                        width: finalPositions[idx].width,
                        height: finalPositions[idx].height,
                        opacity: targetMode ? 0.9 : 1 // Légèrement transparent pour le fade in des duplications
                    };
                });

                setImages(finalUpdatedImages);
                imagesRef.current = finalUpdatedImages;

                // ⚠️ IMPORTANT: Indiquer que l'animation est terminée
                animationInProgress = false;

                // Étape 4: SEULEMENT MAINTENANT changer le mode
                console.log(`✅ Animation terminée, changement de mode vers ${targetMode ? "grille" : "libre"}`);
                isGridModeRef.current = targetMode;

                // Pour le mode grille, afficher les duplications après un petit délai
                if (targetMode) {
                    setTimeout(() => {
                        console.log("🔄 Calcul final et affichage des duplications");

                        // Forcer un recalcul pour les duplications
                        calculateGridLayout();

                        // Terminer la transition après un petit délai
                        setTimeout(() => {
                            setIsTransitioning(false);
                            console.log("✅ Transition terminée, mode grille actif");
                        }, 300);
                    }, 100);
                } else {
                    // Mode libre, terminer immédiatement
                    setIsTransitioning(false);
                    console.log("✅ Transition terminée, mode libre actif");
                }
            }
        };

        // Démarrer l'animation
        requestAnimationFrame(animate);

    }, [imagesRef, calculateGridLayout, initialPositionsRef, setImages, setIsTransitioning, isGridModeRef]);

    // Update images layout based on mode (grid or free)
    const updateImagesLayout = useCallback((useGridLayout) => {
        // If we're already in the requested mode, no need to transition
        if (isGridModeRef.current === useGridLayout) {
            return;
        }

        console.log(`🔄 Transition: ${useGridLayout ? "vers grille" : "vers libre"}`);

        // Passage du mode libre au mode grille
        if (useGridLayout) {
            // Stocker les positions actuelles du canvas pour l'animation
            if (typeof window !== 'undefined') {
                // Sauvegarder l'état actuel du canvas pour l'animation
                window._canvasOffsetX = window.offsetXRef?.current || 0;
                window._canvasOffsetY = window.offsetYRef?.current || 0;

                // Définir la fonction pour mettre à jour les offsets durant l'animation
                window._updateCanvasOffset = (x, y) => {
                    if (window.offsetXRef && window.offsetYRef) {
                        window.offsetXRef.current = x;
                        window.offsetYRef.current = y;
                        window.targetOffsetXRef.current = x;
                        window.targetOffsetYRef.current = y;
                    }
                };

                // Émettre un événement pour réinitialiser le scrolling du grid avant la transition
                const resetEvent = new CustomEvent('resetGridPosition', {detail: {immediate: true}});
                window.dispatchEvent(resetEvent);
            }

            // Court délai pour laisser le temps à la position de se réinitialiser
            setTimeout(() => {
                // Ensure initial positions are stored
                if (imagesRef.current.length > 0) {
                    storeInitialPositions(imagesRef.current);
                }

                // Utiliser la transition sans téléportation
                performNoTeleportTransition(useGridLayout, true);
            }, 50);
        } else {
            // En mode libre, pas besoin de réinitialiser
            // Ensure initial positions are stored
            if (imagesRef.current.length > 0) {
                storeInitialPositions(imagesRef.current);
            }

            // Utiliser la transition sans téléportation
            performNoTeleportTransition(useGridLayout, false);
        }
    }, [storeInitialPositions, performNoTeleportTransition, isGridModeRef, imagesRef]);

    return {storeInitialPositions, updateImagesLayout};
};