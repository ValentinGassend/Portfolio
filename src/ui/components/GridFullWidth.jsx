import React from "react";
import {IsMobile} from "../../utils/utils.jsx";

const GridFullWidth = ({parentClassName, childrensInArray, itemByLine = 3}) => {

    const renderContent = (content, link) => {
        if (content.includes("<#>")) {
            const splitContent = content.split("<#>");
            return splitContent.map((part, index) => (<React.Fragment key={index}>
                {link ? (<a className={"GridFullWidth-row--item---content"} target={`_blank`} href={link}>
                    {part}
                </a>) : (<p className={"GridFullWidth-row--item---content"}>
                    {part}
                </p>)}
            </React.Fragment>));
        } else {
            return (<React.Fragment key={index}>
                {link ? (<a className={"GridFullWidth-row--item---content"} target={`_blank`} href={link}>
                    {content}
                </a>) : (<p className={"GridFullWidth-row--item---content"}>
                    {content}
                </p>)}
            </React.Fragment>);
        }
    };
    const filteredChildrens = IsMobile ? childrensInArray.filter((child) => !child.excludeOnMobile) : childrensInArray;

    // Diviser les enfants en sous-tableaux pour chaque ligne
    const rows = [];
    for (let i = 0; i < filteredChildrens.length; i += itemByLine) {
        rows.push(filteredChildrens.slice(i, i + itemByLine));
    }

    return (<div className={`${parentClassName}-grid GridFullWidth`} style={{"--itemByLine": itemByLine}}>
            {rows.map((row, rowIndex) => (<div key={rowIndex} className="GridFullWidth-row">
                    {row.map((children, index) => (<div key={index} className={`GridFullWidth-row--item`}>
                            {renderContent(children.content, children.link)}
                        </div>))}
                </div>))}
        </div>);
};

export default GridFullWidth;
