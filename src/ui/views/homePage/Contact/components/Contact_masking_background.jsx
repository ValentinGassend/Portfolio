import React, {useEffect, useRef} from "react";
import SvgManager from "../../../../../managers/SvgManager.jsx";
import GridFullWidth from "../../../../components/GridFullWidth.jsx";
import BackgroundLine from "../../../../components/BackgroundLine.jsx";
import gsap from "gsap";
import {Autoplay} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import MenuSection from "../../../../components/menu/components/MenuSection.jsx";
import {IsMobile} from "../../../../../utils/utils.jsx";

const ContactMaskingBackground = ({cursorClicked}) => {

    const childrensInArray = [{
        content: "email :" + "<#>" + "valentin.gassend@gmail.com",
        link: "mailto:valentin.gassend@gmail.com",
        excludeOnMobile: true
    }, {
        content: "twitter :" + "<#>" + "@GassValentin", link: "https://twitter.com/GassValentin", excludeOnMobile: false
    }, {
        content: "phone :" + "<#>" + "07 68 93 59 96", link: "tel:+0768935996", excludeOnMobile: false
    }, {
        content: "github :" + "<#>" + "ValentinGassend",
        link: "https://github.com/ValentinGassend",
        excludeOnMobile: true
    }, {
        content: "instagram :" + "<#>" + "@levavalou",
        link: "https://www.instagram.com/levavalou/",
        excludeOnMobile: false
    }, {
        content: "designed by :" + "<#>" + "Hugo Pinna", link: "https://hugopinna.com/", excludeOnMobile: false
    },];

    return (<>
        <div className="ContactMaskingBackground">
            <div className={'ContactMaskingBackground-texture'}></div>
            <div className={"ContactMaskingBackground-background"}>
                <div className="ContactMaskingBackground-background--layout">
                    <SvgManager name={`valentiN`}
                                parentClassName={`ContactMaskingBackground-background--layout`}/>
                    <SvgManager name={`Gassend`}
                                parentClassName={`ContactMaskingBackground-background--layout`}/>
                </div>
                <BackgroundLine/>
            </div>
            <div className="ContactMaskingBackground-content">
                <h3 className="ContactMaskingBackground-content--title Center Uppercase">
                    ça devient interessant !
                </h3>
                <div className={`ContactMaskingBackground-content--bottom ${cursorClicked ? "__clicked" : ''}`}>

                    <GridFullWidth parentClassName={`ContactMaskingBackground-content--bottom`}
                                   childrensInArray={childrensInArray} itemByLine={IsMobile() ? 2 : 3}/>

                    <Swiper
                        className="ContactMaskingBackground-content--bottom---title Uppercase __ScrollText"

                        slidesPerView={'auto'}
                        autoplay={{
                            enabled: true, delay: 0, disableOnInteraction: false,
                        }}
                        spaceBetween={30}
                        loop={true}
                        modules={[Autoplay]}
                        speed={7500}

                    >
                        <SwiperSlide>
                            <h4 className={"After Before"}>Besoin d'un developpeur passionne ? Tu n'as plus qu'a me contacter</h4>
                        </SwiperSlide>
                        <SwiperSlide>
                            <h4 className={"After Before"}>Besoin d'un developpeur passionne ? Tu n'as plus qu'a me contacter</h4>
                        </SwiperSlide>
                        <SwiperSlide>
                            <h4 className={"After Before"}>Besoin d'un developpeur passionne ? Tu n'as plus qu'a me contacter</h4>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>
    </>)
}
export default ContactMaskingBackground