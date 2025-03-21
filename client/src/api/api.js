import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

//AUTHENTICATION
export const registerUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/register/user`, userData);
};

export const registerAuthor = async (authorData) => {
  return axios.post(`${API_BASE_URL}/register/author`, authorData);
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_BASE_URL}/signin/user`, credentials);
};

export const loginAuthor = async (credentials) => {
  return axios.post(`${API_BASE_URL}/signin/author`, credentials);
};

export const logoutUser = async () => {
  return axios.post(`${API_BASE_URL}/signout/user`);
};

export const logoutAuthor = async () => {
  return axios.post(`${API_BASE_URL}/signout/author`);
};

//PROFILE MANAGEMENT
export const getUserProfile = async (token) => {
  return axios.get(`${API_BASE_URL}/profile/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAuthorProfile = async (token) => {
  return axios.get(`${API_BASE_URL}/profile/author`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserProfile = async (token, profileData) => {
  return axios.patch(`${API_BASE_URL}/profile/user`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateAuthorProfile = async (token, profileData) => {
  return axios.patch(`${API_BASE_URL}/profile/author`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//RECIPE MANAGEMENT
export const getRecipes = async (filters = {}) => {
  return axios.get(`${API_BASE_URL}/recipes/search`, { params: filters });
};

export const getRecipeById = async (id) => {
  return axios.get(`${API_BASE_URL}/recipes/${id}`);
};

export const createRecipe = async (token, recipeData) => {
  return axios.post(`${API_BASE_URL}/recipes`, recipeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateRecipe = async (token, recipeId, updatedData) => {
  return axios.patch(`${API_BASE_URL}/recipes/${recipeId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteRecipe = async (token, recipeId) => {
  return axios.delete(`${API_BASE_URL}/recipes/${recipeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//BOOKMARKING RECIPES
export const addBookmark = async (token, recipeId) => {
  return axios.post(
    `${API_BASE_URL}/bookmarks`,
    { recipeId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const removeBookmark = async (token, recipeId) => {
  return axios.delete(`${API_BASE_URL}/bookmarks/${recipeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getBookmarks = async (token) => {
  return axios.get(`${API_BASE_URL}/bookmarks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//MEAL PLANNING
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

export default API_BASE_URL;