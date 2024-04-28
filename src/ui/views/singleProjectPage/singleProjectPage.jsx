import projectsData from "../../../models/projectsData.js";
import Overlay from "../../components/Overlay.jsx";
import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useParams} from "react-router-dom";
import ProjectsData from "../../../models/projectsData.js";
import SingleProjectLanding from "./landing/singleProjectLanding.jsx";
import SingleProjectContent from "./content/singleProjectContent.jsx";
import SingleProjectEnd from "./end/singleProjectEnd.jsx";
import {IsMobile} from "../../../utils/utils.jsx";
import BackgroundLine from "../../components/BackgroundLine.jsx";
import ColorManager from "../../../managers/ColorManager.jsx";

const SingleProjectPage = () => {


    const {id} = useParams();

    gsap.registerPlugin(ScrollTrigger)

    const projects = ProjectsData


    const project = projects.find((project) => project.id === parseInt(id));

    useEffect(() => {
        const sections = gsap.utils.toArray('.__SingleProjectSection');
        const image = gsap.utils.toArray('.__SingleProjectImageContainer');


        // const offset = targetElement.getBoundingClientRect().top + window.scrollY;

        sections.forEach((section, i) => {

            ScrollTrigger.create({
                trigger: section,
                start: "10px bottom",
                end: "-10px top",
                ease: 'cubic-bezier(.435, .250, .150, .965)',
                onEnter: () => {
                    console.log(i)
                    if (i === 1) {
                        gsap.to(image, {
                            left: 0, delay: 0.2, duration: 0.6,
                        })
                        //
                        gsap.to(".__SingleProjectBack", {
                            color: "#FFFFFF", delay: 0.2
                        })
                    }
                    gsap.to(window, {
                        scrollTo: {
                            y: section, autoKill: false
                        }, duration: 1
                    });


                },
                onEnterBack: () => {
                    console.log("onEnterBack", i)
                    if (i === 1) {
                        gsap.to(image, {
                            left: "50%", delay: 0.2, duration: 0.6,
                        })
                        gsap.to(window, {
                            scrollTo: {
                                y: 0, autoKill: false
                            }, duration: 1, overwrite: true

                        });

                        gsap.to(".__SingleProjectBack", {
                            color: "#000000", delay: 0.2
                        })
                        // gsap.to(section, {
                        //     opacity: 0,
                        // })


                        gsap.to(".SingleProjectLanding", {
                            opacity: 1, delay: 0.6, ease: "power3.out", duration: 0.5
                        })
                    } else {

                        gsap.to(window, {
                            scrollTo: {
                                y: sections[i-1], autoKill: false
                            }, duration: 1, overwrite: true
                        });
                    }

                },
                onLeaveBack: () => {
                    console.log("onLeaveBack", i)

                    // gsap.to(window, {
                    //     scrollTo: {
                    //         y: section, autoKill: false
                    //     }, duration: 1, overwrite: true
                    // });
                }
            });

// Fonction pour calculer l'opacité en fonction de la distance par rapport au projet actuel
            function calculateOpacity(index, interval) {
                const maxOpacity = 1;
                const minOpacity = 0.1;
                const step = (maxOpacity - minOpacity) / interval;
                return maxOpacity - Math.abs(index) * step;
            }
        });
    }, []);

    return (<>
        <Overlay singleProjectPage={true} project={project}/>

        {/*<div className={`__ScrollSmooth`}>*/}

        <section className={"SingleProjectPage Before"}>
            {IsMobile ?
                <BackgroundLine colorName={ColorManager.$color_neutral2} verticalCount={2} horizontalCount={2}/> :
                <BackgroundLine colorName={ColorManager.$color_neutral2}/>}
            <div className={`SingleProjectPage-background`}>
                <p className={`SingleProjectPage-background--back Uppercase __SingleProjectBack`}>Retour</p>
                <img src={`https://picsum.photos/1800/1800`}
                     className={`SingleProjectPage-background--image __SingleProjectImageContainer`} alt={""}/>
            </div>
            <SingleProjectLanding project={project}/>
            <SingleProjectContent project={project}/>
            <SingleProjectEnd project={project}/>
        </section>
        {/*</div>*/}

    </>);
};

export default SingleProjectPage;
