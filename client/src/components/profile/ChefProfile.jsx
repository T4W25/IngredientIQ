import React, { useContext } from "react";
import ProfilePicture from "./ProfilePicture";
import VerificationDocs from "./VerificationDocs";
import EditProfile from "./EditProfile";
import { AuthContext } from "../../context/AuthContext";

const ChefProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="text-center p-6">Loading chef profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProfilePicture imageUrl={user.profileImage} />
      <h2 className="text-2xl font-bold mb-4">Chef {user.name}</h2>
      <p className="mb-4 text-gray-600">Email: {user.email}</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">My Recipes</h3>
        <p className="text-gray-500">You have 0 recipes. (Feature coming soon)</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">User Feedback</h3>
        <p className="text-gray-500">Feedback on your recipes will appear here. (Feature coming soon)</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Verification Documents</h3>
        <VerificationDocs />
      </div>

      <EditProfile />
    </div>
  );
};

export default ChefProfile;
