import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useParams } from "react-router-dom";
import { IsMobile } from "../../../../utils/utils.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";

const SingleProjectContent = ({ project }) => {
    gsap.registerPlugin(ScrollTrigger);

    return (
        <section className={"SingleProjectContent"}>
            {project.content.history && project.content.history.text.trim() !== "" && (
                <div className={"SingleProjectContent-history __SingleProjectSection"}>
                    <div className={"SingleProjectContent-history--content"}>
                        <p className={"SingleProjectContent-history--content---title Uppercase"}>
                            Contexte
                        </p>
                        <p
                            className={"SingleProjectContent-history--content---text"}
                            dangerouslySetInnerHTML={{
                                __html: project.content.history.text.replace(/\n/g, "<br>"),
                            }}
                        />
                    </div>

                    <img src={project.content.history.image}
                         className={`SingleProjectContent-history--image`} alt={""}/>
                </div>
            )}

            {project.content.why && project.content.why.text.trim() !== "" && (
                <div className={"SingleProjectContent-why __SingleProjectSection"}>
                    <div className={"SingleProjectContent-why--content"}>
                        <p className={"SingleProjectContent-why--content---title Uppercase"}>
                            Objectif
                        </p>
                        <p
                            className={"SingleProjectContent-why--content---text"}
                            dangerouslySetInnerHTML={{
                                __html: project.content.why.text.replace(/\n/g, "<br>"),
                            }}
                        />
                    </div>

                    <img src={project.content.why.image}
                         className={`SingleProjectContent-why--image`} alt={""}/>
                </div>
            )}

            {project.content.how && project.content.how.text.trim() !== "" && (
                <div className={"SingleProjectContent-how __SingleProjectSection"}>
                    <div className={"SingleProjectContent-how--content"}>
                        <p className={"SingleProjectContent-how--content---title Uppercase"}>
                            Concept
                        </p>
                        <p
                            className={"SingleProjectContent-how--content---text"}
                            dangerouslySetInnerHTML={{
                                __html: project.content.how.text.replace(/\n/g, "<br>"),
                            }}
                        />
                    </div>

                    <img src={project.content.how.image}
                         className={`SingleProjectContent-how--image`} alt={""}/>
                </div>
            )}

            {project.content.what && project.content.what.text.trim() !== "" && (
                <div className={"SingleProjectContent-what __SingleProjectSection"}>
                    <div className={"SingleProjectContent-what--content"}>
                        <p className={"SingleProjectContent-what--content---title Uppercase"}>
                            Ma participation
                        </p>
                        <p
                            className={"SingleProjectContent-what--content---text"}
                            dangerouslySetInnerHTML={{
                                __html: project.content.what.text.replace(/\n/g, "<br>"),
                            }}
                        />
                    </div>

                    <img src={project.content.what.image}
                         className={`SingleProjectContent-what--image`} alt={""}/>
                </div>
            )}
        </section>
    );
};

export default SingleProjectContent;
