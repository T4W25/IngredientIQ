// pages/chef/ChefProfile.jsx
import React, { useState, useEffect } from 'react';
import ChefProfileForm from './ChefProfileForm';
import ChefProfileView from './ChefProfileView';
import { toast } from 'react-toastify';
import { getAuthorProfile } from '../../api/api';

const ChefProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please login again.');
        return;
      }

      const response = await getAuthorProfile(token);
      setUser(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return <div className="text-center text-red-500 py-10">Error loading profile</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10">
        {isEditing ? (
          <ChefProfileForm
            user={user}
            setUser={setUser}
            setIsEditing={setIsEditing}
            refreshProfile={refreshProfile}
          />
        ) : (
          <ChefProfileView user={user} setIsEditing={setIsEditing} />
        )}
      </div>
    </>
  );
};

export default ChefProfile;
