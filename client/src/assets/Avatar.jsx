// src/components/common/Avatar.jsx
import React from 'react';
import defaultAvatar from './default-avatar.png';

const Avatar = ({ src, alt, className }) => {
  return (
    <img
      src={src || defaultAvatar}
      alt={alt}
      className={`rounded-full object-cover ${className}`}
      onError={(e) => {
        e.target.src = defaultAvatar;
      }}
    />
  );
};

export default Avatar;

