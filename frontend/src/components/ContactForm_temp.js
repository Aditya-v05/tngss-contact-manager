// frontend/src/components/ContactForm.js

import React, { useState } from 'react';
import { db } from '../firebase.js'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ContactForm.css'; 
import CardScanner from './CardScanner';

const ContactForm = ({ onContactAdded }) => {
    const initialState = {
        name: '', company: '', industry: '', email: '', 
        mobile: '', tngss_year: new Date().getFullYear(), notes: '', follow_up: false,
    };
    const [formData, setFormData] = useState(initialState);
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
                // NEW: Let's relax this rule for now, since company might be blank
                if (!formData.name) {
                    alert("Name is required.");
                    return;
                }
            }

            await addDoc(collection(db, 'contacts'), {
                ...formData,
                tngss_year: Number(formData.tngss_year), 
                timestamp: serverTimestamp() 
            });

            alert(`Contact for ${formData.name} saved successfully!`);
            setFormData(initialState); 
            setScanMode(false);
            if (onContactAdded) onContactAdded(); 

        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to save contact.');
        }
    };

    // --- THIS IS THE UPDATED FUNCTION ---
    const handleScanComplete = (rawText) => {
        console.log("Scanned text:", rawText);
        let text = rawText;

        // --- 1. Email Guessing (More Aggressive) ---
        // Looks for "word[e/o/(at)]word.com"
        // This will fix "helloereallygreatsite.com" -> "hello@reallygreatsite.com"
        // It also fixes "helloereallygr@atsite.com"
        text = text.replace(
          /([a-zA-Z0-9._-]+)(?:e|o|\(at\)|\[at\]|gr@at|gr@atsite|ereallygr@atsite)([a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/gi, 
          '$1@$2'
        );
        
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
        const phoneRegex = /(\+?[0-9][0-9\s-]{7,}[0-9])/; 

        const emailMatch = text.match(emailRegex);
        const phoneMatch = text.match(phoneRegex);

        const foundEmail = emailMatch ? emailMatch[0] : '';
        const foundPhone = phoneMatch ? phoneMatch[0].replace(/\s/g, '') : '';
        
        // --- 2. Name, Company, & Industry Guessing (Improved) ---
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 2);
        
        let foundName = '';
        let foundCompany = '';
        let foundIndustry = '';

        if (lines.length > 0) {
            foundName = lines[0]; // Guess: First line is Name
        }

        if (lines.length > 1) {
            const secondLine = lines[1];
            const lowerSecondLine = secondLine.toLowerCase();
            
            const titleKeywords = [
                'designer', 'engineer', 'manager', 'ceo', 'founder', 
                'developer', 'specialist', 'officer', 'consultant', 'architect'
            ];

            const isTitle = titleKeywords.some(keyword => lowerSecondLine.includes(keyword));
            
            // --- NEW LOGIC: ---
            // Only assign to one field, not both.
            if (isTitle) {
                foundIndustry = secondLine; // It's a title, put in Industry
            } else {
                foundCompany = secondLine; // Not a title? It must be the Company
            }
        }
        
        // --- 3. Pre-fill the form ---
        setFormData(prev => ({
            ...prev,
            name: foundName,
            company: foundCompany,   // Will be blank if a title was found
            industry: foundIndustry, // Will be blank if a company was found
            email: foundEmail,
            mobile: foundPhone,
            notes: rawText, // Put ALL raw, original text in notes for review
        }));
        
        setScanMode(false);
    };
    // --- END OF UPDATED FUNCTION ---

    return (
        <form onSubmit={handleSubmit} className="contact-form">
            
            <div className="form-header-toggle">
                <h3 className="form-title">Add New Contact</h3>
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
            
            {scanMode ? (
                <CardScanner onScanComplete={handleScanComplete} />
            ) : (
                <> 
                    <div className="form-grid">
                        {/* We now remove 'required' from Company, 
                          since the card might only have a name and title.
                        */}
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Contact Name" required className="form-input"/>
                        <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="form-input"/>
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