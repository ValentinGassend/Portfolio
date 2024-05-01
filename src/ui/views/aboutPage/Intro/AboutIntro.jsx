import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const AboutIntro = () => {


    gsap.registerPlugin(ScrollTrigger)
    useEffect(() => {

    }, []);


    return (

        <div className={"AboutIntro __HorizontalPanel"}>
            <div className={"AboutIntro-container"}>
                <div className={"AboutIntro-container--item After"}>
                    <img src={`https://picsum.photos/1800/1800`}
                         className={`AboutIntro-container--item---background `} alt={""}/>
                    <p className={"AboutIntro-container--item---content"}> Je suis Valentin Gassend,étudiant et
                        développeur
                        passionné de 22 ans. J'ai exploré le développement
                        dans divers domaines pendant ces sept dernières années, commençant par le développement web
                        avant de m'aventurer dans l'IoT, le mobile, les jeux vidéos, et bien plus encore. Cependant,
                        c'est dans le développement web que se trouve ma véritable passion. ce portfolio est un chouette
                        reflet de mes réalisations aussi bien professionnelles que personnelles retracé avec une touche
                        de personnalité.</p>
                </div>
            </div>
        </div>);
};

export default AboutIntro;
