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

function App() {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, CustomEase);
    CustomEase.create("hop", ".235, .615, .185, .995")
    useEffect(() => {
        if (document.getElementsByClassName("__ScrollSmooth")[0]) {

            ScrollSmoother.create({
                content: ".__ScrollSmooth", smooth: 0.5, effects: true, speed: 1.2, ease: "hop"
            });
        }

    }, []);
    return (<>
        <Menu/>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/projects"} element={<Projects/>}/>
                    <Route path={"/about"} element={<AboutPage/>}/>
                </Routes>
            </BrowserRouter>
    </>)
}

export default App
