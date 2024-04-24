import React, {useEffect, useLayoutEffect, useState} from "react";
import SvgManager from "../../../../../managers/SvgManager.jsx";
import ContactMaskingBackground from "./Contact_masking_background.jsx";
import BackgroundLine from "../../../../components/BackgroundLine.jsx";
import gsap from "gsap";

const ContactMasking = () => {
    const [cursorClicked, setCursorClicked] = useState(false);

    const [clickCount, setClickCount] = useState(1);
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const handleClick = (event) => {
        document.getElementsByClassName("Contact")[0].removeEventListener("mousemove", handleMouseMove)

        // setCursorClicked(true);

        setClickCount(clickCount + 1);
        let cursor = document.getElementsByClassName("__ContactMaskingCursor")[0]
        const boundingRect = cursor.getBoundingClientRect();
        const elementRect = document.getElementsByClassName("ContactMasking")[0].getBoundingClientRect();

        let x;
        let y;
        if (elementRect.width - event.offsetX - (cursor.offsetWidth / 2) >= 0) {
            if ((((event.offsetX - 25) - cursor.offsetWidth / 2) >= 0)) {
                x = event.offsetX - 25;
            } else {
                x = boundingRect.x + 400;
            }

        } else {
            x = boundingRect.x + 400;
        }
        if (elementRect.height - event.offsetY - (cursor.offsetHeight / 2) >= 0) {


            if (((event.offsetY - 25) - cursor.offsetHeight / 2) >= 0) {
                y = event.offsetY - 25;
            } else {
                y = boundingRect.y + 400;
            }
        } else {
            y = boundingRect.y + 400;
        }

        // Créer un cercle initiallement à 0
        let circle = document.createElement('div');
        circle.classList.add('circle');
        document.getElementsByClassName("ContactMasking-frontground")[0].appendChild(circle);


        gsap.set(circle, {

            top: y - circle.offsetHeight / 2, left: x - circle.offsetWidth / 2,
        })
        // Animation pour faire grossir le cercle jusqu'au bord de la fenêtre
        gsap.to(circle, {
            duration: 3,
            width: "1000vw",
            height: "1000vh",
            ease: "power2.inOut",
            top: y - circle.offsetHeight / 2,
            left: x - circle.offsetWidth / 2,
            onComplete: () => {
                document.getElementsByClassName("ContactMasking-frontground")[0].removeChild(circle);
            }
        });

        if (!cursorClicked && clickCount === 3) {
            gsap.to(cursor, {
                delay: 1.6,
                duration: 0.5,
                top: "50%",
                bottom: "50%",
                translateY: "-50%",

                left: "50%",
                right: "50%",
                translateX: "-50%",
                width: `200vw`,
                height: `200vw`,
                ease: "power2.inOut",
                overwrite: true
            });

            // Animation pour le background
            gsap.to(".__ContactMaskedBackground", {
                delay: 1.6, duration: 0.5, top: "0", bottom: "0",

                left: "50%", right: "50%", // scale:0.25,

                translateX: "-50%",

                // translate:"-50%, -50%",

                ease: "power2.inOut", overwrite: true
            });
        }
    };
    useEffect(() => {
        if (clickCount === 3) {
            setCursorClicked(true);
        }
        if (!cursorClicked) {
            document.getElementsByClassName("Contact")[0].addEventListener("mousemove", handleMouseMove)
            document.getElementsByClassName("ContactMasking")[0].addEventListener("click", handleClick)
        }
    }, [cursorClicked, clickCount]);
    const handleMouseMove = (event) => {

        let cursor = document.getElementsByClassName("__ContactMaskingCursor")[0]
        const boundingRect = cursor.getBoundingClientRect();
        const elementRect = document.getElementsByClassName("ContactMasking")[0].getBoundingClientRect();

        let x;
        let y;
        if (elementRect.width - event.offsetX - (cursor.offsetWidth / 2) >= 0) {
            if ((((event.offsetX - 25) - cursor.offsetWidth / 2) >= 0)) {
                x = event.offsetX - 25;
            }

        } else {
            x = elementRect.width - cursor.right - 25;


        }
        if (elementRect.height - event.offsetY - (cursor.offsetHeight / 2) >= 0) {


            if (((event.offsetY - 25) - cursor.offsetHeight / 2) >= 0) {
                y = event.offsetY - 25;
            }
        } else {
            y = elementRect.height - cursor.bottom - 25;


        }
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
                    <ContactMaskingBackground cursorClicked={cursorClicked}/>

                </div>

            </div>

            {/*<ContactMaskingBackground style={{opacity: cursorClicked ? 1 : 0}}/>*/}
        </div>
    </>);
}
export default ContactMasking