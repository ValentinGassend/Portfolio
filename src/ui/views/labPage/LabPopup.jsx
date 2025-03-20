const LabPopup = ({project, onClose}) => {
    if (!project) return null;

    return (
        <div className="project-popup">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>{project.name}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="popup-body">
                    <img src={project.fullSizeImagePath} alt={project.name} className="popup-image"/>
                    <div className="project-details">
                        <p>This is the {project.name} project.</p>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .project-popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.75);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .popup-content {
                    background-color: ${COLOR_PALETTE.neutral1};
                    border-radius: 8px;
                    width: 80%;
                    max-width: 800px;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .popup-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 24px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }

                .popup-header h2 {
                    margin: 0;
                    color: #333;
                }

                .close-button {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }

                .close-button:hover {
                    color: #000;
                }

                .popup-body {
                    padding: 24px;
                }

                .popup-image {
                    width: 100%;
                    max-height: 400px;
                    object-fit: contain;
                    margin-bottom: 16px;
                }

                .project-details {
                    color: #333;
                }
            `}</style>
        </div>
    );
};

export default LabPopup;