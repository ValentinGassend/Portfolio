import React, {useEffect, useState, useRef} from "react";
import SvgManager from "../../../../managers/SvgManager.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";
import {IsMobile} from "../../../../utils/utils.jsx";
import { forceLCPcandidate } from "../../../../utils/webVitals.js";

// Import différé de GSAP pour ne pas bloquer le thread principal
const gsapPromise = import('gsap').then(module => module.default);

const Landing = () => {
    const colors = [ColorManager.$color_accent1, ColorManager.$color_accent2, ColorManager.$color_accent3]; // Liste de couleurs pour le logo
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    // Référence à l'élément qui devrait être le LCP
    const logoContainerRef = useRef(null);

    // Référence pour le contenu SVG lui-même
    const svgContentRef = useRef(null);

    // Configuration de l'élément LCP
    useEffect(() => {
        // Force l'élément à être reconnu comme LCP
        if (logoContainerRef.current) {
            forceLCPcandidate(logoContainerRef.current);

            // Ajouter explicitement les attributs pour forcer le LCP
            logoContainerRef.current.setAttribute('data-testid', 'lcp-element');

            // Ajouter du texte caché pour aider les moteurs de recherche
            const hiddenText = document.createElement('h1');
            hiddenText.className = 'visually-hidden';
            hiddenText.innerText = 'Valentin Gassend - Développeur Front-End Créatif';
            hiddenText.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';

            logoContainerRef.current.appendChild(hiddenText);
        }

        // Précharger les SVG de manière prioritaire
        const preloadSVGs = () => {
            const svgUrls = ['/svg/full_logo.svg', '/svg/n_element.svg'];

            svgUrls.forEach(url => {
                fetch(url, { priority: 'high', cache: 'force-cache' })
                    .then(response => response.text())
                    .then(svgContent => {
                        // Stocker le contenu SVG pour une utilisation immédiate si nécessaire
                        if (url.includes('full_logo') && svgContentRef.current) {
                            svgContentRef.current.innerHTML = svgContent;
                        }

                    })
                    .catch(error => console.error(`Erreur préchargement SVG: ${url}`, error));
            });
        };

        // Exécuter immédiatement
        preloadSVGs();
    }, []);

    // Charger GSAP de manière différée
    useEffect(() => {
        const loadGsap = () => {
            gsapPromise.then(gsap => {

                setGsapLoaded(true);
                window._gsap = gsap; // Stocker pour une utilisation ultérieure
            });
        };

        // Charger GSAP après que le contenu principal soit affiché
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadGsap, { timeout: 2000 });
        } else {
            // Fallback
            setTimeout(loadGsap, 1000);
        }
    }, []);

    // Configurer l'animation après le chargement de GSAP
    useEffect(() => {
        if (!gsapLoaded) return;

        const gsap = window._gsap;
        if (!gsap) return;

        const handleClick = () => {
            // Passage à la couleur suivante dans la liste de couleurs
            const nextColorIndex = (currentColorIndex + 1) % colors.length;
            setCurrentColorIndex(nextColorIndex);

            // Animation
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
                    repeat: 0
                }
            );
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [gsapLoaded, currentColorIndex, colors]);

    return (<section className={"Landing Center After"}>
        {/* BackgroundLine chargé de manière conditionnelle */}
        {IsMobile ?
            <BackgroundLine colorName={ColorManager.$color_neutral2} verticalCount={2} horizontalCount={2}/> :
            <BackgroundLine colorName={ColorManager.$color_neutral2}/>}

        {/* Fond avec élément n */}
        <div className={"Landing-background"}>
            <SvgManager name={"n_element"} parentClassName={"Landing-background"}/>
        </div>

        {/* Conteneur principal du logo - optimisé pour LCP */}
        <div
            ref={logoContainerRef}
            className={`Landing-container Center`}
            style={{'--logo-color': `${colors[currentColorIndex]}`}}
            id="lcp-element"
        >
            {/* Référence pour stocker le contenu SVG préchargé */}
            <div
                ref={svgContentRef}
                className="svg-content-preloaded"
                style={{ display: 'none' }}
            ></div>

            {/* Utiliser SvgManager avec priorité élevée */}
            <SvgManager
                name={"full_logo"}
                parentClassName={"Landing-container"}
                fetchpriority="high"
                loading="eager"
                importance="high"
            />
        </div>
    </section>)
}

export default Landing;