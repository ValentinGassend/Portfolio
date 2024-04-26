import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {IsMobile} from "../../../../utils/utils.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";

const AboutDetails = () => {


    gsap.registerPlugin(ScrollTrigger)
    useEffect(() => {

    }, []);


    return (

        <div className={"AboutDetails Before"}>
            {IsMobile ?
                <BackgroundLine colorName={ColorManager.$color_neutral2} verticalCount={2} horizontalCount={4}/> :
                <BackgroundLine colorName={ColorManager.$color_neutral2}/>}
            <div className={"AboutDetails-container"}>

                <div className={"AboutDetails-container--item"}>
                    <p className={"AboutDetails-container--item---content"}> Cursus tellus sit faucibus fermentum.
                        Mattis
                        euismod consequat commodo potenti tortor cursus congue
                        Amet pulvinar tincidunt cursus sit cursus libero. Lorem integer diam metus non sit. Vulputate
                        quis
                        blandit tempor turpis quis ullamcorper. Tincidunt pretium ornare ante aliquet facilisi diam. A
                        euismod aenean eget malesuada quam vitae mus tempus vitae.</p>
                    <p className={"AboutDetails-container--item---content"}> Cursus tellus sit faucibus fermentum.
                        Mattis
                        euismod consequat commodo potenti tortor cursus congue
                        Amet pulvinar tincidunt cursus sit cursus libero. Lorem integer diam metus non sit. Vulputate
                        quis
                        blandit tempor turpis quis ullamcorper. Tincidunt pretium ornare ante aliquet facilisi diam. A
                        euismod aenean eget malesuada quam vitae mus tempus vitae.</p>
                </div>

                <div className={"AboutDetails-container--item"}>
                    <a href={`/`} className={"AboutDetails-container--item---content Uppercase"}> Retour
                        sur
                        la
                        home</a>
                </div>
            </div>

        </div>);
};

export default AboutDetails;
