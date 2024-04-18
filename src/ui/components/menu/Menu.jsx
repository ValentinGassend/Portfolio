import React from "react";
import MenuSection from "./components/MenuSection.jsx";
import {Swiper} from "swiper/react";
import {SwiperSlide} from "swiper/react";

import 'swiper/css';
import 'swiper/css/autoplay';
import {Autoplay} from "swiper/modules";

const Menu = () => {


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
        <svg xmlns="http://www.w3.org/2000/svg" className={`Menu-close`} width="37" height="37" viewBox="0 0 37 37" fill="none">
            <path d="M4.20458 -0.000234323L0 4.20435L32.7958 37.0001L37.0003 32.7955L4.20458 -0.000234323Z" fill="black"/>
            <path d="M5.47257e-06 32.7955L4.20459 37.0001L37.0003 4.20434L32.7958 -0.000244141L5.47257e-06 32.7955Z" fill="black"/>
        </svg>
    </div>)
}
export default Menu