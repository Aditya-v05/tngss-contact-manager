import React, { useState } from 'react';
import ContactForm from './components/ContactForm_temp.js';
import ContactList from './components/ContactList_temp.js';
import ExportButton from './components/ExportButton';
import Login from './components/Login'; // Import Login
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
      {/* ... (Header) ... */}
      
      <Login onUserChange={setCurrentUser} /> 

      {/* --- PASS THE USER ID DOWN --- */}
      <ContactForm 
        onContactAdded={handleContactAdded} 
        userId={currentUser?.uid} 
      />
      
      <hr className="app-divider" />
      
      <ContactList 
        refreshKey={refreshKey} 
        userEmail={currentUser?.email}
        userId={currentUser?.uid} 
      />
      
       {/* --- Pass it to ExportButton too --- */}
      <div className="app-header-container">
        <h1 className="app-header">TNGSS Contact Manager</h1>
        <ExportButton userId={currentUser?.uid} /> 
      </div>
    </div>
  );
}

export default App;