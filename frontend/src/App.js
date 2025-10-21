import React, { useState, useEffect } from 'react';
import { db } from './firebase.js'; // Ensure this path is correct
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; 
import ContactForm from './components/contactForm';
import ContactList from './components/contactList';
import ExportButton from './components/ExportButton';
import Chatbot from './components/Chatbot'; // --- NEW ---
import './App.css'; 

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  // --- NEW: State and fetch logic moved here from ContactList ---
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch contacts on load and when a new one is added
  useEffect(() => {
    fetchContacts();
  }, [refreshKey]);
  // --- END of moved logic ---


  const handleContactAdded = () => {
    setRefreshKey(prevKey => prevKey + 1); // This will now trigger the fetch in App.js
  };

  return (
    <div className="app-container">
      
      <div className="app-header-container">
        <h1 className="app-header">
          TNGSS Contact Manager
        </h1>
        <ExportButton /> 
      </div>

      <ContactForm onContactAdded={handleContactAdded} />
      
      <hr className="app-divider" />
      
      {/* --- UPDATED: Pass contacts and loading state down --- */}
      <ContactList 
        contacts={contacts} 
        loading={loading}
        onRefresh={fetchContacts} // Pass a way to refresh from the list
      />
      
      {/* --- NEW: Add the chatbot --- */}
      <Chatbot allContacts={contacts} />
    </div>
  );
}

export default App;