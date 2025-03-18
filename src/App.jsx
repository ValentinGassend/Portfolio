import {lazy, Suspense, useEffect, useState} from 'react'
// Importer GSAP avec un chargement dynamique
const gsap = window.gsap || import('gsap').then(m => m.default);

// Chargement seulement lorsque nécessaires
const ScrollSmoother = import('gsap/ScrollSmoother').then(m => m.ScrollSmoother);
const ScrollTrigger = import('gsap/ScrollTrigger').then(m => m.ScrollTrigger);
const CustomEase = import('gsap/CustomEase').then(m => m.CustomEase);

import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
// Chargement différé de Lenis
const Lenis = lazy(() => import('lenis'));

import {WebglCanvasRemover} from "./utils/utils.jsx";
import {Helmet} from "react-helmet";

// Prefetch Home en priorité, puis les autres pages avec un délai
const Home = lazy(() => import('./ui/views/homePage/Home.jsx'));
const Projects = lazy(() => import('./ui/views/projectsPage/projects.jsx'));
const AboutPage = lazy(() => import('./ui/views/aboutPage/aboutPage.jsx'));
const SingleProjectPage = lazy(() => import('./ui/views/singleProjectPage/singleProjectPage.jsx'));

// Component d'affichage pendant le chargement
const LoadingSpinner = () => (
    <div className="loading-spinner" aria-label="Chargement en cours">
        <div className="spinner"></div>
    </div>
);

// Composant pour gérer les métadonnées dynamiques
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

        // Définir l'élément LCP pour les mesures de performance
        if (path === "/") {
            // Trouver l'élément principal de la page d'accueil après rendu
            setTimeout(() => {
                const homeElement = document.querySelector('.home-hero-image, .home-main-content');
                if (homeElement) {
                    homeElement.setAttribute('elementtiming', 'LCP-element');
                    homeElement.setAttribute('fetchpriority', 'high');
                }
            }, 100);
        }
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

// Chargement des plugins GSAP de manière asynchrone
const initGSAP = async () => {
    if (typeof gsap.then === 'function') {
        // GSAP est une promesse, il faut l'attendre
        const gsapModule = await gsap;
        window.gsap = gsapModule;

        const ScrollTriggerModule = await ScrollTrigger;
        const ScrollSmootherModule = await ScrollSmoother;
        const CustomEaseModule = await CustomEase;

        gsapModule.registerPlugin(ScrollTriggerModule, ScrollSmootherModule, CustomEaseModule);
        CustomEaseModule.create("hop", ".235, .615, .185, .995");
    } else {
        // GSAP est déjà chargé (depuis CDN)
        const ScrollTriggerModule = await ScrollTrigger;
        const ScrollSmootherModule = await ScrollSmoother;
        const CustomEaseModule = await CustomEase;

        gsap.registerPlugin(ScrollTriggerModule, ScrollSmootherModule, CustomEaseModule);
        CustomEaseModule.create("hop", ".235, .615, .185, .995");
    }
};

function App() {
    // Récupérer l'état préchargé si disponible (pour le SEO avec les pages statiques)
    const preloadedState = window.__PRELOADED_STATE__;
    const [gsapInitialized, setGsapInitialized] = useState(false);

    useEffect(() => {
        WebglCanvasRemover();

        // Initialiser GSAP de manière asynchrone
        initGSAP().then(() => {
            setGsapInitialized(true);
        });
    }, []);

    // Configuration de Lenis une fois que GSAP est initialisé
    useEffect(() => {
        if (!gsapInitialized) return;

        // Charger Lenis de manière optimisée
        import('lenis').then((LenisModule) => {
            const Lenis = LenisModule.default;
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                wheelMultiplier: 0.8
            });

            lenis.on('scroll', (e) => {
                if (window.gsap && window.gsap.ScrollTrigger) {
                    window.gsap.ScrollTrigger.update();
                }
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

            return () => {
                // Cleanup lenis si nécessaire
                lenis.destroy();
            };
        });
    }, [gsapInitialized]);

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

            <BrowserRouter>
                {/* Handler SEO dynamique qui s'active après le premier rendu */}
                {!preloadedState && <SEOHandler />}

                <Suspense fallback={<LoadingSpinner/>}>
                    <Routes>
                        <Route path={"/"} element={<Home/>}/>
                        <Route path={"/projects"} element={<Projects/>}/>
                        <Route path={"/about"} element={<AboutPage/>}/>
                        <Route path={"/project/:id"} element={<SingleProjectPage/>}/>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )
}

export default App