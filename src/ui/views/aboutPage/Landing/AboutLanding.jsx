import React, {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {IsMobile} from "../../../../utils/utils.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";
import SvgManager from "../../../../managers/SvgManager.jsx";

const AboutLanding = () => {


    gsap.registerPlugin(ScrollTrigger)
    useEffect(() => {

    }, []);


    return (

        <div className={"AboutLanding Before"}>
                {/*<BackgroundLine colorName={ColorManager.$color_neutral1} horizontalCount={6} verticalCount={3}/>*/}
                {IsMobile ?
                    <BackgroundLine colorName={ColorManager.$color_neutral1} verticalCount={2} horizontalCount={4}/> :
                    <BackgroundLine colorName={ColorManager.$color_neutral1}/>}
                <div className={"AboutLanding-container"}>

                    <div className={"AboutLanding-container--item "}>

                        <h2 className={"AboutLanding-container--item---content Uppercase"}>Figma
                            stroke plugin frame
                            <b>editor</b> overflow horizontal arrow.</h2>
                    </div>
                </div>
        </div>);
};

export default AboutLanding;
