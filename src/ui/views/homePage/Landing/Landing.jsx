import React from "react";
import SvgManager from "../../../../managers/SvgManager.jsx";

const Landing = () => {



    return (< section className={"Landing"}>
        <div className={"Landing-background"}>
            <SvgManager name={"n_element"} parentClassName={"Landing-background"}/>
        </div>
        <div className={"Landing-container"}>
        <SvgManager name={"full_logo"} parentClassName={"Landing-container"}/>
        </div>
    </>)
}
export default Landing