import { useState } from 'react';
import { validatePin, validateUsername } from '../lib/auth';
import { useAuth } from './AuthProvider';

export default function StaffLoginForm() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { loginStaff, loading, error, clearError } = useAuth();

  const validateForm = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (!validateUsername(username)) {
      errors.username = 'Username must be 3-20 characters, alphanumeric and underscore only';
    }

    if (!pin.trim()) {
      errors.pin = 'PIN is required';
    } else if (!validatePin(pin)) {
      errors.pin = 'PIN must be 4-6 digits';
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
    const result = await loginStaff(username.trim(), pin);
    
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

    if (field === 'username') {
      // Only allow alphanumeric and underscore
      const cleanValue = value.replace(/[^a-zA-Z0-9_]/g, '');
      setUsername(cleanValue);
    } else if (field === 'pin') {
      // Only allow digits and limit to 6 characters
      const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 6);
      setPin(cleanValue);
    }
  };

  const handlePinKeyDown = (e) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <div className="staff-login-form">
      <div className="form-header">
        <h2>👤 Staff Admin Login</h2>
        <p>Enter your username and PIN to access the admin dashboard</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={validationErrors.username ? 'error' : ''}
            placeholder="Enter your username"
            disabled={loading}
            autoComplete="username"
            maxLength={20}
          />
          {validationErrors.username && (
            <span className="error-message">{validationErrors.username}</span>
          )}
        </div>

        {/* PIN Field */}
        <div className="form-group">
          <label htmlFor="pin">PIN</label>
          <div className="pin-input">
            <input
              type={showPin ? 'text' : 'password'}
              id="pin"
              value={pin}
              onChange={(e) => handleInputChange('pin', e.target.value)}
              onKeyDown={handlePinKeyDown}
              className={validationErrors.pin ? 'error' : ''}
              placeholder="Enter your PIN"
              disabled={loading}
              autoComplete="current-password"
              maxLength={6}
              inputMode="numeric"
            />
            <button
              type="button"
              className="pin-toggle"
              onClick={() => setShowPin(!showPin)}
              disabled={loading}
            >
              {showPin ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {validationErrors.pin && (
            <span className="error-message">{validationErrors.pin}</span>
          )}
          <small className="pin-hint">4-6 digit PIN</small>
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
            'Sign In as Staff'
          )}
        </button>
      </form>

      <div className="form-footer">
        <p>
          <small>
            Staff admin has access to orders, menu management, and QR generator.
          </small>
        </p>
      </div>

      <style jsx>{`
        .staff-login-form {
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

        .pin-input {
          position: relative;
        }

        .pin-toggle {
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

        .pin-toggle:hover {
          color: #ffd700;
        }

        .pin-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pin-hint {
          color: #999;
          font-size: 0.8rem;
          margin-top: 5px;
          display: block;
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
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: #fff;
          border: 2px solid #28a745;
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
          background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
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
          border-top: 2px solid #fff;
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