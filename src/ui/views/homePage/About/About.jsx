import React, {useEffect, useLayoutEffect} from "react";
import SvgManager from "../../../../managers/SvgManager.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {IsMobile} from "../../../../utils/utils.jsx";

const About = () => {
    gsap.registerPlugin(ScrollTrigger);

    useEffect(() => {
        gsap.to(".__AboutSticky", {
            immediateRender: true, overwrite: true, opacity: 0.06, filter: "blur(8px)",
            scrollTrigger: {
                trigger: ".__AboutSticky",
                scrub: true,
                start: "top top",
                end: "bottom top",
                pin: ".__AboutSticky",
            },
        });
        gsap.to(".__AboutToProjectSticky", {
            immediateRender: true, overwrite: true,
            scrollTrigger: {
                trigger: ".__AboutToProjectSticky",
                scrub: true,
                start: "top top",
                end: "bottom top",
                pin: ".__AboutToProjectSticky",
            },
        });


    }, []);

    return (<>
        <section className={"About Before After"}>
            {/*<BackgroundLine colorName={ColorManager.$color_neutral1} horizontalCount={6} verticalCount={3}/>*/}
            {IsMobile ?
                <BackgroundLine colorName={ColorManager.$color_neutral1} verticalCount={2} horizontalCount={4}/>
                :
                <BackgroundLine colorName={ColorManager.$color_neutral1}/>
            }
            <div className={"About-container"}>
                <div className={"About-container--item __AboutSticky"}>
                    <h2 className={"About-container--item---content Uppercase"}>Creative</h2>
                    <h2 className={"About-container--item---content Uppercase Before After"}>Web</h2>
                    <h2 className={"About-container--item---content Uppercase"}>Developer</h2>
                </div>

                <div className={"About-container--item __AboutToProjectSticky"}>
                    <h2 className={"About-container--item---content Uppercase TxtCenter"}>Figma stroke plugin frame
                        <b>editor</b> overflow horizontal arrow.</h2>
                </div>
            </div>
        </section>
    </>)
}
export default About