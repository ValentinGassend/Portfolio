import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const AboutAnimations = () => {
    useLayoutEffect(() => {
        let AboutSplitText;
        if (document.getElementsByClassName("__AboutSplitText") && !document.getElementsByClassName("__AboutSplitText-word")[0]) {
            AboutSplitText = new SplitText(".__AboutSplitText", {
                type: "lines, words",
                linesClass: "__AboutSplitText-line",
                wordsClass: "__AboutSplitText-word"
            });
        }
        if (AboutSplitText && document.getElementsByClassName("__AboutSplitText-word")) {
            gsap.fromTo(AboutSplitText.words, {
                y: "110%",
            }, {
                y: "0",
                opacity: 1,
                stagger: 0.2,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".__AboutSplitText",
                    start: "center bottom",
                    end: "bottom top",
                },
            });
        }
        document.getElementsByClassName("__AboutCursorContainer")[0].addEventListener("mousemove", handleMouseMove);
        if (document.getElementsByClassName("__AboutSticky")[0]) {
            gsap.to(".__AboutSticky", {
                immediateRender: true,
                overwrite: true,
                opacity: 0.06,
                filter: "blur(8px)",
                scrollTrigger: {
                    trigger: ".__AboutSticky",
                    scrub: true,
                    start: "center center",
                    end: "bottom top",
                    pin: ".__AboutSticky",
                    pinSpacer: false
                },
            });
        }
        gsap.to(".__AboutToProjectSticky", {
            immediateRender: true,
            overwrite: true,
            scrollTrigger: {
                trigger: ".__AboutToProjectSticky",
                scrub: true,
                start: "top top",
                end: "bottom top",
                pin: ".__AboutToProjectSticky",
            },
        });

    }, []);

    const handleMouseMove = (event) => {
        let cursor = document.getElementsByClassName("__AboutCursor")[0];
        const boundingRect = cursor.getBoundingClientRect();
        const elementRect = document.getElementsByClassName("__AboutCursorContainer")[0].getBoundingClientRect();

        let x = event.clientX;
        let y = event.clientY;

        gsap.to(cursor, {
            duration: 0.5,
            top: y - elementRect.y,
            left: x - elementRect.x,
            height: "277px",
            width: "277px",
            ease: "none",
        });
    };

    return null;
};

export default AboutAnimations;
