import React, {lazy, useEffect, useLayoutEffect, useState} from "react";
import SvgManager from "../../../../../managers/SvgManager.jsx";
// import ContactMaskingBackground from "./Contact_masking_background.jsx";
import BackgroundLine from "../../../../components/BackgroundLine.jsx";
import gsap from "gsap";
import {IsMobile} from "../../../../../utils/utils.jsx";
import TextPlugin from "gsap/TextPlugin";


const ContactMaskingBackground = lazy(() => import("./Contact_masking_background.jsx"));
const ContactMasking = () => {
    gsap.registerPlugin(TextPlugin);
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

        if (!IsMobile()) {
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
        }

        console.log(IsMobile())
        if ((!cursorClicked && clickCount === 3) || IsMobile()) {
            gsap.to(cursor, {
                delay: !IsMobile() ? 1.6 : 0,
                duration: 0.5,
                top: "50%",
                bottom: "50%",
                translateY: "-50%",

                left: "50%",
                right: "50%",
                translateX: "-50%",
                width: IsMobile() ? `200vh` : `200vw`,
                height: IsMobile() ? `200vh` : `200vw`,
                ease: "power2.inOut",
                overwrite: true
            });

            // Animation pour le background
            gsap.to(".__ContactMaskedBackground", {
                delay: !IsMobile() ? 1.6 : 0, duration: 0.5, top: "0", bottom: "0",

                left: "50%", right: "50%", // scale:0.25,

                translateX: "-50%",

                // translate:"-50%, -50%",

                ease: "power2.inOut", overwrite: true
            });
        } else if (!IsMobile()) {
            gsap.to(cursor, {
                delay: !IsMobile() ? 1.6 : 0,
                duration: 0.5,
                top: "50%",
                bottom: "50%",
                translateY: "-50%",

                left: "50%",
                right: "50%",
                translateX: "-50%",
                width: IsMobile() ? `200vh` : `200vw`,
                height: IsMobile() ? `200vh` : `200vw`,
                ease: "power2.inOut",
                overwrite: true
            });

            // Animation pour le background
            gsap.to(".__ContactMaskedBackground", {
                delay: !IsMobile() ? 1.6 : 0, duration: 0.5,
                // top: "0", bottom: "0",

                // left: "50%",
                // right: "50%", // scale:0.25,

                translateX: "-0%",

                // translate:"-50%, -50%",

                ease: "power2.inOut", overwrite: true
            });
        }
    };
    useEffect(() => {
        let cursor = document.getElementsByClassName("__ContactMaskingCursor")[0]
        const backgroundTitle = document.getElementsByClassName("ContactMaskingBackground-content--title")[0]
        if (clickCount === 3 || IsMobile()) {
            setCursorClicked(true);
        }
        if (!IsMobile()) {
            switch (clickCount) {
                case 2:
                    gsap.to(backgroundTitle, {
                        duration: 2,
                        text: "essaye encore",
                        ease: "power4.inOut",
                    });
                    gsap.to(cursor, {
                        width: IsMobile() ? `50vh` : `50vh`,
                        height: IsMobile() ? `50vh` : `50vh`,
                        overwrite: true
                    });
                    break;
                case 3:
                    gsap.to(backgroundTitle, {
                        duration: 2,
                        text: "Petit curieux !",
                        ease: "power4.inOut",
                    });
                    gsap.to(cursor, {
                        width: IsMobile() ? `60vh` : `66vh`,
                        height: IsMobile() ? `60vh` : `66vh`,
                        overwrite: true
                    });
                    break;
                case 4:
                    gsap.to(backgroundTitle, {
                        duration: 2,
                        text: "Allez, contact moi !",
                        ease: "power4.inOut",
                    });

            }
        } else {
            gsap.to(backgroundTitle, {
                duration: 2,
                text: "Faisons connaissance !",
                ease: "power4.inOut",
            });
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
        <div className={`ContactMasking ${clickCount > 3 ? "BackgroundFull" : ''}`}>
            <div className={`ContactMasking-frontground ${cursorClicked ? "__clicked" : ''}`}>
                    <span
                        className={`ContactMasking-frontground--content Center Uppercase ${cursorClicked ? "__clicked" : ''}`}>Faisons connaissance !</span>
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