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
    const lastCursorPosRef = useRef({x: 0, y: 0}); // Track last cursor position for hover checks

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
        images,
        isDragging,
        debugInfo,
        findClickedProject,
        setDragHandlers,
        updateImagesLayout,
        isTransitioning,
        forceUpdateImages
    } = useCanvasAnimation({
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
        // Always update last cursor position for hover detection
        lastCursorPosRef.current = {x: e.clientX, y: e.clientY};

        if (isDragging) {
            // Check if we've moved enough to be considered a drag
            const deltaX = Math.abs(e.clientX - startPosRef.current.x);
            const deltaY = Math.abs(e.clientY - startPosRef.current.y);

            if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
                hasDraggedRef.current = true;
            }

            // Call the drag handler
            setDragHandlers.mouseMove(e);
        }
    }, [isDragging, setDragHandlers]);

    // Set up touch handlers the same way
    const handleTouchStart = useCallback((e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            hasDraggedRef.current = false;
            startPosRef.current = {x: touch.clientX, y: touch.clientY};
            lastCursorPosRef.current = {x: touch.clientX, y: touch.clientY}; // Update cursor position

            // Call the original handler with touch coords
            setDragHandlers.mouseDown({clientX: touch.clientX, clientY: touch.clientY});
        }
    }, [setDragHandlers]);

    const handleTouchMove = useCallback((e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];

            // Update last cursor position for hover detection
            lastCursorPosRef.current = {x: touch.clientX, y: touch.clientY};

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

    // Simplifier la fonction checkCursorOverProject pour la rendre plus robuste
    const checkCursorOverProject = useCallback((e) => {
        if (!e || !e.clientX || !e.clientY) return; // Nécessite un événement valide

        // Mettre à jour la dernière position connue
        lastCursorPosRef.current = {x: e.clientX, y: e.clientY};

        // Utiliser findClickedProject pour vérifier si le curseur est sur un projet
        const project = findClickedProject(e.clientX, e.clientY);
        const isOverProject = !!project;

        // Mettre à jour l'état de survol s'il a changé
        if (isOverProject !== isHoveringProject) {
            setIsHoveringProject(isOverProject);

            // Appliquer la classe CSS pour le style de curseur
            if (isOverProject) {
                document.body.classList.add('cursor-pointer');
            } else {
                document.body.classList.remove('cursor-pointer');
            }
        }
    }, [findClickedProject, isHoveringProject]);

    // Handle canvas mouse movement with enhanced hover detection
    const handleCanvasMouseMove = useCallback((e) => {
        // Update the cursor position and check for project hover
        checkCursorOverProject(e);

        // Apply different cursor classes based on mode and drag state
        if (isDragging && !gridLayoutActive) {
            document.body.classList.add('cursor-grabbing');
        } else {
            document.body.classList.remove('cursor-grabbing');
        }
    }, [checkCursorOverProject, isDragging, gridLayoutActive]);

    // Expose preview references globally to allow hover detection to access them
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Expose the correct offset references for hover detection to use
            window.__prevOffsetXRef = prevOffsetXRef.current;
            window.__prevOffsetYRef = prevOffsetYRef.current;

            // Update these values whenever they change
            const intervalId = setInterval(() => {
                window.__prevOffsetXRef = prevOffsetXRef.current;
                window.__prevOffsetYRef = prevOffsetYRef.current;
            }, 50); // Update frequently enough to stay in sync

            return () => {
                clearInterval(intervalId);
                // Clean up
                window.__prevOffsetXRef = undefined;
                window.__prevOffsetYRef = undefined;
            };
        }
    }, [prevOffsetXRef, prevOffsetYRef]);

    // Set grid mode class on body - garder cet effet
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

    // Update images layout when grid mode changes - conserver cet effet également
    useEffect(() => {
        if (images.length > 0 && updateImagesLayout && !isTransitioning) {
            updateImagesLayout(gridLayoutActive);
        }
    }, [gridLayoutActive, images.length, updateImagesLayout, isTransitioning]);

    // Re-run hover detection after transitions complete - solution plus robuste
    useEffect(() => {
        if (!isTransitioning && lastCursorPosRef.current.x && lastCursorPosRef.current.y) {
            // Short delay to allow the canvas to stabilize
            const timeoutId = setTimeout(() => {
                // Simuler un événement de souris avec les dernières coordonnées connues
                const fakeEvent = {
                    clientX: lastCursorPosRef.current.x,
                    clientY: lastCursorPosRef.current.y
                };
                handleCanvasMouseMove(fakeEvent);
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [isTransitioning, handleCanvasMouseMove]);

    // Force periodic hover check in free mode to keep cursor accurately updated
    useEffect(() => {
        if (!gridLayoutActive && !isTransitioning && lastCursorPosRef.current.x && lastCursorPosRef.current.y) {
            const intervalId = setInterval(() => {
                // Simuler un événement de souris avec les dernières coordonnées
                const fakeEvent = {
                    clientX: lastCursorPosRef.current.x,
                    clientY: lastCursorPosRef.current.y
                };
                // Appliquer la vérification complète du hover
                handleCanvasMouseMove(fakeEvent);
            }, 100);

            return () => clearInterval(intervalId);
        }
    }, [gridLayoutActive, isTransitioning, handleCanvasMouseMove]);

    // Attach all event listeners to the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set initial cursor style
        canvas.style.cursor = 'grab';

        // Split responsibilities:
        // 1. Listen for mouse events on canvas for cursor style
        canvas.addEventListener('mousemove', handleCanvasMouseMove);

        // 2. Listen for mouse events on window for dragging
        window.addEventListener('mousemove', handleMouseMove);

        // Other event listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Touch events
        canvas.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove, {passive: false});
        window.addEventListener('touchend', handleTouchEnd);

        // Cleanup on unmount
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

    return (
        <section className={"Lab"}>
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
            {selectedProject && (
                <LabPopup
                    project={selectedProject}
                    onClose={handleClosePopup}
                />
            )}
        </section>
    );
};

export default Lab;