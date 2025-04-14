import React from 'react';
import defaultAvatar from './default-avatar.png';

const Avatar = ({ src, alt, className }) => {
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL); // Debug log for API Base URL

  const getImageUrl = (url) => {
    console.log("getImageUrl function called");
    console.log("Received URL:", url);  // Log the received URL for debugging
    if (!url) return defaultAvatar; // Return default avatar if no URL is provided
    
    if (url.startsWith('http')) return url; // If it's already a full URL, return it directly
    
    // Hardcode full backend URL for testing (it should be based on the environment variable)
    return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${url}`;
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
