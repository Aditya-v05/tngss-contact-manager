import React from 'react';
import './ViewModal.css'; // We'll create this CSS file next

const ViewModal = ({ contact, onClose, onEdit, onDelete }) => {
    if (!contact) return null;

    return (
        // Modal backdrop
        <div className="modal-backdrop" onClick={onClose}>
            {/* Modal content */}
            <div className="view-modal-content" onClick={e => e.stopPropagation()}>
                
                {/* Header with name and year */}
                <div className="view-modal-header">
                    <h2 className="card-name">{contact.name} ({contact.tngss_year})</h2>
                    {contact.follow_up && (
                        <span className="follow-up-tag follow-up-yes">Follow Up: YES</span>
                    )}
                </div>

                {/* Body with details */}
                <div className="view-modal-body">
                    <p className="card-company">{contact.company}</p>
                    <p className="card-detail"><strong>Industry:</strong> {contact.industry || 'N/A'}</p>
                    <p className="card-contact">
                        {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                        {contact.email && contact.mobile && ' | '}
                        {contact.mobile}
                    </p>
                    <p className="card-notes">
                        {contact.notes || 'No notes recorded.'}
                    </p>
                </div>

                {/* Footer with action buttons */}
                <div className="view-modal-footer">
                    <button className="edit-button" onClick={onEdit}>
                        Edit
                    </button>
                    <button className="delete-button" onClick={onDelete}>
                        Delete
                    </button>
                    <button className="cancel-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewModal;