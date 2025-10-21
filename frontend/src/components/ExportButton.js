import React, { useState } from 'react';
import { db } from '../firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import './ExportButton.css'; // We'll create this CSS file

const ExportButton = () => {
    const [loading, setLoading] = useState(false);

    const handleExportAll = async () => {
        if (loading) return; // Prevent double-clicks
        
        setLoading(true);
        try {
            // 1. Fetch ALL contacts from Firestore
            console.log("Fetching all contacts for export...");
            const contactsQuery = query(
                collection(db, 'contacts'),
                orderBy('name', 'asc') // Exporting in alphabetical order is nice
            );

            const querySnapshot = await getDocs(contactsQuery);
            const allContacts = querySnapshot.docs.map(doc => doc.data());
            
            if (allContacts.length === 0) {
                alert("No contacts found to export.");
                return;
            }
            
            console.log(`Found ${allContacts.length} contacts.`);

            // 2. Format the data for the sheet
            const dataToExport = allContacts.map(contact => ({
                Name: contact.name,
                Company: contact.company,
                Industry: contact.industry,
                Email: contact.email,
                Mobile: contact.mobile,
                'Follow Up': contact.follow_up ? 'YES' : 'NO',
                'TNGSS Year': contact.tngss_year,
                Notes: contact.notes
            }));

            // 3. Create and trigger the download
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            XLSX.utils.book_append_sheet(wb, ws, "All Contacts");
            XLSX.writeFile(wb, "TNGSS_All_Contacts.xlsx");

        } catch (error) {
            console.error("Error exporting documents: ", error);
            alert("Failed to export contacts. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleExportAll} 
            className="export-all-button" 
            disabled={loading}
        >
            {loading ? 'Exporting...' : 'Export All Data'}
        </button>
    );
};

export default ExportButton;