import {lazy, Suspense, useEffect} from 'react'
// import Home from "./ui/views/homePage/Home.jsx";
import gsap from "gsap";
import {ScrollSmoother} from "gsap/ScrollSmoother";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import {BrowserRouter, Route, Routes} from "react-router-dom";
// import Projects from "./ui/views/projectsPage/projects.jsx";
// import AboutPage from "./ui/views/aboutPage/aboutPage.jsx";
// import SingleProjectPage from "./ui/views/singleProjectPage/singleProjectPage.jsx";
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

function App() {

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
            <Helmet>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="author" content="Valentin Gassend"/>
                <meta name="robots" content="index, follow"/>
                <title>DEVELOPPEUR CREATIF - VALENTIN GASSEND</title>
                <meta name="description"
                      content="Je m'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance"/>
                <link rel="canonical" href="https://valentingassend.com"/>
            </Helmet>

            <BrowserRouter>
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
