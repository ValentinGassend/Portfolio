import React from 'react';
import { COLOR_PALETTE } from './constants';

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
                    <div className="popup-image-container">
                        {/* Create a canvas to render a larger version of the project */}
                        <canvas
                            width={project.width * 2}
                            height={project.height * 2}
                            className="popup-canvas"
                            ref={(canvasRef) => {
                                if (canvasRef && project.canvas) {
                                    const ctx = canvasRef.getContext('2d');
                                    ctx.drawImage(
                                        project.canvas,
                                        0, 0,
                                        project.width, project.height,
                                        0, 0,
                                        project.width * 2, project.height * 2
                                    );
                                }
                            }}
                        />
                    </div>
                    <div className="project-details">
                        <h3>Project Details</h3>
                        <p>This is project #{project.index + 1} with size ratio: {(project.sizeRatio * 100).toFixed(0)}%</p>
                        <p>The parallax factor for this project is: {project.parallaxFactor.toFixed(2)}</p>
                        <p>Dimensions: {Math.round(project.width)}px × {Math.round(project.height)}px</p>
                        <div className="actions">
                            <button className="action-button">View Details</button>
                            <button className="action-button">Share</button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
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
                    backdrop-filter: blur(8px);
                }

                .popup-content {
                    background-color: ${COLOR_PALETTE.neutral1};
                    border-radius: 12px;
                    width: 90%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    animation: popIn 0.3s ease-out;
                }

                @keyframes popIn {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
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
                    font-size: 1.8rem;
                }

                .close-button {
                    background: none;
                    border: none;
                    font-size: 32px;
                    cursor: pointer;
                    color: #666;
                    height: 40px;
                    width: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }

                .close-button:hover {
                    color: #000;
                    background-color: rgba(0, 0, 0, 0.05);
                }

                .popup-body {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                }

                .popup-image-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .popup-canvas {
                    max-width: 100%;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .project-details {
                    color: #333;
                }

                .project-details h3 {
                    margin-top: 0;
                    font-size: 1.4rem;
                    color: #444;
                    margin-bottom: 16px;
                }

                .project-details p {
                    margin: 8px 0;
                    font-size: 1.1rem;
                    line-height: 1.5;
                }

                .actions {
                    margin-top: 24px;
                    display: flex;
                    gap: 12px;
                }

                .action-button {
                    padding: 10px 20px;
                    background-color: ${COLOR_PALETTE.accent1};
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .action-button:hover {
                    background-color: #8837e0;
                }

                @media (min-width: 768px) {
                    .popup-body {
                        flex-direction: row;
                        gap: 36px;
                    }

                    .popup-image-container {
                        flex: 1;
                        margin-bottom: 0;
                    }

                    .project-details {
                        flex: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default LabPopup;