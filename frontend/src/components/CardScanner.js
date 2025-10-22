// frontend/src/components/CardScanner.js

import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import './CardScanner.css';

const CardScanner = ({ onScanComplete }) => {
  const [ocrProgress, setOcrProgress] = useState(null);
  const [ocrStatus, setOcrStatus] = useState('Idle. Upload a card to begin.');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrStatus('Initializing worker...');
    setOcrProgress(0);

    // 1. Create the worker (without the logger)
    const worker = await createWorker();

    // 2. Subscribe to the worker's messages
    const unsubscribe = worker.subscribe(m => {
      if (m.status === 'recognizing text') {
        setOcrStatus('Recognizing text...');
        // m.progress is a value from 0 to 1
        setOcrProgress(m.progress);
      } else {
        // You can also log other statuses
        setOcrStatus(m.status);
      }
    });

    try {
      // 3. Load language and run recognition
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(file);
      
      setOcrStatus('Scan complete!');
      setOcrProgress(1);
      
      // 4. Pass the raw text up to the ContactForm
      onScanComplete(text);

    } catch (error) {
      console.error("OCR Error:", error);
      setOcrStatus('Scan failed. Please try again.');
    } finally {
      // 5. Clean up
      await worker.terminate();
      unsubscribe(); // Stop listening to messages
    }
  };

  return (
    <div className="scanner-container">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="scanner-input"
        id="card-scanner-input"
      />
      <label htmlFor="card-scanner-input" className="scanner-label">
        Upload Business Card
      </label>

      {ocrProgress !== null && (
        <div className="scanner-progress-bar">
          <div 
            className="scanner-progress-fill" 
            style={{ width: `${ocrProgress * 100}%` }}
          />
        </div>
      )}
      <p className="scanner-status">{ocrStatus}</p>
    </div>
  );
};

export default CardScanner;