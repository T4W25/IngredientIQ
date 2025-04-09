import React from "react";

const ProfilePicture = ({ imageUrl, altText = "Profile Picture" }) => {
  const defaultImage = "./default-avatar.png"; // Path to your default image

  return (
    <div className="flex justify-center mb-6">
      <img
        src={imageUrl || defaultImage}
        alt={altText}
        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
      />
    </div>
  );
};

export default ProfilePicture;
