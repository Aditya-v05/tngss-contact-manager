// frontend/src/components/ContactForm.js

import React, { useState } from 'react';
import { db } from '../firebase.js'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// You imported React twice, removing the duplicate below
// import React, { useState } from 'react'; // <--- REMOVE THIS DUPLICATE IMPORT
import './ContactForm.css'; 
import CardScanner from './CardScanner';

// Make sure you accept userId as a prop if you've implemented multi-user support
const ContactForm = ({ onContactAdded, userId }) => { 
    const initialState = {
        name: '', company: '', industry: '', email: '', 
        mobile: '', tngss_year: new Date().getFullYear(), notes: '', follow_up: false, 
        // We added tags array initialization here
        tags: [], 
    };
    const [formData, setFormData] = useState(initialState);
    const [scanMode, setScanMode] = useState(false);
    // Added state for the tag input string
    const [tagsInput, setTagsInput] = useState(''); 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
        }));
    };

    // Added handler for the tag input
    const handleTagsChange = (e) => {
        setTagsInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Added check for userId if implementing multi-user
        if (!userId) {
          alert("You must be logged in to save a contact.");
          return;
        }

        try {
            // Relaxed the company requirement
            if (!formData.name) { 
                alert("Name is required.");
                return;
            }
            
            // Added logic to convert tags string to array
            const tagsArray = tagsInput.split(',') 
                               .map(tag => tag.trim()) 
                               .filter(tag => tag.length > 0); 

            // Updated path for multi-user support
            const userContactsCollection = collection(db, 'users', userId, 'contacts');

            await addDoc(userContactsCollection, { // Use user-specific path
                ...formData,
                tngss_year: Number(formData.tngss_year), 
                tags: tagsArray, // Save the tags array
                timestamp: serverTimestamp() 
            });

            alert(`Contact for ${formData.name} saved successfully!`);
            setFormData(initialState); 
            setTagsInput(''); // Clear tag input
            setScanMode(false);
            if (onContactAdded) onContactAdded(); 

        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to save contact.');
        }
    };

    // --- THIS IS THE UPDATED PARSING FUNCTION ---
    const handleScanComplete = (rawText) => {
        console.log("Scanned text:", rawText);
        let text = rawText;

        // --- 1. Email Guessing (More Aggressive) ---
        text = text.replace(
          /([a-zA-Z0-9._-]+)(?:e|o|\(at\)|\[at\]|gr@at|gr@atsite|ereallygr@atsite| | e | o )([a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/gi, // Added spaces around e/o
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
            company: foundCompany,   
            industry: foundIndustry, 
            email: foundEmail,
            mobile: foundPhone,
            notes: rawText, 
            tags: [], // Reset tags on scan
        }));
        setTagsInput(''); // Reset tags input field
        
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
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Contact Name" required className="form-input"/>
                        {/* Removed 'required' from Company */}
                        <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="form-input"/>
                        <input name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry (e.g., AI, SaaS)" className="form-input"/>
                        <input name="tngss_year" value={formData.tngss_year} onChange={handleChange} placeholder="TNGSS Year" type="number" required className="form-input"/>
                    </div>

                    <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" className="form-input full-width" /><br/>
                    <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" className="form-input full-width" /><br/>
                    
                    {/* Added Tag Input */}
                    <input
                        name="tags"
                        value={tagsInput}
                        onChange={handleTagsChange}
                        placeholder="Tags (comma-separated, e.g., investor, AI)"
                        className="form-input full-width"
                    /><br/>

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