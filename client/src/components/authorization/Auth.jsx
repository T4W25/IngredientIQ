import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../api/api";

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // Default role
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = () => {
    setFormData({
      ...formData,
      role: formData.role === "user" ? "author" : "user",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
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

        if (formData.role === "author") {
          navigate("/chef-dashboard");
        } else{
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
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome to Ingredient IQ</h1>

        <div className="auth-toggle">
          <span
            className={!isRegistering ? "active-tab" : "inactive-tab"}
            onClick={() => setIsRegistering(false)}
          >
            Login
          </span>
          <span
            className={isRegistering ? "active-tab" : "inactive-tab"}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </span>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </>
          )}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {isRegistering && (
            <label className="role-selector">
              <input
                type="checkbox"
                checked={formData.role === "author"}
                onChange={handleRoleToggle}
              />
              Register as Chef
            </label>
          )}

          <button className="auth-button" type="submit">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;