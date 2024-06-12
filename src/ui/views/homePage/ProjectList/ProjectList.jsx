import React from "react";
import ProjectListItem from "./components/ProjectListItem.jsx";
import projectsData from "../../../../models/projectsData.js";

const ProjectList = () => {
    // Sort projects by year
    const sortedProjects = projectsData.slice().sort((a, b) => b.year - a.year);

    // Filter projects with isPromoted true
    const promotedProjects = sortedProjects.filter((project) => project.isPromoted);

    return (
        <section className="ProjectList">
            <div className="ProjectList-container">
                {promotedProjects.map((project) => (
                    <ProjectListItem
                        key={project.id} // Ensure each item has a unique key
                        project={project}
                        // Additional props or event handlers can be added here if needed
                    />
                ))}
                <a className="ProjectList-container--more Center Before After" href="/projects">
                    Voir plus de projets
                </a>
            </div>
        </section>
    );
};

export default ProjectList;
