import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isRegistering ? "/api/register/user" : "/api/signin/user";
      const response = await axios.post(endpoint, {
        username: isRegistering ? formData.username : undefined,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert(isRegistering ? "Registration successful!" : "Login successful!");
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
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
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
          {isRegistering && <p className="forgot-password">Forgot Password?</p>}
          <button className="auth-button" type="submit">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
