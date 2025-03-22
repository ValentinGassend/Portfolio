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
    // Nouvel état pour le projet survolé
    const [hoveredProject, setHoveredProject] = useState(null);

    // Store current images in a ref to avoid dependency issues in the animation loop
    const imagesRef = useRef([]);
    const wheelEventOccurredRef = useRef(false);
    const wheelListenersRef = useRef({added: false});
    const wheelSetupCompleteRef = useRef(false);

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
    const infiniteScrollRef = useRef({
        totalRows: 1000,       // Nombre initial de répétitions de la grille
        itemsPerRow: 2,     // Correspond à columnCount dans calculateGridLayout
        rowHeight: 500,     // Hauteur approximative d'une rangée (sera calculée plus précisément)
        virtualOffset: 0,   // Décalage virtuel pour le scroll infini
        lastScrollPos: 0    // Pour détecter la direction du défilement
    });
    // Add ref for tracking scroll position in grid mode
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

    // Référence aux positions originales (important pour pouvoir revenir à l'état initial)
    const originalPositionsRef = useRef([]);
    // Référence aux positions cibles pour l'animation
    const targetPositionsRef = useRef([]);
    // État pour suivre si une animation de transition est en cours
    const [isTransitioning, setIsTransitioning] = useState(false);
    // Référence pour suivre le temps d'animation
    const animationProgressRef = useRef(0);
    // Référence pour stocker si on est actuellement en mode grille
    const isGridModeRef = useRef(false);
    // Add this reference to preserve the very first initial positions
    const initialPositionsRef = useRef([]);

    // Add this new function to store initial positions before any transformations
    const storeInitialPositions = useCallback((imgs) => {
        console.log('Stockage des positions initiales', imgs);
        if (!originalPositionsRef.current || originalPositionsRef.current.length === 0) {
            originalPositionsRef.current = imgs.map(img => ({
                x: img.patternX, y: img.patternY, width: img.width, height: img.height
            }));

            initialPositionsRef.current = JSON.parse(JSON.stringify(originalPositionsRef.current));

            console.log('Positions initiales stockées:', initialPositionsRef.current);
        }
    }, []);

    // Modification pour centrer verticalement les premiers projets
    const calculateGridLayout = useCallback(() => {
        if (images.length === 0) return [];

        const canvas = canvasRef.current;
        if (!canvas) return [];

        // Make sure initial positions are stored
        if (originalPositionsRef.current.length === 0) {
            originalPositionsRef.current = images.map(img => ({
                x: img.patternX, y: img.patternY, width: img.width, height: img.height
            }));
        }

        // Get canvas dimensions
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Grid parameters
        const horizontalSpacing = 100;     // Espacement horizontal entre projets
        const verticalSpacing = horizontalSpacing;       // Espacement vertical entre lignes de projets
        const groupSpacing = verticalSpacing;         // Espacement entre les groupes répétés
        const targetHeight = 250;         // Target height for projects
        const columnCount = 2;            // Columns per row
        const baseImagesCount = images.length;

        // Store these values for infinite scroll
        infiniteScrollRef.current.itemsPerRow = columnCount;

        // Calculate positions for base images (single repetition)
        const baseGridPositions = [];

        // Calculer d'abord la hauteur totale pour pouvoir centrer verticalement
        let totalHeight = 0;
        const rows = Math.ceil(baseImagesCount / columnCount);

        // Estimation de la hauteur basée sur targetHeight et espacements
        const estimatedRowHeight = targetHeight + verticalSpacing;
        totalHeight = rows * estimatedRowHeight - verticalSpacing; // Soustraire le dernier espacement

        // Calculer le décalage Y pour centrer verticalement
        const initialY = Math.max(0, (canvasHeight - totalHeight) / 2) - estimatedRowHeight / 2;
        let currentY = initialY; // Commencer avec un décalage qui centre verticalement

        // Go through images in pairs to create rows
        for (let i = 0; i < baseImagesCount; i += columnCount) {
            // Calculate dimensions while preserving aspect ratio
            const calculateSize = (img) => {
                const aspectRatio = img.width / img.height;
                let newHeight = targetHeight;
                let newWidth = newHeight * aspectRatio;
                return {width: newWidth, height: newHeight};
            };

            // Collect sizes for this row
            const sizes = [];
            const availableImages = [];
            for (let j = 0; j < columnCount && i + j < baseImagesCount; j++) {
                availableImages.push(images[i + j]);
                sizes.push(calculateSize(images[i + j]));
            }

            // Total width of the row with UNIFORM horizontal spacing
            const totalWidth = sizes.reduce((sum, size) => sum + size.width, 0) + ((sizes.length - 1) * horizontalSpacing);
            const startX = (canvasWidth - totalWidth) / 2;

            // Position of each image in the row
            let currentX = startX;
            availableImages.forEach((img, index) => {
                const size = sizes[index];
                baseGridPositions.push({
                    x: currentX, y: currentY, width: size.width, height: size.height, originalIndex: i + index
                });

                // Utiliser horizontalSpacing constant entre les éléments
                currentX += size.width + horizontalSpacing;
            });

            // Move to next row with UNIFORM vertical spacing
            const rowHeight = Math.max(...sizes.map(s => s.height));
            currentY += rowHeight + verticalSpacing;
        }

        // Recalculer la hauteur réelle du pattern
        const patternHeight = currentY - initialY + (groupSpacing - verticalSpacing);
        infiniteScrollRef.current.rowHeight = patternHeight / Math.ceil(baseImagesCount / columnCount);
        infiniteScrollRef.current.patternHeight = patternHeight;

        // Now, create the complete layout with duplication for infinite scroll
        const gridPositions = [];

        // Calculate virtual offset (allows infinite scroll)
        const scrollOffset = offsetYRef.current;
        const virtualOffset = infiniteScrollRef.current.virtualOffset || 0;
        const adjustedScrollOffset = scrollOffset + virtualOffset;

        // Initialiser topRepeats et totalRows s'ils n'existent pas encore
        if (infiniteScrollRef.current.topRepeats === undefined) {
            infiniteScrollRef.current.topRepeats = 0;
        }
        if (infiniteScrollRef.current.totalRows === undefined) {
            infiniteScrollRef.current.totalRows = 5;
        }

        // Number of repetitions needed to fill the view
        const visibleRows = Math.ceil(canvasHeight / infiniteScrollRef.current.rowHeight) + 5; // +5 pour éviter les sauts visuels

        // Nombre de répétitions nécessaires dans chaque direction
        const requiredRepeatsDown = Math.max(infiniteScrollRef.current.totalRows, Math.ceil(visibleRows * 2));
        const requiredRepeatsUp = Math.max(infiniteScrollRef.current.topRepeats, Math.ceil(visibleRows * 2));

        // Calculer les répétitions visibles en fonction de l'offset actuel
        const currentViewport = {
            top: -offsetYRef.current - canvasHeight,
            bottom: -offsetYRef.current + canvasHeight * 2
        };

        // Créer des répétitions au-dessus (répétitions négatives)
        for (let repeat = -requiredRepeatsUp; repeat < 0; repeat++) {
            baseGridPositions.forEach((basePos, idx) => {
                // Position Y avec un espacement UNIFORME entre les répétitions
                const repeatY = basePos.y + (repeat * patternHeight);

                // Only include positions that are within the visible area plus some padding
                if (repeatY + basePos.height + offsetYRef.current > -canvasHeight * 2 &&
                    repeatY + offsetYRef.current < canvasHeight * 3) {

                    gridPositions.push({
                        ...basePos,
                        y: repeatY,
                        originalIndex: basePos.originalIndex,
                        repeatIndex: repeat,
                        isVisible: true
                    });
                }
            });
        }

        // Créer des répétitions au-dessous (répétitions positives)
        for (let repeat = 0; repeat < requiredRepeatsDown; repeat++) {
            baseGridPositions.forEach((basePos, idx) => {
                // Position Y avec un espacement UNIFORME entre les répétitions
                const repeatY = basePos.y + (repeat * patternHeight);

                // Only include positions that are within the visible area plus some padding
                if (repeatY + basePos.height + offsetYRef.current > -canvasHeight * 2 &&
                    repeatY + offsetYRef.current < canvasHeight * 3) {

                    gridPositions.push({
                        ...basePos,
                        y: repeatY,
                        originalIndex: basePos.originalIndex,
                        repeatIndex: repeat,
                        isVisible: true
                    });
                }
            });
        }

        // Ajouter l'information de débogage pour faciliter le suivi
        debugInfoRef.current = {
            ...debugInfoRef.current,
            scrollOffset,
            virtualOffset,
            topRepeats: infiniteScrollRef.current.topRepeats,
            totalRows: infiniteScrollRef.current.totalRows,
            visibleProjects: gridPositions.length
        };

        return gridPositions;
    }, [images, canvasRef, offsetYRef]);


    // Add the wheel handler function
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

            // Initialiser les compteurs de répétitions s'ils n'existent pas encore
            if (infiniteScrollRef.current.topRepeats === undefined) {
                infiniteScrollRef.current.topRepeats = 0;
            }
            if (infiniteScrollRef.current.totalRows === undefined) {
                infiniteScrollRef.current.totalRows = 5;
            }

            // Détection de la direction du défilement
            const isScrollingUp = delta < 0;
            const isScrollingDown = delta > 0;

            // Si on défile vers le haut et qu'on approche de la limite supérieure
            if (isScrollingUp && gridScrollOffsetRef.current > patternHeight * 0.5) {
                console.log("Ajout de répétitions vers le haut");
                // Ajouter des répétitions au-dessus et décaler l'offset
                infiniteScrollRef.current.topRepeats += 5;
                infiniteScrollRef.current.virtualOffset -= patternHeight * 5;
                gridScrollOffsetRef.current -= patternHeight * 5;
                targetOffsetYRef.current = gridScrollOffsetRef.current;
            }

            // Si on défile vers le bas et qu'on approche de la limite inférieure
            const totalRepeats = infiniteScrollRef.current.totalRows;
            if (isScrollingDown && gridScrollOffsetRef.current < -(patternHeight * totalRepeats * 0.7)) {
                console.log("Ajout de répétitions vers le bas");
                // Ajouter plus de lignes quand on s'approche du bas
                infiniteScrollRef.current.totalRows += 5;
            }
        }
    }, [isGridModeRef, calculateGridLayout]);


    // Modified version of updateImagesLayout
    const updateImagesLayout = useCallback((useGridLayout) => {
        console.log('Transition entre layouts:', useGridLayout ? 'Grid' : 'Libre');
        console.log('Positions initiales:', initialPositionsRef.current);

        if (isGridModeRef.current === useGridLayout) {
            console.log('Déjà dans ce mode, pas de transition');
            return;
        }
        if (isGridModeRef.current === useGridLayout) {
            return;
        }

        // S'assurer que les positions initiales sont stockées
        storeInitialPositions(imagesRef.current);

        // Mettre à jour la référence du mode
        isGridModeRef.current = useGridLayout;

        // Réinitialiser la progression de l'animation
        animationProgressRef.current = 0;

        // Stocker les positions actuelles comme point de départ de l'animation
        originalPositionsRef.current = imagesRef.current.map(img => ({
            x: img.patternX, y: img.patternY, width: img.width, height: img.height
        }));

        if (useGridLayout) {
            // Forcer le calcul du layout de grille
            const gridPositions = calculateGridLayout();

            // Vérifier que les positions de grille sont valides
            if (gridPositions && gridPositions.length > 0) {
                targetPositionsRef.current = gridPositions.map((pos, index) => ({
                    x: pos.x, y: pos.y, width: pos.width, height: pos.height, originalIndex: pos.originalIndex, // Ajouter l'image originale correspondante
                    image: imagesRef.current[pos.originalIndex % imagesRef.current.length]
                }));
            } else {
                // Fallback: créer manuellement un layout de grille simple
                targetPositionsRef.current = imagesRef.current.map((img, index) => {
                    const cols = 2; // Nombre de colonnes
                    const margin = 20; // Marge entre les éléments
                    const targetHeight = 250; // Hauteur cible

                    // Calculer l'aspect ratio
                    const aspectRatio = img.width / img.height;
                    let height = targetHeight;
                    let width = height * aspectRatio;

                    // Calculer la position
                    const col = index % cols;
                    const row = Math.floor(index / cols);

                    return {
                        x: col * (width + margin) + (window.innerWidth - (width * cols + margin * (cols - 1))) / 2,
                        y: row * (height + margin) + 50, // 50px from top
                        width: width,
                        height: height,
                        originalIndex: index,
                        image: img
                    };
                });
            }
        } else {
            // Retour au layout libre - utiliser les positions initiales sauvegardées
            targetPositionsRef.current = initialPositionsRef.current.map((pos, index) => ({
                ...pos, image: imagesRef.current[index]
            }));
        }

        // Start transition animation
        setIsTransitioning(true);
    }, [calculateGridLayout, storeInitialPositions]);

    // This useEffect ensures we store initial positions when images first load
    useEffect(() => {
        if (images.length > 0 && !originalPositionsRef.current.length) {
            storeInitialPositions(images);
        }
    }, [images, storeInitialPositions]);

    // Effet d'animation de transition entre les layouts
    useEffect(() => {
        if (!isTransitioning) return;

        let startTime = null;
        const TRANSITION_DURATION = 800; // ms

        const animateTransition = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / TRANSITION_DURATION, 1);

            console.log('Animation de transition:', progress);

            animationProgressRef.current = progress;

            // Si la transition est terminée
            if (progress >= 1) {
                console.log('Transition terminée');
                setIsTransitioning(false);
                return;
            }

            // Continuer l'animation
            requestAnimationFrame(animateTransition);
        };

        const animationId = requestAnimationFrame(animateTransition);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [isTransitioning]);

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

        // Cas spécial pour le mode grille
        if (isGridModeRef.current) {
            // Cette partie utilise isGridModeRef qui est disponible dans le hook
            // Obtenir les positions de grid actuelles
            const gridPositions = calculateGridLayout();
            if (!gridPositions || gridPositions.length === 0) return null;

            // Trier les positions par taille (grandes d'abord)
            const sortedPositions = [...gridPositions].sort((a, b) => {
                const imgA = imagesRef.current[a.originalIndex % imagesRef.current.length];
                const imgB = imagesRef.current[b.originalIndex % imagesRef.current.length];
                return imgB.size - imgA.size;
            });

            // Parcourir chaque position de la grille
            for (const pos of sortedPositions) {
                const image = imagesRef.current[pos.originalIndex % imagesRef.current.length];
                if (!image) continue;

                // Ajuster la position Y avec l'offset de défilement actuel
                const imgY = pos.y + offsetYRef.current;

                // Vérifier si le point est dans l'image
                if (canvasX >= pos.x && canvasX <= pos.x + pos.width &&
                    canvasY >= imgY && canvasY <= imgY + pos.height) {

                    // Projet trouvé
                    if (canvasRef.current) {
                        canvasRef.current.style.cursor = 'pointer';
                    }

                    const projectInfo = {
                        ...image,
                        index: pos.originalIndex,
                        name: image.name || `Project ${pos.originalIndex + 1}`
                    };

                    setHoveredProject(projectInfo);
                    return projectInfo;
                }
            }

            // Aucun projet trouvé en mode grille
            if (canvasRef.current) {
                canvasRef.current.style.cursor = 'default';
            }

            setHoveredProject(null);
            return null;
        }

        // Mode libre - logique existante
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
                    const parallaxFactor = image.parallaxFactor;
                    const imgOffsetX = offsetX * parallaxFactor;
                    const imgOffsetY = offsetY * parallaxFactor;

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

        // Vérifier les projets sous le pointeur
        for (const imgData of visibleImagesData) {
            if (isPointInImage(canvasX, canvasY, imgData.x, imgData.y, imgData.width, imgData.height)) {
                // Une fois qu'un projet est trouvé, appliquer directement le style du curseur
                if (canvasRef.current) {
                    canvasRef.current.style.cursor = 'pointer';
                }

                const projectInfo = {
                    ...imgData.image,
                    index: imgData.index,
                    name: imgData.image.name || `Project ${imgData.index + 1}`
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
    }, [canvasRef, isPointInImage, isDragging, offsetYRef, isGridModeRef, calculateGridLayout, imagesRef]);


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

            // Instead of passing a fixed count (40), let the function use the actual number of images
            const newImages = createNonOverlappingImages(projectImagesRef || projectImageRef, // Use image array if available, fallback to single image
                patternWidth, patternHeight
                // No more imageCount parameter - we'll use exactly as many images as were loaded
            );

            // Set the total and loaded count to match the actual created images
            setTotalImages(newImages.length);
            setImagesLoaded(newImages.length);
            setImages(newImages);


        }
    }, [projectImageLoaded, backgroundLoaded, images.length, projectImageRef, projectImagesRef, setImagesLoaded, setTotalImages]);
    // The animation function that uses refs instead of state to avoid re-renders
    const animate = useCallback(() => {
        if (!canvasRef.current || !offscreenCanvasRef.current) return;
        if (wheelEventOccurredRef.current && isGridModeRef.current) {
            // Réinitialiser le flag
            wheelEventOccurredRef.current = false;

            // Augmenter la réactivité dans ce cas
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
            // Transition encore plus rapide pour le mode grille
            const diff = gridScrollOffsetRef.current - offsetYRef.current;
            // Utiliser une transition exponentielle - plus rapide pour les grands mouvements
            const factor = Math.min(1, Math.abs(diff) * 0.01);
            offsetYRef.current += diff * Math.max(0.2, factor * 0.8);

            // Forcer les coordonnées horizontales à zéro
            offsetXRef.current = 0;
            targetOffsetXRef.current = 0;
            dragVelocityXRef.current = 0;

            // Générer une vélocité artificielle pour les effets visuels
            const deltaY = offsetYRef.current - prevOffsetYRef.current;
            dragVelocityYRef.current = deltaY * 2;

            // Effet visuel subtil basé sur le mouvement
            effectStrengthRef.current = Math.abs(deltaY) > 0.5 ? Math.min(Math.abs(deltaY) * 0.05, 0.1) : Math.max(effectStrengthRef.current - 0.01, 0);

            // Désactiver l'effet fisheye
            fisheyeStrengthRef.current = 0;
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

        // If a transition is in progress, update image positions
        let imagesToDraw = [...imagesRef.current];
        if (isTransitioning && targetPositionsRef.current.length > 0) {
            const progress = animationProgressRef.current;
            // Utiliser une fonction d'interpolation de type "ease-in-out"
            const easedProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            // Créer une copie modifiée des images avec des positions de transition
            imagesToDraw = imagesRef.current.map((img, index) => {
                const origPos = {
                    x: img.patternX, y: img.patternY, width: img.width, height: img.height
                };
                const targetPos = targetPositionsRef.current[index];

                if (!targetPos) return img;

                // Interpoler entre la position actuelle et la position cible
                const newX = origPos.x + (targetPos.x - origPos.x) * easedProgress;
                const newY = origPos.y + (targetPos.y - origPos.y) * easedProgress;
                const newWidth = origPos.width + (targetPos.width - origPos.width) * easedProgress;
                const newHeight = origPos.height + (targetPos.height - origPos.height) * easedProgress;

                return {
                    ...img, patternX: newX, patternY: newY, width: newWidth, height: newHeight
                };
            });

            // Si la transition est complète, mettre à jour l'état des images
            if (progress >= 1) {
                setTimeout(() => {
                    setImages(imagesToDraw);
                    setIsTransitioning(false);
                }, 0);
            }
        }

        // Draw everything using the current images
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
            calculateGridLayout // Ajouter cette ligne
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
    }, [isDragging, canvasRef, offscreenCanvasRef, animationFrameRef, prevOffsetXRef, prevOffsetYRef, isTransitioning]);

    // Event handlers for mouse/touch interaction
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
    }, [canvasRef, isGridModeRef]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        // Only allow dragging in non-grid mode
        if (!isGridModeRef.current) {
            // In free mode, allow both horizontal and vertical movement
            const newTargetX = e.clientX - dragStartXRef.current;
            const newTargetY = e.clientY - dragStartYRef.current;

            targetOffsetXRef.current = newTargetX;
            targetOffsetYRef.current = newTargetY;
        }
        // In grid mode, don't respond to drag
    }, [isDragging, isGridModeRef]);

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
    }, [canvasRef, isGridModeRef]);


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

    useEffect(() => {
        // Only run this once when the canvas is available
        if (wheelSetupCompleteRef.current || !canvasRef.current) return;

        // Mark as completed immediately to avoid multiple executions
        wheelSetupCompleteRef.current = true;

        // Wheel event handler function with debounce for performance
        let wheelTimeout = null;
        const wheelHandler = (e) => {
            // Only process the event if we're in grid mode
            if (!isGridModeRef.current) return;

            // Prevent default browser behavior
            e.preventDefault();

            // Apply factor to adjust scroll speed
            const scrollFactor = 2.5;
            const delta = e.deltaY / scrollFactor;

            // Update positions directly
            gridScrollOffsetRef.current -= delta;
            targetOffsetYRef.current = gridScrollOffsetRef.current;

            // Set a flag to indicate we should update in the animation loop
            wheelEventOccurredRef.current = true;

            // Appeler handleWheel pour la logique avancée de scroll infini
            handleWheel(e);
        };

        // Add event listeners - important to set passive: false to prevent default scrolling
        window.addEventListener('wheel', wheelHandler, {passive: false});
        canvasRef.current.addEventListener('wheel', wheelHandler, {passive: false});

        // Cleanup function
        return () => {
            if (!wheelSetupCompleteRef.current) return;

            window.removeEventListener('wheel', wheelHandler);

            if (canvasRef.current) {
                canvasRef.current.removeEventListener('wheel', wheelHandler);
            }

            // Reset to allow reconfiguration if needed
            wheelSetupCompleteRef.current = false;
        };
    }, [handleWheel]);


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
        isTransitioning
    };
};