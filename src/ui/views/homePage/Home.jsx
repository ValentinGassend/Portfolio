import React from "react";
import Landing from "./Landing/Landing.jsx";
import About from "./About/About.jsx";
import ProjectList from "./ProjectList/ProjectList.jsx";
import Contact from "./Contact/Contact.jsx";

const Home = () => {


    return (<section className={"Home"}>
        <Landing/>
        <About/>
        <ProjectList/>
        <Contact/>
    </section>)
}
export default Home