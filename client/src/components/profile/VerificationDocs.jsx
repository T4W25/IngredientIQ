import React, { useState } from 'react';

const VerificationDocs = ({ user, onUpdateVerificationDocs }) => {
  const [documents, setDocuments] = useState(user?.verificationDocs || []);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]); // Store the selected file names for display

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const fileNames = files.map(file => file.name); // Get the names of the selected files
    setFileNames(fileNames);

    const validFiles = files.filter((file) => {
      const fileType = file.type.split('/')[0];
      const isValidType = fileType === 'application' || fileType === 'image'; // Allow PDFs and images
      if (!isValidType) {
        setError('Please upload a valid document (PDF or image only)');
        return false;
      }

      // Add size validation (optional)
      const maxSize = 5 * 1024 * 1024; // 5 MB limit
      if (file.size > maxSize) {
        setError('File size should be less than 5MB');
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setError(''); // Reset error if valid files are selected
    } else {
      setFileNames([]); // Clear file names if invalid files are selected
    }
  }};

  // Handle file upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('No files selected');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('verificationDocs', file);
    });

    try {
      // Replace with your actual API endpoint to upload the documents
      const response = await fetch('/api/upload-verification-docs', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${user.token}`, // Assuming you're using token-based authentication
        },
      });

      const result = await response.json();
      if (response.ok) {
        // Update the user's verification documents in the parent component
        onUpdateVerificationDocs(result.verificationDocs);
        setDocuments(result.verificationDocs);
        setSelectedFiles([]); // Reset selected files after successful upload
        setFileNames([]); // Reset the file names display
      } else {
        setError(result.message || 'Failed to upload verification documents');
      }
    } catch (error) {
      setError('An error occurred while uploading the documents');
    }
  };

  return (
    <div className="verification-docs-container">
      <h3>Upload Verification Documents (For Chefs)</h3>

      <div className="documents-preview">
        {documents.length > 0 ? (
          <ul>
            {documents.map((doc, index) => (
              <li key={index}>
                {doc}
              </li>
            ))}
          </ul>
        ) : (
          <p>No verification documents uploaded yet.</p>
        )}
      </div>

      <div className="file-upload">
        <input
          type="file"
          accept="application/pdf, image/*"
          multiple
          onChange={handleFileChange}
        />
        {fileNames.length > 0 && (
          <div className="file-names">
            <ul>
              {fileNames.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>

      <button onClick={handleUpload}>Upload Documents</button>
    </div>
  );
};

export default VerificationDocs;
