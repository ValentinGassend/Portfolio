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
            {project.content.history && project.content.history.trim() !== "" && (
                <div className={"SingleProjectContent-history __SingleProjectSection"}>
                    <div className={"SingleProjectContent-history--content"}>
                        <p className={"SingleProjectContent-history--content---title Uppercase"}>
                            Contexte
                        </p>
                        <p
                            className={"SingleProjectContent-history--content---text"}
                            dangerouslySetInnerHTML={{
                                __html: project.content.history.replace(/\n/g, "<br>"),
                            }}
                        />
                    </div>
                </div>
            )}

            {project.content.why && project.content.why.trim() !== "" && (
                <div className={"SingleProjectContent-why __SingleProjectSection"}>
                    <div className={"SingleProjectContent-why--content"}>
                        <p className={"SingleProjectContent-why--content---title Uppercase"}>
                            Objectif
                        </p>
                        <p
                            className={"SingleProjectContent-why--content---text"}
                            dangerouslySetInnerHTML={{
                                __html: project.content.why.replace(/\n/g, "<br>"),
                            }}
                        />
                    </div>
                </div>
            )}

            {project.content.how && project.content.how.trim() !== "" && (
                <div className={"SingleProjectContent-how __SingleProjectSection"}>
                    <div className={"SingleProjectContent-how--content"}>
                        <p className={"SingleProjectContent-how--content---title Uppercase"}>
                            Concept
                        </p>
                        <p
                            className={"SingleProjectContent-how--content---text"}
                            dangerouslySetInnerHTML={{
                                __html: project.content.how.replace(/\n/g, "<br>"),
                            }}
                        />
                    </div>
                </div>
            )}

            {project.content.what && project.content.what.trim() !== "" && (
                <div className={"SingleProjectContent-what __SingleProjectSection"}>
                    <div className={"SingleProjectContent-what--content"}>
                        <p className={"SingleProjectContent-what--content---title Uppercase"}>
                            Ma participation
                        </p>
                        <p
                            className={"SingleProjectContent-what--content---text"}
                            dangerouslySetInnerHTML={{
                                __html: project.content.what.replace(/\n/g, "<br>"),
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default SingleProjectContent;
