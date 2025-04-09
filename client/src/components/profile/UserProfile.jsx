import React, { useContext } from "react";
import ProfilePicture from "./ProfilePicture";
import EditProfile from "./EditProfile";
import { AuthContext } from "../../context/AuthContext";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="text-center p-6">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ProfilePicture imageUrl={user.profileImage} />
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
      <p className="mb-4 text-gray-600">Email: {user.email}</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Bookmarked Recipes</h3>
        <p className="text-gray-500">You have 0 bookmarked recipes. (Feature coming soon)</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Meal Plans</h3>
        <p className="text-gray-500">View and manage your saved meal plans here. (Feature coming soon)</p>
      </div>

      <EditProfile />
    </div>
  );
};

export default UserProfile;
