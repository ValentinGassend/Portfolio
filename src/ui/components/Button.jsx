import styleBtnManager from "../../managers/StyleBtnManager.jsx";

const Button = ({url, text = "", style, parentClass}) => {

    const btnClass = styleBtnManager(style)
    return (
        <>
            {url ? (
                <div className={`${parentClass}-btn ${btnClass}`}>
                    <a className={`${parentClass}-btn--link`} href={url} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a>
                    <span className={`${parentClass}-btn--decoration`}></span>
                </div>
            ) : (
                <></>
            )
            }
        </>
    );
};
export default Button