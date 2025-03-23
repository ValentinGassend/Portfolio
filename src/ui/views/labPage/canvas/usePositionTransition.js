import { useCallback } from 'react';

export const usePositionTransition = (
    imagesRef,
    originalPositionsRef,
    initialPositionsRef,
    targetPositionsRef,
    isGridModeRef,
    calculateGridLayout,
    animationProgressRef,
    setIsTransitioning,
    setImages
) => {
    // Store initial positions before any transformations
    const storeInitialPositions = useCallback((imgs) => {
        if (!originalPositionsRef.current || originalPositionsRef.current.length === 0) {
            originalPositionsRef.current = imgs.map(img => ({
                x: img.patternX,
                y: img.patternY,
                width: img.width,
                height: img.height,
                visible: img.visible || false
            }));

            initialPositionsRef.current = JSON.parse(JSON.stringify(originalPositionsRef.current));
        }
    }, [originalPositionsRef, initialPositionsRef]);

    // Fonction de transition sans téléportation
    const performNoTeleportTransition = useCallback((useGridLayout) => {
        console.log(`🔄 Démarrage de la transition fluide: ${useGridLayout ? "libre → grille" : "grille → libre"}`);

        // ⚠️ CRITIQUE: Utiliser des flags pour ne pas changer le mode pendant l'animation
        // (le mode ne changera qu'après l'animation complète)
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

        // Étape 1: Calculer les positions finales SANS changer le mode
        let finalPositions = {};

        if (targetMode) { // Si on va vers la grille
            // Sauvegarder l'état d'origine
            const tempGridMode = isGridModeRef.current;

            // Temporairement passer en mode grille pour le calcul seulement
            isGridModeRef.current = true;

            // Calculer les positions de grille
            const gridPositions = calculateGridLayout();

            // Immédiatement revenir au mode d'origine
            isGridModeRef.current = tempGridMode;

            if (gridPositions && gridPositions.length > 0) {
                // Filtrer uniquement les positions non dupliquées
                const originalPositions = gridPositions.filter(pos => pos.repeatIndex === 0);

                visibleIndices.forEach(idx => {
                    const img = images[idx];
                    const gridPos = originalPositions.find(pos => pos.originalIndex === idx);

                    if (gridPos) {
                        finalPositions[idx] = {
                            x: gridPos.x,
                            y: gridPos.y,
                            width: gridPos.width,
                            height: gridPos.height,
                            opacity: 1
                        };
                    } else {
                        // Position par défaut centrée
                        finalPositions[idx] = {
                            x: window.innerWidth / 2 - img.width / 2,
                            y: window.innerHeight / 2 - img.height / 2,
                            width: img.width,
                            height: img.height,
                            opacity: 1
                        };
                    }
                });
            } else {
                // Fallback - layout grille basique
                const cols = 2;
                const spacing = 30;
                const baseHeight = 200;

                visibleIndices.forEach((idx, i) => {
                    const img = images[idx];
                    const col = i % cols;
                    const row = Math.floor(i / cols);

                    const aspectRatio = img.width / img.height;
                    const targetHeight = baseHeight;
                    const targetWidth = targetHeight * aspectRatio;

                    finalPositions[idx] = {
                        x: col * (targetWidth + spacing) + (window.innerWidth - cols * (targetWidth + spacing) + spacing) / 2,
                        y: row * (targetHeight + spacing) + 100,
                        width: targetWidth,
                        height: targetHeight,
                        opacity: 1
                    };
                });
            }
        } else { // Si on revient au mode libre
            visibleIndices.forEach(idx => {
                const initialPos = initialPositionsRef.current[idx];

                if (initialPos) {
                    finalPositions[idx] = {
                        ...initialPos,
                        opacity: 1
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

        // Étape 2: Mémoriser les positions de départ
        const startPositions = {};
        visibleIndices.forEach(idx => {
            startPositions[idx] = {
                x: images[idx].patternX,
                y: images[idx].patternY,
                width: images[idx].width,
                height: images[idx].height,
                opacity: images[idx].opacity || 1
            };
        });

        // Étape 3: Animer progressivement sans changer le mode
        let startTime = null;
        const ANIMATION_DURATION = 1500; // 1.5 secondes

        console.log("🔄 Début de l'animation sans changement de mode");

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

            // Easing en accélération/décélération
            // Plus lent au début et à la fin, plus rapide au milieu
            const easedProgress = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            // Appliquer les positions intermédiaires sans changer le mode
            const updatedImages = [...images];

            visibleIndices.forEach(idx => {
                const start = startPositions[idx];
                const end = finalPositions[idx];

                updatedImages[idx] = {
                    ...updatedImages[idx],
                    patternX: start.x + (end.x - start.x) * easedProgress,
                    patternY: start.y + (end.y - start.y) * easedProgress,
                    width: start.width + (end.width - start.width) * easedProgress,
                    height: start.height + (end.height - start.height) * easedProgress,
                    // Maintenir une bonne visibilité pendant la transition
                    opacity: Math.max(0.7, start.opacity + (end.opacity - start.opacity) * easedProgress)
                };
            });

            // Mettre à jour l'affichage avec les nouvelles positions
            setImages(updatedImages);
            imagesRef.current = updatedImages;

            // Continuer l'animation jusqu'à la fin
            if (progress < 1) {
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

        // Ensure initial positions are stored
        if (imagesRef.current.length > 0) {
            storeInitialPositions(imagesRef.current);
        }

        // Utiliser la transition sans téléportation
        performNoTeleportTransition(useGridLayout);

    }, [storeInitialPositions, performNoTeleportTransition, isGridModeRef, imagesRef]);

    return { storeInitialPositions, updateImagesLayout };
};