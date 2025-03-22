import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../api/api"; // ✅ Import API base URL
import { registerUser, loginUser } from "../../api/api"; // ✅ Correct import



const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const endpoint = isRegistering ? `${API_BASE_URL}/register/user` : `${API_BASE_URL}/signin/user`;
      console.log("📩 Sending request to:", endpoint);
      console.log("📝 Payload:", formData);
  
      const response = await axios.post(endpoint, {
        username: isRegistering ? formData.username : undefined,
        email: formData.email,
        password: formData.password,
      });
  
      console.log("✅ Server Response:", response.data);
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/home"); //
      } else if (response.data.message) {
        alert(response.data.message); // Show success message if no token
      } else {
        setError("Unexpected response from the server");
      }      
    } catch (err) {
      console.error("❌ Request Error:", err.response ? err.response.data : err);
      setError(err.response?.data?.message || "Server error. Check console.");
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome to Ingredient IQ</h1>

        {/* Login / Register Toggle */}
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

        {/* Form */}
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

          {/* Show "Forgot Password" only on Login */}
          {!isRegistering && (
            <p className="forgot-password">Forgot Password?</p>
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
