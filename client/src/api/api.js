import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// AUTHENTICATION
export const registerUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/auth/register/user`, userData);
};

export const registerAuthor = async (authorData) => {
  return axios.post(`${API_BASE_URL}/auth/register/author`, authorData);
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_BASE_URL}/auth/signin/user`, credentials);
};

export const loginAuthor = async (credentials) => {
  return axios.post(`${API_BASE_URL}/auth/signin/author`, credentials);
};

export const logoutUser = async () => {
  return axios.post(`${API_BASE_URL}/auth/signout/user`);
};

export const logoutAuthor = async () => {
  return axios.post(`${API_BASE_URL}/auth/signout/author`);
};

// PROFILE MANAGEMENT
export const getUserProfile = async (token) => {
  return axios.get(`${API_BASE_URL}/auth/profile/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAuthorProfile = async (token) => {
  return axios.get(`${API_BASE_URL}/auth/profile/author`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserProfile = async (token, profileData) => {
  return axios.patch(`${API_BASE_URL}/auth/profile/user`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateAuthorProfile = async (token, profileData) => {
  return axios.patch(`${API_BASE_URL}/auth/profile/author`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// UPLOAD PROFILE IMAGE
// api.js
export const uploadUserProfileImage = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);
  
  return axios.post(`${API_BASE_URL}/auth/profile/user/upload-image`, formData, {
    headers: { 
      "Content-Type": "multipart/form-data",  
      Authorization: `Bearer ${token}` 
    },
  });
};

// api.js
export const uploadAuthorProfileImage = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);

  return axios.post(`${API_BASE_URL}/auth/profile/user/upload-image`, formData, {
    headers: { 
      Authorization: `Bearer ${token}` 
      // Remove Content-Type header, axios will set it automatically with boundary
    },
  });
};

export const uploadAuthorDocuments = async (file, token) => {
  const formData = new FormData();
  formData.append('documents', file);

  return axios.post(`${API_BASE_URL}/auth/profile/author/upload-documents`, formData, {
    headers: { 
      Authorization: `Bearer ${token}` 
      // Remove Content-Type header, axios will set it automatically with boundary
    },
  });
};

// RECIPE MANAGEMENT
export const searchRecipes = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/search`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecipes = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.searchQuery) {
      queryParams.append('search', filters.searchQuery);
    }
    if (filters.category) {
      queryParams.append('category', filters.category);
    }
    if (filters.cuisine) {
      queryParams.append('cuisine', filters.cuisine);
    }
    if (filters.difficulty) {
      queryParams.append('difficulty', filters.difficulty);
    }
    if (filters.dietary) {
      queryParams.append('dietary', filters.dietary);
    }
    queryParams.append('status', 'published');

    const response = await axios.get(`${API_BASE_URL}/recipes?${queryParams.toString()}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDraftRecipes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/moderation-queue`);
    return response.data;
  } catch (error) {
    console.error('Get draft recipes error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch draft recipes');
  }
};

export const publishRecipe = async (id) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/recipes/${id}/publish`);
    return response.data;
  } catch (error) {
    console.error('Publish recipe error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to publish recipe');
  }
};

export const getRecipeById = async (id) => {
  return axios.get(`${API_BASE_URL}/recipes/${id}`);
};

// src/api/api.js

// RECIPE MANAGEMENT
// export const createRecipe = async (token, recipeData) => {
//   // Prepare the data before sending it to the backend
//   const cleanedData = {
//     ...recipeData,
//     ingredients: recipeData.ingredients.filter(ing => 
//       ing.name.trim() && ing.quantity.trim() && ing.unit.trim()
//     ),
//     instructions: recipeData.instructions.filter(inst => 
//       inst.text.trim()
//     ).map((inst, index) => ({
//       ...inst,
//       step: index + 1
//     }))
//   };

//   return axios.post(`${API_BASE_URL}/recipes/add`, cleanedData, {
//     headers: { 
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   });
// };


// ADD RECIPE
export const addRecipe = async (token, recipeData) => {
  try {
    // Clean up the data before sending
    const cleanedData = {
      ...recipeData,
      // Ensure mainImage is a relative path starting with /uploads/
      mainImage: recipeData.mainImage.startsWith('http') 
        ? recipeData.mainImage.replace(/^.*\/uploads\//, '/uploads/')
        : recipeData.mainImage,
      ingredients: recipeData.ingredients.filter(ing =>
        ing.name.trim() && ing.quantity && ing.unit
      ),
      instructions: recipeData.instructions
        .filter(inst => inst.text.trim())
        .map((inst, index) => ({
          ...inst,
          step: index + 1
        }))
    };

    console.log('Sending recipe data:', cleanedData); // Debug log

    const response = await axios.post(`${API_BASE_URL}/recipes/add`, cleanedData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error adding recipe:', error.response?.data || error.message);
    throw error;
  }
};

// FILE UPLOAD
export const handleFileUpload = async (file) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found for upload');
  }

  try {
    // Validate the file
    if (!file || !file.get("image")) {
      throw new Error('No file provided for upload');
    }

    const imageFile = file.get("image");
    console.log('Uploading file:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    const response = await axios.post(`${API_BASE_URL}/upload/image`, file, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    
    // Ensure the URL points to the backend server
    let imageUrl = response.data.url;
    if (imageUrl.startsWith('http')) {
      const url = new URL(imageUrl);
      imageUrl = url.pathname;
    }
    if (!imageUrl.startsWith('/uploads/')) {
      imageUrl = '/uploads/' + imageUrl.replace(/^\/+/, '');
    }
    
    // Prepend the backend server URL if it's not already a full URL
    if (!imageUrl.startsWith('http')) {
      imageUrl = `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
    }
    
    console.log('Upload successful:', { 
      originalUrl: response.data.url,
      processedUrl: imageUrl 
    });
    
    return { ...response, data: { ...response.data, url: imageUrl } };
  } catch (error) {
    console.error('Upload error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};


// UPDATE RECIPE
export const updateRecipe = async (token, recipeId, updatedData) => {
  return axios.patch(`${API_BASE_URL}/recipes/${recipeId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteRecipe = async (recipeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/recipes/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error('Delete recipe error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to delete recipe');
  }
};

// BOOKMARKING RECIPES
export const checkBookmarkStatus = async (token, recipeId) => {
  try {
    if (!token || !recipeId) {
      throw new Error('Token and Recipe ID are required');
    }

    const response = await axios.get(
      `${API_BASE_URL}/bookmarks/recipe/${recipeId}/bookmarked`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return { data: { isBookmarked: false, bookmarkId: null } };
  }
};

export const addBookmark = async (token, recipeId) => {
  const userId = localStorage.getItem('userId');
  const response = await axios.post(`${API_BASE_URL}/bookmarks`, {
    userId,
    recipeId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};


export const removeBookmark = async (token, bookmarkId) => {
  try {
    console.log('Removing bookmark:', bookmarkId); // Debug log

    const response = await axios.delete(
      `${API_BASE_URL}/bookmarks/${bookmarkId}`,
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw new Error(error.response?.data?.error || 'Failed to remove bookmark');
  }
};

export const getBookmarks = async (token) => {
  return axios.get(`${API_BASE_URL}/bookmarks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// MEAL PLANNING
export const getMealPlans = async (token) => {
  return axios.get(`${API_BASE_URL}/mealplans`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createMealPlan = async (token, mealPlanData) => {
  return axios.post(`${API_BASE_URL}/mealplans`, mealPlanData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateMealPlan = async (token, mealPlanId, updatedData) => {
  return axios.patch(`${API_BASE_URL}/mealplans/${mealPlanId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteMealPlan = async (token, mealPlanId) => {
  return axios.delete(`${API_BASE_URL}/mealplans/${mealPlanId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// MODERATOR MANAGEMENT
export const getVerificationRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/moderator/pending-verifications`);
    return response.data.pendingAuthors;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching verification requests' };
  }
};

// Approve verification
export const approveVerification = async (authorId) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/moderator/approve/${authorId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error approving verification' };
  }
};

// Reject verification
export const rejectVerification = async (authorId, reason) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/moderator/reject/${authorId}`,
      { reason }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error rejecting verification' };
  }
};

export default API_BASE_URL;