import React from "react";
import SvgManager from "../../../../../managers/SvgManager.jsx";
import ContactMaskingBackground from "./Contact_masking_background.jsx";
import BackgroundLine from "../../../../components/BackgroundLine.jsx";

const ContactMasking = () => {


    return (<>
        <div className={"ContactMasking"}>
            <ContactMaskingBackground/>

            <div className="ContactMasking-frontground">
                <span className="ContactMasking-frontground--content Center Uppercase">Let's contact !</span>
            </div>

            <div className="ContactMasking-cursor __ContactMaskingCursor">
                <SvgManager name={`ContactMaskingCursor`} parentClassName={`ContactMasking-cursor`}/>

                <div className="ContactMasking-background">
                    <span className="ContactMasking-background--content Center Uppercase">Let's contact !</span>
                    <BackgroundLine/>

                </div>

            </div>

        </div>
    </>)
}
export default ContactMasking