import React, {useState, useEffect, useRef} from 'react';
import Overlay from "../../components/Overlay.jsx";

// Color palette
const COLOR_PALETTE = {
    accent1: '#9C41F7',   // Purple
    accent2: '#C26140',   // Terracotta
    accent3: '#06BA63',   // Green
    accent4: '#FBD038',   // Yellow
    neutral1: '#F8F5EC',  // Couleur de fond claire (à ajuster selon vos besoins)
    neutral2: '#EFE4D1'   // Soft cream
};


// Ajout d'un trail avec décalage chromatique des images (séparation RGB)

// 1. Fonction pour créer des versions de l'image avec canaux séparés
// Enhanced function to create versions of the image with separated RGB channels
const createSplitChannelCanvas = (sourceCanvas) => {
    // Prepare the three canvases - one for each channel (red, green, blue)
    const redCanvas = document.createElement('canvas');
    const greenCanvas = document.createElement('canvas');
    const blueCanvas = document.createElement('canvas');

    // Same dimensions as source canvas
    redCanvas.width = sourceCanvas.width;
    redCanvas.height = sourceCanvas.height;
    greenCanvas.width = sourceCanvas.width;
    greenCanvas.height = sourceCanvas.height;
    blueCanvas.width = sourceCanvas.width;
    blueCanvas.height = sourceCanvas.height;

    // Rendering contexts
    const redCtx = redCanvas.getContext('2d');
    const greenCtx = greenCanvas.getContext('2d');
    const blueCtx = blueCanvas.getContext('2d');

    // Get image data from source canvas
    redCtx.drawImage(sourceCanvas, 0, 0);
    greenCtx.drawImage(sourceCanvas, 0, 0);
    blueCtx.drawImage(sourceCanvas, 0, 0);

    // Modify data to isolate each channel with more intensity
    const redData = redCtx.getImageData(0, 0, redCanvas.width, redCanvas.height);
    const greenData = greenCtx.getImageData(0, 0, greenCanvas.width, greenCanvas.height);
    const blueData = blueCtx.getImageData(0, 0, blueCanvas.width, blueCanvas.height);

    // Red channel with more pronounced violet color
    for (let i = 0; i < redData.data.length; i += 4) {
        // Use pixel brightness to modulate color intensity
        const brightness = (redData.data[i] + redData.data[i + 1] + redData.data[i + 2]) / (3 * 255);

        // Apply purple color (based on accent1 but more vivid)
        redData.data[i] = Math.min(255, Math.round(180 * brightness * 1.5));    // Plus rouge
        redData.data[i + 1] = Math.min(255, Math.round(50 * brightness));       // Peu de vert
        redData.data[i + 2] = Math.min(255, Math.round(255 * brightness * 1.5)); // Bleu maximal

        // Appliquer une opacité relative à la luminosité pour un meilleur effet de glow
        // Les parties claires sont plus visibles, les parties sombres plus transparentes
        redData.data[i + 3] = Math.max(30, Math.min(255, redData.data[i + 3] * (0.6 + brightness * 0.6)));
    }

    // Green channel with more vivid green
    for (let i = 0; i < greenData.data.length; i += 4) {
        const brightness = (greenData.data[i] + greenData.data[i + 1] + greenData.data[i + 2]) / (3 * 255);

        // Vert vif (basé sur accent3 mais plus intense)
        greenData.data[i] = Math.min(255, Math.round(10 * brightness));         // Presque pas de rouge
        greenData.data[i + 1] = Math.min(255, Math.round(240 * brightness * 1.5)); // Vert maximal
        greenData.data[i + 2] = Math.min(255, Math.round(70 * brightness));      // Peu de bleu

        // Opacité relative à la luminosité comme pour le rouge
        greenData.data[i + 3] = Math.max(30, Math.min(255, greenData.data[i + 3] * (0.6 + brightness * 0.6)));
    }

    // Blue channel (maintenu pour compatibilité)
    for (let i = 0; i < blueData.data.length; i += 4) {
        const brightness = (blueData.data[i] + blueData.data[i + 1] + blueData.data[i + 2]) / (3 * 255);

        // Strong blue with minimal other colors
        blueData.data[i] = Math.min(255, Math.round(20 * brightness));           // Minimal red
        blueData.data[i + 1] = Math.min(255, Math.round(80 * brightness));       // Some green
        blueData.data[i + 2] = Math.min(255, Math.round(230 * brightness * 1.5)); // Strong blue

        // Adjust alpha
        blueData.data[i + 3] = Math.min(255, blueData.data[i + 3] * 0.9);
    }

    // Apply modified data
    redCtx.putImageData(redData, 0, 0);
    greenCtx.putImageData(greenData, 0, 0);
    blueCtx.putImageData(blueData, 0, 0);

    return {
        redCanvas,
        greenCanvas,
        blueCanvas
    };
};


const Lab = () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [totalImages, setTotalImages] = useState(0);
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [projectImageLoaded, setProjectImageLoaded] = useState(false);
    const backgroundImageRef = useRef(null);
    const projectImageRef = useRef(null);

    // Canvas temporaire pour l'effet fisheye
    const offscreenCanvasRef = useRef(null);

    // Ajouter des refs pour stocker les positions précédentes
    const prevOffsetXRef = useRef(0);
    const prevOffsetYRef = useRef(0);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Créer ou redimensionner le canvas hors écran pour l'effet fisheye
            if (!offscreenCanvasRef.current) {
                offscreenCanvasRef.current = document.createElement('canvas');
            }
            offscreenCanvasRef.current.width = canvas.width;
            offscreenCanvasRef.current.height = canvas.height;
        };
        setCanvasDimensions();

        // Grid parameters - Modified for 500x350 rectangles
        const gridSizeX = 500; // Width of grid cells
        const gridSizeY = 350; // Height of grid cells
        const lineWidth = 2;
        const lineColor = `rgba(${parseInt(COLOR_PALETTE.neutral2.slice(1, 3), 16)}, ${parseInt(COLOR_PALETTE.neutral2.slice(3, 5), 16)}, ${parseInt(COLOR_PALETTE.neutral2.slice(5, 7), 16)}, 0.8)`; // Increased opacity

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

        // Historique des positions pour l'effet de traînée
        let positionHistory = [];
        const MAX_HISTORY = 10; // Nombre de positions à conserver pour l'effet de traînée

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


        const drawImageWithColorShift = (ctx, image, x, y, width, height, velocity, opacity) => {
            // Pour les images, on ne veut plus appliquer l'effet de décalage de couleur
            // On dessine simplement l'image originale
            ctx.globalAlpha = opacity;
            ctx.drawImage(image.canvas, x, y, width, height);
        };
        // Function to create a color-shifted canvas
        const createColorShiftedCanvas = (sourceCanvas, colorChannel) => {
            const newCanvas = document.createElement('canvas');
            newCanvas.width = sourceCanvas.width;
            newCanvas.height = sourceCanvas.height;
            const newCtx = newCanvas.getContext('2d');

            if (!newCtx) return sourceCanvas;

            // Draw the original canvas
            newCtx.drawImage(sourceCanvas, 0, 0);

            // Define accent colors
            const accentColors = [
                {hex: COLOR_PALETTE.accent1, r: 156, g: 65, b: 247},   // Purple
                {hex: COLOR_PALETTE.accent2, r: 194, g: 97, b: 64},    // Terracotta
                {hex: COLOR_PALETTE.accent3, r: 6, g: 186, b: 99},     // Green
                {hex: COLOR_PALETTE.accent4, r: 251, g: 208, b: 56}    // Yellow
            ];

            // Get image data
            const imageData = newCtx.getImageData(0, 0, newCanvas.width, newCanvas.height);
            const data = imageData.data;

            // Choose color based on color channel
            let chosenColor;
            if (colorChannel === 'r') {
                chosenColor = accentColors[3]; // Yellow for red
            } else if (colorChannel === 'g') {
                chosenColor = accentColors[2]; // Green for green
            } else if (colorChannel === 'b') {
                chosenColor = accentColors[0]; // Purple for blue
            } else {
                return sourceCanvas;
            }

            // Apply color shift
            for (let i = 0; i < data.length; i += 4) {
                // Preserve original brightness while shifting to accent color
                const brightness = data[i] / 255;
                data[i] = Math.round(chosenColor.r * brightness);
                data[i + 1] = Math.round(chosenColor.g * brightness);
                data[i + 2] = Math.round(chosenColor.b * brightness);

                // Reduce opacity slightly for better blending
                data[i + 3] = Math.max(data[i + 3] - 50, 0);
            }

            // Put the modified image data back
            newCtx.putImageData(imageData, 0, 0);

            return newCanvas;
        };

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
        // Create images with non-overlapping layout
        const createNonOverlappingImages = () => {
            // Only proceed if all necessary resources are loaded
            if (!projectImageLoaded || images.length > 0) return;

            const existingRects = [];
            let attempts = 0;
            const maxAttempts = 1000;

            // Min et max tailles pour normaliser le facteur de parallaxe
            const minSize = 100; // Taille minimale de projet
            const maxSize = 250; // Taille maximale de projet
            const sizeRange = maxSize - minSize;

            // Create random positions for images within the pattern
            for (let i = 0; i < imageCount && attempts < maxAttempts; i++) {
                // Random size between 100px and 250px
                const width = 100 + Math.random() * 150;
                const height = width * (0.7 + Math.random() * 0.6); // Random aspect ratio

                // Calculer le facteur de parallaxe basé sur la taille
                // Plus le projet est petit, plus il est proche du facteur de la grille (0.7)
                // Plus le projet est grand, plus il est proche de 1.0 (pas de parallaxe)
                const sizeRatio = (width - minSize) / sizeRange;
                const parallaxFactor = 0.7 + (sizeRatio * 0.3); // Entre 0.7 et 1.0

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
                    // Les petits projets ont un overlay plus foncé pour renforcer l'effet de profondeur
                    const overlayAlpha = 0.3 + (0.2 * (1 - sizeRatio)); // Smaller projects have darker overlay (0.5 for smallest, 0.3 for largest)
                    imageCtx.fillStyle = `rgba(0, 0, 0, ${overlayAlpha})`;
                    imageCtx.fillRect(0, 0, newRect.width, newRect.height);

                    // Add project label with proportional font size
                    imageCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    imageCtx.font = `bold ${Math.round(newRect.width / 10)}px Arial`;
                    imageCtx.textAlign = 'center';
                    imageCtx.textBaseline = 'middle';
                    imageCtx.fillText(`Project ${i + 1}`, newRect.width / 2, newRect.height / 2);

                    // Create color-shifted versions for 3D effect
                    const redCanvas = createColorShiftedCanvas(imageCanvas, 'r');
                    const blueCanvas = createColorShiftedCanvas(imageCanvas, 'b');

                    // Create split channel versions for chromatic aberration effect
                    const { redCanvas: redSplitCanvas, greenCanvas: greenSplitCanvas, blueCanvas: blueSplitCanvas } =
                        createSplitChannelCanvas(imageCanvas);

                    // Add shadow canvas for depth perception
                    const shadowCanvas = document.createElement('canvas');
                    shadowCanvas.width = newRect.width + 20; // Larger to contain shadow
                    shadowCanvas.height = newRect.height + 20;
                    const shadowCtx = shadowCanvas.getContext('2d');

                    // Draw shadow with size-dependent intensity
                    // Les grands projets ont des ombres plus prononcées (plus en premier plan)
                    const shadowOpacity = 0.2 + (sizeRatio * 0.2); // 0.2 for small projects, 0.4 for large ones
                    const shadowBlur = 5 + (sizeRatio * 10); // 5px for small, 15px for large
                    const shadowOffsetX = 2 + (sizeRatio * 8); // 2px for small, 10px for large
                    const shadowOffsetY = 2 + (sizeRatio * 8); // 2px for small, 10px for large

                    shadowCtx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
                    shadowCtx.shadowBlur = shadowBlur;
                    shadowCtx.shadowOffsetX = shadowOffsetX;
                    shadowCtx.shadowOffsetY = shadowOffsetY;
                    shadowCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    shadowCtx.fillRect(5, 5, newRect.width - 10, newRect.height - 10);

                    // Add to images array
                    images.push({
                        canvas: imageCanvas,
                        shadowCanvas: shadowCanvas, // Store shadow canvas
                        redCanvas: redCanvas,
                        blueCanvas: blueCanvas,
                        redSplitCanvas,
                        greenSplitCanvas,
                        blueSplitCanvas,
                        patternX: newRect.x,
                        patternY: newRect.y,
                        width: newRect.width,
                        height: newRect.height,
                        opacity: 0,
                        visible: false,
                        rotation: 0,
                        parallaxFactor: parallaxFactor, // Facteur de parallaxe basé sur la taille
                        size: width, // Stocke la taille réelle pour le tri
                        sizeRatio: sizeRatio // Ratio de taille normalisé entre 0 et 1
                    });

                    // Signal that this image is "loaded"
                    setImagesLoaded(i + 1);
                }
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

        // Fonction pour appliquer l'effet fisheye
        const applyFisheye = (sourceCtx, destCtx, strength) => {
            const width = canvas.width;
            const height = canvas.height;

            // If the effect is too weak, don't apply it (optimization for performance)
            if (strength < 0.01) {
                destCtx.drawImage(sourceCtx.canvas, 0, 0);
                return;
            }

            // Parameters for the effect
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.max(width, height) / 2;
            const maxDistortion = strength * 0.6; // Normal fisheye effect

            // OPTIMISATION: Réduire la résolution pendant le traitement
            // Plus l'effet fisheye est fort, plus on peut réduire la résolution
            // sans que ce soit perceptible
            const scale = isDragging ? 0.5 : 0.75; // Réduire davantage pendant le drag pour plus de fluidité
            const scaledWidth = Math.floor(width * scale);
            const scaledHeight = Math.floor(height * scale);

            // Create a reduced image for processing
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = scaledWidth;
            tempCanvas.height = scaledHeight;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(sourceCtx.canvas, 0, 0, width, height, 0, 0, scaledWidth, scaledHeight);

            let processedImageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight);

            // Destination à la taille correcte
            const destImageData = destCtx.createImageData(width, height);

            // OPTIMISATION: Traiter un pixel sur deux pour accélérer le rendu
            // L'œil humain ne détectera pas cette différence pendant le mouvement
            const step = isDragging ? 2 : 1; // Sauter des pixels pendant le drag

            // Pour chaque pixel dans l'image de destination
            for (let y = 0; y < height; y += step) {
                const scaledY = Math.floor(y * scale);

                for (let x = 0; x < width; x += step) {
                    const scaledX = Math.floor(x * scale);

                    // Calculer la distance normalisée du pixel au centre
                    const dx = (x - centerX) / radius;
                    const dy = (y - centerY) / radius;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Calculer le facteur de distorsion
                    const distortionFactor = 1.0 - distance * maxDistortion;

                    // Calculer les nouvelles coordonnées
                    let srcX = Math.floor((centerX + (x - centerX) * distortionFactor) * scale);
                    let srcY = Math.floor((centerY + (y - centerY) * distortionFactor) * scale);

                    // S'assurer que les coordonnées sont dans les limites
                    srcX = Math.max(0, Math.min(scaledWidth - 1, srcX));
                    srcY = Math.max(0, Math.min(scaledHeight - 1, srcY));

                    // Transfert de pixels
                    const destIndex = (y * width + x) * 4;
                    const srcIndex = (srcY * scaledWidth + srcX) * 4;

                    // Copier les valeurs RGBA directement
                    destImageData.data[destIndex] = processedImageData.data[srcIndex];
                    destImageData.data[destIndex + 1] = processedImageData.data[srcIndex + 1];
                    destImageData.data[destIndex + 2] = processedImageData.data[srcIndex + 2];
                    destImageData.data[destIndex + 3] = processedImageData.data[srcIndex + 3];

                    // OPTIMISATION: Remplir les pixels voisins pour le cas où step > 1
                    if (step > 1) {
                        // Remplir le pixel à droite si possible
                        if (x + 1 < width) {
                            const rightIndex = destIndex + 4;
                            destImageData.data[rightIndex] = processedImageData.data[srcIndex];
                            destImageData.data[rightIndex + 1] = processedImageData.data[srcIndex + 1];
                            destImageData.data[rightIndex + 2] = processedImageData.data[srcIndex + 2];
                            destImageData.data[rightIndex + 3] = processedImageData.data[srcIndex + 3];
                        }

                        // Remplir le pixel en dessous si possible
                        if (y + 1 < height) {
                            const bottomIndex = destIndex + width * 4;
                            destImageData.data[bottomIndex] = processedImageData.data[srcIndex];
                            destImageData.data[bottomIndex + 1] = processedImageData.data[srcIndex + 1];
                            destImageData.data[bottomIndex + 2] = processedImageData.data[srcIndex + 2];
                            destImageData.data[bottomIndex + 3] = processedImageData.data[srcIndex + 3];

                            // Remplir le pixel en diagonale
                            if (x + 1 < width) {
                                const diagIndex = bottomIndex + 4;
                                destImageData.data[diagIndex] = processedImageData.data[srcIndex];
                                destImageData.data[diagIndex + 1] = processedImageData.data[srcIndex + 1];
                                destImageData.data[diagIndex + 2] = processedImageData.data[srcIndex + 2];
                                destImageData.data[diagIndex + 3] = processedImageData.data[srcIndex + 3];
                            }
                        }
                    }
                }
            }

            // Libérer les ressources temporaires
            tempCanvas = null;

            // Mettre à jour l'image de destination
            destCtx.putImageData(destImageData, 0, 0);
        };

        // Function to draw just the grid with parallax effect
        const drawGrid = (ctx, offsetX, offsetY) => {
            ctx.beginPath();
            // Utiliser une couleur de grille plus subtile
            ctx.strokeStyle = `rgba(${parseInt(COLOR_PALETTE.neutral2.slice(1, 3), 16)}, ${parseInt(COLOR_PALETTE.neutral2.slice(3, 5), 16)}, ${parseInt(COLOR_PALETTE.neutral2.slice(5, 7), 16)}, 0.5)`;
            ctx.lineWidth = 4; // Ligne plus fine

            // Facteur de parallaxe - la grille se déplace plus lentement que les images
            // Une valeur de 0.7 signifie que la grille se déplace à 70% de la vitesse des images
            const parallaxFactor = 0.7;

            // Appliquer le facteur de parallaxe aux offsets pour la grille
            const gridOffsetX = offsetX * parallaxFactor;
            const gridOffsetY = offsetY * parallaxFactor;

            // Calculer le premier point de grille visible avec le décalage de parallaxe
            // Calculer le modulo correctement pour des valeurs négatives
            const startGridX = ((gridOffsetX % gridSizeX) + gridSizeX) % gridSizeX;
            const startGridY = ((gridOffsetY % gridSizeY) + gridSizeY) % gridSizeY;

            // Dessiner les lignes verticales avec le décalage de parallaxe
            for (let x = startGridX; x <= canvas.width + gridSizeX; x += gridSizeX) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }

            // Dessiner les lignes horizontales avec le décalage de parallaxe
            for (let y = startGridY; y <= canvas.height + gridSizeY; y += gridSizeY) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }

            ctx.stroke();
        };


        const createImagesMask = (ctx, canvas, images, offsetX, offsetY, patternWidth, patternHeight) => {
            // Créer un canvas pour le masque
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = canvas.width;
            maskCanvas.height = canvas.height;
            const maskCtx = maskCanvas.getContext('2d');

            // Remplir le masque en blanc (zones à afficher)
            maskCtx.fillStyle = 'white';
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

            // Calculer quelles tuiles sont visibles
            const startTileX = Math.floor((-offsetX - canvas.width) / patternWidth);
            const endTileX = Math.ceil((-offsetX + canvas.width) / patternWidth);
            const startTileY = Math.floor((-offsetY - canvas.height) / patternHeight);
            const endTileY = Math.ceil((-offsetY + canvas.width) / patternHeight);

            // Pour chaque tuile visible
            for (let tileY = startTileY; tileY <= endTileY; tileY++) {
                for (let tileX = startTileX; tileX <= endTileX; tileX++) {
                    // Calculer la position de la tuile
                    const tilePixelX = tileX * patternWidth + offsetX;
                    const tilePixelY = tileY * patternHeight + offsetY;

                    // Pour chaque image dans cette tuile
                    images.forEach(image => {
                        if (image.opacity > 0.1) { // Ne masquer que les images visibles
                            // Position de l'image
                            const imgX = image.patternX + tilePixelX;
                            const imgY = image.patternY + tilePixelY;

                            // Vérifier si l'image est visible dans le viewport
                            if (imgX + image.width >= 0 && imgX <= canvas.width &&
                                imgY + image.height >= 0 && imgY <= canvas.height) {
                                // "Découper" cette zone du masque en noir (zone à ne pas afficher)
                                maskCtx.fillStyle = 'black';
                                maskCtx.fillRect(imgX, imgY, image.width, image.height);
                            }
                        }
                    });
                }
            }

            return maskCanvas;
        };


        // Fonction complètement revue pour dessiner une image avec une traînée qui s'étend au-delà des limites de l'image
        const drawImageWithColorTrail = (ctx, image, x, y, width, height, velocity, opacity) => {
            const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

            // Si vitesse trop faible, dessiner juste l'image sans effet
            if (velocityMagnitude < 0.3) {
                ctx.globalAlpha = opacity;
                ctx.drawImage(image.canvas, x, y, width, height);
                return;
            }

            // Ajuster la force de l'effet en fonction du facteur de parallaxe
            // Plus un élément est proche de la caméra (parallaxFactor proche de 1),
            // plus son effet de traînée est prononcé
            const effectMultiplier = (image.parallaxFactor - 0.7) / 0.3; // Normaliser entre 0 et 1

            // Calculer la direction du décalage (opposée à la direction du mouvement)
            const dirX = velocity.x !== 0 ? -Math.sign(velocity.x) : 0;
            const dirY = velocity.y !== 0 ? -Math.sign(velocity.y) : 0;

            // Force de l'effet basée sur la vitesse et la profondeur
            const effectStrength = Math.min(velocityMagnitude / 10, 1.5) * effectMultiplier;

            // Ajuster l'amplitude de la traînée en fonction de la profondeur
            const trailOffset = Math.max(10, Math.min(50, velocityMagnitude * 2.0 * effectMultiplier));

            // 1. Calculer les dimensions et positions des traînées (plus grandes que l'image)
            // Traînée violette
            const purpleTrailX = x + dirX * trailOffset * (Math.abs(velocity.x) / (velocityMagnitude + 0.001));
            const purpleTrailY = y + dirY * trailOffset * (Math.abs(velocity.y) / (velocityMagnitude + 0.001));
            // Agrandir la traînée par rapport à l'image
            const trailWidthFactor = 1.2 + effectStrength * 0.3; // Jusqu'à 50% plus large
            const trailHeightFactor = 1.2 + effectStrength * 0.3; // Jusqu'à 50% plus haute
            const purpleTrailWidth = width * trailWidthFactor;
            const purpleTrailHeight = height * trailHeightFactor;

            // Traînée verte (dans la direction opposée)
            const greenTrailX = x - dirX * trailOffset * 0.7 * (Math.abs(velocity.x) / (velocityMagnitude + 0.001));
            const greenTrailY = y - dirY * trailOffset * 0.7 * (Math.abs(velocity.y) / (velocityMagnitude + 0.001));
            const greenTrailWidth = width * (trailWidthFactor - 0.1); // Légèrement différent
            const greenTrailHeight = height * (trailHeightFactor - 0.1);

            // 2. Dessiner les traînées colorées en premier
            ctx.globalCompositeOperation = 'lighter';

            // Traînée violette
            ctx.globalAlpha = Math.min(effectStrength * 0.9, 0.8) * opacity;
            // Utiliser une transformation pour centrer correctement la traînée agrandie
            ctx.save();
            ctx.translate(purpleTrailX + width / 2, purpleTrailY + height / 2);
            ctx.scale(trailWidthFactor, trailHeightFactor);
            ctx.drawImage(
                image.redSplitCanvas,
                -width / 2,
                -height / 2,
                width,
                height
            );
            ctx.restore();

            // Traînée verte
            ctx.globalAlpha = Math.min(effectStrength * 0.9, 0.8) * opacity;
            ctx.save();
            ctx.translate(greenTrailX + width / 2, greenTrailY + height / 2);
            ctx.scale(trailWidthFactor - 0.1, trailHeightFactor - 0.1);
            ctx.drawImage(
                image.greenSplitCanvas,
                -width / 2,
                -height / 2,
                width,
                height
            );
            ctx.restore();

            // 3. Dessiner l'image principale par-dessus
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = opacity;
            ctx.drawImage(image.canvas, x, y, width, height);
        };
        // Modification du drawCanvas pour utiliser la nouvelle fonction


// ÉTAPE 2: Modifier la fonction drawCanvas pour appliquer l'effet global
        // Fonction améliorée pour appliquer l'effet avec un décalage réduit et une opacité augmentée
        const applyGlobalColorTrail = (ctx, canvas, offsetX, offsetY, dragVelocityX, dragVelocityY, effectStrength) => {
            const velocityMagnitude = Math.sqrt(dragVelocityX * dragVelocityX + dragVelocityY * dragVelocityY);

            // Ne pas appliquer l'effet si la vitesse est trop faible
            if (velocityMagnitude < 0.3) return;

            // Calculer la direction du décalage (opposée à la direction du mouvement)
            const dirX = dragVelocityX !== 0 ? -Math.sign(dragVelocityX) : 0;
            const dirY = dragVelocityY !== 0 ? -Math.sign(dragVelocityY) : 0;

            // Réduire l'amplitude du décalage comme demandé
            // Décalage plus petit mais toujours proportionnel à la vitesse
            const shiftAmount = Math.max(5, Math.min(15, velocityMagnitude * 0.8));

            // Stocker l'état actuel du canvas complet
            const originalCanvas = document.createElement('canvas');
            originalCanvas.width = canvas.width;
            originalCanvas.height = canvas.height;
            const originalCtx = originalCanvas.getContext('2d');
            originalCtx.drawImage(canvas, 0, 0);

            // Créer deux copies pour les versions colorées (violet et vert)
            const purpleCanvas = document.createElement('canvas');
            purpleCanvas.width = canvas.width;
            purpleCanvas.height = canvas.height;
            const purpleCtx = purpleCanvas.getContext('2d');

            const greenCanvas = document.createElement('canvas');
            greenCanvas.width = canvas.width;
            greenCanvas.height = canvas.height;
            const greenCtx = greenCanvas.getContext('2d');

            // Copier l'état original du canvas sur les deux versions colorées
            purpleCtx.drawImage(originalCanvas, 0, 0);
            greenCtx.drawImage(originalCanvas, 0, 0);

            // Appliquer une teinte violette plus prononcée sur la première copie
            purpleCtx.globalCompositeOperation = 'overlay';
            purpleCtx.fillStyle = COLOR_PALETTE.accent1; // Violet
            purpleCtx.fillRect(0, 0, canvas.width, canvas.height);
            // Seconde passe pour intensifier la couleur
            purpleCtx.fillRect(0, 0, canvas.width, canvas.height);
            purpleCtx.globalCompositeOperation = 'source-over';

            // Appliquer une teinte verte plus prononcée sur la deuxième copie
            greenCtx.globalCompositeOperation = 'overlay';
            greenCtx.fillStyle = COLOR_PALETTE.accent3; // Vert
            greenCtx.fillRect(0, 0, canvas.width, canvas.height);
            // Seconde passe pour intensifier la couleur
            greenCtx.fillRect(0, 0, canvas.width, canvas.height);
            greenCtx.globalCompositeOperation = 'source-over';

            // Effacer le canvas original
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dessiner d'abord les versions décalées
            ctx.globalCompositeOperation = 'lighter';

            // Augmenter l'opacité comme demandé
            // Version violette décalée dans la direction opposée au mouvement
            ctx.globalAlpha = Math.min(0.85, effectStrength * 0.85); // Opacité plus élevée
            ctx.drawImage(
                purpleCanvas,
                dirX * shiftAmount * (Math.abs(dragVelocityX) / (velocityMagnitude + 0.001)),
                dirY * shiftAmount * (Math.abs(dragVelocityY) / (velocityMagnitude + 0.001))
            );

            // Version verte décalée dans la direction opposée (mais légèrement différente)
            ctx.globalAlpha = Math.min(0.85, effectStrength * 0.85); // Opacité plus élevée
            ctx.drawImage(
                greenCanvas,
                -dirX * shiftAmount * 0.7 * (Math.abs(dragVelocityX) / (velocityMagnitude + 0.001)),
                -dirY * shiftAmount * 0.7 * (Math.abs(dragVelocityY) / (velocityMagnitude + 0.001))
            );

            // Enfin, dessiner la version originale par-dessus avec une légère transparence
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.85; // Légèrement plus opaque pour un effet plus subtil
            ctx.drawImage(originalCanvas, 0, 0);

            // Réinitialiser les paramètres du contexte
            ctx.globalAlpha = 1.0;
        };
// Modify the drawCanvas function to remove the shadow rendering
        const drawCanvas = () => {
            if (!ctx || !offscreenCanvasRef.current) return;

            const offscreenCtx = offscreenCanvasRef.current.getContext('2d');
            if (!offscreenCtx) return;

            // Effacer le canvas
            offscreenCtx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. D'abord, dessiner le fond
            offscreenCtx.fillStyle = COLOR_PALETTE.neutral1;
            offscreenCtx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Dessiner la grille avec le facteur de parallaxe fixe pour la grille
            const gridParallaxFactor = 0.7;
            drawGrid(offscreenCtx, offsetX * gridParallaxFactor, offsetY * gridParallaxFactor);

            // Calculer la magnitude de la vitesse
            const velocityMagnitude = Math.sqrt(dragVelocityX * dragVelocityX + dragVelocityY * dragVelocityY);

            // Mise à jour des compteurs de debug
            debugInfo.visibleTiles = 0;
            debugInfo.visibleInstances = 0;
            debugInfo.offsetX = Math.round(offsetX);
            debugInfo.offsetY = Math.round(offsetY);
            debugInfo.velocityMagnitude = Math.round(velocityMagnitude * 100) / 100;
            debugInfo.effectStrength = Math.round(effectStrength * 100) / 100;

            // 3. Calculer les tuiles visibles
            const startTileX = Math.floor((-offsetX - canvas.width) / patternWidth);
            const endTileX = Math.ceil((-offsetX + canvas.width) / patternWidth);
            const startTileY = Math.floor((-offsetY - canvas.height) / patternHeight);
            const endTileY = Math.ceil((-offsetY + canvas.width) / patternHeight);

            // 4. Collecter toutes les images visibles avec leurs positions calculées
            const visibleImagesData = [];
            const visibleIndices = new Set();

            for (let tileY = startTileY; tileY <= endTileY; tileY++) {
                for (let tileX = startTileX; tileX <= endTileX; tileX++) {
                    // Pour chaque tuile, collecter les images visibles
                    images.forEach((image, index) => {
                        // Appliquer le facteur de parallaxe propre à chaque image
                        const imgOffsetX = offsetX * image.parallaxFactor;
                        const imgOffsetY = offsetY * image.parallaxFactor;

                        // Calculer la position avec ce nouveau décalage
                        const tilePixelX = tileX * patternWidth + imgOffsetX;
                        const tilePixelY = tileY * patternHeight + imgOffsetY;

                        const imgX = image.patternX + tilePixelX;
                        const imgY = image.patternY + tilePixelY;

                        if (isInViewport(imgX, imgY, image.width, image.height)) {
                            debugInfo.visibleInstances++;
                            visibleIndices.add(index);

                            // Ajouter l'image à la liste des images visibles avec sa position
                            visibleImagesData.push({
                                image,
                                x: imgX,
                                y: imgY,
                                width: image.width,
                                height: image.height,
                                size: image.size || image.width, // Utiliser la taille pour le tri
                                velocity: {
                                    x: dragVelocityX * image.parallaxFactor,
                                    y: dragVelocityY * image.parallaxFactor
                                },
                                opacity: image.opacity,
                                index // Garder l'index original pour la mise à jour des propriétés
                            });
                        }
                    });
                }
            }

            // 5. Trier les images par taille (de petite à grande pour que les grandes soient au-dessus)
            visibleImagesData.sort((a, b) => a.size - b.size);

            // 6. Dessiner les images dans l'ordre trié (petites d'abord, grandes ensuite)
            for (const imageData of visibleImagesData) {
                // ** REMOVED SHADOW DRAWING CODE HERE **

                // Dessiner l'image avec traînée si nécessaire
                drawImageWithColorTrail(
                    offscreenCtx,
                    imageData.image,
                    imageData.x,
                    imageData.y,
                    imageData.width,
                    imageData.height,
                    imageData.velocity,
                    imageData.opacity
                );
            }

            // 7. Si la vitesse est suffisante ou si l'effet est encore visible, appliquer l'effet
            if (velocityMagnitude > 0.3 || effectStrength > 0.05) {
                // Passer effectStrength à la fonction pour bien contrôler l'intensité
                applyGlobalColorTrail(
                    offscreenCtx,
                    offscreenCanvasRef.current,
                    offsetX,
                    offsetY,
                    dragVelocityX,
                    dragVelocityY,
                    effectStrength
                );
            }

            // 8. Mettre à jour la visibilité des images
            images.forEach((image, index) => {
                const isVisible = visibleIndices.has(index);
                image.visible = isVisible;

                if (isVisible) {
                    image.opacity = Math.min(image.opacity + 0.05, 1); // Fade in
                } else {
                    image.opacity = Math.max(image.opacity - 0.05, 0); // Fade out
                }
            });

            // 9. Dessiner l'interface utilisateur
            offscreenCtx.globalAlpha = 1.0;
            offscreenCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            offscreenCtx.font = '14px Arial';
            offscreenCtx.fillText('Drag to explore the infinite gallery (with color shift effect)', 20, 30);

            if (imagesLoaded < totalImages) {
                offscreenCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                offscreenCtx.font = '14px Arial';
                offscreenCtx.fillText(`Loading projects: ${imagesLoaded}/${totalImages}`, 20, 50);
            }

            // Debug info
            offscreenCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            offscreenCtx.font = '12px monospace';
            offscreenCtx.fillText(`Offset: (${debugInfo.offsetX}, ${debugInfo.offsetY}) | Velocity: ${debugInfo.velocityMagnitude} | Effect: ${debugInfo.effectStrength} | Tiles: ${debugInfo.visibleTiles} | Images: ${debugInfo.visibleInstances}`, 20, canvas.height - 20);

            // 10. Appliquer l'effet fisheye si nécessaire
            if (fisheyeStrength > 0.01) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = COLOR_PALETTE.neutral1;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                applyFisheye(offscreenCtx, ctx, fisheyeStrength);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(offscreenCanvasRef.current, 0, 0);
            }
        };


        let effectStrength = 0; // Controls the visual strength of the color shift effect
        let fisheyeStrength = 0; // Controls the fisheye effect strength

        // Animation loop for smooth effects
        // Enhanced animation loop with better trail effect control

// Fonction animate améliorée pour des transitions plus douces
        const animate = () => {
            // Smoothly transition to target offset with improved easing
            offsetX += (targetOffsetX - offsetX) * 0.066;
            offsetY += (targetOffsetY - offsetY) * 0.066;

            // Calculate velocity with smoother response
            if (isDragging) {
                // Plus smooth pendant le drag - réagit plus progressivement
                dragVelocityX = dragVelocityX * 0.6 + (targetOffsetX - lastDragX) * 0.5; // transition plus douce
                dragVelocityY = dragVelocityY * 0.6 + (targetOffsetY - lastDragY) * 0.5;

                // Augmenter progressivement la force de l'effet (plus lentement pour une transition plus douce)
                effectStrength = Math.min(effectStrength + 0.08, 1.5); // Montée plus lente et progressive

                // Increase fisheye effect more smoothly
                fisheyeStrength = Math.min(fisheyeStrength + 0.035, 0.5); // Plus doux
            } else {
                // Encore plus graduel pour le relâchement (release) - maintient l'effet plus longtemps
                if (Math.abs(dragVelocityX) > 1.0 || Math.abs(dragVelocityY) > 1.0) {
                    // Higher velocities: slow down more gently to keep effect visible longer
                    dragVelocityX *= 0.99; // Décroissance très lente pour l'inertie
                    dragVelocityY *= 0.99;
                } else {
                    // Lower velocities: still slow decay
                    dragVelocityX *= 0.975; // Décroissance un peu plus prononcée mais toujours douce
                    dragVelocityY *= 0.975;
                }

                // Threshold to stop very small movements
                if (Math.abs(dragVelocityX) < 0.05) dragVelocityX = 0;
                if (Math.abs(dragVelocityY) < 0.05) dragVelocityY = 0;

                // Diminution très progressive des effets pour une transition douce
                fisheyeStrength = Math.max(fisheyeStrength - 0.01, 0); // Décroissance plus lente
                effectStrength = Math.max(effectStrength - 0.008, 0); // Décroissance encore plus lente
            }

            // Calculate velocity magnitude for debug and effects
            const velocityMagnitude = Math.sqrt(dragVelocityX * dragVelocityX + dragVelocityY * dragVelocityY);

            // Update position history for trail effect
            if (positionHistory.length >= MAX_HISTORY) {
                positionHistory.shift(); // Remove oldest position
            }
            positionHistory.push({
                x: offsetX,
                y: offsetY,
                velocityX: dragVelocityX,
                velocityY: dragVelocityY,
                magnitude: velocityMagnitude
            });

            // Store last position for velocity calculation
            lastDragX = targetOffsetX;
            lastDragY = targetOffsetY;

            // Update tracking refs
            prevOffsetXRef.current = offsetX;
            prevOffsetYRef.current = offsetY;

            // Draw everything
            drawCanvas();

            // Always use requestAnimationFrame for smooth animation
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        // Start animation
        animate();

        // Nettoyer correctement l'animation
        const cleanupAnimation = () => {
            if (typeof animationFrameRef.current === 'number') {
                cancelAnimationFrame(animationFrameRef.current);
            } else if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
        };

        // Event handlers
        const handleMouseDown = (e) => {
            isDragging = true;
            dragStartX = e.clientX - targetOffsetX;
            dragStartY = e.clientY - targetOffsetY;
            canvas.style.cursor = 'grabbing';

            // Add a small initial velocity if starting from rest
            // This ensures the effect begins to show immediately
            if (Math.abs(dragVelocityX) < 0.1 && Math.abs(dragVelocityY) < 0.1) {
                dragVelocityX = 0.1;
                dragVelocityY = 0.1;
            }

            // Réinitialiser l'historique des positions
            positionHistory = [];
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

            // NE PAS TOUCHER À fisheyeStrength ICI
            // Permettre à la boucle d'animation de gérer la transition

            // Réduire modérément la vitesse pour un effet d'inertie
            dragVelocityX *= 0.5;
            dragVelocityY *= 0.5;
        };

        const handleResize = () => {
            setCanvasDimensions();
        };

        // Touch event handlers (for mobile devices)
        const handleTouchStart = (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                handleMouseDown({clientX: touch.clientX, clientY: touch.clientY});
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                handleMouseMove({clientX: touch.clientX, clientY: touch.clientY});

                // Prevent scroll/zoom on touch devices
                e.preventDefault();
            }
        };

        const handleTouchEnd = () => {
            handleMouseUp();
            // Plus besoin de code supplémentaire puisque handleMouseUp fait déjà tout le travail nécessaire
        };

        // Set initial cursor style
        canvas.style.cursor = 'grab';

        // Add event listeners
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove, {passive: false});
        window.addEventListener('touchend', handleTouchEnd);

        // Cleanup function
        return () => {
            cleanupAnimation();

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
        <section className={"Lab"}>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    display: 'block',
                    width: '100vw',
                    height: '100vh',
                    touchAction: 'none',
                    background: COLOR_PALETTE.neutral1 // Couleur de fond
                }}
            />
            <Overlay lab={true}/>

        </section>
    );
};

export default Lab;