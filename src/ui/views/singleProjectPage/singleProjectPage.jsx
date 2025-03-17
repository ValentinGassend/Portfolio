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
import {Helmet} from "react-helmet";

const SingleProjectPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    gsap.registerPlugin(ScrollTrigger);

    const projects = ProjectsData;
    const project = projects.find((project) => project.id === parseInt(id));

    // Si le projet n'existe pas, rediriger vers la liste des projets
    useEffect(() => {
        if (!project) {
            navigate('/projects');
            return; // Sortir tôt si pas de projet
        }
    }, [project, navigate]);

    // Gestion des animations GSAP
    useEffect(() => {
        if (!project) return; // Ne pas exécuter si pas de projet

        const sections = gsap.utils.toArray('.__SingleProjectSection');
        const imageContainer = gsap.utils.toArray('.__SingleProjectImageContainer');
        const images = gsap.utils.toArray('.__SingleProjectImage');

        sections.forEach((section, i) => {
            gsap.to(images[i], {
                opacity: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "10px bottom",
                    end: "-10px top",
                    ease: 'cubic-bezier(.435, .250, .150, .965)',
                    scrub: true,
                }
            });
            if (i === 1) {
                gsap.to(imageContainer, {
                    left: 0,
                    scrollTrigger: {
                        trigger: section,
                        start: "10px bottom",
                        end: "-10px top",
                        ease: 'cubic-bezier(.435, .250, .150, .965)',
                        scrub: true,
                    },
                });
            }
        });
    }, [project]);

    // Si le projet est introuvable, ne pas rendre la page
    if (!project) return null;

    // Construction de la description meta à partir du contenu du projet
    const metaDescription = `${project.title} - Projet réalisé en ${project.year} pour ${project.client}. ${project.content.description.text.substring(0, 150)}...`;

    // URL canonique pour ce projet
    const canonicalUrl = `https://valentingassend.com/project/${project.id}`;

    // Titre optimisé pour le SEO
    const pageTitle = `${project.title} | Portfolio de Valentin Gassend | ${project.tags.slice(0, 2).join(', ')}`;

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={metaDescription} />
                {project.imageUrl && <meta property="og:image" content={project.imageUrl} />}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={canonicalUrl} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={metaDescription} />
                {project.imageUrl && <meta name="twitter:image" content={project.imageUrl} />}

                {/* Métadonnées structurées pour les riches snippets */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CreativeWork",
                        "name": project.title,
                        "description": metaDescription,
                        "image": project.imageUrl,
                        "dateCreated": `${project.year}`,
                        "author": {
                            "@type": "Person",
                            "name": "Valentin Gassend"
                        },
                        "keywords": project.tags.join(", ")
                    })}
                </script>
            </Helmet>

            <Overlay singleProjectPage={true} project={project} />

            <section className="SingleProjectPage Before">
                {IsMobile ?
                    <BackgroundLine colorName={ColorManager.$color_neutral2} verticalCount={2} horizontalCount={2} /> :
                    <BackgroundLine colorName={ColorManager.$color_neutral2} />}

                <div className="SingleProjectPage-background">
                    <p className="SingleProjectPage-background--back Uppercase __SingleProjectBack"
                       onClick={() => navigate(-1)}>
                        Retour
                    </p>

                    <div className="SingleProjectPage-background--container __SingleProjectImageContainer">
                        {project.content.description.image && (
                            <div className="SingleProjectPage-background--container---image Before __SingleProjectImage">
                                <img loading="lazy"
                                     src={project.content.description.image}
                                     className="SingleProjectPage-background--container---image----img"
                                     alt={`Aperçu du projet ${project.title} - ${project.content.description.text.substring(0, 50)}...`} />
                            </div>
                        )}

                        {project.content.history.image && (
                            <div className="SingleProjectPage-background--container---image Before __SingleProjectImage">
                                <img loading="lazy"
                                     src={project.content.history.image}
                                     className="SingleProjectPage-background--container---image----img"
                                     alt={`Contexte du projet ${project.title}`} />
                            </div>
                        )}

                        {project.content.why.image && (
                            <div className="SingleProjectPage-background--container---image Before __SingleProjectImage">
                                <img loading="lazy"
                                     src={project.content.why.image}
                                     className="SingleProjectPage-background--container---image----img"
                                     alt={`Objectifs du projet ${project.title}`} />
                            </div>
                        )}

                        {project.content.how.image && (
                            <div className="SingleProjectPage-background--container---image Before __SingleProjectImage">
                                <img loading="lazy"
                                     src={project.content.how.image}
                                     className="SingleProjectPage-background--container---image----img"
                                     alt={`Concept du projet ${project.title}`} />
                            </div>
                        )}

                        {project.content.what.image && (
                            <div className="SingleProjectPage-background--container---image Before __SingleProjectImage">
                                <img loading="lazy"
                                     src={project.content.what.image}
                                     className="SingleProjectPage-background--container---image----img"
                                     alt={`Ma participation au projet ${project.title}`} />
                            </div>
                        )}

                        {project.imageUrl && (
                            <div className="SingleProjectPage-background--container---image Before __SingleProjectImage">
                                <img loading="lazy"
                                     src={project.imageUrl}
                                     className="SingleProjectPage-background--container---image----img"
                                     alt={`Vue principale du projet ${project.title}`} />
                            </div>
                        )}
                    </div>
                </div>

                <SingleProjectLanding project={project} />
                <SingleProjectContent project={project} />
                <SingleProjectEnd project={project} />
            </section>
        </>
    );
};

export default SingleProjectPage;