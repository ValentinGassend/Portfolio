import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {SplitText} from "gsap/SplitText";
import {IsMobile} from "../../../../utils/utils.jsx";

const AboutIntro = () => {


    gsap.registerPlugin(ScrollTrigger, SplitText)
    useEffect(() => {
        if (!IsMobile()) {
            let AboutTextAppearSplit

            if (document.getElementsByClassName("__AboutTextAppear") && !document.getElementsByClassName("__AboutTextAppear-line")[0]) {
                AboutTextAppearSplit = new SplitText(".__AboutTextAppear", {
                    type: "lines", linesClass: "__AboutTextAppear-line"
                })
            }
            if (AboutTextAppearSplit) {
                gsap.to(AboutTextAppearSplit.lines, {
                    backgroundPositionX: "0%", stagger: 0.2, scrollTrigger: {
                        trigger: ".__AboutTextAppearContainer", scrub: 1,

                        start: "top center", end: "center center"
                    }
                });
            }
        }
    }, []);


    return (

        <div className={"AboutIntro __HorizontalPanel"}>
            <div className={"AboutIntro-container __AboutTextAppearContainer"}>
                <div className={"AboutIntro-container--item After"}>
                    <img loading={"lazy"} src={`https://picsum.photos/1800/1800`}
                         className={`AboutIntro-container--item---background `} alt={""}/>
                    <p className={"AboutIntro-container--item---content __AboutTextAppear"}> Je suis Valentin
                        Gassend,étudiant et
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
