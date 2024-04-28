import React from "react";

const MenuSection = () => {


    return (
        <div className={"MenuSection"}>
            <div className={"MenuSection-item"}>
                <p className={"MenuSection-item--text Uppercase"}>Développeur web créatif</p>
                <p className={"MenuSection-item--text Uppercase"}>Basé à annecy</p>
            </div>
            <a href="/" className={"MenuSection-item"}>
                <h1 className={"MenuSection-item--title Uppercase"}>

                    Accueil
                </h1>

            </a>
            <a href="/projects" className={"MenuSection-item"}>
                <h1 className={"MenuSection-item--title Uppercase"}>
                    Projets

                </h1>
            </a>
            <a href="/about" className={"MenuSection-item"}>
                <h1 className={"MenuSection-item--title Uppercase"}>

                    à propos
                </h1>

            </a>
            <a href="#" className={"MenuSection-item"}>
                <h1 className={"MenuSection-item--title Uppercase"}>
                    Labo
                </h1>

            </a>
            <div className={"MenuSection-item"}>
                <p className={"MenuSection-item--text Uppercase"}>En recherche d'alternance</p>
                <p className={"MenuSection-item--text Uppercase"}>Portfolio</p>
            </div>
        </div>
    )
}
export default MenuSection