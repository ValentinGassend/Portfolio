import React, {useState, useCallback, useRef, useEffect} from 'react';
import Overlay from "../../components/Overlay.jsx";
import {COLOR_PALETTE} from './constants';
import {useCanvasSetup} from './canvas/useCanvasSetup.js';
import {useCanvasAnimation} from './canvas/useCanvasAnimation.js';
import LabPopup from './LabPopup.jsx';

const Lab = () => {
    // State to track the currently selected project
    const [selectedProject, setSelectedProject] = useState(null);

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

    // Use animation hook to handle the interactive canvas
    const {
        images, isDragging, debugInfo, findClickedProject, setDragHandlers
    } = useCanvasAnimation({
        canvasRef, offscreenCanvasRef, animationFrameRef, projectImageRef, projectImagesRef, // Pass the projectImagesRef to the animation hook
        projectImageLoaded, backgroundLoaded, setImagesLoaded, setTotalImages, prevOffsetXRef, prevOffsetYRef
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

    const handleMouseUp = useCallback((e) => {
        // First, call the drag end handler
        setDragHandlers.mouseUp(e);

        // Only consider this a click if the mouse hasn't moved significantly
        if (!hasDraggedRef.current) {
            console.log("Detecting click at:", e.clientX, e.clientY);
            const project = findClickedProject(e.clientX, e.clientY);
            if (project) {
                console.log("Project clicked:", project.name || `Project ${project.index + 1}`);
                setSelectedProject(project);
            }
        } else {
            console.log("Drag ended - not opening project");
        }

        // Reset cursor after drag
        if (canvasRef.current) {
            const project = findClickedProject(e.clientX, e.clientY);
            if (project) {
                canvasRef.current.style.cursor = 'pointer';
            } else {
                canvasRef.current.style.cursor = 'grab';
            }
        }
    }, [setDragHandlers, findClickedProject, canvasRef]);

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

            // If it wasn't a drag, treat as click
            if (!hasDraggedRef.current) {
                const project = findClickedProject(touch.clientX, touch.clientY);
                if (project) {
                    console.log("Project clicked from touch:", project.name || `Project ${project.index + 1}`);
                    setSelectedProject(project);
                }
            } else {
                console.log("Touch drag ended - not opening project");
            }
        }
    }, [setDragHandlers, findClickedProject]);

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

            console.log("Hover state changed:", isOverProject ? "Over project" : "Not over project");
        }
    }, [findClickedProject, isHoveringProject]);

    // Gestionnaire spécifique au canvas pour assurer une détection correcte des survols de projets
    const handleCanvasMouseMove = useCallback((e) => {
        // Vérifier simplement si nous survolons un projet
        checkCursorOverProject(e);

        // Si nous sommes en train de faire glisser, appliquer une autre classe
        if (isDragging) {
            document.body.classList.add('cursor-grabbing');
        } else {
            document.body.classList.remove('cursor-grabbing');
        }
    }, [checkCursorOverProject, isDragging]);


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

            body:not(.cursor-pointer):not(.cursor-grabbing) .Lab canvas {
                cursor: grab !important;
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
        <Overlay lab={true}/>

        {/* Project Popup */}
        {selectedProject && (<LabPopup
            project={selectedProject}
            onClose={handleClosePopup}
        />)}
    </section>);
};

export default Lab;