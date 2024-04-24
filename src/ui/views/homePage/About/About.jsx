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
        document.getElementsByClassName("__AboutCursorContainer")[0].addEventListener("mousemove", handleMouseMove)

        gsap.to(".__AboutSticky", {
            immediateRender: true, overwrite: true, opacity: 0.06, filter: "blur(8px)", scrollTrigger: {
                trigger: ".__AboutSticky", scrub: true, start: "top top", end: "bottom top", pin: ".__AboutSticky",
            },
        });
        gsap.to(".__AboutToProjectSticky", {
            immediateRender: true, overwrite: true, scrollTrigger: {
                trigger: ".__AboutToProjectSticky",
                scrub: true,
                start: "top top",
                end: "bottom top",
                pin: ".__AboutToProjectSticky",
            },
        });


    }, []);

    const handleMouseMove = (event) => {

        let cursor = document.getElementsByClassName("__AboutCursor")[0]
        const boundingRect = cursor.getBoundingClientRect();
        const elementRect = document.getElementsByClassName("__AboutCursorContainer")[0].getBoundingClientRect();

        let x;
        let y;
        console.log(event)
        console.log(boundingRect)
        console.log(elementRect)
        // if (elementRect.width - event.offsetX - (cursor.offsetWidth / 2) >= 0) {
        //     if ((((event.offsetX - 25) - cursor.offsetWidth / 2) >= 0)) {
        x = event.offsetX;
        // }

        // } else {
        //     x = elementRect.width - cursor.right - 25;


        // }
        y = event.offsetY;
        //
        // if (elementRect.height - event.offsetY - (cursor.offsetHeight / 2) >= 0) {
        //
        //
        //     if (((event.offsetY - 25) - cursor.offsetHeight / 2) >= 0) {
        //         y = event.offsetY;
        //     }
        // } else {
        //     y = elementRect.height - cursor.bottom - 25;
        //
        //
        // }
        // console.log(cursorClicked)
        gsap.to(cursor, {
            duration: 0.1, top: y + elementRect.top, left: x + elementRect.left, height: "25vw", width: "25vw"
        });
    };

    return (<>
        <section className={"About Before After"}>
            {/*<BackgroundLine colorName={ColorManager.$color_neutral1} horizontalCount={6} verticalCount={3}/>*/}
            {IsMobile ?
                <BackgroundLine colorName={ColorManager.$color_neutral1} verticalCount={2} horizontalCount={4}/> :
                <BackgroundLine colorName={ColorManager.$color_neutral1}/>}
            <div className={"About-container"}>
                <div className={"About-container--item __AboutSticky"}>
                    <h2 className={"About-container--item---content Uppercase"}>Creative</h2>
                    <h2 className={"About-container--item---content Uppercase Before After"}>Web</h2>
                    <h2 className={"About-container--item---content Uppercase"}>Developer</h2>
                </div>

                <div className={"About-container--item __AboutToProjectSticky"}>


                    <div className={`About-container--item---cursor __AboutCursor`}>

                        <SvgManager name={`ContactMaskingCursor`} parentClassName={`About-container--item---cursor`}/>
                    </div>
                    <h2 className={"About-container--item---content Uppercase TxtCenter __AboutCursorContainer"}>Figma
                        stroke plugin frame
                        <b>editor</b> overflow horizontal arrow.</h2>
                </div>
            </div>
        </section>
    </>)
}
export default About