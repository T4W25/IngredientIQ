import React from "react";
import DefaultAvatar from "../../assets/default-avatar.png"; // Path to your default image

const ProfilePicture = ({ imageUrl, altText = "Profile Picture" }) => {
  // Fallback to default image if none is provided
  const imageToShow = imageUrl ? imageUrl : DefaultAvatar;

  return (
    <div className="flex justify-center mb-6">
      <img
        src={imageToShow}  // Display profile picture or default if unavailable
        alt={altText}
        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
      />
    </div>
  );
};

export default ProfilePicture;
