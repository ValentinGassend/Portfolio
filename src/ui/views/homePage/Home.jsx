import React, {useEffect, useRef} from "react";
import {Helmet} from "react-helmet";

// Import différé des composants non-critiques
const Landing = React.lazy(() => import("./Landing/Landing.jsx"));
// Préserver l'import synchrone pour le composant critique de la landing
// Ce composant contient l'élément visuel principal (LCP)

// Imports différés des composants secondaires qui peuvent être chargés après
const About = React.lazy(() => import("./About/About.jsx"));
const ProjectList = React.lazy(() => import("./ProjectList/ProjectList.jsx"));
const Contact = React.lazy(() => import("./Contact/Contact.jsx"));
const Overlay = React.lazy(() => import("../../components/Overlay.jsx"));

// Composant de fallback pour le chargement progressif
const LoadingPlaceholder = () => (
    <div className="loading-placeholder" aria-hidden="true"></div>
);

const Home = () => {
    // Référence pour identifier et optimiser l'élément LCP
    const lcpElementRef = useRef(null);

    useEffect(() => {
        // Marquer le début du rendu pour mesurer les performances
        if (window.performance && window.performance.mark) {
            window.performance.mark('home-component-mounted');
        }

        // Observer l'élément LCP pour vérifier son timing de chargement
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP candidat:', lastEntry.element);
                console.log('LCP timing:', lastEntry.startTime);

                // Si on a une référence à notre élément, vérifier s'il correspond au LCP
                if (lcpElementRef.current && lastEntry.element) {
                    const isOurLCPElement = lcpElementRef.current.contains(lastEntry.element);
                    console.log('Notre élément est le LCP:', isOurLCPElement);
                }
            });

            lcpObserver.observe({type: 'largest-contentful-paint', buffered: true});

            return () => {
                lcpObserver.disconnect();
            };
        }
    }, []);

    // Précharger l'image principale en tant qu'élément LCP
    useEffect(() => {
        // Précharger l'image principale pour optimiser le LCP
        const preloadLCPImage = new Image();
        preloadLCPImage.src = '/img/landing.png'; // Chemin vers votre image principale
        preloadLCPImage.fetchPriority = 'high';

        // Écouter l'événement de chargement pour marquer la fin
        preloadLCPImage.onload = () => {
            if (window.performance && window.performance.mark) {
                window.performance.mark('lcp-image-loaded');
                window.performance.measure('lcp-image-load-time', 'home-component-mounted', 'lcp-image-loaded');
            }
        };
    }, []);

    return (
        <main className="Home">
            <Helmet>
                <title>Valentin Gassend | Développeur créatif </title>
                <meta name="description"
                      content="Je m'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance basé à Aix-Les-Bains."/>
                <link rel="canonical" href="https://valentingassend.com/"/>

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://valentingassend.com/"/>
                <meta property="og:title" content="Portfolio - Valentin Gassend | Développeur front-end créatif"/>
                <meta property="og:description"
                      content="Je m'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance basé à Aix-Les-Bains."/>
                <meta property="og:image" content="https://www.valentingassend.com/img/landing.png"/>

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:url" content="https://valentingassend.com/"/>
                <meta name="twitter:title" content="Portfolio - Valentin Gassend | Développeur front-end créatif"/>
                <meta name="twitter:description"
                      content="Je m'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance basé à Aix-Les-Bains."/>
                <meta name="twitter:image" content="https://www.valentingassend.com/img/landing.png"/>
            </Helmet>

            {/* Élément LCP optimisé - ajouté directement dans le composant Home */}
            {/*<div ref={lcpElementRef} className="lcp-container" id="lcp-element">*/}
            {/*    <img*/}
            {/*        src="/img/landing.png"*/}
            {/*        alt="Valentin Gassend - Développeur front-end créatif"*/}
            {/*        className="lcp-image"*/}
            {/*        width="1200"*/}
            {/*        height="800"*/}
            {/*        fetchpriority="high"*/}
            {/*        loading="eager"*/}
            {/*        decoding="async"*/}
            {/*    />*/}
            {/*    <h1 className="hero-title">Valentin Gassend</h1>*/}
            {/*    <h2 className="hero-subtitle">Développeur Front-End Créatif</h2>*/}
            {/*</div>*/}

            <header>
                <React.Suspense fallback={<LoadingPlaceholder/>}>
                    <Overlay/>
                </React.Suspense>
            </header>

            {/* Le composant Landing sera chargé après l'élément LCP */}
            <React.Suspense fallback={<LoadingPlaceholder/>}>
                <Landing/>
            </React.Suspense>

            {/* Utiliser IntersectionObserver pour charger les composants quand ils sont proches du viewport */}
            <React.Suspense fallback={<LoadingPlaceholder/>}>
                <About/>
            </React.Suspense>

            <React.Suspense fallback={<LoadingPlaceholder/>}>
                <ProjectList/>
            </React.Suspense>

            <footer>
                <React.Suspense fallback={<LoadingPlaceholder/>}>
                    <Contact/>
                </React.Suspense>
            </footer>
        </main>
    );
};

export default Home;