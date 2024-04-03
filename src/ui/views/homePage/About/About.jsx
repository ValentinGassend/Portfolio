import React from "react";
import SvgManager from "../../../../managers/SvgManager.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";

const About = () => {



    return (<>
        <section className={"About Before After"}>
            <BackgroundLine colorName={ColorManager.$color_neutral1} horizontalCount={6} verticalCount={3}/>

            <div className={"About-container"}>
                <div className={"About-container--item"}>
                    <h2 className={"About-container--item---content"}>Creative</h2>
                    <h2 className={"About-container--item---content Before After"}>Web</h2>
                    <h2 className={"About-container--item---content"}>Developer</h2>
                </div>

                <div className={"About-container--item"}>
                    <h2 className={"About-container--item---content"}>Figma stroke plugin frame editor overflow horizontal arrow.</h2>
                </div>
            </div>
        </section>
    </>)
}
export default About