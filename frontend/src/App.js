import React, { useState } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import ExportButton from './components/ExportButton';
import Login from './components/Login';
import './firebase.js'; 
import './App.css'; 

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentUser, setCurrentUser] = useState(null); 

  const handleContactAdded = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="app-container">
      
      {/* --- MOVED THIS BLOCK BACK TO THE TOP --- */}
      <div className="app-header-container">
        <h1 className="app-header">
          TNGSS Contact Manager
        </h1>
        {/* Pass the userId to the export button */}
        <ExportButton userId={currentUser?.uid} /> 
      </div>
      
      {/* This shows your login status */}
      <Login onUserChange={setCurrentUser} /> 

      {/* Pass the user ID to the form */}
      <ContactForm 
        onContactAdded={handleContactAdded} 
        userId={currentUser?.uid} 
      />
      
      <hr className="app-divider" />
      
      {/* Pass the user ID and email to the list */}
      <ContactList 
        refreshKey={refreshKey} 
        userEmail={currentUser?.email}
        userId={currentUser?.uid} 
      />
      
      {/* --- The header block is no longer down here --- */}
      
    </div>
  );
}

export default App;