import React from "react";
import SvgManager from "../../../../managers/SvgManager.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";

const Landing = () => {


    return (
        <section className={"Landing Center After"}>
            <BackgroundLine colorName={ColorManager.$color_neutral2}/>
            <div className={"Landing-background"}>
                <SvgManager name={"n_element"} parentClassName={"Landing-background"}/>
            </div>
            <div className={"Landing-container Center"}>
                <SvgManager name={"full_logo"} parentClassName={"Landing-container"}/>
            </div>
        </section>
    )
}
export default Landing