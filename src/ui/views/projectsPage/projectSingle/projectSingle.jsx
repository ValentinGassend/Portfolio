import React from "react";

const ProjectSingle = ({project, index}) => {
    // Liste de projets


    return (<div className={"ProjectSingle"} id={`project${index}`}>

        <div className={"ProjectSingle-header"}>
            {project.year} - {project.client}
        </div>
        <h3 className={"ProjectSingle-title"}>{project.title}</h3>


        <div className={"ProjectSingle-subtitle"}>
            {project.tags.map((tag, index) => (<p key={index} className={"ProjectSingle-subtitle--tag Before"}>
                {tag}
            </p>))}
        </div>
    </div>);
};

export default ProjectSingle;
