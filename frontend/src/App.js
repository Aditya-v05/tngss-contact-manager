import React, { useState } from 'react';
import ContactForm from './components/contactForm';
import ContactList from './components/contactList';
import ExportButton from './components/ExportButton';
import './firebase.js'; 
import './App.css'; 

function App() {
  // We are only keeping refreshKey state here
  const [refreshKey, setRefreshKey] = useState(0);

  // This stays the same
  const handleContactAdded = () => {
    setRefreshKey(prevKey => prevKey + 1);
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
      
      {/* --- REVERTED --- */}
      {/* Pass refreshKey down, not contacts or loading */}
      <ContactList refreshKey={refreshKey} />
      
      {/* --- REMOVED --- */}
      {/* <Chatbot allContacts={contacts} /> was here */}
    </div>
  );
}

export default App;