import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../api/api";
// Import icons from react-icons
import { FaUser, FaLock, FaEnvelope, FaUtensils } from "react-icons/fa";
import { motion } from "framer-motion"; // Add framer-motion for animations

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ... your existing handle functions ...
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Special handling for admin login
      if (!isRegistering && formData.email === "admin@gmail.com") {
        if (formData.password === "admin@123") {
          localStorage.setItem("token", "admin-token");
          localStorage.setItem("role", "admin");
          navigate("/moderator/dashboard");
          return;
        } else {
          setError("Invalid admin credentials");
          return;
        }
      }

      const endpoint = isRegistering
        ? `${API_BASE_URL}/auth/register/${formData.role}`
        : `${API_BASE_URL}/auth/signin/${formData.role}`;

      const payload = {
        email: formData.email,
        password: formData.password,
      };

      if (isRegistering) payload.username = formData.username;

      const response = await axios.post(endpoint, payload);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", formData.role);

        switch (formData.role) {
          case "author":
            navigate("/chef-dashboard");
            break;
          case "user":
            navigate("/home");
            break;
          default:
            navigate("/home");
        }
      } else {
        setError("Unexpected response from the server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo or Brand Icon */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <FaUtensils className="text-5xl text-primary-600 mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Ingredient IQ
          </h1>
          <p className="text-gray-600 mt-2">
            {isRegistering ? "Create your account" : "Welcome back"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-custom p-8 backdrop-blur-sm bg-opacity-90">
          {/* Auth Toggle */}
          <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                !isRegistering
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-primary-600"
              }`}
              onClick={() => setIsRegistering(false)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                isRegistering
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-primary-600"
              }`}
              onClick={() => setIsRegistering(true)}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-100 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            {formData.email !== "admin@gmail.com" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative">
                    <input
                      type="radio"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={handleRoleChange}
                      className="peer sr-only"
                    />
                    <div className="p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 peer-checked:bg-primary-50 peer-checked:border-primary-500 peer-checked:text-primary-600 hover:bg-gray-50">
                      <FaUser className="mx-auto mb-2" />
                      <span className="font-medium">User</span>
                    </div>
                  </label>
                  <label className="relative">
                    <input
                      type="radio"
                      value="author"
                      checked={formData.role === "author"}
                      onChange={handleRoleChange}
                      className="peer sr-only"
                    />
                    <div className="p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 peer-checked:bg-primary-50 peer-checked:border-primary-500 peer-checked:text-primary-600 hover:bg-gray-50">
                      <FaUtensils className="mx-auto mb-2" />
                      <span className="font-medium">Chef</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isRegistering ? "Create Account" : "Sign In"
              )}
            </button>
          </form>

          {/* Additional Info */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {isRegistering ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {isRegistering ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;