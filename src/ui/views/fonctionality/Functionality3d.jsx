import * as THREE from 'three';
import React, {useEffect, useRef} from 'react';
import gsap from 'gsap';
import ImageHoverEffect from "./ImageHoverEffect.jsx";
import ProjectListItem from "../homePage/ProjectList/components/ProjectListItem.jsx";
import projects from "../projectsPage/projects.jsx";
import projectsData from "../../../models/projectsData.js";

// Adding the map method to Number prototype
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};


class Functionality3d extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show: true};
    }

    render() {
        return (
            <div>
                <style>{`
          .link {
            display: inline-block;
            margin: 20px;
          }

          .link img {
            display: none;
            width: 300px;
            height: auto;
          }
        `}</style>
                <ProjectListItem
                    key={1} // Add key prop here
                    project={projectsData[0]}
                />
            </div>
        );
    }
}

export default Functionality3d;
