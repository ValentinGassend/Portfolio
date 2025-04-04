import { useCallback } from 'react';

export const useGridLayout = (
    canvasRef,
    imagesRef,
    infiniteScrollRef,
    offsetYRef,
    debugInfoRef,
    images
) => {
    // Fonction pour grouper les projets connexes
    const groupProjects = (images) => {
        const groups = {
            'Project 1': ['Project 1', 'How'],
            'Year': ['Year', 'What', 'Why'],
            'Preview': ['Preview'],
            'Other': []
        };

        const groupedImages = [];
        const processedIndices = new Set();

        // Parcourir les groupes
        Object.values(groups).forEach(groupMembers => {
            const groupImages = images.filter((img, index) =>
                groupMembers.some(member =>
                    img.name.includes(member) && !processedIndices.has(index)
                )
            );

            // Trier les images du groupe par taille (plus grands en premier)
            groupImages.sort((a, b) => (b.width * b.height) - (a.width * a.height));

            groupImages.forEach(img => {
                const imgIndex = images.indexOf(img);
                groupedImages.push(img);
                processedIndices.add(imgIndex);
            });
        });

        // Ajouter les images restantes non traitées
        images.forEach((img, index) => {
            if (!processedIndices.has(index)) {
                groupedImages.push(img);
            }
        });

        return groupedImages;
    };

    // Function to calculate grid layout positions
    const calculateGridLayout = useCallback(() => {
        if (images.length === 0) return [];
        const canvas = canvasRef.current;
        if (!canvas) return [];

        // SOLUTION CLÉ POUR GARANTIR LA CONTINUITÉ:
        // Si nous venons de finir une transition et que le flag est activé,
        // utiliser exactement les positions actuelles des images
        const isUsingDirectImagePositions = window.useFinalGridPositions === true && window.isGridModeRef?.current;

        if (isUsingDirectImagePositions && imagesRef.current && imagesRef.current.length > 0) {
            console.log("🔄 Utilisation des positions EXACTES des images pour le layout grille");

            // Obtenir les positions actuelles directement depuis les images
            const basePositions = imagesRef.current.map((img, idx) => ({
                x: img.patternX,
                y: img.patternY,
                width: img.width,
                height: img.height,
                originalIndex: idx,
                name: img.name
            }));

            // Ajouter des informations de debug
            debugInfoRef.current = {
                ...debugInfoRef.current,
                usingDirectPositions: true,
                positionsCount: basePositions.length
            };

            // Utiliser directement ces positions comme positions de base
            return basePositions.map(pos => ({
                ...pos,
                repeatIndex: 0,
                isVisible: true
            }));
        }

        // Grouper les projets
        const groupedImages = groupProjects(images);

        // Get canvas dimensions
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Grid parameters - AJUSTÉ POUR ÉVITER LES CHEVAUCHEMENTS
        const horizontalSpacing = 50;     // Espacement horizontal augmenté
        const verticalSpacing = 50;       // Espacement vertical augmenté
        const groupSpacing = 50;          // Espacement entre groupes augmenté
        const targetHeight = 200;          // Hauteur cible légèrement réduite
        const columnCount = 2;             // Toujours 2 colonnes par ligne

        // Nombre d'images à positionner
        const baseImagesCount = groupedImages.length;

        // Store these values for infinite scroll
        infiniteScrollRef.current.itemsPerRow = columnCount;

        // Calcul des lignes et colonnes
        const fullRows = Math.floor(baseImagesCount / columnCount);
        const remainingProjects = baseImagesCount % columnCount;
        const totalRows = remainingProjects > 0 ? fullRows + 1 : fullRows;

        // Positions de base pour tous les projets
        let baseGridPositions = [];

        // Hauteur estimée pour centrage vertical
        const estimatedRowHeight = targetHeight + verticalSpacing;
        const totalHeight = totalRows * estimatedRowHeight;
        const startY = Math.max(0, (canvasHeight - totalHeight) / 2);

        // Position chaque projet ligne par ligne
        for (let row = 0; row < totalRows; row++) {
            // Déterminer le nombre de colonnes pour cette ligne
            const isLastRow = row === fullRows;
            const colsInThisRow = isLastRow && remainingProjects > 0 ? remainingProjects : columnCount;

            // Position Y pour cette ligne
            const rowY = startY + row * estimatedRowHeight;

            // Collecter tailles pour cette ligne
            const rowSizes = [];
            for (let col = 0; col < colsInThisRow; col++) {
                const imgIndex = row * columnCount + col;
                const img = groupedImages[imgIndex];

                // Calculer la taille en préservant le ratio d'aspect
                const aspectRatio = img.width / img.height;
                const newHeight = targetHeight;
                const newWidth = aspectRatio * newHeight;

                rowSizes.push({
                    width: newWidth,
                    height: newHeight,
                    index: imgIndex,
                    name: img.name
                });
            }

            // Calculer largeur totale de la ligne
            const totalRowWidth = rowSizes.reduce((sum, size) => sum + size.width, 0) +
                (colsInThisRow - 1) * horizontalSpacing;

            // Position X de départ (centrée)
            let currentX = (canvasWidth - totalRowWidth) / 2;

            // Positionner chaque image dans cette ligne
            for (let i = 0; i < rowSizes.length; i++) {
                const size = rowSizes[i];
                const img = groupedImages[size.index];

                // Ajouter la position
                baseGridPositions.push({
                    x: currentX,
                    y: rowY,
                    width: size.width,
                    height: size.height,
                    originalIndex: size.index,
                    name: size.name
                });

                // Avancer X pour le prochain élément
                currentX += size.width + horizontalSpacing;
            }
        }

        // Vérification de sécurité: s'assurer que tous les projets sont positionnés
        // et qu'ils ont des positions uniques
        const positionedIndices = baseGridPositions.map(p => p.originalIndex);
        for (let i = 0; i < baseImagesCount; i++) {
            if (!positionedIndices.includes(i)) {
                console.warn(`Projet #${i} non positionné, ajout position par défaut`);
                // Position par défaut au centre si non positionné
                baseGridPositions.push({
                    x: canvasWidth / 2 - 150,
                    y: canvasHeight / 2 + i * 80,
                    width: 300,
                    height: 200,
                    originalIndex: i,
                    name: groupedImages[i].name
                });
            }
        }

        // Vérification des duplicatas
        const indexCounts = {};
        baseGridPositions.forEach(pos => {
            indexCounts[pos.originalIndex] = (indexCounts[pos.originalIndex] || 0) + 1;
        });

        Object.entries(indexCounts).forEach(([idx, count]) => {
            if (count > 1) {
                console.warn(`Projet #${idx} a ${count} positions, correction nécessaire`);
                // Garder seulement la première occurrence et supprimer les autres
                let found = false;
                baseGridPositions = baseGridPositions.filter(pos => {
                    if (pos.originalIndex == idx) {
                        if (!found) {
                            found = true;
                            return true;
                        }
                        return false;
                    }
                    return true;
                });
            }
        });

        // Recalculate the actual pattern height
        const maxY = Math.max(...baseGridPositions.map(pos => pos.y + pos.height));
        const minY = Math.min(...baseGridPositions.map(pos => pos.y));
        const patternHeight = maxY - minY + groupSpacing;

        infiniteScrollRef.current.rowHeight = patternHeight / totalRows;
        infiniteScrollRef.current.patternHeight = patternHeight;

        // Now, create the complete layout with duplication for infinite scroll
        const gridPositions = [];

        // Calculate virtual offset (allows infinite scroll)
        const scrollOffset = offsetYRef.current;
        const virtualOffset = infiniteScrollRef.current.virtualOffset || 0;

        // Initialize topRepeats and totalRows if they don't exist yet
        if (infiniteScrollRef.current.topRepeats === undefined) {
            infiniteScrollRef.current.topRepeats = 0;
        }
        if (infiniteScrollRef.current.totalRows === undefined) {
            infiniteScrollRef.current.totalRows = 5;
        }

        // Number of repetitions needed to fill the view
        const visibleRows = Math.ceil(canvasHeight / infiniteScrollRef.current.rowHeight) + 5;

        // Number of repetitions needed in each direction
        const requiredRepeatsDown = Math.max(infiniteScrollRef.current.totalRows, Math.ceil(visibleRows * 2));
        const requiredRepeatsUp = Math.max(infiniteScrollRef.current.topRepeats, Math.ceil(visibleRows * 2));

        // Create repetitions above (negative repetitions)
        for (let repeat = -requiredRepeatsUp; repeat < 0; repeat++) {
            baseGridPositions.forEach((basePos) => {
                // Y position with UNIFORM spacing between repetitions
                const repeatY = basePos.y + (repeat * patternHeight);

                // MODIFICATION: Utiliser une marge plus large pour assurer que les duplicatas
                // restent chargés pendant le défilement
                if (repeatY + basePos.height + offsetYRef.current > -canvasHeight * 4 &&
                    repeatY + offsetYRef.current < canvasHeight * 5) {

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

        // Create repetitions below (positive repetitions)
        for (let repeat = 0; repeat < requiredRepeatsDown; repeat++) {
            baseGridPositions.forEach((basePos) => {
                // Y position with UNIFORM spacing between repetitions
                const repeatY = basePos.y + (repeat * patternHeight);

                // MODIFICATION: Utiliser une marge plus large pour assurer que les duplicatas
                // restent chargés pendant le défilement
                if (repeatY + basePos.height + offsetYRef.current > -canvasHeight * 4 &&
                    repeatY + offsetYRef.current < canvasHeight * 5) {

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

        // Add debug information for easy tracking
        debugInfoRef.current = {
            ...debugInfoRef.current,
            scrollOffset,
            virtualOffset,
            topRepeats: infiniteScrollRef.current.topRepeats,
            totalRows: infiniteScrollRef.current.totalRows,
            visibleProjects: gridPositions.length,
            remainingProjects,
            fullRows,
            totalRows,
            uniqueIndices: Object.keys(indexCounts).length,
            basePositionsCount: baseGridPositions.length
        };

        return gridPositions;
    }, [images, canvasRef, offsetYRef, infiniteScrollRef, debugInfoRef]);

    return { calculateGridLayout };
};