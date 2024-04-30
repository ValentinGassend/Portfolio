import React, { useState } from "react";
import ProjectListItem from "./components/ProjectListItem.jsx";
import projectsData from "../../../../models/projectsData.js";

const ProjectList = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setMousePosition({ x: e.offsetX, y: e.offsetY });
    };

    const handleMouseEnter = (evt) => {
        evt.target.classList.add("hovered");
        evt.target.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseLeave = (evt) => {
        evt.target.classList.remove("hovered");
        evt.target.removeEventListener("mousemove", handleMouseMove);
    };

    // Filter projects with isPromoted true
    const promotedProjects = projectsData.filter((project) => project.isPromoted);

    return (
        <>
            <section className="ProjectList">
                <div className="ProjectList-container">
                    {promotedProjects.map((project, index) => (
                        <>
                        <a
                            href={`project/${project.id}`}
                            key={index}
                            className="ProjectListItem Center"
                            style={{ "--color": project.color }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <ProjectListItem project={project} mousePosition={mousePosition} />
                        </a>
                            <span className="ProjectList-container--separator"></span>

                        </>
                    ))}
                    <a className="ProjectList-container--more Center Before After" href="/projects">
                        Voir plus de projets
                    </a>
                </div>
            </section>
        </>
    );
};

export default ProjectList;
