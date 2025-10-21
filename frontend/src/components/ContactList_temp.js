// frontend/src/components/ContactList.js

import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js'; 
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore'; 
import EditModal from './EditModal.js';
import ViewModal from './ViewModal.js';
import EmailModal from './EmailModal.js'; // Import the new EmailModal
import './ContactList.css'; 

// Receive userEmail as a prop
const ContactList = ({ refreshKey, userEmail }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('');
    const [editingContact, setEditingContact] = useState(null);
    const [viewingContact, setViewingContact] = useState(null);

    // State to control the email modal
    const [isEmailing, setIsEmailing] = useState(false);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const contactsQuery = query(
                collection(db, 'contacts'),
                orderBy('timestamp', 'desc') 
            );
            const querySnapshot = await getDocs(contactsQuery);
            const fetchedContacts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setContacts(fetchedContacts);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on load and whenever a new contact is added (via refreshKey)
    useEffect(() => {
        fetchContacts();
    }, [refreshKey]); 

    const uniqueIndustries = [...new Set(contacts.map(c => c.industry).filter(Boolean).sort())];

    const filteredAndSearchedContacts = contacts.filter(contact => {
        if (filterIndustry && contact.industry !== filterIndustry) {
            return false;
        }
        const searchLower = searchTerm.toLowerCase();
        return (
            contact.name.toLowerCase().includes(searchLower) ||
            contact.company.toLowerCase().includes(searchLower) ||
            (contact.notes && contact.notes.toLowerCase().includes(searchLower))
        );
    });

    const shouldShowContacts = searchTerm.length > 0 || filterIndustry.length > 0;

    const handleDelete = async (contactId, contactName) => {
        if (window.confirm(`Are you sure you want to delete ${contactName}?`)) {
            try {
                await deleteDoc(doc(db, 'contacts', contactId));
                fetchContacts(); // Refetch after delete
                alert('Contact deleted successfully!');
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert('Failed to delete contact.');
            }
        }
    };

    const handleSaveEdit = async (updatedContact) => {
        const { id, ...dataToUpdate } = updatedContact; 
        try {
            await updateDoc(doc(db, 'contacts', id), dataToUpdate);
            fetchContacts(); // Refetch after update
            setEditingContact(null);
            alert('Contact updated successfully!');
        } catch (error) {
            console.error("Error updating document: ", error);
            alert('Failed to update contact.');
        }
    };

    if (loading) return <p className="loading-text">Loading TNGSS contacts...</p>;

    return (
        <div className="contact-list-container">
            {/* Edit Modal (unchanged) */}
            {editingContact && (
                <EditModal 
                    contact={editingContact}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingContact(null)}
                />
            )}
            
            {/* View Modal (updated) */}
            {viewingContact && (
                <ViewModal
                    contact={viewingContact}
                    userEmail={userEmail} // Pass the user's email down
                    onClose={() => setViewingContact(null)}
                    onEdit={() => {
                        setEditingContact(viewingContact);
                        setViewingContact(null);
                    }}
                    onDelete={() => {
                        handleDelete(viewingContact.id, viewingContact.name);
                        setViewingContact(null);
                    }}
                    // Prop to open email modal
                    onEmail={() => {
                        setIsEmailing(true); // Open email modal
                        // We keep the view modal open underneath
                    }}
                />
            )}

            {/* NEW: Email Modal */}
            {isEmailing && viewingContact && (
                <EmailModal
                  show={isEmailing}
                  contact={viewingContact} // Pass the contact being emailed
                  fromEmail={userEmail}   // Pass the logged-in user's email
                  onClose={() => setIsEmailing(false)} // Function to close it
                />
            )}

            <h3 className="list-title">Search & Filter Contacts</h3>
            
            <div className="filter-bar">
                <input 
                    type="text" 
                    placeholder="Search by Name, Company, or Notes..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="search-input"
                />
                <select 
                    value={filterIndustry} 
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Industries</option>
                    {uniqueIndustries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                    ))}
                </select>
            </div>
            
            {shouldShowContacts && (
                 <h3 className="list-subtitle">Contacts Found: {filteredAndSearchedContacts.length}</h3>
            )}
            
            <div className="contact-grid">
                {shouldShowContacts ? (
                    filteredAndSearchedContacts.map(contact => (
                        <div 
                            key={contact.id} 
                            className="contact-card" 
                            data-follow-up={contact.follow_up}
                            onClick={() => setViewingContact(contact)}
                            tabIndex="0" 
                            onKeyPress={(e) => e.key === 'Enter' && setViewingContact(contact)}
                        >
                            <h4 className="card-name">{contact.name} ({contact.tngss_year})</h4>
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
                            
                            {contact.follow_up ? (
                                <span className="follow-up-tag follow-up-yes">Follow Up: YES</span>
                            ) : (
                                <span className="follow-up-tag follow-up-no">Follow Up: No</span>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="prompt-text">
                        Type in the search bar or select an industry to find contacts.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ContactList;