import React, { useEffect, useState } from "react";
import MenuSection from "./components/MenuSection.jsx";

const Menu = ({ scrollPosition }) => {
    const [menu, setMenu] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const menuElement = document.querySelector('.Menu');
        setMenu(menuElement);

        // Détecter si on est sur mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Vérifier au chargement
        checkMobile();

        // Mettre à jour lors du redimensionnement
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const closeMenu = (evt) => {
        if (menu && menu.classList.contains("active")) {
            menu.classList.remove("active");
            document.getElementById('root').classList.remove('no-scroll');
            window.scrollTo(0, scrollPosition);
        }
    };

    useEffect(() => {
        if (menu) {
            document.querySelector('.__MenuCloser').addEventListener("click", closeMenu);
            return () => {
                document.querySelector('.__MenuCloser').removeEventListener("click", closeMenu);
            };
        }
    }, [menu, scrollPosition]);

    return (
        <div className="Menu">
            <div className="Menu-scroll-container">
                <div className="Menu-scroll-track">
                    {/* En mobile, seule la première section sera affichée grâce au CSS */}
                    <MenuSection />
                    {!isMobile && (
                        <>
                            <MenuSection />
                            <MenuSection />
                            <MenuSection />
                            <MenuSection />
                        </>
                    )}
                </div>
            </div>

            <div className="Menu-close __MenuCloser">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 37 37" fill="none">
                    <path d="M4.20458 -0.000234323L0 4.20435L32.7958 37.0001L37.0003 32.7955L4.20458 -0.000234323Z" fill="black"/>
                    <path d="M5.47257e-06 32.7955L4.20459 37.0001L37.0003 4.20434L32.7958 -0.000244141L5.47257e-06 32.7955Z" fill="black"/>
                </svg>
            </div>
        </div>
    );
};

export default Menu;