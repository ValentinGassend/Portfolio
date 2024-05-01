import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {IsMobile} from "../../../../utils/utils.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";
import SvgManager from "../../../../managers/SvgManager.jsx";
import ScrollToPlugin from "gsap/ScrollToPlugin";

const AboutLanding = () => {


    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
    useEffect(() => {
        const targetElement = document.getElementsByClassName("AboutIntro")[0]
        if (targetElement) {
            const offset = targetElement.getBoundingClientRect().top + window.scrollY;
            gsap.to(".__AboutLandingSticky", {
                overwrite: true, duration: 1, scrollTrigger: {
                    trigger: ".__AboutLandingSticky",
                    start: "1px top",
                    end: "bottom top",
                    pin: ".__AboutLandingSticky",
                    markers: false,

                    onEnter: () => {
                        gsap.to(window, {
                            scrollTo: {
                                y: offset,
                                autoKill: false
                            },
                            duration: 1
                        });
                    },
                    onEnterBack: () => {
                        gsap.to(window, {
                            scrollTo: {
                                y: 0,
                                autoKill: false
                            },
                            duration: 1
                        });
                    }
                },
            });
        }

    }, []);


    return (

        <div className={"AboutLanding Before"}>
            {/*<BackgroundLine colorName={ColorManager.$color_neutral1} horizontalCount={6} verticalCount={3}/>*/}
            {IsMobile ?
                <BackgroundLine colorName={ColorManager.$color_neutral1} verticalCount={2} horizontalCount={4}/> :
                <BackgroundLine colorName={ColorManager.$color_neutral1}/>}
            <div className={"AboutLanding-container __AboutLandingSticky"}>

                <div className={"AboutLanding-container--item "}>

                    <h2 className={"AboutLanding-container--item---content Uppercase"}>Developpeur
                        frontend <b>passionne</b> en quete de defis creatifs.</h2>
                </div>
            </div>
        </div>);
};

export default AboutLanding;
