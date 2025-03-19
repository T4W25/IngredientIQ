import React, { useState, useEffect } from 'react';

const ProfilePicture = ({ user, onUpdateProfilePicture }) => {
  const [image, setImage] = useState(user?.profilePicture || null); // Display existing profile picture if any
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  // Update image preview when an image is selected
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // Check file size (5MB limit)
        setError('File size exceeds 5MB');
        return;
      }

      const fileType = file.type.split('/')[0];
      if (fileType !== 'image') { // Check if the file is an image
        setError('Please select an image file');
        return;
      }

      setError(''); // Reset error if file is valid
      setImagePreview(URL.createObjectURL(file)); // Set preview for selected image
      setImage(file); // Set the actual file to be uploaded
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('No image selected');
      return;
    }

    // Call API to upload image
    try {
      // Replace the URL below with your actual API endpoint to upload the image
      const formData = new FormData();
      formData.append('profilePicture', image);
      
      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${user.token}`, // Assuming you use token for authentication
        },
      });

      const result = await response.json();
      if (response.ok) {
        // Call parent function to update the user profile picture
        onUpdateProfilePicture(result.profilePicture);
      } else {
        setError(result.message || 'Failed to upload image');
      }
    } catch (error) {
      setError('An error occurred while uploading the image');
    }
  };

  useEffect(() => {
    if (user?.profilePicture) {
      setImagePreview(user.profilePicture);
    }
  }, [user]);

  return (
    <div className="profile-picture-container">
      <h3>Profile Picture</h3>
      
      <div className="profile-picture-preview">
        {imagePreview ? (
          <img src={imagePreview} alt="Profile" className="profile-picture" />
        ) : (
          <div className="placeholder">No Image</div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input"
      />

      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ProfilePicture;
