// Modification de App.jsx pour optimiser le LCP et réduire le TBT

import React, {lazy, Suspense, useEffect, useState} from 'react'
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import {Helmet} from "react-helmet";
// N'importez pas GSAP et les plugins ici pour réduire le JS initial
// import gsap from "gsap";
// import {ScrollSmoother} from "gsap/ScrollSmoother";
// import {ScrollTrigger} from "gsap/ScrollTrigger";
// import CustomEase from "gsap/CustomEase";
// import Lenis from "lenis";

import {WebglCanvasRemover} from "./utils/utils.jsx";
import Lab from "./ui/views/labPage/Lab.jsx";

// Utiliser React.lazy pour les composants à charger en différé
const Home = lazy(() => import('./ui/views/homePage/Home.jsx'));
const Projects = lazy(() => import('./ui/views/projectsPage/projects.jsx'));
const AboutPage = lazy(() => import('./ui/views/aboutPage/aboutPage.jsx'));
const SingleProjectPage = lazy(() => import('./ui/views/singleProjectPage/singleProjectPage.jsx'));

// Composant de skeleton plus élaboré pour améliorer la perception de vitesse
const LoadingFallback = () => (
    <div className="loading-skeleton" aria-label="Chargement du contenu">
        <div className="skeleton-header"></div>
        <div className="skeleton-hero">
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle"></div>
        </div>
        <div className="skeleton-content">
            <div className="skeleton-block"></div>
            <div className="skeleton-block"></div>
        </div>
    </div>
);

// Composant pour gérer les métriques de performance
const PerformanceMetrics = () => {
    useEffect(() => {
        // Importer la bibliothèque web-vitals uniquement après le chargement initial
        if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
                const { onCLS, onFID, onLCP } = await import('web-vitals');

                function sendToAnalytics({name, delta, value, id}) {
                    // Envoyer les métriques à votre service d'analytics
                    // console.log(name, delta, value, id);
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: 'web-vitals',
                        eventCategory: 'Web Vitals',
                        eventAction: name,
                        eventValue: Math.round(value),
                        eventLabel: id,
                        nonInteraction: true,
                    });
                }

                onCLS(sendToAnalytics);
                onFID(sendToAnalytics);
                onLCP(sendToAnalytics);
            });
        }
    }, []);

    return null; // Ce composant ne rend rien visuellement
};

// Composant pour charger GSAP et Lenis progressivement
const ProgressiveEnhancement = () => {
    useEffect(() => {
        // Marquer la fin du chargement initial
        if ('performance' in window && 'mark' in performance) {
            performance.mark('app-loaded');
        }

        // Charger GSAP et les animations de manière progressive
        const loadAnimationLibraries = async () => {
            try {
                // Chargement dynamique de GSAP
                const gsapModule = await import('gsap');
                const gsap = gsapModule.default;

                // Chargement des plugins GSAP uniquement lorsqu'ils sont nécessaires
                const { ScrollTrigger } = await import('gsap/ScrollTrigger');
                const { ScrollSmoother } = await import('gsap/ScrollSmoother');
                const { CustomEase } = await import('gsap/CustomEase');

                // Enregistrer les plugins
                gsap.registerPlugin(ScrollTrigger, ScrollSmoother, CustomEase);
                CustomEase.create("hop", ".235, .615, .185, .995");

                // Initialiser Lenis après que GSAP soit chargé
                const { default: Lenis } = await import('lenis');
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    orientation: 'vertical',
                    smoothTouch: false
                });

                lenis.on('scroll', (e) => {
                    ScrollTrigger.update();
                });

                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }

                requestAnimationFrame(raf);

                // Marquer la fin du chargement des animations
                if ('performance' in window && 'mark' in performance) {
                    performance.mark('animations-loaded');
                    performance.measure('animations-load-time', 'app-loaded', 'animations-loaded');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des bibliothèques d\'animation:', error);
            }
        };

        // Utiliser requestIdleCallback pour charger les animations
        // seulement quand le navigateur est inactif
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                loadAnimationLibraries();
            }, { timeout: 2000 }); // Timeout pour s'assurer que ça se charge même sur les appareils lents
        } else {
            // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
            setTimeout(loadAnimationLibraries, 1000);
        }

        return () => {
            // Nettoyage si nécessaire
        };
    }, []);

    return null; // Ce composant ne rend rien visuellement
};

// SEO Handler component (existant, avec légères optimisations)
const SEOHandler = () => {
    const location = useLocation();
    const [seo, setSeo] = useState({
        title: "DEVELOPPEUR CREATIF - VALENTIN GASSEND",
        description: "Je m'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance",
        url: "https://valentingassend.com"
    });

    useEffect(() => {
        // Mettre à jour les métadonnées en fonction du chemin actuel
        const path = location.pathname;
        let newSeo = {...seo};

        // Logique existante...
        if (path === "/about") {
            newSeo = {
                title: "À Propos - Valentin Gassend",
                description: "Découvrez qui je suis, mon parcours et mes compétences en tant que développeur front-end créatif.",
                url: "https://valentingassend.com/about"
            };
        } else if (path === "/projects") {
            newSeo = {
                title: "Projets - Valentin Gassend",
                description: "Découvrez mes projets de développement web créatif, mes réalisations et mon portfolio.",
                url: "https://valentingassend.com/projects"
            };
        } else if (path.startsWith("/project/")) {
            const id = path.split("/").pop();
            newSeo = {
                title: `Projet ${id} - Valentin Gassend`,
                description: `Détails du projet ${id} - Développement front-end créatif par Valentin Gassend`,
                url: `https://valentingassend.com/project/${id}`
            };
        }

        setSeo(newSeo);
    }, [location.pathname]);

    return (
        <Helmet>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta name="author" content="Valentin Gassend"/>
            <meta name="robots" content="index, follow"/>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description}/>
            <link rel="canonical" href={seo.url}/>

            {/* Open Graph tags pour les réseaux sociaux */}
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:url" content={seo.url} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="https://valentingassend.com/img/landing.png" />
        </Helmet>
    );
};

function App() {
    // Récupérer l'état préchargé si disponible (pour le SEO avec les pages statiques)
    const preloadedState = window.__PRELOADED_STATE__;

    // Retirer le canvas WebGL pour économiser des ressources
    WebglCanvasRemover();

    return (
        <>
            {/* Métadonnées pré-rendues pour le SEO statique */}
            {preloadedState && (
                <Helmet>
                    <title>{preloadedState.title}</title>
                    <meta name="description" content={preloadedState.description} />
                    <link rel="canonical" href={`https://valentingassend.com${preloadedState.route}`} />
                </Helmet>
            )}

            {/* Composant pour charger les animations progressivement */}
            <ProgressiveEnhancement />

            {/* Composant pour mesurer les métriques de performance */}
            <PerformanceMetrics />

            <BrowserRouter>
                {/* Handler SEO dynamique qui s'active après le premier rendu */}
                {!preloadedState && <SEOHandler />}

                <Suspense fallback={<LoadingFallback/>}>
                    <Routes>
                        <Route path={"/"} element={<Home/>}/>
                        <Route path={"/projects"} element={<Projects/>}/>
                        <Route path={"/about"} element={<AboutPage/>}/>
                        <Route path={"/lab"} element={<Lab/>}/>
                        <Route path={"/project/:id"} element={<SingleProjectPage/>}/>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )
}

export default App