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

    // 1. Create the worker and load the language in ONE step
    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        // The logger is the correct way to get progress
        if (m.status === 'recognizing text') {
          setOcrStatus('Recognizing text...');
          setOcrProgress(m.progress);
        } else {
          setOcrStatus(m.status);
        }
      },
    });

    try {
      // 2. We can now recognize immediately.
      // We don't need loadLanguage or initialize.
      const { data: { text } } = await worker.recognize(file);
      
      setOcrStatus('Scan complete!');
      setOcrProgress(1);
      
      // 3. Pass the raw text up to the ContactForm
      onScanComplete(text);

    } catch (error) {
      console.error("OCR Error:", error);
      setOcrStatus('Scan failed. Please try again.');
    } finally {
      // 4. Clean up
      await worker.terminate();
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