import React, {useEffect, useLayoutEffect, useState} from "react";
import SvgManager from "../../../../../managers/SvgManager.jsx";
import ContactMaskingBackground from "./Contact_masking_background.jsx";
import BackgroundLine from "../../../../components/BackgroundLine.jsx";
import gsap from "gsap";

const ContactMasking = () => {
    const [cursorClicked, setCursorClicked] = useState(false);

    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const handleClick = (event) => {
        document.getElementsByClassName("Contact")[0].removeEventListener("mousemove", handleMouseMove)

        setCursorClicked(true);

        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let cursor = document.getElementsByClassName("__ContactMaskingCursor")[0];

        if (!cursorClicked) {
            gsap.to(cursor, {
                duration: 0.5, top: "50%", bottom: "50%", translateY: "-50%",

                left: "50%", right: "50%", translateX: "-50%", width: "200vw", height: "200vw", ease: "power2.inOut"
            });

            // Animation pour le background
            gsap.to(".__ContactMaskedBackground", {
                duration: 0.5, top: "0", bottom: "0",

                left: "50%", right: "50%", // scale:0.25,

                translateX: "-50%",

                // translate:"-50%, -50%",

                ease: "power2.inOut"
            });
        }
    };
    useEffect(() => {
        if (!cursorClicked) {
            document.getElementsByClassName("Contact")[0].addEventListener("mousemove", handleMouseMove)
        document.getElementsByClassName("ContactMasking")[0].addEventListener("click", handleClick)
        }
    }, [cursorClicked]);
    const handleMouseMove = (event) => {
        // setCursorPosition({ x: event.clientX, y: event.clientY });
        let x = event.layerX - 25;
        let y = event.layerY - 25;
        let cursor = document.getElementsByClassName("__ContactMaskingCursor")[0]
        // console.log(cursorClicked)
            gsap.to(cursor, {
                duration: 0.1, top: y - cursor.offsetHeight / 2, left: x - cursor.offsetWidth / 2
            });
            gsap.to(".__ContactMaskedBackground", {
                duration: 0.1, top: -y + cursor.offsetHeight / 2, left: -x + cursor.offsetWidth / 2
            });
    };
    return (<>
        <div className={"ContactMasking"}>
            <div className={`ContactMasking-frontground ${cursorClicked ? "__clicked" : ''}`}>
                    <span
                        className={`ContactMasking-frontground--content Center Uppercase ${cursorClicked ? "__clicked" : ''}`}>Let's contact !</span>
            </div>

            {/*style={{ left: cursorPosition.x, top: cursorPosition.y }}*/}
            <div className={`ContactMasking-cursor __ContactMaskingCursor ${cursorClicked ? "__clicked" : ''}`}>
                <SvgManager name={`ContactMaskingCursor`} parentClassName={`ContactMasking-cursor`}/>

                <div
                    className={`ContactMasking-background __ContactMaskedBackground ${cursorClicked ? "__clicked" : ''}`}>
                    {/*    <div className={`ContactMasking-background-texture ${cursorClicked ? "__clicked" : ''}`}></div>*/}
                    {/*    <div className={`ContactMasking-background-color ${cursorClicked ? "__clicked" : ''}`}>*/}

                    {/*        <span className={`ContactMasking-background--content Center Uppercase ${cursorClicked ? "__clicked" : ''}`}>Let's contact !</span>*/}
                    {/*        <BackgroundLine/>*/}
                    {/*    </div>*/}
                    <ContactMaskingBackground cursorClicked={cursorClicked}/>

                </div>

            </div>

            {/*<ContactMaskingBackground style={{opacity: cursorClicked ? 1 : 0}}/>*/}
        </div>
    </>);
}
export default ContactMasking