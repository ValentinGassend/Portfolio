import React, {useEffect} from "react";
import DynamicHover from "../../../components/DynamicHover.jsx";

const ProjectSingle = ({project, index}) => {
    const projectStyle = {
        "--color": project.color, // Utilisation de la couleur définie dans le projet
    };

    return (<a href={`/project/${project.id}`} className={"ProjectSingle After"} style={projectStyle} id={`project${index}`}>

        <div className={"ProjectSingle-header"}>
            {project.year} - {project.client}
        </div>
        <div className={"ProjectSingle-title"}>
            <DynamicHover text={project.title} parentClass={"ProjectSingle-title"} hoverTriggerClass={"ProjectSingle"}/>
        </div>


        <div className={"ProjectSingle-subtitle"}>
            {project.tags.map((tag, index) => (<p key={index} className={"ProjectSingle-subtitle--tag Before"}>
                {tag}
            </p>))}
        </div>
    </a>);
};

export default ProjectSingle;
