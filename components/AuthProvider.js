import { createContext, useContext, useEffect, useState } from 'react';
import { authenticateAdminUser } from '../lib/adminUsers';
import {
    clearSession,
    createSession,
    getRemainingLockoutTime,
    getSession,
    isAccountLocked,
    isSessionValid,
    trackLoginAttempt,
    validateMasterAdmin
} from '../lib/auth';

// Create authentication context
const AuthContext = createContext({
  user: null,
  userRole: null,
  loading: true,
  loginMaster: async () => {},
  loginStaff: async () => {},
  logout: () => {},
  isAuthenticated: false,
  error: null,
  clearError: () => {}
});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const session = getSession();
      
      if (session && isSessionValid()) {
        // Restore user from session
        setUser({
          id: session.userId,
          username: session.username,
          role: session.role
        });
        setUserRole(session.role);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  // Master admin login
  const loginMaster = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Check if account is locked
      if (isAccountLocked(email)) {
        const remainingTime = getRemainingLockoutTime(email);
        const minutes = Math.ceil(remainingTime / (60 * 1000));
        throw new Error(`Account locked. Try again in ${minutes} minutes.`);
      }

      // Validate master admin credentials
      const isValid = await validateMasterAdmin(email, password);
      
      if (!isValid) {
        // Track failed attempt
        trackLoginAttempt(email, false);
        throw new Error('Invalid email or password');
      }

      // Track successful attempt
      trackLoginAttempt(email, true);

      // Create user object for master admin
      const masterUser = {
        id: 'master',
        email,
        role: 'master'
      };

      // Create session
      createSession(masterUser);

      // Update state
      setUser(masterUser);
      setUserRole('master');

      return { success: true };
    } catch (error) {
      console.error('Master login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Staff admin login
  const loginStaff = async (username, pin) => {
    try {
      setLoading(true);
      setError(null);

      // Check if account is locked
      if (isAccountLocked(username)) {
        const remainingTime = getRemainingLockoutTime(username);
        const minutes = Math.ceil(remainingTime / (60 * 1000));
        throw new Error(`Account locked. Try again in ${minutes} minutes.`);
      }

      // Authenticate staff user
      const staffUser = await authenticateAdminUser(username, pin);
      
      if (!staffUser) {
        // Track failed attempt
        trackLoginAttempt(username, false);
        throw new Error('Invalid username or PIN');
      }

      // Track successful attempt
      trackLoginAttempt(username, true);

      // Create session
      createSession(staffUser);

      // Update state
      setUser(staffUser);
      setUserRole('normal');

      return { success: true };
    } catch (error) {
      console.error('Staff login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      clearSession();
      setUser(null);
      setUserRole(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Check if user is authenticated
  const isAuthenticated = user !== null && userRole !== null;

  // Context value
  const value = {
    user,
    userRole,
    loading,
    loginMaster,
    loginStaff,
    logout,
    isAuthenticated,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;