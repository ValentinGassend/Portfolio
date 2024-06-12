import React, {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from "./ui/views/homePage/Home.jsx";
import Menu from "./ui/components/menu/Menu.jsx";
import gsap from "gsap";
import {ScrollSmoother} from "gsap/ScrollSmoother";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import {BrowserRouter, createBrowserRouter, Route, Router, RouterProvider, Routes, useLocation} from "react-router-dom";
import Projects from "./ui/views/projectsPage/projects.jsx";
import About from "./ui/views/aboutPage/aboutPage.jsx";
import AboutPage from "./ui/views/aboutPage/aboutPage.jsx";
import SingleProjectPage from "./ui/views/singleProjectPage/singleProjectPage.jsx";
import Lenis from "lenis";
import Functionality3d from "./ui/views/fonctionality/Functionality3d.jsx";

function App() {
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
                    <Route path={"/func3d"} element={<Functionality3d/>}/>
                    <Route path={"/project/:id"}  element={<SingleProjectPage/>}/>
                </Routes>
            </BrowserRouter>
    </>)
}

export default App
