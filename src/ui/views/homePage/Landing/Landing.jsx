import React, {useEffect, useState} from "react";
import SvgManager from "../../../../managers/SvgManager.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";
import {IsMobile} from "../../../../utils/utils.jsx";
import gsap from "gsap";
const Landing = () => {
    const colors = [ColorManager.$color_accent1, ColorManager.$color_accent2, ColorManager.$color_accent3]; // Liste de couleurs pour le logo
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    useEffect(() => {
        const handleClick = () => {
            // Passage à la couleur suivante dans la liste de couleurs
            const nextColorIndex = (currentColorIndex + 1) % colors.length;
            setCurrentColorIndex(nextColorIndex);
            colorTriggered()// Déclenche l'animation au clic
        };
        function colorTriggered() {
            gsap.fromTo(
                ".Landing-container",
                {
                    scale: 1,
                    rotation: 0
                },
                {
                    ease: "power2.inOut",
                    keyframes: [
                        { scale: 1, rotation: 0, duration: 0.125 },
                        { scale: 1.05, rotation: 2.5, duration: 0.125 },
                        { scale: 1.1, rotation: 0, duration: 0.125 },
                        { scale: 1.05, rotation: -2.5, duration: 0.125 },
                        { scale: 1, rotation: 0, duration: 0.125 }
                    ],
                    repeat: 0 // Nécessaire pour que l'animation ne se répète pas (0% à 100%)
                }
            );
        }
        // Ajout d'un écouteur d'événements pour détecter les clics sur la section Landing
        document.addEventListener("click", handleClick);

        // Nettoyage de l'écouteur d'événements lors du démontage du composant
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [currentColorIndex, colors]);
    return (<section className={"Landing Center After"}>
        {IsMobile ?
            <BackgroundLine colorName={ColorManager.$color_neutral2} verticalCount={2} horizontalCount={2}/> :
            <BackgroundLine colorName={ColorManager.$color_neutral2}/>}
        <div className={"Landing-background"}>
            <SvgManager name={"n_element"} parentClassName={"Landing-background"}/>
        </div>
        <div className={`Landing-container Center`}
             style={{'--logo-color': `${colors[currentColorIndex]}`}}>
            <SvgManager name={"full_logo"} parentClassName={"Landing-container"}/>
        </div>
    </section>)
}
export default Landing