import {useLayoutEffect} from "react";

const IsMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const IsWidthLessThanOrEqualToHeight = () => {
    return window.innerWidth <= window.innerHeight;
};
const WebglCanvasRemover = () => {
    // Check if an element with the class `.home` exists
    useLayoutEffect(() => {
        if (!document.querySelector('.Home')) {
            // Select the element with the class `.webgl-canvas`
            const webglCanvas = document.querySelector('.webgl-canvas');

            // If the element exists, remove it from the DOM
            if (webglCanvas) {
                webglCanvas.remove();
            }
        }
    }, []);


}
export {IsMobile, IsWidthLessThanOrEqualToHeight, WebglCanvasRemover};