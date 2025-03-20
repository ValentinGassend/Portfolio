import React from 'react';
import Overlay from "../../components/Overlay.jsx";
import {COLOR_PALETTE} from './constants';
import {useCanvasSetup} from './canvas/useCanvasSetup.js';
import {useCanvasAnimation} from './canvas/useCanvasAnimation.js';

const Lab = () => {
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
        prevOffsetXRef,
        prevOffsetYRef
    } = useCanvasSetup();

    // Use animation hook to handle the interactive canvas
    const {
        images,
        isDragging,
        debugInfo
    } = useCanvasAnimation({
        canvasRef,
        offscreenCanvasRef,
        animationFrameRef,
        projectImageRef,
        projectImageLoaded,
        backgroundLoaded,
        setImagesLoaded,
        setTotalImages,
        prevOffsetXRef,
        prevOffsetYRef
    });

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
                    background: COLOR_PALETTE.neutral1 // Background color
                }}
            />
            <Overlay lab={true}/>
        </section>
    );
};

export default Lab;