import React, { useState, useEffect } from 'react';
import './contactForm.css'; // We can reuse the same form styles!
import './EditModal.css';   // We'll add new styles for the modal overlay

const EditModal = ({ contact, onSave, onClose }) => {
    // Initialize form state with the contact data being edited
    const [formData, setFormData] = useState(contact);

    // Update state if the contact prop changes (e.g., opening modal for a different contact)
    useEffect(() => {
        setFormData(contact);
    }, [contact]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Pass the updated data (which includes the id) to the parent
    };

    return (
        // Modal backdrop
        <div className="modal-backdrop" onClick={onClose}>
            {/* Modal content */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Re-using the contact-form styles for consistency */}
                <form onSubmit={handleSubmit} className="contact-form">
                    <h3 className="form-title">Edit Contact</h3>
                    
                    <div className="form-grid">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Contact Name" required className="form-input"/>
                        <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" required className="form-input"/>
                        <input name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry" className="form-input"/>
                        <input name="tngss_year" value={formData.tngss_year} onChange={handleChange} placeholder="TNGSS Year" type="number" required className="form-input"/>
                    </div>

                    <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" className="form-input full-width" />
                    <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" className="form-input full-width" />

                    <textarea 
                        name="notes" 
                        value={formData.notes} 
                        onChange={handleChange} 
                        placeholder="Notes..." 
                        rows="3" 
                        className="form-textarea full-width"
                    />
                    
                    <div className="form-footer">
                        <label className="form-checkbox-label">
                            <input 
                                name="follow_up" 
                                checked={formData.follow_up} 
                                onChange={handleChange} 
                                type="checkbox" 
                                className="form-checkbox"
                            />
                            Mark for Follow Up
                        </label>
                        <div className="modal-actions">
                             <button type="button" onClick={onClose} className="cancel-button">
                                Cancel
                            </button>
                            <button type="submit" className="submit-button">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;