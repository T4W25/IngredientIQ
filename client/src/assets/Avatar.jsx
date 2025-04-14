// src/components/common/Avatar.jsx
import React from 'react';
import defaultAvatar from './default-avatar.png';

const Avatar = ({ src, alt, className }) => {
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL); // Check if the env variable is loaded correctly

  const getImageUrl = (url) => {
    console.log("getImageUrl function called");
    console.log("Received URL:", url);  // Log the input URL to check if it's passed correctly
    if (!url) return defaultAvatar; // If no URL, return the default avatar
    // Hardcode full backend URL for testing
    return `http://localhost:5000/uploads${url}`;
  };

  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      className={`rounded-full object-cover ${className}`}
      onError={(e) => {
        e.target.src = defaultAvatar;  // Fallback to default avatar on error
      }}
    />
  );
};

export default Avatar;
