import React, { useState } from 'react';
import { db } from '../firebase.js'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ContactForm.css'; 
import CardScanner from './CardScanner';

const ContactForm = ({ onContactAdded, userId }) => {
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
    
    // 2. NEW: Check if the user is logged in
    if (!userId) {
      alert("You must be logged in to save a contact.");
      return;
    }

        try {
        if (!formData.name || !formData.company) {
            alert("Name and Company are required.");
            return;
        }
        
        // 3. NEW: Use the user-specific path
        const userContactsCollection = collection(db, 'users', userId, 'contacts');

        await addDoc(userContactsCollection, { // Use the new path
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

    // --- THIS IS THE NEW, SMARTER PARSING FUNCTION ---
    const handleScanComplete = (rawText) => {
        console.log("Scanned text:", rawText);
        let text = rawText;

        // --- 1. Email Guessing ---
        // Try to fix common OCR mistakes for "@" (like 'e' or 'o')
        // This line looks for "word-e-word.com" and changes it to "word@word.com"
        text = text.replace(/([a-zA-Z0-9._-]+)(?: e | o |\(at\)|\[at\]| |e|o)([a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/gi, '$1@$2');
        
        // Now run the strict regex on the *corrected* text
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
        const phoneRegex = /(\+?[0-9][0-9\s-]{7,}[0-9])/; 

        const emailMatch = text.match(emailRegex);
        const phoneMatch = text.match(phoneRegex);

        const foundEmail = emailMatch ? emailMatch[0] : '';
        const foundPhone = phoneMatch ? phoneMatch[0].replace(/\s/g, '') : '';
        
        // --- 2. Name, Company, & Industry Guessing ---
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 2);
        
        let foundName = '';
        let foundCompany = '';
        let foundIndustry = '';

        // Guess: The first valid line is the Name
        if (lines.length > 0) {
            foundName = lines[0];
        }

        // Guess: The second line is either a Title (Industry) or Company
        if (lines.length > 1) {
            const secondLine = lines[1];
            const lowerSecondLine = secondLine.toLowerCase();
            
            // Keywords that suggest a job title
            const titleKeywords = [
                'designer', 'engineer', 'manager', 'ceo', 'founder', 
                'developer', 'specialist', 'officer', 'consultant', 'architect'
            ];

            // Check if the second line sounds like a job title
            const isTitle = titleKeywords.some(keyword => lowerSecondLine.includes(keyword));
            
            if (isTitle) {
                // It's a title, let's use it for "Industry"
                foundIndustry = secondLine;
            } else {
                // Not a title? Let's guess it's the Company.
                foundCompany = secondLine;
            }
        }
        
        // --- 3. Pre-fill the form ---
        setFormData(prev => ({
            ...prev,
            name: foundName,       // Add the found name
            company: foundCompany, // Add the found company
            industry: foundIndustry, // Add the found industry
            email: foundEmail,
            mobile: foundPhone,
            notes: rawText, // Put ALL raw, original text in notes for review
        }));
        
        // Flip back to the form
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