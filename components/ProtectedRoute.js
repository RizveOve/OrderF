import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  fallback = null,
  redirectTo = '/admin-login' 
}) => {
  const { user, userRole, loading, isAuthenticated } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (loading) {
      setShouldRender(false);
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
      setShouldRender(false);
      return;
    }

    // Check role requirements
    if (requiredRole && userRole !== requiredRole) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
  }, [user, userRole, loading, isAuthenticated, requiredRole, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Checking authentication...</p>
        </div>
        <style jsx>{`
          .auth-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
            color: #fff;
          }
          .loading-container {
            text-align: center;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #333;
            border-top: 4px solid #ffd700;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show unauthorized message if role doesn't match
  if (isAuthenticated && requiredRole && userRole !== requiredRole) {
    return (
      <div className="unauthorized">
        <div className="unauthorized-container">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p>Required role: <strong>{requiredRole}</strong></p>
          <p>Your role: <strong>{userRole}</strong></p>
          <button 
            onClick={() => window.location.href = '/admin'}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
        <style jsx>{`
          .unauthorized {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
            color: #fff;
            padding: 20px;
          }
          .unauthorized-container {
            text-align: center;
            background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
            padding: 40px;
            border-radius: 12px;
            border: 2px solid #dc3545;
            max-width: 500px;
          }
          .unauthorized-container h2 {
            color: #dc3545;
            margin-bottom: 20px;
          }
          .unauthorized-container p {
            margin-bottom: 15px;
          }
          .btn-primary {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #000;
            border: 2px solid #ffd700;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            margin-top: 20px;
          }
          .btn-primary:hover {
            background: linear-gradient(135deg, #ffed4e 0%, #fff700 100%);
          }
        `}</style>
      </div>
    );
  }

  // Show fallback if provided and not authenticated
  if (!shouldRender && fallback) {
    return fallback;
  }

  // Render children if all checks pass
  return shouldRender ? children : null;
};

export default ProtectedRoute;