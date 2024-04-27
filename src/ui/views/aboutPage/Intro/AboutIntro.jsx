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
                    <p className={"AboutIntro-container--item---content"}> Cursus tellus sit faucibus fermentum. Mattis
                        euismod consequat commodo potenti tortor cursus congue
                        id. Dolor commodo pulvinar nullam volutpat nisl erat. Dui commodo scelerisque hendrerit iaculis
                        nulla. Eu lobortis lacus et ultrices. Consectetur.</p>
                </div>
            </div>
        </div>);
};

export default AboutIntro;
