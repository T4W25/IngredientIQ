// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { getAuthorProfile, updateAuthorProfile } from '../../api/api';

const ChefProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
    verificationDocuments: []
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await getAuthorProfile(token);
        setProfile(profileRes.data);
        setProfileForm({
          username: profileRes.data.username,
          email: profileRes.data.email,
          bio: profileRes.data.bio,
          profilePicture: profileRes.data.profilePicture,
          verificationDocuments: profileRes.data.verificationDocuments
        });
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    try {
      await updateAuthorProfile(token, profileForm);
      setProfile((prev) => ({ ...prev, ...profileForm }));
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary-800 mb-4">Profile</h1>
      <div className="bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center mb-4">
          <img
            src={profile?.profilePicture || '/default-profile.png'}
            alt="Profile"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="ml-4">
            {editing ? (
              <div>
                <input
                  type="text"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  className="text-xl font-semibold text-gray-800 border-b border-gray-300 focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="text-sm text-gray-500 mt-2 border-b border-gray-300 focus:outline-none"
                  disabled
                />
                <textarea
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  className="text-sm text-gray-500 mt-2 border-b border-gray-300 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <div className="text-xl font-semibold text-gray-800">{profile?.username}</div>
                <div className="text-sm text-gray-500">{profile?.email}</div>
                <div className="text-sm text-gray-500">{profile?.bio}</div>
              </div>
            )}
          </div>
        </div>
        <div>
          {editing ? (
            <button
              onClick={handleProfileSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">Verification Documents</h2>
          <ul className="list-disc list-inside">
            {profile?.verificationDocuments.map((doc, index) => (
              <li key={index} className="text-sm text-gray-500">
                <a href={doc} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  Document {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChefProfilePage;