import React, { useState } from 'react';

const VerificationDocs = ({ user, onUpdateVerificationDocs }) => {
  const [documents, setDocuments] = useState(user?.verificationDocs || []);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const validFiles = files.filter((file) => {
      const fileType = file.type.split('/')[0];
      const isValidType = fileType === 'application' || fileType === 'image'; // Allow PDFs and images
      if (!isValidType) {
        setError('Please upload a valid document (PDF or image only)');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setError(''); // Reset error if valid files are selected
    }
  };

  