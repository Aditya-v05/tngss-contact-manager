import React, { useState } from 'react';
import { db } from '../firebase.js'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ContactForm.css'; // Import the form CSS
import CardScanner from './CardScanner'; // --- NEW: Import the scanner ---

const ContactForm = ({ onContactAdded }) => {
    const initialState = {
        name: '', company: '', industry: '', email: '', 
        mobile: '', tngss_year: new Date().getFullYear(), notes: '', follow_up: false,
    };
    const [formData, setFormData] = useState(initialState);
    
    // --- NEW: State for the "switch" ---
    const [scanMode, setScanMode] = useState(false);

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
            setScanMode(false); // Reset the scanner toggle
            if (onContactAdded) onContactAdded(); 

        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to save contact.');
        }
    };

    // --- NEW: Function to handle the scanned text ---
    const handleScanComplete = (text) => {
        console.log("Scanned text:", text);

        // Basic parsing with Regex (imperfect, but a good start)
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        const phoneRegex = /(\+?[0-9][0-9\s-]{7,}[0-9])/; // Simple phone regex

        const emailMatch = text.match(emailRegex);
        const phoneMatch = text.match(phoneRegex);

        const foundEmail = emailMatch ? emailMatch[0] : '';
        const foundPhone = phoneMatch ? phoneMatch[0].replace(/\s/g, '') : '';
        
        // Pre-fill the form! This is your "edit and review" step.
        setFormData(prev => ({
            ...prev,
            email: foundEmail,
            mobile: foundPhone,
            notes: text, // Put all raw text in notes for review
        }));
        
        // Flip back to the form
        setScanMode(false);
    };

    return (
        <form onSubmit={handleSubmit} className="contact-form">
            
            <div className="form-header-toggle">
                <h3 className="form-title">Add New Contact</h3>
                {/* --- NEW: The "Switch" --- */}
                <label className="scanner-toggle-label">
                    Scan Card
                    <input 
                        type="checkbox" 
                        checked={scanMode} 
                        onChange={() => setScanMode(!scanMode)} 
                        className="scanner-toggle-checkbox"
                    />
                    <span className="scanner-toggle-switch"></span>
                </label>
            </div>
            
            {/* --- NEW: Conditional Rendering --- */}
            {scanMode ? (
                <CardScanner onScanComplete={handleScanComplete} />
            ) : (
                <> 
                    {/* This is your existing form, now wrapped in a fragment */}
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
                </>
            )}
        </form>
    );
};

export default ContactForm;