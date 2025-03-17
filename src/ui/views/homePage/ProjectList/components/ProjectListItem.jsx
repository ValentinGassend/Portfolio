import React, { useEffect, useRef } from "react";
import Effect from "../../../fonctionality/Effect.jsx";
import sharedEffectManager from "../../../fonctionality/SharedEffectManager";

// Adding the map method to Number prototype
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const ProjectListItem = ({ project }) => {
    const imgRef = useRef(null);
    const containerRef = useRef(null);
    const itemsWrapperRef = useRef(null);

    useEffect(() => {
        // Initialize Effect with shared data
        const effect = new Effect(containerRef.current, itemsWrapperRef.current, {}, sharedEffectManager);

        // Add resize event listener
        window.addEventListener('resize', effect.onWindowResize.bind(effect));

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', effect.onWindowResize.bind(effect));
        };
    }, []);

    return (
        <article ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <div ref={itemsWrapperRef}>
                <a
                    href={`project/${project.id}`}
                    className="ProjectListItem Center"
                    style={{ "--color": project.color, position: 'relative', width: '100%' }}
                    aria-labelledby={`project-title-${project.id}`}
                >
                    <header className="ProjectListItem-header">
                        <time dateTime={`${project.year}`}>{project.year}</time> - {project.client}
                    </header>

                    <h3 id={`project-title-${project.id}`} className="ProjectListItem-title TxtCenter Uppercase Before After">
                        {project.title}
                    </h3>

                    <div className="ProjectListItem-subtitle" role="list" aria-label="Technologies utilisées">
                        {project.tags.map((tag, index) => (
                            <p key={index} className="ProjectListItem-subtitle--tag Before" role="listitem">
                                {tag}
                            </p>
                        ))}
                    </div>

                    <img
                        className="ProjectListItem-img"
                        src={project.imageUrl}
                        alt={`Aperçu du projet ${project.title}`}
                        ref={imgRef}
                        loading="lazy"
                    />
                </a>
            </div>
        </article>
    );
};

export default ProjectListItem;
