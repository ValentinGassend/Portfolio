import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {IsMobile} from "../../../../utils/utils.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";

const AboutDetails = () => {


    gsap.registerPlugin(ScrollTrigger)
    useEffect(() => {
        document.getElementsByClassName("Back")[0].addEventListener("click", (e) => {
            //     ajoute la position en x et y de la souris au click au style de l'element
            e.preventDefault()
            e.target.style.setProperty("--x", e.clientX - e.target.offsetLeft + "px");
            e.target.style.setProperty("--y", e.clientY - e.target.offsetTop + "px");
        });
    }, []);


    return (

        <div className={"AboutDetails Before __HorizontalPanel"}>
            {IsMobile ?
                <BackgroundLine colorName={ColorManager.$color_neutral2} verticalCount={2} horizontalCount={4}/> :
                <BackgroundLine colorName={ColorManager.$color_neutral2}/>}
            <div className={"AboutDetails-container"}>

                <div className={"AboutDetails-container--item"}>
                    <p className={"AboutDetails-container--item---content"}> Mon parcours de développement a commencé il
                        y a sept ans avec la création de sites web statiques en HTML et CSS. Au fil du temps, j'ai
                        élargi mes compétences pour inclure le développement web dynamique avec JavaScript, PHP et des
                        frameworks comme Blade pour Laravel. J'ai ensuite exploré le domaine des applications web, en
                        utilisant des technologies modernes telles que React, Vue.js et Three.js pour créer des
                        expériences utilisateur innovantes. En parallèle, j'ai également exploré l'IoT, le développement
                        mobile et même le jeu vidéo, élargissant ainsi mes horizons et enrichissant mes connaissances
                        dans le domaine de la technologie.</p>
                    <p className={"AboutDetails-container--item---content"}> Au cours de mes deux dernières années en
                        alternance, j'ai eu l'occasion d'enrichir mes compétences en développement front dans le monde
                        professionnel. De la mise en place de CMS Wordpress à la création de sites interactifs avec
                        React, ainsi que des expériences 3D avec ThreeJS, j'ai pu approfondir mes connaissances et
                        acquérir une expérience solide dans ce domaine en constante évolution. En parallèle, mon
                        parcours à l'école a été une source d'inspiration pour l'innovation. Les projets de groupe
                        stimulants, les séances de brainstorming mêlant développeurs et designers passionnés, ainsi que
                        les défis techniques, ont nourri ma créativité, me poussant à repousser les limites de mes
                        compétences techniques.</p>
                </div>

                <div className={"AboutDetails-container--item"}>
                    <a href={`/`} className={"AboutDetails-container--item---content Back Uppercase"}> Retour
                        a l'accueil</a>
                </div>
            </div>

        </div>);
};

export default AboutDetails;
