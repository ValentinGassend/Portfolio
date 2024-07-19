import projectsData from "../../../models/projectsData.js";
import Overlay from "../../components/Overlay.jsx";
import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useParams, useNavigate} from "react-router-dom";
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
        const imageContainer = gsap.utils.toArray('.__SingleProjectImageContainer');

        const images = gsap.utils.toArray('.__SingleProjectImage');

        // const offset = targetElement.getBoundingClientRect().top + window.scrollY;

        sections.forEach((section, i) => {
            gsap.to(images[i], {
                opacity: 1, scrollTrigger: {
                    trigger: section,
                    start: "10px bottom",
                    end: "-10px top",
                    ease: 'cubic-bezier(.435, .250, .150, .965)',
                    scrub: true,
                }
            });
            if (i === 1) {
                gsap.to(imageContainer, {
                    left: 0, scrollTrigger: {
                        trigger: section,
                        start: "10px bottom",
                        end: "-10px top",
                        ease: 'cubic-bezier(.435, .250, .150, .965)',
                        scrub: true,
                    },
                })
            }
        });

    }, []);
    const navigate = useNavigate()
    return (<>
        <Overlay singleProjectPage={true} project={project}/>

        {/*<div className={`__ScrollSmooth`}>*/}

        <section className={"SingleProjectPage Before"}>
            {IsMobile ?
                <BackgroundLine colorName={ColorManager.$color_neutral2} verticalCount={2} horizontalCount={2}/> :
                <BackgroundLine colorName={ColorManager.$color_neutral2}/>}
            <div className={`SingleProjectPage-background`}>
                <p className={`SingleProjectPage-background--back Uppercase __SingleProjectBack`}
                   onClick={() => navigate(-1)}>Retour</p>
                <div className={`SingleProjectPage-background--container __SingleProjectImageContainer`}>
                    {project.content.description.image && (
                        <div className={`SingleProjectPage-background--container---image Before __SingleProjectImage`}>
                            <img loading={"lazy"} src={project.content.description.image}
                                 className={`SingleProjectPage-background--container---image----img`} alt={""}/>
                        </div>
                    )}

                    {project.content.history.image && (
                        <div className={`SingleProjectPage-background--container---image Before __SingleProjectImage`}>
                            <img loading={"lazy"} src={project.content.history.image}
                                 className={`SingleProjectPage-background--container---image----img`} alt={""}/>
                        </div>
                    )}

                    {project.content.why.image && (
                        <div className={`SingleProjectPage-background--container---image Before __SingleProjectImage`}>
                            <img loading={"lazy"} src={project.content.why.image}
                                 className={`SingleProjectPage-background--container---image----img`} alt={""}/>
                        </div>
                    )}

                    {project.content.how.image && (
                        <div className={`SingleProjectPage-background--container---image Before __SingleProjectImage`}>
                            <img loading={"lazy"} src={project.content.how.image}
                                 className={`SingleProjectPage-background--container---image----img`} alt={""}/>
                        </div>
                    )}

                    {project.content.what.image && (
                        <div className={`SingleProjectPage-background--container---image Before __SingleProjectImage`}>
                            <img loading={"lazy"} src={project.content.what.image}
                                 className={`SingleProjectPage-background--container---image----img`} alt={""}/>
                        </div>
                    )}

                    {project.imageUrl && (
                        <div className={`SingleProjectPage-background--container---image Before __SingleProjectImage`}>
                            <img loading={"lazy"} src={project.imageUrl}
                                 className={`SingleProjectPage-background--container---image----img`} alt={""}/>
                        </div>
                    )}



                </div>
            </div>
            <SingleProjectLanding project={project}/>
            <SingleProjectContent project={project}/>
            <SingleProjectEnd project={project}/>
        </section>
        {/*</div>*/}

    </>);
};

export default SingleProjectPage;
