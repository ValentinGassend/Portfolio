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
        x = event.offsetX;
        y = event.offsetY - 25;
        // Check if mouse is inside the cursor container
        if (event.clientX >= elementRect.left && event.clientX <= elementRect.right && event.clientY >= elementRect.top && event.clientY <= elementRect.bottom) {
            // Mouse is inside the container, keep cursor at its normal size
            gsap.to(cursor, {
                duration: 0.5,
                top: y + (elementRect.bottom - elementRect.top),
                left: x + elementRect.x,
                height: "277px",
                width: "277px",
                ease: "none"
            });
        } else {
            // Mouse is outside the container, reduce cursor size
            gsap.to(cursor, {
                duration: 0.8,
                top: elementRect.bottom - elementRect.top + elementRect.height,
                left: elementRect.right - elementRect.left,
                height: "150px", // Adjust these values as needed
                width: "150px",
                ease: "none"// Adjust these values as needed
            });
        }
        // gsap.to(cursor, {
        //     duration: 0.1, top: y + (elementRect.bottom - elementRect.top) , left: x + elementRect.x, height: "277px", width: "277px"
        // });
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

                        <SvgManager name={`AboutPlusCursor`} parentClassName={`About-container--item---cursor`}/>
                        <SvgManager name={`AboutTextCursor`} parentClassName={`About-container--item---cursor`}/>
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