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
                    <h2 className={"About-container--item---content Uppercase"}>Creative</h2>
                    <h2 className={"About-container--item---content Uppercase Before After"}>Web</h2>
                    <h2 className={"About-container--item---content Uppercase"}>Developer</h2>
                </div>

                <div className={"About-container--item"}>
                    <h2 className={"About-container--item---content Uppercase TxtCenter"}>Figma stroke plugin frame editor overflow horizontal arrow.</h2>
                </div>
            </div>
        </section>
    </>)
}
export default About