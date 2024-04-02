import React from "react";

const GridFullWidth = ({ parentClassName, childrensInArray }) => {

    const renderContent = (content) => {
        // Check if content contains "<#>"
        if (content.includes("<#>")) {
            // Split the content if it contains "<#>"
            const splitContent = content.split("<#>");
            return splitContent.map((part, index) => (
                <React.Fragment key={index}>
                    {childrensInArray.link ? (
                        <a className={"GridFullWidth-item--content"} href={childrensInArray.link}>
                            {part}
                        </a>
                    ) : (
                        <p className={"GridFullWidth-item--content"}>
                            {part}
                        </p>
                    )}
                </React.Fragment>
            ));
        } else {
            // If content doesn't contain "<#>", render it as is
            return (
                <React.Fragment>
                    {childrensInArray.link ? (
                        <a className={"GridFullWidth-item--content"} href={childrensInArray.link}>
                            {content}
                        </a>
                    ) : (
                        <p className={"GridFullWidth-item--content"}>
                            {content}
                        </p>
                    )}
                </React.Fragment>
            );
        }
    };

    return (
        <div className={`${parentClassName}-grid GridFullWidth`}>
            {childrensInArray.map((children, index) => (
                <div key={index} className={`GridFullWidth-item`}>
                    {renderContent(children.content)}
                </div>
            ))}
        </div>
    );
};

export default GridFullWidth;
