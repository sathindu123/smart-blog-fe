import React, { useState } from "react";
import "./Login.css"; // CSS file එක import කරගන්න
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

// Role එකට Type එකක් හදාගමු (Type Safety සදහා)
type UserRole = "passenger" | "driver";

const Login: React.FC = () => {
  // State variables with Types
  const [role, setRole] = useState<UserRole>("passenger");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Console log කරලා බලමු values හරියට එනවද කියලා
    console.log("Logging in details:");
    console.log("Role:", role);
    console.log("Email:", email);
    console.log("Password:", password);

    // TODO: මෙතනින් Backend API call එක ගන්න (Axios use කරලා)
    // loginUser({ email, password, role });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side - Image/Branding */}
        <div className="login-left">
          <div className="brand-content">
            <h1>SL Bus Tracker 🚍</h1>
            <p>Find your bus anytime, anywhere.</p>
            <div className="illustration">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3448/3448620.png" 
                alt="Bus" 
              />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-right">
          <h2>Welcome Back! 👋</h2>
          <p className="sub-text">Please login to your account</p>

          {/* Role Selector */}
          <div className="role-selector">
            <button
              type="button"
              className={role === "passenger" ? "active" : ""}
              onClick={() => setRole("passenger")}
            >
              Passenger
            </button>
            <button
              type="button"
              className={role === "driver" ? "active" : ""}
              onClick={() => setRole("driver")}
            >
              Driver
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">
              Login as {role.charAt(0).toUpperCase() + role.slice(1)} <FaSignInAlt />
            </button>
          </form>

          <p className="register-link">
            Don't have an account? <a href="#">Register Here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;