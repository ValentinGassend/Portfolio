import React, {useEffect, useState} from "react";
import MenuSection from "./components/MenuSection.jsx";
import {Swiper} from "swiper/react";
import {SwiperSlide} from "swiper/react";

import 'swiper/css';
import 'swiper/css/autoplay';
import {Autoplay} from "swiper/modules";

const Menu = () => {


    const [menu, setMenu] = useState(null);

    useEffect(() => {
        const menuElement = document.querySelector('.Menu');
        setMenu(menuElement);
    }, []);

    const closeMenu = (evt) => {
        if (menu && menu.classList.contains("active")) {
            menu.classList.remove("active");
        }
    };
    useEffect(() => {
        if (menu) {
            document.querySelector('.__MenuCloser').addEventListener("click", closeMenu);
            return () => {
                document.querySelector('.__MenuCloser').removeEventListener("click", closeMenu);
            };
        }
    }, [menu]);
    return (<div className={"Menu"}>
        <Swiper
            slidesPerView={'auto'}
            autoplay={{
                enabled: true,
                delay: 0,
                disableOnInteraction: false,
            }}
            loop={true}
            modules={[Autoplay]}
            speed={7500}

        >
            <SwiperSlide>
                <MenuSection/>
            </SwiperSlide>
            <SwiperSlide>
                <MenuSection/>
            </SwiperSlide>
            <SwiperSlide>
                <MenuSection/>
            </SwiperSlide>
            <SwiperSlide>
                <MenuSection/>
            </SwiperSlide>
            <SwiperSlide>
                <MenuSection/>
            </SwiperSlide>
        </Swiper>
        <div className={`Menu-close __MenuCloser`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 37 37" fill="none">
            <path d="M4.20458 -0.000234323L0 4.20435L32.7958 37.0001L37.0003 32.7955L4.20458 -0.000234323Z" fill="black"/>
            <path d="M5.47257e-06 32.7955L4.20459 37.0001L37.0003 4.20434L32.7958 -0.000244141L5.47257e-06 32.7955Z" fill="black"/>
        </svg>
        </div>
    </div>)
}
export default Menu