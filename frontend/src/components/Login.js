import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import './Login.css'; // We'll create this

const Login = ({ onUserChange }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener checks if the user is signed in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      onUserChange(currentUser); // Tell App.js who the user is
      setLoading(false);
    });
    
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [onUserChange]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  if (loading) {
    return <div className="login-container"><p>Loading...</p></div>;
  }

  return (
    <div className="login-container">
      {user ? (
        <div className="login-info">
          <p>Signed in as: <strong>{user.email}</strong></p>
          <button onClick={handleLogout} className="auth-button logout">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="auth-button login">
          Sign In with Google (to Send Mail)
        </button>
      )}
    </div>
  );
};

export default Login;