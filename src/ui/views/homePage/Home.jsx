import React from "react";
import Landing from "./Landing/Landing.jsx";
import About from "./About/About.jsx";
import ProjectList from "./ProjectList/ProjectList.jsx";
import Contact from "./Contact/Contact.jsx";
import Overlay from "../../components/Overlay.jsx";

const Home = () => {


    return (<section className={"Home"}>

        <Landing/>
        <About/>
        <ProjectList/>
        <Contact/>
        <Overlay/>

    </section>)
}
export default Home