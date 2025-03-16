import React from "react";
import "../styles/ExportModal.css";

const ExportModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null; // Hide modal when not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Export Data CSV</h3>
                <br />
                <p>Do you want to download the current records in the table?</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="yes-button">Yes</button>
                    <button onClick={onClose} className="no-button">No</button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
