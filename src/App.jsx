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
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/projects"} element={<Projects/>}/>
                <Route path={"/about"} element={<AboutPage/>}/>
                <Route path={"/project/:id"} element={<SingleProjectPage/>}/>
            </Routes>
        </BrowserRouter>
    </>)
}

export default App
