import React, {useEffect, useState} from "react";
import Overlay from "../../components/Overlay.jsx";
import ProjectSingle from "./projectSingle/projectSingle.jsx";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {IsMobile} from "../../../utils/utils.jsx";
import BackgroundLine from "../../components/BackgroundLine.jsx";
import ColorManager from "../../../managers/ColorManager.jsx";
import projectsData from "../../../models/projectsData.js";

const Projects = () => {

    const projects = projectsData
    const [sortedProjects, setSortedProjects] = useState([]);

    // Sort projects by year on component mount
    useEffect(() => {
        const sorted = projectsData.slice().sort((a, b) => b.year - a.year);
        setSortedProjects(sorted);
    }, []);

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
    }, [sortedProjects]);


    return (<>
        <Overlay projectsPage={true} projectsList={sortedProjects}/>

        {/*<div className={`__ScrollSmooth`}>*/}

        <section className={"Projects"}>
            <div className={`Projects-landing Before`}>
                {IsMobile ?
                    <BackgroundLine colorName={ColorManager.$color_neutral2} verticalCount={2} horizontalCount={2}/> :
                    <BackgroundLine colorName={ColorManager.$color_neutral2}/>}
                <h1 className={`Projects-landing--title Uppercase Before After`}>Projects</h1>
            </div>
            {sortedProjects.map((project, index) => (<React.Fragment key={index}>
                <ProjectSingle project={project} index={index}/>
            </React.Fragment>))}
        </section>
        {/*</div>*/}

    </>);
};

export default Projects;
