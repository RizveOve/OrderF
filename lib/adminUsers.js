import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { hashPin, validatePin, validateUsername, verifyPin } from './auth';
import { db } from './firebase';

const ADMIN_USERS_COLLECTION = 'adminUsers';

// Create a new normal admin user
export const createAdminUser = async (username, pin, createdBy = 'master') => {
  try {
    // Validate input
    if (!validateUsername(username)) {
      throw new Error('Invalid username. Must be 3-20 characters, alphanumeric and underscore only.');
    }
    
    if (!validatePin(pin)) {
      throw new Error('Invalid PIN. Must be 4-6 digits.');
    }
    
    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists. Please choose a different username.');
    }
    
    // Hash the PIN
    const pinHash = await hashPin(pin);
    
    // Create user document
    const userData = {
      username,
      pinHash,
      role: 'normal',
      createdAt: Timestamp.now(),
      createdBy,
      lastLogin: null,
      isActive: true
    };
    
    const docRef = await addDoc(collection(db, ADMIN_USERS_COLLECTION), userData);
    
    return {
      id: docRef.id,
      ...userData,
      pinHash: undefined // Don't return the hash
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Get all admin users
export const getAllAdminUsers = async () => {
  try {
    const q = query(
      collection(db, ADMIN_USERS_COLLECTION),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        username: userData.username,
        role: userData.role,
        createdAt: userData.createdAt,
        createdBy: userData.createdBy,
        lastLogin: userData.lastLogin,
        isActive: userData.isActive
      });
    });
    
    // Sort by createdAt in JavaScript to avoid composite index requirement
    users.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.toMillis() - a.createdAt.toMillis();
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

// Get user by username
export const getUserByUsername = async (username) => {
  try {
    const q = query(
      collection(db, ADMIN_USERS_COLLECTION),
      where('username', '==', username),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const userData = doc.data();
    
    return {
      id: doc.id,
      ...userData
    };
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
};

// Authenticate normal admin user
export const authenticateAdminUser = async (username, pin) => {
  try {
    // Get user by username
    const user = await getUserByUsername(username);
    
    if (!user) {
      return null; // User not found
    }
    
    // Verify PIN
    const isValidPin = await verifyPin(pin, user.pinHash);
    
    if (!isValidPin) {
      return null; // Invalid PIN
    }
    
    // Update last login
    await updateDoc(doc(db, ADMIN_USERS_COLLECTION, user.id), {
      lastLogin: Timestamp.now()
    });
    
    // Return user data without PIN hash
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: Timestamp.now()
    };
  } catch (error) {
    console.error('Error authenticating admin user:', error);
    throw error;
  }
};

// Delete admin user (soft delete)
export const deleteAdminUser = async (userId) => {
  try {
    await updateDoc(doc(db, ADMIN_USERS_COLLECTION, userId), {
      isActive: false,
      deletedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting admin user:', error);
    throw error;
  }
};

// Hard delete admin user (permanent)
export const permanentDeleteAdminUser = async (userId) => {
  try {
    await deleteDoc(doc(db, ADMIN_USERS_COLLECTION, userId));
    return true;
  } catch (error) {
    console.error('Error permanently deleting admin user:', error);
    throw error;
  }
};

// Update admin user
export const updateAdminUser = async (userId, updates) => {
  try {
    const allowedUpdates = ['username', 'isActive'];
    const filteredUpdates = {};
    
    // Only allow specific fields to be updated
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });
    
    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No valid updates provided');
    }
    
    filteredUpdates.updatedAt = Timestamp.now();
    
    await updateDoc(doc(db, ADMIN_USERS_COLLECTION, userId), filteredUpdates);
    
    return true;
  } catch (error) {
    console.error('Error updating admin user:', error);
    throw error;
  }
};

// Change user PIN
export const changeUserPin = async (userId, newPin) => {
  try {
    if (!validatePin(newPin)) {
      throw new Error('Invalid PIN. Must be 4-6 digits.');
    }
    
    const pinHash = await hashPin(newPin);
    
    await updateDoc(doc(db, ADMIN_USERS_COLLECTION, userId), {
      pinHash,
      updatedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error changing user PIN:', error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const allUsers = await getAllAdminUsers();
    
    const stats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(user => user.isActive).length,
      recentLogins: allUsers.filter(user => {
        if (!user.lastLogin) return false;
        const lastLogin = user.lastLogin.toDate();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastLogin > oneDayAgo;
      }).length
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};