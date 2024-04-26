import React from "react";

const MenuSection = () => {


    return (
        <div className={"MenuSection"}>
            <div className={"MenuSection-item"}>
                <p className={"MenuSection-item--text Uppercase"}>Creative web developer</p>
                <p className={"MenuSection-item--text Uppercase"}>Based in annecy</p>
            </div>
            <a href="/projects" className={"MenuSection-item"}>
                <h1 className={"MenuSection-item--title Uppercase"}>
                    Projects

                </h1>
            </a>
            <a href="/about" className={"MenuSection-item"}>
                <h1 className={"MenuSection-item--title Uppercase"}>

                    About
                </h1>

            </a>
            <a href="#" className={"MenuSection-item"}>
                <h1 className={"MenuSection-item--title Uppercase"}>

                    Contact
                </h1>

            </a>
            <a href="#" className={"MenuSection-item"}>
                <h1 className={"MenuSection-item--title Uppercase"}>

                    The lab
                </h1>

            </a>
            <div className={"MenuSection-item"}>
                <p className={"MenuSection-item--text Uppercase"}>Open to work</p>
                <p className={"MenuSection-item--text Uppercase"}>Portfolio</p>
            </div>
        </div>
    )
}
export default MenuSection