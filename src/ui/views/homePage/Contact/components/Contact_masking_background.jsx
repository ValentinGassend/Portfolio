import React from "react";
import SvgManager from "../../../../../managers/SvgManager.jsx";
import GridFullWidth from "../../../../components/GridFullWidth.jsx";
import BackgroundLine from "../../../../components/BackgroundLine.jsx";

const ContactMaskingBackground = () => {
    const childrensInArray = [
        {content: "email :" + "<#>" + "valentin.gassend@gmail.com", link: "#"},
        {content: "twitter :" + "<#>" + "@valou.gass", link: "#"},
        {content: "phone :" + "<#>" + "07 07 07 07 07", link: "#"},
        {content: "github :" + "<#>" + "valentin.gassend", link: "#"},
        {content: "instagram :" + "<#>" + "@valou.gass", link: "#"},
        {content: "designed by :" + "<#>" + "Hugo Pinna", link: "#"},
    ];

    return (<>
        <div className="ContactMaskingBackground">
            <div className={"ContactMaskingBackground-background"}>
                <div className="ContactMaskingBackground-background--layout">
                    <SvgManager name={`valentiN`}
                                parentClassName={`ContactMaskingBackground-background--layout---item`}/>
                    <SvgManager name={`Gassend`}
                                parentClassName={`ContactMaskingBackground-background--layout---item`}/>
                </div>
                <BackgroundLine/>
            </div>
            <div className="ContactMaskingBackground-content">
                <h3 className="ContactMaskingBackground-content--title Center Uppercase">
                    You should !
                </h3>
                <div className="ContactMaskingBackground-content--bottom">

                    <GridFullWidth parentClassName={`ContactMaskingBackground-content--bottom`}
                                   childrensInArray={childrensInArray} itemByLine={3}/>
                    <h4 className="ContactMaskingBackground-content--bottom---title Uppercase">
                        phrase un peu cool qui explique voilà pourquoi faut me contacter moi phrase un peu cool qui explique voilà pourquoi faut me contacter moi phrase un peu cool qui explique voilà pourquoi faut me contacter moi phrase un peu cool qui explique voilà pourquoi faut me contacter moi phrase un peu cool qui explique voilà pourquoi faut me contacter moi phrase un peu cool qui explique voilà pourquoi faut me contacter moi
                    </h4>
                </div>
            </div>
        </div>
    </>)
}
export default ContactMaskingBackground