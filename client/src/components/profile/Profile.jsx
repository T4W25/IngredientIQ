import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [editMode, setEditMode] = useState(false); // To toggle between view and edit modes
  const [error, setError] = useState('');
  const history = useHistory();
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

  