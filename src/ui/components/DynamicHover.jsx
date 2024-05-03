import React, {useState, useEffect, useRef} from "react";

const DynamicHover = ({ text = "", parentClass, hoveredText = "", hoverTriggerClass = null }) => {
    const [isActive, setIsActive] = useState(false);
    const dynamicHoverRef = useRef(null);

    useEffect(() => {
        const handleHover = () => {
            setIsActive(true);
        };

        const handleMouseOut = () => {
            setIsActive(false);
        };

        if (!hoverTriggerClass) {
            hoverTriggerClass = "DynamicHover"
        }
            const dynamicHoverElement = document.querySelector(`.${parentClass}-dynamic`);
            if (dynamicHoverElement) {
                const trigger = dynamicHoverRef.current.closest(`.${hoverTriggerClass}`);
                if (trigger) {
                    trigger.addEventListener("mouseenter", handleHover);
                    trigger.addEventListener("mouseleave", handleMouseOut);

                    return () => {
                        trigger.removeEventListener("mouseenter", handleHover);
                        trigger.removeEventListener("mouseleave", handleMouseOut);
                    };
                }
            }
    }, [hoverTriggerClass, parentClass]);

    return (
        <div ref={dynamicHoverRef} className={`${parentClass}-dynamic DynamicHover ${isActive ? "__Active" : ""}`}>
            <p className={`${parentClass}-dynamic--original DynamicHover-original`}>
                {text}
            </p>
            <p className={`${parentClass}-dynamic--hover DynamicHover-hover`}>
                {isActive && hoveredText !== "" ? hoveredText : text}
            </p>
        </div>
    );
};

export default DynamicHover;
