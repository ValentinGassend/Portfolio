import React, {useEffect} from "react";
import Overlay from "../../components/Overlay.jsx";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import AboutLanding from "./Landing/AboutLanding.jsx";
import AboutIntro from "./Intro/AboutIntro.jsx";
import AboutDetails from "./Details/AboutDetails.jsx";

const AboutPage = () => {


    gsap.registerPlugin(ScrollTrigger)
    useEffect(() => {

    }, []);


    return (<>

        <div className={`__ScrollSmooth`}>
            <section className={"About"}>
                <AboutLanding/>
                <AboutIntro/>
                <AboutDetails/>
            </section>
        </div>
    </>);
};

export default AboutPage;
