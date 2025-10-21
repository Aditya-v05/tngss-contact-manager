import React, { useState } from 'react';
import ContactForm from './components/ContactForm_temp.js';
import ContactList from './components/ContactList_temp.js';
import ExportButton from './components/ExportButton';
import Login from './components/Login'; // Import Login
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
          Adi's Contact Manager
        </h1>
        <ExportButton /> 
      </div>
      
      {/* Add the Login component */}
      <Login onUserChange={setCurrentUser} /> 

      <ContactForm onContactAdded={handleContactAdded} />
      
      <hr className="app-divider" />
      
      {/* We can now pass the user's email to the list */}
      <ContactList refreshKey={refreshKey} userEmail={currentUser?.email} />
    </div>
  );
}

export default App;