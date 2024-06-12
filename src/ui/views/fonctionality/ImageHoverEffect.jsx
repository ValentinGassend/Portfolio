import React, {useEffect, useRef} from "react";
import Effect from "./Effect.jsx";

function ImageHoverEffect() {
    const containerRef = useRef(null);
    const itemsWrapperRef = useRef(null);

    useEffect(() => {
        const effect = new Effect(containerRef.current, itemsWrapperRef.current);
        return () => {
            window.removeEventListener('resize', effect.onWindowResize);
        };
    }, []);

    return (
        <>
            <div ref={containerRef}  className={`ProjectListItem`} style={{position: 'relative', width: '100%'}}>

                <div ref={itemsWrapperRef}>

                    <a ref={containerRef} className="link" href="#">

                        <h1> maskBackgroundTexture image </h1>
                        <img src="/maskBackgroundTexture.webp" alt="Some image"/>
                    </a>
                    <a ref={itemsWrapperRef} className="link" href="#">
                        <h1> landing image </h1>
                        <img src="/img/landing.png" alt="Some image"/>
                    </a>
                </div>
            </div>
        </>
    );
}

export default ImageHoverEffect;