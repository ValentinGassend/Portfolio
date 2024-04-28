import React, {useEffect} from "react";

const ProjectSingle = ({project, index}) => {
    const projectStyle = {
        "--color": project.color, // Utilisation de la couleur définie dans le projet
    };

    return (<a href={`/project/${project.id}`} className={"ProjectSingle"} style={projectStyle} id={`project${index}`}>

        <div className={"ProjectSingle-header"}>
            {project.year} - {project.client}
        </div>
        <h3 className={"ProjectSingle-title"}>{project.title}</h3>


        <div className={"ProjectSingle-subtitle"}>
            {project.tags.map((tag, index) => (<p key={index} className={"ProjectSingle-subtitle--tag Before"}>
                {tag}
            </p>))}
        </div>
    </a>);
};

export default ProjectSingle;
