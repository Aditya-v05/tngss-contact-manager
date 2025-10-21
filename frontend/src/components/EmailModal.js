import React, { useState } from 'react';
import './EditModal.css'; // Reuse styles
import './EmailModal.css'; // Add new styles

const EmailModal = ({ show, onClose, contact, fromEmail }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromEmail: fromEmail, // Your verified sender email
          toEmail: contact.email, // The contact's email
          subject: subject,
          body: body,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send. Check console.');
      }

      setStatus({ loading: false, error: '', success: `Email sent to ${contact.name}!` });
      setSubject('');
      setBody('');
      setTimeout(onClose, 2000); // Close modal after 2s on success

    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="contact-form">
          <h3 className="form-title">Send Email</h3>
          
          <div className="email-meta">
            <p><strong>From:</strong> {fromEmail}</p>
            <p><strong>To:</strong> {contact.name} ({contact.email})</p>
          </div>

          <input 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
            placeholder="Subject" 
            required 
            className="form-input full-width"
          />
          <textarea 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            placeholder="Hi..." 
            rows="8" 
            required
            className="form-textarea full-width"
          />
          
          <div className="form-footer">
            {status.error && <p className="email-status-error">{status.error}</p>}
            {status.success && <p className="email-status-success">{status.success}</p>}
            
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-button" disabled={status.loading}>
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={status.loading}>
                {status.loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;