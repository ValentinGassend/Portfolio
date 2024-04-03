import React from "react";
import ColorManager from "../../managers/ColorManager.jsx";

const BackgroundLine = ({colorName = ColorManager.$color_neutral2, verticalCount = 3, horizontalCount = 3}) => {

    return (
        <div className={"BackgroundLine"} style={{ "--horizontalCount": horizontalCount + 1, "--verticalCount": verticalCount + 1, "--colorName": colorName}}>
            <div className={"BackgroundLine-vertical"}>
                {Array.from({length: verticalCount + 1}, (_, index) => (
                    <span key={`vertical-${index}`} className={"BackgroundLine-vertical--item"}></span>
                ))}
            </div>

            <div className={"BackgroundLine-horizontal"}>
                {Array.from({length: horizontalCount + 1}, (_, index) => (
                    <span key={`horizontal-${index}`} className={"BackgroundLine-horizontal--item"}></span>
                ))}
            </div>
        </div>
    );
};

export default BackgroundLine;
