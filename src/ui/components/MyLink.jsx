import StyleLinkManager from "../../managers/StyleLinkManager.jsx";
import {Link} from "react-router-dom";

const MyLink = ({url, text = "", style, parentClass, isTarget = true}) => {

    const linkClass = StyleLinkManager(style)
    return (
        <>
            {url ? (
                <div className={`${parentClass}-link ${linkClass}`}>
                    <Link className={`${parentClass}-link--url  ${linkClass}--url`} to={url}
                       target={isTarget ? "_blank" : ""} rel="noopener noreferrer">
                        {text}
                    </Link>
                    <span className={`${parentClass}-link--decoration  ${linkClass}--decoration`}></span>
                </div>
            ) : (
                <></>
            )
            }
        </>
    );
};
export default MyLink
