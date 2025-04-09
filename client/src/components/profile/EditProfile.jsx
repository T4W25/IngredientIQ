import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateUserProfile, updateAuthorProfile } from "../../api/api";

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (!token) throw new Error("No token found");

      if (user?.role === "chef") {
        await updateAuthorProfile(token, formData);
      } else {
        await updateUserProfile(token, formData);
      }

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="mt-10 bg-white shadow-md rounded px-8 pt-6 pb-8">
      <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

      {message && <p className="mb-4 text-green-600 text-sm">{message}</p>}
      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="block mb-2 text-sm font-medium">Profile Image URL</label>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="text"
          name="profileImage"
          value={formData.profileImage}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
