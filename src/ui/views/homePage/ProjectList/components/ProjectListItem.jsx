import React, {useEffect, useRef} from "react";
import Effect from "../../../fonctionality/Effect.jsx";
import ImageHoverEffect from "../../../fonctionality/ImageHoverEffect.jsx";
// Adding the map method to Number prototype
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const ProjectListItem = ({project, onMouseEnter, onMouseLeave, mousePosition = {x: 0, y: 0}}) => {
    const imgRef = useRef(null);

    const containerRef = useRef(null);
    const itemsWrapperRef = useRef(null);
    useEffect(() => {
        const effect = new Effect(containerRef.current, itemsWrapperRef.current);
        return () => {
            window.removeEventListener('resize', effect.onWindowResize);
        };
    }, []);

    return (

        <div ref={containerRef} style={{position: 'relative', width: '100%'}}>
            <div ref={itemsWrapperRef}>

                <a
                   href={`project/${project.id}`}
                   className="ProjectListItem Center"
                   style={{"--color": project.color, position: 'relative', width: '100%'}}
                >
                    {/*<>*/}
                    {/*<ImageHoverEffect/>*/}
                    <div className={"ProjectListItem-header"}>
                        {project.year} - {project.client}
                    </div>
                    <h3 className={"ProjectListItem-title TxtCenter Uppercase Before After"}>
                        {project.title}
                    </h3>
                    <div className={"ProjectListItem-subtitle"}>
                        {project.tags.map((tag, index) => (
                            <p key={index} className={"ProjectListItem-subtitle--tag Before"}>
                                {tag}
                            </p>))}
                    </div>
                    <img
                        className={"ProjectListItem-img"}
                        src={project.imageUrl}
                        alt={project.name}
                    />
                </a>
            </div>
        </div>);
};

export default ProjectListItem;
