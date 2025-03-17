import React from "react";
import Landing from "./Landing/Landing.jsx";
import About from "./About/About.jsx";
import ProjectList from "./ProjectList/ProjectList.jsx";
import Contact from "./Contact/Contact.jsx";
import Overlay from "../../components/Overlay.jsx";
import {Helmet} from "react-helmet";

const Home = () => {


    return (
        <main className="Home">
            <Helmet>
                <title>Portfolio - Valentin Gassend | Développeur front-end créatif</title>
                <meta name="description" content="Je m'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance basé à Annecy." />
                <link rel="canonical" href="https://valentingassend.com/" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://valentingassend.com/" />
                <meta property="og:title" content="Portfolio - Valentin Gassend | Développeur front-end créatif" />
                <meta property="og:description" content="Je m'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance basé à Annecy." />
                <meta property="og:image" content="https://www.valentingassend.com/img/landing.png" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content="https://valentingassend.com/" />
                <meta name="twitter:title" content="Portfolio - Valentin Gassend | Développeur front-end créatif" />
                <meta name="twitter:description" content="Je m'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance basé à Annecy." />
                <meta name="twitter:image" content="https://www.valentingassend.com/img/landing.png" />
            </Helmet>
            <header>

                <Overlay/>
            </header>

            <Landing/>

            <About/>

            <ProjectList/>

            <footer>
                <Contact/>
            </footer>
        </main>
    );
}
export default Home