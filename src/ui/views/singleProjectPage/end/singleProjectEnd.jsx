import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useParams } from "react-router-dom";

const SingleProjectEnd = ({ project }) => {
    gsap.registerPlugin(ScrollTrigger);

    return (
        <section className={"SingleProjectEnd __SingleProjectSection"}>
            {project.content.credits && project.content.credits.length > 0 && (
                <div className={"SingleProjectEnd-credit"}>
                    <div className={"SingleProjectEnd-credit--content"}>
                        <h2 className={"SingleProjectEnd-credit--content---title Uppercase"}>
                            Crédits
                        </h2>
                        {project.content.credits.map((credit, index) => (
                            <div key={index}>
                                <a
                                    className={"SingleProjectEnd-credit--content---text"}
                                    href={credit.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {credit.content}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {project.content.inspiration && project.content.inspiration.length > 0 && (
                <div className={"SingleProjectEnd-inspiration"}>
                    <div className={"SingleProjectEnd-inspiration--content"}>
                        <h2 className={"SingleProjectEnd-inspiration--content---title Uppercase"}>
                            Inspirations
                        </h2>
                        {project.content.inspiration.map((inspiration, index) => (
                            <div key={index}>
                                <a
                                    className={"SingleProjectEnd-inspiration--content---text"}
                                    href={inspiration.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {inspiration.title}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {project.content.links && project.content.links.length > 0 && (
                <div className={"SingleProjectEnd-link"}>
                    <div className={"SingleProjectEnd-link--content"}>
                        <h2 className={"SingleProjectEnd-link--content---title Uppercase"}>
                            Liens utiles
                        </h2>
                        {project.content.links.map((link, index) => (
                            <div key={index}>
                                <a
                                    className={"SingleProjectEnd-link--content---text"}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.title}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default SingleProjectEnd;
