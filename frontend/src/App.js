import React, { useState } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import ExportButton from './components/ExportButton';
import Login from './components/Login';
import './firebase.js'; 
import './App.css'; 

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentUser, setCurrentUser] = useState(null); // Keep track of user

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
      
      {/* --- This shows your login status --- */}
      <Login onUserChange={setCurrentUser} /> 

      {/* --- You should only have ONE of these --- */}
      <ContactForm onContactAdded={handleContactAdded} />
      
      <hr className="app-divider" />
      
      {/* --- This shows your contact list --- */}
      <ContactList refreshKey={refreshKey} userEmail={currentUser?.email} />
    </div>
  );
}

export default App;