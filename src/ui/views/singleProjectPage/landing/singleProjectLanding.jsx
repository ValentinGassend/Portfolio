import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useParams} from "react-router-dom";
import {IsMobile} from "../../../../utils/utils.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";

const SingleProjectLanding = ({project}) => {


    gsap.registerPlugin(ScrollTrigger)

    return (<>

        {/*<div className={`__ScrollSmooth`}>*/}

        <section className={"SingleProjectLanding __SingleProjectSection"}>
            <div className={"SingleProjectLanding-wrapper"}>
                <div className={"SingleProjectLanding-headline"}>
                    <div className={"SingleProjectLanding-headline--header"}>
                        <h3 className={"SingleProjectLanding-headline--header---item Uppercase"}>
                            {project.year}
                        </h3>
                        <h3 className={"SingleProjectLanding-headline--header---item Uppercase"}>
                            {project.client}
                        </h3>
                    </div>
                    <h3 className={"SingleProjectLanding-headline--title Uppercase"}>{project.title}</h3>


                    <div className={"SingleProjectLanding-headline--subtitle"}>
                        {project.tags.map((tag, index) => (
                            <p key={index} className={"SingleProjectLanding-headline--subtitle---tag Uppercase"}>
                                {tag}
                            </p>))}
                    </div>
                </div>
                <div className={"SingleProjectLanding-content"}>
                    <p
                        className={"SingleProjectLanding-content--text"}
                        dangerouslySetInnerHTML={{__html: project.content.description.text.replace(/\n/g, "<br>")}}
                    />
                </div>
            </div>
            <img loading={"lazy"} src={project.content.description.image}
                 className={`SingleProjectLanding-image`} alt={""}/>
        </section>

        {/*</div>*/}

    </>);
};

export default SingleProjectLanding;
