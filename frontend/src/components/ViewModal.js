// Add userEmail and onEmail to the props
const ViewModal = ({ contact, onClose, onEdit, onDelete, userEmail, onEmail }) => {
    if (!contact) return null;
    
    // Check if user is logged in AND this contact has an email
    const canEmail = userEmail && contact.email;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            {/* ... modal content ... */}
            
            {/* ... modal header ... */}

            {/* ... modal body ... */}

            {/* --- UPDATED: view-modal-footer --- */}
            <div className="view-modal-footer">
                
                {/* --- NEW: Email Button --- */}
                {/* Show this button ONLY if we can email them */}
                {canEmail && (
                    <button className="email-button" onClick={onEmail}>
                        Email
                    </button>
                )}

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
    );
};