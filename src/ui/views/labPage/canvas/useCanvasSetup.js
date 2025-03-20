import { useEffect, useRef, useState } from 'react';

// Custom hook to handle canvas setup and image loading
export const useCanvasSetup = () => {
    const canvasRef = useRef(null);
    const offscreenCanvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [totalImages, setTotalImages] = useState(0);
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [projectImageLoaded, setProjectImageLoaded] = useState(false);
    const backgroundImageRef = useRef(null);
    const projectImageRef = useRef(null);

    // Add refs to store previous positions
    const prevOffsetXRef = useRef(0);
    const prevOffsetYRef = useRef(0);

    // Add a ref to store all project images
    const projectImagesRef = useRef([]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Create or resize the offscreen canvas for the fisheye effect
            if (!offscreenCanvasRef.current) {
                offscreenCanvasRef.current = document.createElement('canvas');
            }
            offscreenCanvasRef.current.width = canvas.width;
            offscreenCanvasRef.current.height = canvas.height;
        };
        setCanvasDimensions();

        // Load project images from public folder
        const loadImages = async () => {
            projectImagesRef.current = [];

            // Basé sur votre capture d'écran, voici les fichiers disponibles
            const knownFiles = [
                'how.webp',
                'preview.webp',
                'project1.webp',
                'what.webp',
                'why.webp'
            ];

            console.log("Attempting to load known .webp files:", knownFiles);

            // Définir le nombre total d'images à charger
            setTotalImages(knownFiles.length);

            let loadedSuccessfully = 0;
            const loadPromises = knownFiles.map((filename, index) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = `/img/lab/${filename}`;

                    img.onload = () => {
                        loadedSuccessfully++;
                        setImagesLoaded(loadedSuccessfully);

                        // Stocker l'image chargée avec ses métadonnées
                        projectImagesRef.current.push({
                            img: img,
                            filename: filename,
                            index: index
                        });

                        console.log(`Successfully loaded: ${filename}`);
                        resolve();
                    };

                    img.onerror = (error) => {
                        console.error(`Failed to load: ${filename}`, error);
                        resolve(); // Continue malgré l'erreur
                    };
                });
            });

            // Attendre que toutes les tentatives de chargement soient terminées
            await Promise.all(loadPromises);

            // Vérifier si au moins une image a été chargée
            if (loadedSuccessfully > 0) {
                // Trier les images par nom de fichier
                projectImagesRef.current.sort((a, b) =>
                    a.filename.localeCompare(b.filename)
                );

                // Définir la première image comme référence
                projectImageRef.current = projectImagesRef.current[0].img;

                // Mettre à jour l'état
                setProjectImageLoaded(true);
                console.log(`Successfully loaded ${loadedSuccessfully} out of ${knownFiles.length} images`);
            } else {
                // Si aucune image n'a été chargée, créer une image par défaut
                createFallbackImage();
            }

            // Continuer l'initialisation
            setBackgroundLoaded(true);
        };

        // Create a fallback image if needed
        const createFallbackImage = () => {
            console.log("Creating fallback image");

            const fallback = document.createElement('canvas');
            fallback.width = 200;
            fallback.height = 300;
            const ctx = fallback.getContext('2d');
            ctx.fillStyle = '#C26140'; // Use an accent color
            ctx.fillRect(0, 0, 200, 300);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No Images Loaded', 100, 150);

            // Create a fake image object
            const fakeImage = {
                img: fallback,
                filename: 'fallback.webp',
                index: 0
            };

            projectImagesRef.current = [fakeImage];
            projectImageRef.current = fallback;

            // Update state
            setTotalImages(1);
            setImagesLoaded(1);
            setProjectImageLoaded(true);
        };

        // Start loading images
        loadImages();

        // Add resize event listener
        window.addEventListener('resize', setCanvasDimensions);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
        };
    }, []);

    return {
        canvasRef,
        offscreenCanvasRef,
        animationFrameRef,
        imagesLoaded,
        setImagesLoaded,
        totalImages,
        setTotalImages,
        backgroundLoaded,
        projectImageLoaded,
        backgroundImageRef,
        projectImageRef,
        projectImagesRef, // Expose the array of loaded images
        prevOffsetXRef,
        prevOffsetYRef
    };
};