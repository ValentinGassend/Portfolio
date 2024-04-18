import React, {useEffect, useState} from "react";

const Overlay = () => {

    const [menu, setMenu] = useState(null);

    useEffect(() => {
        const menuElement = document.querySelector('.Menu');
        setMenu(menuElement);
    }, []);

    const openMenu = (evt) => {
        if (menu && !menu.classList.contains("active")) {
            menu.classList.add("active");
        }
    };
    useEffect(() => {
        if (menu) {
            document.querySelector('.__MenuOpener').addEventListener("click", openMenu);
            return () => {
                document.querySelector('.__MenuOpener').removeEventListener("click", openMenu);
            };
        }
    }, [menu]);
    return (<>
        <div className={`Overlay`}>
            <div className={`Overlay-upper`}>
                <div className={`Overlay-upper--item`}>
                    <p className={`Overlay-upper--item---text Uppercase`}>Creative web developer</p>
                </div>
                <div className={`Overlay-upper--item`}>
                    <p className={`Overlay-upper--item---text Uppercase`}>Based in annecy</p>
                </div>
                <div className={`Overlay-upper--item __MenuOpener`}>
                    <p className={`Overlay-upper--item---text Uppercase`}>ME<br/>NU</p>
                </div>
            </div>
            <div className={`Overlay-lower`}>

                <div className={`Overlay-lower--item`}>
                    <p className={`Overlay-lower--item---text Uppercase`}>Open to work</p>
                </div>
                <div className={`Overlay-lower--item`}>
                    <p className={`Overlay-lower--item---text Uppercase`}>Portfolio</p>
                </div>
                <div className={`Overlay-lower--item`}>
                    <p className={`Overlay-lower--item---text Uppercase`}>2024</p>
                </div>
            </div>

        </div>
    </>)
}
export default Overlay