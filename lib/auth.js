import bcrypt from 'bcryptjs';

// Master admin credentials (in production, these should be environment variables)
const MASTER_ADMIN_EMAIL = process.env.MASTER_ADMIN_EMAIL || 'admin@flychicken.com';
const MASTER_ADMIN_PASSWORD = process.env.MASTER_ADMIN_PASSWORD || 'FlyChicken2024!';

// Authentication utilities
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const hashPin = async (pin) => {
  const saltRounds = 10;
  return await bcrypt.hash(pin.toString(), saltRounds);
};

export const verifyPin = async (pin, hash) => {
  return await bcrypt.compare(pin.toString(), hash);
};

// Master admin validation
export const validateMasterAdmin = async (email, password) => {
  if (email !== MASTER_ADMIN_EMAIL) {
    return false;
  }
  
  // In production, the master password should be hashed
  // For now, we'll do direct comparison but this should be improved
  return password === MASTER_ADMIN_PASSWORD;
};

// Session utilities
export const createSession = (user) => {
  const sessionData = {
    sessionId: generateSessionId(),
    userId: user.id || 'master',
    role: user.role,
    username: user.username || user.email,
    createdAt: Date.now(),
    expiresAt: Date.now() + (2 * 60 * 60 * 1000), // 2 hours
  };
  
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminSession', JSON.stringify(sessionData));
  }
  
  return sessionData;
};

export const getSession = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionData = localStorage.getItem('adminSession');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error reading session:', error);
    clearSession();
    return null;
  }
};

export const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('loginAttempts');
  }
};

export const isSessionValid = () => {
  const session = getSession();
  return session !== null;
};

// Generate unique session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Login attempt tracking for brute force protection
export const trackLoginAttempt = (identifier, success) => {
  if (typeof window === 'undefined') return;
  
  try {
    const attempts = getLoginAttempts();
    const now = Date.now();
    
    // Clean old attempts (older than 1 hour)
    const recentAttempts = attempts.filter(attempt => 
      now - attempt.timestamp < 60 * 60 * 1000
    );
    
    // Add new attempt
    recentAttempts.push({
      identifier,
      timestamp: now,
      success
    });
    
    localStorage.setItem('loginAttempts', JSON.stringify(recentAttempts));
  } catch (error) {
    console.error('Error tracking login attempt:', error);
  }
};

export const getLoginAttempts = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const attempts = localStorage.getItem('loginAttempts');
    return attempts ? JSON.parse(attempts) : [];
  } catch (error) {
    console.error('Error reading login attempts:', error);
    return [];
  }
};

export const isAccountLocked = (identifier) => {
  const attempts = getLoginAttempts();
  const now = Date.now();
  const lockoutDuration = 5 * 60 * 1000; // 5 minutes
  
  // Get failed attempts for this identifier in the last 5 minutes
  const recentFailedAttempts = attempts.filter(attempt => 
    attempt.identifier === identifier &&
    !attempt.success &&
    now - attempt.timestamp < lockoutDuration
  );
  
  return recentFailedAttempts.length >= 3;
};

export const getRemainingLockoutTime = (identifier) => {
  const attempts = getLoginAttempts();
  const now = Date.now();
  const lockoutDuration = 5 * 60 * 1000; // 5 minutes
  
  // Find the most recent failed attempt
  const recentFailedAttempts = attempts
    .filter(attempt => 
      attempt.identifier === identifier &&
      !attempt.success
    )
    .sort((a, b) => b.timestamp - a.timestamp);
  
  if (recentFailedAttempts.length >= 3) {
    const mostRecentAttempt = recentFailedAttempts[0];
    const lockoutEnd = mostRecentAttempt.timestamp + lockoutDuration;
    const remaining = lockoutEnd - now;
    
    return remaining > 0 ? remaining : 0;
  }
  
  return 0;
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePin = (pin) => {
  const pinStr = pin.toString();
  return pinStr.length >= 4 && pinStr.length <= 6 && /^\d+$/.test(pinStr);
};

export const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
};