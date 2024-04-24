import React, {useState} from "react";
import ProjectListItem from "./components/ProjectListItem.jsx";

const ProjectList = () => {

    const projectData = [{
        name: "Elysium VR Experience",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2023",
        tags: ["virtual reality", "experience", "entertainment"],
        client: "Elysium Studios"
    }, {
        name: "Aquatic Adventure Game",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2023",
        tags: ["game", "adventure", "underwater"],
        client: "Oceanic Games"
    }, {
        name: "Retro Music Player App",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2023",
        tags: ["app", "music", "retro", "design"],
        client: "RetroTech Inc."
    }, {
        name: "Urban Art Festival Website",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2023",
        tags: ["website", "festival", "art", "urban"],
        client: "City Arts Council"
    }, {
        name: "Cosmic Explorer Mobile Game",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2024",
        tags: ["mobile", "game", "space", "exploration"],
        client: "Stellar Entertainment"
    }, {
        name: "Wildlife Conservation Platform",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2024",
        tags: ["platform", "conservation", "wildlife", "environment"],
        client: "Global Wildlife Fund"
    }, {
        name: "Dreamscape Art Installation",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2024",
        tags: ["art", "installation", "dream", "immersive"],
        client: "DreamWorld Exhibitions"
    }, {
        name: "Fantasy Kingdom Mobile Game",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2024",
        tags: ["mobile", "game", "fantasy", "kingdom"],
        client: "Fantasy Realms Studios"
    }, {
        name: "Culinary Adventure App",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2024",
        tags: ["app", "culinary", "adventure", "food"],
        client: "TasteTrekker Co."
    }, {
        name: "Mystic Forest VR Experience",
        imageUrl: "https://picsum.photos/2000/3000",
        date: "2025",
        tags: ["virtual reality", "experience", "nature", "mystery"],
        client: "Enchanted Studios"
    }];

    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    const handleMouseMove = (e) => {
        console.log(e)
        setMousePosition({x: e.offsetX, y: e.offsetY});
    };
    const handleMouseEnter = (evt) => {
        evt.target.classList.add("hovered")
        evt.target.addEventListener("mousemove", handleMouseMove)
    };

    const handleMouseLeave = (evt) => {
        evt.target.classList.remove("hovered")
        evt.target.removeEventListener("mousemove", handleMouseMove)


    };
    return (<>
        <section className={"ProjectList"}>
            <div className={"ProjectList-container"}>
                {projectData.map((project, index) => (<>
                    <a href={'#'} key={index}
                       className={`ProjectListItem Center`}
                       onMouseEnter={handleMouseEnter}
                       onMouseLeave={handleMouseLeave}>
                        <ProjectListItem project={project} mousePosition={mousePosition}/>
                    </a>
                    <span className={`ProjectList-container--separator`}></span>
                </>))}
                <a className={"ProjectList-container--more Center Before After"} href={'#'}>Voir plus de projets</a>
            </div>
        </section>

    </>)
}
export default ProjectList