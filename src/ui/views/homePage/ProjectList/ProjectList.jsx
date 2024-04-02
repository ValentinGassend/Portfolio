import React from "react";

const ProjectList = () => {

    const projectData = [
        { name: "Project 1", imageUrl: "https://picsum.photos/2000/3000" },
        { name: "Project 2", imageUrl: "https://picsum.photos/2000/3000" },
        { name: "Project 3", imageUrl: "https://picsum.photos/2000/3000" },
        { name: "Project 4", imageUrl: "https://picsum.photos/2000/3000" },
        { name: "Project 5", imageUrl: "https://picsum.photos/2000/3000" },
        { name: "Project 6", imageUrl: "https://picsum.photos/2000/3000" },
        { name: "Project 7", imageUrl: "https://picsum.photos/2000/3000" },
        { name: "Project 8", imageUrl: "https://picsum.photos/2000/3000" },
        { name: "Project 9", imageUrl: "https://picsum.photos/2000/3000" },
        { name: "Project 10", imageUrl: "https://picsum.photos/2000/3000" }
    ];


    return (<>
        <section className={"ProjectList"}>
            <div className={"ProjectList-container"}>
                {projectData.map((project, index) => (<div key={index} className={"ProjectList-container--item"}>
                    <h3 className={"ProjectList-container--item---content Before After"}>
                        {project.name}
                    </h3>
                    <img className={"ProjectList-container--item---img"} src={project.imageUrl} alt={project.name}/>
                </div>))}
            </div>
        </section>

    </>)
}
export default ProjectList