import React, { useState } from 'react';
import { db } from '../firebase.js'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './contactForm.css'; // Import the form CSS

const ContactForm = ({ onContactAdded }) => {
    const initialState = {
        name: '', company: '', industry: '', email: '', 
        mobile: '', tngss_year: new Date().getFullYear(), notes: '', follow_up: false,
    };
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.name || !formData.company) {
                alert("Name and Company are required.");
                return;
            }

            await addDoc(collection(db, 'contacts'), {
                ...formData,
                tngss_year: Number(formData.tngss_year), 
                timestamp: serverTimestamp() 
            });

            alert(`Contact for ${formData.name} saved successfully!`);
            setFormData(initialState); 
            if (onContactAdded) onContactAdded(); 

        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to save contact.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="contact-form">
            <h3 className="form-title">Add New Contact</h3>
            
            <div className="form-grid">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Contact Name" required className="form-input"/>
                <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" required className="form-input"/>
                <input name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry (e.g., AI, SaaS)" className="form-input"/>
                <input name="tngss_year" value={formData.tngss_year} onChange={handleChange} placeholder="TNGSS Year" type="number" required className="form-input"/>
            </div>

            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" className="form-input full-width" /><br/>
            <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" className="form-input full-width" /><br/>

            <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                placeholder="Notes from card/brochure..." 
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
                <button type="submit" className="submit-button">
                    Save Contact
                </button>
            </div>
        </form>
    );
};

export default ContactForm;