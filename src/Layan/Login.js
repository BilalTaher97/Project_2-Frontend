import { saveAuthToken, saveUserInfo, login } from './api';
import { useState } from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Call the login API
      const response = await login(email, password);
      // Check if login was successful
      if (response.message ==='Login successful.' && response.token) {
        // Save the token using the API helper function
        saveAuthToken(response.token, rememberMe);
        
        // Save user info if available
        if (response.user) {
          saveUserInfo(response.user, rememberMe);
        }
        
        // Navigate to home page
        if(email==='admin@teknosoft.com'){
          navigate('/admin');
        }
        else{
          navigate('/home');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Handle login errors
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          {/* Simple Logo Text */}
          <div className="logo-container">
            <h1 className="logo-text">TechnoSoft</h1>
          </div>

          <p className="brand-subtitle">Team Management System</p>

          {/* Features List */}
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Manage your team efficiently</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Track tasks and progress</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Real-time collaboration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-side">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Sign in to access your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Login Form */}
          <div className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="admin@teknosoft.com"
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="form-input"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                  disabled={isLoading}
                />
                <span className="checkbox-text">Remember me</span>
              </label>
              <button className="forgot-link" onClick={() => alert('Please contact your administrator')}>
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
    
  );
}

export default Login;