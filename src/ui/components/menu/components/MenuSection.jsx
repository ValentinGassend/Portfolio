import React from "react";
import DynamicHover from "../../DynamicHover.jsx";

const MenuSection = () => {


    return (<div className={"MenuSection"}>
        <div className={"MenuSection-item"}>
            <p className={"MenuSection-item--text Uppercase"}>Développeur web créatif</p>
            <p className={"MenuSection-item--text Uppercase"}>Basé à Aix-Les-Bains</p>
        </div>
        <a href="/" className={"MenuSection-item"}>
            <div className={"MenuSection-item--title Uppercase"}>
                <DynamicHover text={"Accueil"} parentClass={"MenuSection-item--title"}
                              hoverTriggerClass={"MenuSection-item"}
                />
            </div>

        </a>
        <a href="/projects" className={"MenuSection-item"}>
            <div className={"MenuSection-item--title Uppercase"}>
                <DynamicHover text={"Projets"} parentClass={"MenuSection-item--title"}
                              hoverTriggerClass={"MenuSection-item"}/>


            </div>
        </a>
        <a href="/about" className={"MenuSection-item"}>
            <div className={"MenuSection-item--title Uppercase"}>
                <DynamicHover text={"A propos"} parentClass={"MenuSection-item--title"}
                              hoverTriggerClass={"MenuSection-item"}/>


            </div>

        </a>
        <a href={'/lab'} className={"MenuSection-item"}>
            <div className={"MenuSection-item--title Uppercase"}>
                <DynamicHover text={"Lab"} parentClass={"MenuSection-item--title"}
                              hoverTriggerClass={"MenuSection-item"}/>

            </div>

        </a>
        <div className={"MenuSection-item"}>
            <p className={"MenuSection-item--text Uppercase"}>disponible en freelance</p>
            <p className={"MenuSection-item--text Uppercase"}>Portfolio</p>
        </div>
    </div>)
}
export default MenuSection