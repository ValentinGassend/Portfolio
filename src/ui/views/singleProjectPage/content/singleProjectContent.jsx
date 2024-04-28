import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useParams} from "react-router-dom";
import {IsMobile} from "../../../../utils/utils.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";

const SingleProjectContent = ({project}) => {


    gsap.registerPlugin(ScrollTrigger)
    return (<>

        {/*<div className={`__ScrollSmooth`}>*/}

        <section className={"SingleProjectContent"}>

            <div className={"SingleProjectContent-history __SingleProjectSection"}>
                <div className={"SingleProjectContent-history--content"}>
                    <p className={"SingleProjectContent-history--content---title Uppercase"}>Contexte</p>
                    <p className={"SingleProjectContent-history--content---text"}>{project.content.history}</p>
                </div>
            </div>
            <div className={"SingleProjectContent-why __SingleProjectSection"}>
                <div className={"SingleProjectContent-why--content"}>
                    <p className={"SingleProjectContent-why--content---title Uppercase"}>Objectif</p>
                    <p className={"SingleProjectContent-why--content---text"}>{project.content.why}</p>
                </div>
            </div>
            <div className={"SingleProjectContent-how __SingleProjectSection"}>
                <div className={"SingleProjectContent-how--content"}>
                    <p className={"SingleProjectContent-how--content---title Uppercase"}>Concept</p>
                    <p className={"SingleProjectContent-how--content---text"}>{project.content.how}</p>
                </div>
            </div>
            <div className={"SingleProjectContent-what __SingleProjectSection"}>
                <div className={"SingleProjectContent-what--content"}>
                    <p className={"SingleProjectContent-what--content---title Uppercase"}>Ma participation</p>
                    <p className={"SingleProjectContent-what--content---text"}>{project.content.what}</p>
                </div>
            </div>
        </section>
        {/*</div>*/}

    </>);
};

export default SingleProjectContent;
