// ChefProfile.jsx
import React, { useState, useEffect } from 'react';
import ChefProfileForm from './ChefProfileForm';
import ChefProfileView from './chefProfileView';
import { toast } from 'react-toastify';
import axios from 'axios';

const ChefProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/chef/profile`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Error loading profile</div>;

  return isEditing ? (
    <ChefProfileForm
      user={user}
      setUser={setUser}
      setIsEditing={setIsEditing}
      refreshProfile={refreshProfile}
    />
  ) : (
    <ChefProfileView
      user={user}
      setIsEditing={setIsEditing}
    />
  );
};

export default ChefProfile;