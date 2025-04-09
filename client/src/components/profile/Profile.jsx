import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserProfile from "./UserProfile";
import ChefProfile from "./ChefProfile";

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="p-6 text-center">Loading...</div>;

  if (user.role === "chef") return <ChefProfile />;
  if (user.role === "user") return <UserProfile />;

  return <div className="p-6 text-center text-red-600">Unknown user role</div>;
};

export default Profile;
