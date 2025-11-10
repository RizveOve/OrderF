import { useState } from 'react';
import { validateEmail } from '../lib/auth';
import { useAuth } from './AuthProvider';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { loginMaster, loading, error, clearError } = useAuth();

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError();
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Attempt login
    const result = await loginMaster(email.trim(), password);
    
    if (result.success) {
      // Redirect will be handled by the auth context
      window.location.href = '/admin';
    }
  };

  const handleInputChange = (field, value) => {
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }

    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }
  };

  return (
    <div className="login-form">
      <div className="form-header">
        <h2>👑 Master Admin Login</h2>
        <p>Enter your email and password to access the master dashboard</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={validationErrors.email ? 'error' : ''}
            placeholder="admin@flychicken.com"
            disabled={loading}
            autoComplete="email"
          />
          {validationErrors.email && (
            <span className="error-message">{validationErrors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={validationErrors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {validationErrors.password && (
            <span className="error-message">{validationErrors.password}</span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="auth-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Signing In...
            </>
          ) : (
            'Sign In as Master Admin'
          )}
        </button>
      </form>

      <div className="form-footer">
        <p>
          <small>
            Master admin has full access to all features including user management.
          </small>
        </p>
      </div>

      <style jsx>{`
        .login-form {
          width: 100%;
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .form-header h2 {
          color: #ffd700;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .form-header p {
          color: #ccc;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #ffd700;
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #666;
          border-radius: 6px;
          background: #000;
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #ffd700;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .form-group input.error {
          border-color: #dc3545;
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #ccc;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0;
        }

        .password-toggle:hover {
          color: #ffd700;
        }

        .password-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc3545;
          font-size: 0.8rem;
          margin-top: 5px;
          display: block;
        }

        .auth-error {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: #fff;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 0.9rem;
        }

        .login-button {
          width: 100%;
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          color: #000;
          border: 2px solid #ffd700;
          padding: 15px;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffed4e 0%, #fff700 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #666;
          border-top: 2px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .form-footer {
          text-align: center;
          margin-top: 20px;
        }

        .form-footer small {
          color: #999;
          font-size: 0.8rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-header h2 {
            font-size: 1.3rem;
          }

          .form-group input {
            padding: 10px;
          }

          .login-button {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}