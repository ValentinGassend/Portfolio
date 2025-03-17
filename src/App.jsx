import React, {useEffect} from 'react'
import Home from "./ui/views/homePage/Home.jsx";
import gsap from "gsap";
import {ScrollSmoother} from "gsap/ScrollSmoother";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Projects from "./ui/views/projectsPage/projects.jsx";
import AboutPage from "./ui/views/aboutPage/aboutPage.jsx";
import SingleProjectPage from "./ui/views/singleProjectPage/singleProjectPage.jsx";
import Lenis from "lenis";
import {WebglCanvasRemover} from "./utils/utils.jsx";
import {Helmet} from "react-helmet";

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

    }, []);
    return (
        <>
            <Helmet>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="author" content="Valentin Gassend" />
                <meta name="robots" content="index, follow" />
                <title>DEVELOPPEUR CREATIF - VALENTIN GASSEND</title>
                <meta name="description" content="Je m'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance" />
                <link rel="canonical" href="https://valentingassend.com" />
            </Helmet>

            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/projects"} element={<Projects/>}/>
                    <Route path={"/about"} element={<AboutPage/>}/>
                    <Route path={"/project/:id"} element={<SingleProjectPage/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
