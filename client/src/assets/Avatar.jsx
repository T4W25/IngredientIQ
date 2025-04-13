// src/components/common/Avatar.jsx
import React from 'react';
import defaultAvatar from './default-avatar.png';

const Avatar = ({ src, alt, className }) => {
  const getImageUrl = (url) => {
    if (!url) return defaultAvatar;
    if (url.startsWith('http')) return url;
    return `${process.env.REACT_APP_API_URL.replace('/api', '')}${url}`;
  };

  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      className={`rounded-full object-cover ${className}`}
      onError={(e) => {
        e.target.src = defaultAvatar;
      }}
    />
  );
};

export default Avatar;

