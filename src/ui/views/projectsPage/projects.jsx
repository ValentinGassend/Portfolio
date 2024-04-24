import React, {useEffect} from "react";
import Overlay from "../../components/Overlay.jsx";
import ProjectSingle from "./projectSingle/projectSingle.jsx";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const Projects = () => {

    const projects = [{
        year: 2020,
        client: "Entreprise XYZ",
        title: "Plateforme de gestion des stocks",
        tags: ["Gestion des stocks", "Plateforme web", "Développement logiciel"]
    }, {
        year: 2019,
        client: "Association ABC",
        title: "Application mobile pour la sensibilisation environnementale",
        tags: ["Application mobile", "Sensibilisation environnementale", "Développement d'applications"]
    }, {
        year: 2021,
        client: "Startup XYZ",
        title: "Site web de commerce électronique",
        tags: ["Site web", "Commerce électronique", "Développement web"]
    }, {
        year: 2018,
        client: "Organisation non gouvernementale (ONG)",
        title: "Système de gestion des bénévoles",
        tags: ["Gestion des bénévoles", "ONG", "Développement logiciel"]
    }, {
        year: 2022,
        client: "Société ABC",
        title: "Application de gestion des tâches",
        tags: ["Application de productivité", "Gestion des tâches", "Développement d'applications"]
    }, {
        year: 2023,
        client: "Startup ABC",
        title: "Plateforme de réservation de salles de réunion",
        tags: ["Plateforme web", "Réservation de salles", "Développement d'applications"]
    }, {
        year: 2024,
        client: "Entreprise XYZ",
        title: "Application de gestion de la relation client (CRM)",
        tags: ["CRM", "Gestion de la relation client", "Développement d'applications"]
    }, {
        year: 2022,
        client: "Startup DEF",
        title: "Application de suivi de fitness",
        tags: ["Application mobile", "Fitness", "Développement d'applications"]
    }, {
        year: 2023,
        client: "Entreprise XYZ",
        title: "Plateforme de formation en ligne",
        tags: ["Plateforme web", "Formation en ligne", "Développement web"]
    }, {
        year: 2024,
        client: "Association XYZ",
        title: "Application de collecte de fonds",
        tags: ["Application mobile", "Collecte de fonds", "Développement d'applications"]
    }, {
        year: 2021,
        client: "Startup GHI",
        title: "Site web de réservation de voyages",
        tags: ["Site web", "Réservation de voyages", "Développement web"]
    }, {
        year: 2023,
        client: "Organisation XYZ",
        title: "Système de suivi des volontaires",
        tags: ["Suivi des volontaires", "Organisation", "Développement logiciel"]
    }, {
        year: 2022,
        client: "Startup JKL",
        title: "Application de partage de photos",
        tags: ["Application mobile", "Partage de photos", "Développement d'applications"]
    }, {
        year: 2024,
        client: "Entreprise ABC",
        title: "Plateforme de gestion de projets",
        tags: ["Plateforme web", "Gestion de projets", "Développement logiciel"]
    }, {
        year: 2023,
        client: "Startup MNO",
        title: "Application de gestion des finances personnelles",
        tags: ["Application mobile", "Gestion financière", "Développement d'applications"]
    }, {
        year: 2024,
        client: "Organisation ABC",
        title: "Système de suivi des dons",
        tags: ["Suivi des dons", "Organisation", "Développement logiciel"]
    }, {
        year: 2023,
        client: "Startup PQR",
        title: "Site web d'achat de produits locaux",
        tags: ["Site web", "Achat local", "Développement web"]
    }, {
        year: 2024,
        client: "Entreprise DEF",
        title: "Application de gestion des ressources humaines (RH)",
        tags: ["RH", "Gestion des ressources humaines", "Développement d'applications"]
    }];


    gsap.registerPlugin(ScrollTrigger)
    useEffect(() => {
        const projectElements = gsap.utils.toArray('.ProjectSingle');
        projectElements.forEach((project, i) => {

            ScrollTrigger.create({
                trigger: project, start: "-10px top", onEnter: () => {
                    const projectIdFormatted = parseInt(project.id.replace(/^project/, ''));

                    // Définir l'intervalle autour de l'ID du projet actuel
                    const interval = 5;
                    for (let i = -interval; i <= interval; i++) {
                        const currentProjectId = projectIdFormatted + i;
                        const overlayText = document.querySelector(`[href="#project${currentProjectId}"]`);
                        if (overlayText) {
                            const opacity = calculateOpacity(i, interval);
                            gsap.to(overlayText, {opacity: opacity, duration: 0.5});
                        }
                    }
                }, onEnterBack: () => {
                    const projectIdFormatted = parseInt(project.id.replace(/^project/, ''));

                    // Définir l'intervalle autour de l'ID du projet actuel
                    const interval = 5;
                    for (let i = -interval; i <= interval; i++) {
                        const currentProjectId = projectIdFormatted + i;
                        const overlayText = document.querySelector(`[href="#project${currentProjectId}"]`);
                        if (overlayText) {
                            const opacity = calculateOpacity(i, interval);
                            gsap.to(overlayText, {opacity: opacity, duration: 0.5});
                        }
                    }
                }, ease: 'cubic-bezier(.435, .250, .150, .965)'
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
        <Overlay projectsPage={true} projectsList={projects}/>

        {/*<div className={`__ScrollSmooth`}>*/}

        <section className={"Projects"}>
            {projects.map((project, index) => (<div key={index}>
                <ProjectSingle project={project} index={index}/>
            </div>))}
        </section>
        {/*</div>*/}

    </>);
};

export default Projects;
