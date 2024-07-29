import React, {lazy, Suspense} from "react";
import SvgManager from "../../../../managers/SvgManager.jsx";
import BackgroundLine from "../../../components/BackgroundLine.jsx";
import ColorManager from "../../../../managers/ColorManager.jsx";
import {IsMobile} from "../../../../utils/utils.jsx";

const AboutAnimations = lazy(() => import('./AboutAnimations'));
const About = () => {


    return (<>
        <section className={"About Before"}>
            {/*<BackgroundLine colorName={ColorManager.$color_neutral1} horizontalCount={6} verticalCount={3}/>*/}
            {IsMobile ?
                <BackgroundLine colorName={ColorManager.$color_neutral1} verticalCount={2} horizontalCount={4}/> :
                <BackgroundLine colorName={ColorManager.$color_neutral1}/>}
            <div className={"About-container"}>
                <div className={"About-container--item __AboutSticky"}>
                    <h2 className={"About-container--item---content Uppercase"}>Developpeur</h2>
                    <h2 className={"About-container--item---content Uppercase Before After"}>Web</h2>
                    <h2 className={"About-container--item---content Uppercase"}>creatif</h2>
                </div>

                <a href={'/about'} className={"About-container--item __AboutToProjectSticky __AboutCursorContainer"}>


                    <div className={`About-container--item---cursor __AboutCursor`}>

                        <SvgManager name={`AboutPlusCursor`} parentClassName={`About-container--item---cursor`}/>
                        <SvgManager name={`AboutTextCursor`} parentClassName={`About-container--item---cursor`}/>
                    </div>
                    <h2 className={"About-container--item---content Uppercase TxtCenter __AboutSplitText"}>Developpeur
                        frontend <b>passionne</b> en quete de defis creatifs.</h2>
                </a>
            </div>
        </section>
        <Suspense>
            <AboutAnimations />
        </Suspense>
    </>)
}
export default About