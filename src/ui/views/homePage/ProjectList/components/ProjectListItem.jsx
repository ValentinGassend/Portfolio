import React from "react";

const ProjectListItem = ({project}) => {


    return (<>
        <div className={"ProjectListItem-header"} >
            {project.date} - {project.client}

        </div>
        <h3 className={"ProjectListItem-title Before After"}>
            {project.name}
        </h3>
        <div className={"ProjectListItem-subtitle"}>
        {project.tags.map((tag, index) => (
                <p key={index} className={"ProjectListItem-subtitle--tag Before"}>
                    {tag}
                </p>
        ))}
        </div>
        <img className={"ProjectListItem-img"} src={project.imageUrl} alt={project.name}/>
    </>)
}
export default ProjectListItem