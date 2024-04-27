import React, {useEffect} from "react";
import Overlay from "../../components/Overlay.jsx";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import AboutLanding from "./Landing/AboutLanding.jsx";
import AboutIntro from "./Intro/AboutIntro.jsx";
import AboutDetails from "./Details/AboutDetails.jsx";
import {Autoplay, FreeMode, Mousewheel} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";

const AboutPage = () => {


    gsap.registerPlugin(ScrollTrigger)
    let sections = gsap.utils.toArray(".__HorizontalPanel");
    useEffect(() => {
        // gsap.to(sections, {
        //     xPercent: -100 * (sections.length - 1), ease: "none", scrollTrigger: {
        //         trigger: ".__HorizontalScrollContainer",
        //         pin: ".__HorizontalScrollContainer",
        //         scrub: true,
        //         markers: true,
        //         snap: 1 / (sections.length - 1),
        //         end: () => "+=" + document.querySelector(".__HorizontalScrollContainer").offsetWidth
        //     }
        // });
    }, []);


    return (<>

        <div className={`__ScrollSmooth`}>
            <section className={"About"}>
                <AboutLanding/>
                <Swiper
                    slidesPerView={'auto'}
                    // loop={true}
                    freeMode={true}
                    modules={[Mousewheel, FreeMode]}
                    mousewheel={{
                        enabled: true,
                        releaseOnEdges: true,
                        eventsTarget:".About-swiper",
                        sensitivity:7.5
                    }}
                className={`About-swiper`}
                >
                    <SwiperSlide>
                        <AboutIntro/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <AboutDetails/>
                    </SwiperSlide>

                </Swiper>
            </section>
        </div>
    </>);
};

export default AboutPage;
