import React from "react";

const GridFullWidth = ({ parentClassName, childrensInArray, itemByLine = 3 }) => {

    const renderContent = (content) => {
        if (content.includes("<#>")) {
            const splitContent = content.split("<#>");
            return splitContent.map((part, index) => (
                <React.Fragment key={index}>
                    {childrensInArray.link ? (
                        <a className={"GridFullWidth-row--item---content"} href={childrensInArray.link}>
                            {part}
                        </a>
                    ) : (
                        <p className={"GridFullWidth-row--item---content"}>
                            {part}
                        </p>
                    )}
                </React.Fragment>
            ));
        } else {
            return (
                <React.Fragment key={index}>
                    {childrensInArray.link ? (
                        <a className={"GridFullWidth-row--item---content"} href={childrensInArray.link}>
                            {content}
                        </a>
                    ) : (
                        <p className={"GridFullWidth-row--item---content"}>
                            {content}
                        </p>
                    )}
                </React.Fragment>
            );
        }
    };

    // Diviser les enfants en sous-tableaux pour chaque ligne
    const rows = [];
    for (let i = 0; i < childrensInArray.length; i += itemByLine) {
        rows.push(childrensInArray.slice(i, i + itemByLine));
    }

    return (
        <div className={`${parentClassName}-grid GridFullWidth`} style={{ "--itemByLine": itemByLine }}>
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="GridFullWidth-row">
                    {row.map((children, index) => (
                        <div key={index} className={`GridFullWidth-row--item`}>
                            {renderContent(children.content)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GridFullWidth;
