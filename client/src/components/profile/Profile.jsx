import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 


const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [editMode, setEditMode] = useState(false); // To toggle between view and edit modes
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user profile data on page load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if needed
          },
        });
        const data = await response.json();
        if (data.success) {
          setUserData(data.profile);
        } else {
          setError('Error loading profile data');
        }
      } catch (err) {
        setError('Error fetching profile');
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.success) {
        setEditMode(false); // Disable edit mode after a successful update
      } else {
        setError('Error updating profile');
      }
    } catch (err) {
      setError('Error updating profile');
    }
  };
// Handle input change in the profile form
const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {error && <p className="error">{error}</p>}
      {!editMode ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <button onClick={() => setEditMode(true)} className="edit-button">
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="profile-form">
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">New Password (Optional)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="save-button">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
  