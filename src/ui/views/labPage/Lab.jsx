import React, {useState, useCallback, useRef, useEffect} from 'react';
import Overlay from "../../components/Overlay.jsx";
import {COLOR_PALETTE} from './constants';
import {useCanvasSetup} from './canvas/useCanvasSetup.js';
import {useCanvasAnimation} from './canvas/useCanvasAnimation.js';
import LabPopup from './LabPopup.jsx';

const Lab = () => {
    // State to track the currently selected project
    const [selectedProject, setSelectedProject] = useState(null);
    const [gridLayoutActive, setGridLayoutActive] = useState(false);

    // Ref to track if the user has moved significantly (to distinguish between click and drag)
    const hasDraggedRef = useRef(false);
    const startPosRef = useRef({x: 0, y: 0});
    const [isHoveringProject, setIsHoveringProject] = useState(false);

    // Thresholds for detecting a drag vs a click
    const DRAG_THRESHOLD = 10; // Pixels of movement to consider a drag

    // Use custom hooks to manage canvas setup and animation
    const {
        canvasRef,
        offscreenCanvasRef,
        animationFrameRef,
        imagesLoaded,
        setImagesLoaded,
        totalImages,
        setTotalImages,
        backgroundLoaded,
        projectImageLoaded,
        projectImageRef,
        projectImagesRef, // Add this to the destructuring
        prevOffsetXRef,
        prevOffsetYRef
    } = useCanvasSetup();

    const handleGridLayoutToggle = useCallback((isGridActive) => {
        setGridLayoutActive(isGridActive);
    }, []);
    // Use animation hook to handle the interactive canvas
    const {
        images, isDragging, debugInfo, findClickedProject, setDragHandlers, updateImagesLayout, isTransitioning
    } = useCanvasAnimation({
        canvasRef, offscreenCanvasRef, animationFrameRef, projectImageRef, projectImagesRef,
        projectImageLoaded, backgroundLoaded, setImagesLoaded, setTotalImages, prevOffsetXRef, prevOffsetYRef,
        gridLayoutActive // Ajouter cette prop
    });

    // Handle closing the popup
    const handleClosePopup = useCallback(() => {
        setSelectedProject(null);
    }, []);

    // Set up custom mouse handlers that manage both dragging and clicks
    const handleMouseDown = useCallback((e) => {
        // Reset drag tracking
        hasDraggedRef.current = false;
        startPosRef.current = {x: e.clientX, y: e.clientY};

        // Set cursor to grabbing during mouse down
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing';
        }

        // Call the original drag handler from the animation hook
        setDragHandlers.mouseDown(e);
    }, [setDragHandlers, canvasRef]);

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            // Check if we've moved enough to be considered a drag
            const deltaX = Math.abs(e.clientX - startPosRef.current.x);
            const deltaY = Math.abs(e.clientY - startPosRef.current.y);

            if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
                hasDraggedRef.current = true;
            }

            // Cette partie est essentielle pour le glissement et doit être conservée
            setDragHandlers.mouseMove(e);
        }
    }, [isDragging, setDragHandlers]);


    // Set up touch handlers the same way
    const handleTouchStart = useCallback((e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            hasDraggedRef.current = false;
            startPosRef.current = {x: touch.clientX, y: touch.clientY};

            // Call the original handler with touch coords
            setDragHandlers.mouseDown({clientX: touch.clientX, clientY: touch.clientY});
        }
    }, [setDragHandlers]);

    const handleTouchMove = useCallback((e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];

            // Track if this is a drag using the same threshold
            const deltaX = Math.abs(touch.clientX - startPosRef.current.x);
            const deltaY = Math.abs(touch.clientY - startPosRef.current.y);

            if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
                hasDraggedRef.current = true;
            }

            // Call the original handler
            setDragHandlers.mouseMove({clientX: touch.clientX, clientY: touch.clientY});

            // Prevent scrolling
            e.preventDefault();
        }
    }, [setDragHandlers]);

    const handleTouchEnd = useCallback((e) => {
        if (e.changedTouches.length === 1) {
            const touch = e.changedTouches[0];

            // Call the original handler
            setDragHandlers.mouseUp({clientX: touch.clientX, clientY: touch.clientY});

            // If it wasn't a drag, treat as click OR if we're in grid mode
            if (!hasDraggedRef.current || gridLayoutActive) {
                const project = findClickedProject(touch.clientX, touch.clientY);
                if (project) {
                    setSelectedProject(project);
                }
            }

            // Reset drag state
            hasDraggedRef.current = false;
        }
    }, [setDragHandlers, findClickedProject, gridLayoutActive]);

    const handleMouseUp = useCallback((e) => {
        // First, call the drag end handler
        setDragHandlers.mouseUp(e);

        // Only consider this a click if the mouse hasn't moved significantly OR if we're in grid mode
        if (!hasDraggedRef.current || gridLayoutActive) {
            const project = findClickedProject(e.clientX, e.clientY);
            if (project) {
                setSelectedProject(project);
            }
        }

        // Reset drag state
        hasDraggedRef.current = false;

        // Reset cursor after drag
        if (canvasRef.current) {
            const project = findClickedProject(e.clientX, e.clientY);
            if (project) {
                canvasRef.current.style.cursor = 'pointer';
            } else {
                canvasRef.current.style.cursor = gridLayoutActive ? 'default' : 'grab';
            }
        }
    }, [setDragHandlers, findClickedProject, canvasRef, gridLayoutActive]);



    const checkCursorOverProject = useCallback((e) => {
        const project = findClickedProject(e.clientX, e.clientY);
        const isOverProject = !!project;

        // Si l'état change, mettez-le à jour
        if (isOverProject !== isHoveringProject) {
            setIsHoveringProject(isOverProject);

            // Appliquer une classe au body pour un contrôle CSS global du curseur
            if (isOverProject) {
                document.body.classList.add('cursor-pointer');
            } else {
                document.body.classList.remove('cursor-pointer');
            }


        }
    }, [findClickedProject, isHoveringProject]);

    // Gestionnaire spécifique au canvas pour assurer une détection correcte des survols de projets
    const handleCanvasMouseMove = useCallback((e) => {
        // Check if we're hovering over a project
        checkCursorOverProject(e);

        // Apply different cursor classes based on mode and drag state
        if (isDragging && !gridLayoutActive) {
            document.body.classList.add('cursor-grabbing');
        } else {
            document.body.classList.remove('cursor-grabbing');
        }
    }, [checkCursorOverProject, isDragging, gridLayoutActive]);

    useEffect(() => {
        if (gridLayoutActive) {
            document.body.classList.add('grid-mode');
        } else {
            document.body.classList.remove('grid-mode');
        }

        return () => {
            document.body.classList.remove('grid-mode');
        };
    }, [gridLayoutActive]);
    useEffect(() => {
        if (images.length > 0 && updateImagesLayout && !isTransitioning) {
            updateImagesLayout(gridLayoutActive);
        }
    }, [gridLayoutActive, images.length, updateImagesLayout, isTransitioning]);
    // Attach all event listeners to the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Définir le style de curseur initial
        canvas.style.cursor = 'grab';

        // IMPORTANT: Séparer les responsabilités
        // 1. Écoute des événements de souris sur le canvas pour le style de curseur
        canvas.addEventListener('mousemove', handleCanvasMouseMove);

        // 2. Écoute des événements de souris sur la fenêtre pour le glissement
        window.addEventListener('mousemove', handleMouseMove);

        // Autres écouteurs d'événements
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Pour les événements touch
        canvas.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove, {passive: false});
        window.addEventListener('touchend', handleTouchEnd);

        // Nettoyage lors du démontage
        return () => {
            canvas.removeEventListener('mousemove', handleCanvasMouseMove);
            window.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [canvasRef, handleCanvasMouseMove, handleMouseMove, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

    return (<section className={"Lab"}>
        <style>{`
    body.cursor-pointer * {
        cursor: pointer !important;
    }

    body.cursor-grabbing * {
        cursor: grabbing !important;
    }
    
    /* Add this for grid mode */
    body.grid-mode canvas {
        cursor: default !important;
    }

    /* Update this to handle grid mode */
    body:not(.cursor-pointer):not(.cursor-grabbing):not(.grid-mode) .Lab canvas {
        cursor: grab !important;
    }
    
    /* When in grid mode but hovering over a project, show pointer */
    body.grid-mode.cursor-pointer * {
        cursor: pointer !important;
    }
`}</style>

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
                background: COLOR_PALETTE.neutral1
            }}
        />
        <Overlay
            lab={true}
            onGridLayoutToggle={handleGridLayoutToggle}
        />
        {/* Project Popup */}
        {selectedProject && (<LabPopup
            project={selectedProject}
            onClose={handleClosePopup}
        />)}

    </section>);
};

export default Lab;