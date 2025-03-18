import {lazy, Suspense, useEffect, useState} from 'react'
import gsap from "gsap";
import {ScrollSmoother} from "gsap/ScrollSmoother";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import Lenis from "lenis";
import {WebglCanvasRemover} from "./utils/utils.jsx";
import {Helmet} from "react-helmet";

const Home = lazy(() => import('./ui/views/homePage/Home.jsx'));
const Projects = lazy(() => import('./ui/views/projectsPage/projects.jsx'));
const AboutPage = lazy(() => import('./ui/views/aboutPage/aboutPage.jsx'));
const SingleProjectPage = lazy(() => import('./ui/views/singleProjectPage/singleProjectPage.jsx'));

const LoadingSpinner = () => (
    <div className="loading-spinner">
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

    WebglCanvasRemover()
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, CustomEase);
    CustomEase.create("hop", ".235, .615, .185, .995")

    useEffect(() => {
        const lenis = new Lenis()
        lenis.on('scroll', (e) => {
            ScrollTrigger.update() // pour resynchroniser le scrolltrigger de gsap
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
        return () => {
            // Nettoyage si nécessaire
        };
    }, []);

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