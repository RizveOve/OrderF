import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import LoginForm from '../components/LoginForm';
import StaffLoginForm from '../components/StaffLoginForm';

export default function AdminLogin() {
  const [loginType, setLoginType] = useState(null); // 'master' or 'staff'
  const { isAuthenticated, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      window.location.href = '/admin';
    }
  }, [isAuthenticated, loading]);

  // Show loading if checking authentication
  if (loading) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Header */}
        <div className="login-header">
          <img 
            src="https://cdn.prod.website-files.com/6307266e269e4a08d8b311b7/6307266e269e4a7d28b3122e_Flychicken_vanlig_RGB_HvitClucking_Web.png"
            alt="Fly Chicken Logo"
            className="login-logo"
          />
          <h1>Admin Login</h1>
          <p>Choose your login type to access the admin dashboard</p>
        </div>

        {/* Role Selection */}
        {!loginType && (
          <div className="role-selection">
            <h2>Select Login Type</h2>
            <div className="role-buttons">
              <button
                className="role-button master"
                onClick={() => setLoginType('master')}
              >
                <div className="role-icon">👑</div>
                <h3>Master Admin</h3>
                <p>Full access with user management</p>
                <small>Email & Password</small>
              </button>
              
              <button
                className="role-button staff"
                onClick={() => setLoginType('staff')}
              >
                <div className="role-icon">👤</div>
                <h3>Staff Admin</h3>
                <p>Standard admin dashboard access</p>
                <small>Username & PIN</small>
              </button>
            </div>
          </div>
        )}

        {/* Login Forms */}
        {loginType === 'master' && (
          <div className="login-form-container">
            <button 
              className="back-button"
              onClick={() => setLoginType(null)}
            >
              ← Back to Selection
            </button>
            <LoginForm />
          </div>
        )}

        {loginType === 'staff' && (
          <div className="login-form-container">
            <button 
              className="back-button"
              onClick={() => setLoginType(null)}
            >
              ← Back to Selection
            </button>
            <StaffLoginForm />
          </div>
        )}
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #000 0%, #1a1a1a 50%, #000 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .login-wrapper {
          background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
          border: 2px solid #ffd700;
          border-radius: 12px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-logo {
          height: 80px;
          width: auto;
          margin-bottom: 20px;
        }

        .login-header h1 {
          color: #ffd700;
          font-size: 2rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .login-header p {
          color: #fff;
          margin-bottom: 0;
        }

        .role-selection h2 {
          color: #ffd700;
          text-align: center;
          margin-bottom: 30px;
          font-size: 1.5rem;
        }

        .role-buttons {
          display: grid;
          gap: 20px;
        }

        .role-button {
          background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
          border: 2px solid #ffd700;
          border-radius: 12px;
          padding: 30px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          color: #fff;
        }

        .role-button:hover {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          color: #000;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        }

        .role-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .role-button h3 {
          font-size: 1.3rem;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .role-button p {
          margin-bottom: 10px;
          opacity: 0.9;
        }

        .role-button small {
          opacity: 0.7;
          font-size: 0.9rem;
        }

        .login-form-container {
          animation: slideIn 0.3s ease-out;
        }

        .back-button {
          background: transparent;
          border: 1px solid #666;
          color: #ffd700;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 20px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: #ffd700;
          color: #000;
          border-color: #ffd700;
        }

        .login-loading {
          min-height: 100vh;
          background: #1a1a1a;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #333;
          border-top: 4px solid #ffd700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .login-wrapper {
            padding: 20px;
            margin: 10px;
          }

          .login-header h1 {
            font-size: 1.5rem;
          }

          .role-button {
            padding: 20px 15px;
          }

          .role-icon {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}