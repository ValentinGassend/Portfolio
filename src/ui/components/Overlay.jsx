import React, { useEffect, useRef, useState } from "react";
import ProjectSingle from "../views/projectsPage/projectSingle/projectSingle.jsx";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import ColorManager from "../../managers/ColorManager.jsx";
import Menu from "./menu/Menu.jsx";

const Overlay = ({ projectsPage = false, projectsList, singleProjectPage = false, project, about = false }) => {

    const [menu, setMenu] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const mousePosition = useRef({ x: 0, y: 0 });

    gsap.registerPlugin(ScrollToPlugin);

    useEffect(() => {
        const menuElement = document.querySelector(".Menu");
        setMenu(menuElement);
    }, []);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const { clientX: x, clientY: y } = event;
            mousePosition.current = { x, y };
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const projectsList = document.querySelectorAll(".Overlay-center--item---text");
        projectsList.forEach((projectItem, index) => {
            projectItem.addEventListener('click', function (evt) {
                evt.preventDefault();
                let segments = evt.target.href.split("#");
                let lastSegment = segments[segments.length - 1];
                const targetElement = document.querySelector(`#${lastSegment}`);
                console.log(targetElement);
                scrollToTargetElement(targetElement);
            });
        });

        if (!about && !projectsPage && !singleProjectPage) {
            gsap.to(".Overlay", {
                opacity: 0, zIndex: -1, scrollTrigger: {
                    trigger: ".Contact", start: "top center", end: "bottom bottom", scrub: true,
                }
            });
        }
        if (projectsPage) {
            gsap.to(".Overlay-upper--item---text", {
                color: ColorManager.$color_neutral1, scrollTrigger: {
                    trigger: ".Projects-landing", start: "bottom center", end: "bottom top", scrub: true,
                }
            });
            gsap.to(".Overlay-lower--item---text", {
                color: ColorManager.$color_neutral1, scrollTrigger: {
                    trigger: ".Projects-landing", start: "bottom center", end: "bottom top", scrub: true,
                }
            });
        }
    }, []);

    const scrollToTargetElement = (targetElement) => {
        if (targetElement) {
            const offset = targetElement.getBoundingClientRect().top + window.scrollY;

            gsap.to(window, {
                duration: 1.2, scrollTo: {
                    y: offset, smooth: 0.5, behavior: "smooth"
                }, ease: "hop"
            });
        }
    };

    const openMenu = (evt) => {
        if (menu && !menu.classList.contains("active")) {
            console.log(window.scrollY);
            setScrollPosition(window.scrollY);
            menu.classList.add("active");
            document.getElementById("root").classList.add("no-scroll");
        }
    };

    useEffect(() => {
        if (menu) {
            const menuOpener = document.querySelector(".__MenuOpener");
            const menuCloser = document.querySelector(".__MenuCloser");

            if (menuOpener && menuCloser) {
                menuOpener.addEventListener("click", openMenu);

                const handleMagneticEffect = () => {
                    const { x, y } = mousePosition.current;

                    const rectOpener = menuOpener.getBoundingClientRect();
                    const distanceToMouseOpener = Math.sqrt(Math.pow(x - (rectOpener.left + rectOpener.width / 2), 2) + Math.pow(y - (rectOpener.top + rectOpener.height / 2), 2));

                    const rectCloser = menuCloser.getBoundingClientRect();
                    const distanceToMouseCloser = Math.sqrt(Math.pow(x - (rectCloser.left + rectCloser.width / 2), 2) + Math.pow(y - (rectCloser.top + rectCloser.height / 2), 2));

                    const distanceThreshold = 100; // Adjust this threshold as needed

                    if (distanceToMouseOpener < distanceThreshold) {
                        const dxOpener = x - (rectOpener.left + rectOpener.width / 2);
                        const dyOpener = y - (rectOpener.top + rectOpener.height / 2);

                        gsap.to(menuOpener, {
                            duration: 0.3, x: dxOpener * 0.2, y: dyOpener * 0.2, ease: 'power2.out'
                        });
                    } else {
                        gsap.to(menuOpener, {
                            duration: 0.3, x: 0, y: 0, ease: 'power2.out'
                        });
                    }

                    if (distanceToMouseCloser < distanceThreshold) {
                        const dxCloser = x - (rectCloser.left + rectCloser.width / 2);
                        const dyCloser = y - (rectCloser.top + rectCloser.height / 2);

                        gsap.to(menuCloser, {
                            duration: 0.3, x: dxCloser * 0.2, y: dyCloser * 0.2, ease: 'power2.out'
                        });
                    } else {
                        gsap.to(menuCloser, {
                            duration: 0.3, x: 0, y: 0, ease: 'power2.out'
                        });
                    }
                };

                const handleMagneticEffectRaf = () => {
                    handleMagneticEffect();
                    requestAnimationFrame(handleMagneticEffectRaf);
                };

                handleMagneticEffectRaf();

                return () => {
                    window.removeEventListener('mousemove', handleMagneticEffect);
                    document.querySelector(".__MenuOpener").removeEventListener("click", openMenu);
                };
            }
        }
    }, [menu]);

    return (
        <>
            <Menu scrollPosition={scrollPosition} />
            {about ? (
                <nav className={`Overlay About`} role="navigation" aria-label="Navigation principale">
                    <div className={`Overlay-upper`}>
                        <div className={`Overlay-upper--item __MenuOpener`}>
                            <p className={`Overlay-upper--item---text Uppercase`}>ME<br />NU</p>
                        </div>
                    </div>
                </nav>
            ) : (
                <>
                    {projectsPage && projectsList ? (
                        <nav className={`Overlay Projects`} role="navigation" aria-label="Navigation principale et liste des projets">
                            <div className={`Overlay-upper`}>
                                <div className={`Overlay-upper--item`}>
                                    <a href={"/"} className={`Overlay-upper--item---text Uppercase`}>Développeur web créatif</a>
                                </div>
                                <div className={`Overlay-upper--item __MenuOpener`}>
                                    <p className={`Overlay-upper--item---text Uppercase`} aria-label="Ouvrir le menu">ME<br />NU</p>
                                </div>
                            </div>
                            <div className={`Overlay-center`}>
                                <nav className={`Overlay-center--item`} aria-label="Navigation rapide vers les projets">
                                    {projectsList.map((project, index) => (
                                        <a key={index}
                                           href={`#project${index}`}
                                           className={`Overlay-center--item---text Uppercase Before`}
                                           aria-label={`Aller au projet ${project.title}`}>
                                            {project.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                            <div className={`Overlay-lower`}>
                                <div className={`Overlay-lower--item`}>
                                    <h2 className={`Overlay-lower--item---text Uppercase`}>Projects</h2>
                                </div>
                            </div>
                        </nav>
                    ) : (
                        <>
                            {singleProjectPage && project ? (
                                <aside className={`Overlay SingleProject`} aria-label="Informations sur le projet">
                                    <div className={`Overlay-left`}></div>
                                    <div className={`Overlay-right`}>
                                        <header className={`Overlay-right--upper`}>
                                            <div className={`Overlay-right--upper---item`}>
                                                <h1 className={`Overlay-right--upper---item----text Uppercase`}>{project.title}</h1>
                                            </div>
                                            <div className={`Overlay-right--upper---item`}>
                                                <time className={`Overlay-right--upper---item----text Uppercase`} dateTime={`${project.year}`}>{project.year}</time>
                                                <p className={`Overlay-right--upper---item----text Uppercase`}>{project.client}</p>
                                            </div>
                                        </header>
                                        <footer className={`Overlay-right--lower`}>
                                            <div className={`Overlay-right--lower---item`} role="list" aria-label="Technologies utilisées">
                                                {project.tags.map((tag, index) => (
                                                    <p key={index} className={`Overlay-right--lower---item----text Uppercase`} role="listitem">{tag}</p>
                                                ))}
                                            </div>
                                        </footer>
                                    </div>
                                </aside>
                            ) : (
                                <div className={`Overlay`} role="banner">
                                    <div className={`Overlay-upper`}>
                                        <div className={`Overlay-upper--item`}>
                                            <h1 className={`Overlay-upper--item---text Uppercase`}>Développeur web créatif</h1>
                                        </div>
                                        <div className={`Overlay-upper--item`}>
                                            <p className={`Overlay-upper--item---text Uppercase`}>Basé à annecy</p>
                                        </div>
                                        <div className={`Overlay-upper--item __MenuOpener`}>
                                            <p className={`Overlay-upper--item---text Uppercase`} aria-label="Ouvrir le menu">ME<br />NU</p>
                                        </div>
                                    </div>
                                    <div className={`Overlay-lower`}>
                                        <div className={`Overlay-lower--item`}>
                                            <p className={`Overlay-lower--item---text Uppercase`}>Disponible en freelance</p>
                                        </div>
                                        <div className={`Overlay-lower--item`}>
                                            <p className={`Overlay-lower--item---text Uppercase`}>Portfolio</p>
                                        </div>
                                        <div className={`Overlay-lower--item`}>
                                            <p className={`Overlay-lower--item---text Uppercase`}>2024</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Overlay;
