import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import './CardScanner.css'; // We'll create this

const CardScanner = ({ onScanComplete }) => {
  const [ocrProgress, setOcrProgress] = useState(null);
  const [ocrStatus, setOcrStatus] = useState('Idle');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrStatus('Initializing...');
    setOcrProgress(0);

    const worker = await createWorker({
      logger: m => {
        if (m.status === 'recognizing text') {
          setOcrStatus('Recognizing text...');
          setOcrProgress(m.progress);
        }
      },
    });

    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(file);
      
      setOcrStatus('Scan complete!');
      setOcrProgress(1);
      
      // Pass the raw text up to the ContactForm
      onScanComplete(text);

    } catch (error) {
      console.error("OCR Error:", error);
      setOcrStatus('Scan failed. Please try again.');
    } finally {
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