import { useEffect, useRef, useState } from 'react';
import { IMAGE_COUNT } from '../constants.js';

// Custom hook to handle canvas setup and image loading
export const useCanvasSetup = () => {
    const canvasRef = useRef(null);
    const offscreenCanvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [totalImages, setTotalImages] = useState(IMAGE_COUNT);
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [projectImageLoaded, setProjectImageLoaded] = useState(false);
    const backgroundImageRef = useRef(null);
    const projectImageRef = useRef(null);
    
    // Add refs to store previous positions
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

            // Create or resize the offscreen canvas for the fisheye effect
            if (!offscreenCanvasRef.current) {
                offscreenCanvasRef.current = document.createElement('canvas');
            }
            offscreenCanvasRef.current.width = canvas.width;
            offscreenCanvasRef.current.height = canvas.height;
        };
        setCanvasDimensions();

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
        prevOffsetXRef,
        prevOffsetYRef
    };
};
