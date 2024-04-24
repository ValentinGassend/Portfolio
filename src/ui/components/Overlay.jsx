import React, {useEffect, useRef, useState} from "react";
import ProjectSingle from "../views/projectsPage/projectSingle/projectSingle.jsx";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

const Overlay = ({projectsPage = false, projectsList}) => {

    const [menu, setMenu] = useState(null);
    gsap.registerPlugin(ScrollToPlugin)
    useEffect(() => {
        const menuElement = document.querySelector(".Menu");
        setMenu(menuElement);

    }, []);

    useEffect(() => {
        const projectsList = document.querySelectorAll(".Overlay-center--item---text");
        projectsList.forEach((projectItem, index) => {
            projectItem.addEventListener('click', function (evt) {
                evt.preventDefault();
                let segments = evt.target.href.split("#");
                let lastSegment = segments[segments.length - 1];
                const targetElement = document.querySelector(`#${lastSegment}`);
                console.log(targetElement)
                scrollToTargetElement(targetElement);
            });
        });
    }, []);
    const scrollToTargetElement = (targetElement) => {
        if (targetElement) {
            const offset = targetElement.getBoundingClientRect().top + window.scrollY;

            gsap.to(window, {
                duration: 1.2,
                scrollTo: {
                    y: offset,
                    smooth: 0.5,
                    behavior:"smooth"
                },
                ease: "hop"
            })
        }
    };
    const openMenu = (evt) => {
        if (menu && !menu.classList.contains("active")) {
            menu.classList.add("active");
        }
    };
    useEffect(() => {
        if (menu) {
            document
                .querySelector(".__MenuOpener")
                .addEventListener("click", openMenu);
            return () => {
                document
                    .querySelector(".__MenuOpener")
                    .removeEventListener("click", openMenu);
            };
        }
    }, [menu]);
    return (<>
        {projectsPage && projectsList ? <div className={`Overlay Projects`}>
                <div className={`Overlay-upper`}>
                    <div className={`Overlay-upper--item`}>
                        <p className={`Overlay-upper--item---text Uppercase`}>Creative web developer</p>
                    </div>
                    <div className={`Overlay-upper--item __MenuOpener`}>
                        <p className={`Overlay-upper--item---text Uppercase`}>ME<br/>NU</p>
                    </div>
                </div>
                <div className={`Overlay-center`}>
                    <div className={`Overlay-center--item `}>
                        {projectsList.map((project, index) => (<a key={index} href={`#project${index}`}
                                                                  className={`Overlay-center--item---text Uppercase Before`}>
                            {project.title}
                        </a>))}
                    </div>
                </div>
                <div className={`Overlay-lower`}>

                    <div className={`Overlay-lower--item`}>
                        <p className={`Overlay-lower--item---text Uppercase`}>Projects</p>
                    </div>
                </div>

            </div>

            : <div className={`Overlay`}>
                <div className={`Overlay-upper`}>
                    <div className={`Overlay-upper--item`}>
                        <p className={`Overlay-upper--item---text Uppercase`}>Creative web developer</p>
                    </div>
                    <div className={`Overlay-upper--item`}>
                        <p className={`Overlay-upper--item---text Uppercase`}>Based in annecy</p>
                    </div>
                    <div className={`Overlay-upper--item __MenuOpener`}>
                        <p className={`Overlay-upper--item---text Uppercase`}>ME<br/>NU</p>
                    </div>
                </div>
                <div className={`Overlay-lower`}>

                    <div className={`Overlay-lower--item`}>
                        <p className={`Overlay-lower--item---text Uppercase`}>Open to work</p>
                    </div>
                    <div className={`Overlay-lower--item`}>
                        <p className={`Overlay-lower--item---text Uppercase`}>Portfolio</p>
                    </div>
                    <div className={`Overlay-lower--item`}>
                        <p className={`Overlay-lower--item---text Uppercase`}>2024</p>
                    </div>
                </div>

            </div>}
    </>)
}
export default Overlay