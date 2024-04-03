import React from "react";
import SvgManager from "../../../../../managers/SvgManager.jsx";
import ContactMaskingBackground from "./Contact_masking_background.jsx";

const ContactMasking = () => {


    return (<>
        <div className={"ContactMasking"}>
            <div className="ContactMasking-frontground">
                <span className="ContactMasking-frontground--content">Let's contact !</span>
            </div>

            <div className="ContactMasking-cursor __ContactMaskingCursor">
                <SvgManager name={`ContactMaskingCursor`} parentClassName={`ContactMasking-cursor`}/>
                <ContactMaskingBackground/>
            </div>
        </div>
    </>)
}
export default ContactMasking