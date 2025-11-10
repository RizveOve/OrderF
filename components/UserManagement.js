import { useEffect, useState } from 'react';
import {
    createAdminUser,
    deleteAdminUser,
    getAllAdminUsers,
    getUserStats
} from '../lib/adminUsers';
import { validatePin, validateUsername } from '../lib/auth';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, recentLogins: 0 });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [newUser, setNewUser] = useState({
    username: '',
    pin: '',
    confirmPin: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load users and stats on component mount
  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userList = await getAllAdminUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!newUser.username.trim()) {
      errors.username = 'Username is required';
    } else if (!validateUsername(newUser.username)) {
      errors.username = 'Username must be 3-20 characters, alphanumeric and underscore only';
    }

    if (!newUser.pin.trim()) {
      errors.pin = 'PIN is required';
    } else if (!validatePin(newUser.pin)) {
      errors.pin = 'PIN must be 4-6 digits';
    }

    if (!newUser.confirmPin.trim()) {
      errors.confirmPin = 'Please confirm the PIN';
    } else if (newUser.pin !== newUser.confirmPin) {
      errors.confirmPin = 'PINs do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createAdminUser(newUser.username.trim(), newUser.pin, 'master');
      
      setSuccess(`Staff admin "${newUser.username}" created successfully!`);
      setNewUser({ username: '', pin: '', confirmPin: '' });
      setShowAddForm(false);
      
      // Reload users and stats
      await loadUsers();
      await loadStats();
      
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`Are you sure you want to delete staff admin "${username}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await deleteAdminUser(userId);
      setSuccess(`Staff admin "${username}" deleted successfully!`);
      
      // Reload users and stats
      await loadUsers();
      await loadStats();
      
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user: ' + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    // Clear form errors when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    if (field === 'username') {
      // Only allow alphanumeric and underscore
      const cleanValue = value.replace(/[^a-zA-Z0-9_]/g, '');
      setNewUser(prev => ({ ...prev, username: cleanValue }));
    } else if (field === 'pin' || field === 'confirmPin') {
      // Only allow digits and limit to 6 characters
      const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 6);
      setNewUser(prev => ({ ...prev, [field]: cleanValue }));
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>👥 User Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            clearMessages();
          }}
          disabled={submitting}
        >
          {showAddForm ? 'Cancel' : '+ Add Staff Admin'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Staff</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activeUsers}</div>
          <div className="stat-label">Active Staff</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.recentLogins}</div>
          <div className="stat-label">Recent Logins (24h)</div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="message error">
          <span>⚠️ {error}</span>
          <button onClick={clearMessages}>×</button>
        </div>
      )}

      {success && (
        <div className="message success">
          <span>✅ {success}</span>
          <button onClick={clearMessages}>×</button>
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-item-form">
          <h3>Create New Staff Admin</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={formErrors.username ? 'error' : ''}
                placeholder="Enter username"
                disabled={submitting}
                maxLength={20}
              />
              {formErrors.username && (
                <span className="error-message">{formErrors.username}</span>
              )}
              <small>3-20 characters, letters, numbers, and underscore only</small>
            </div>

            <div className="form-group">
              <label>PIN *</label>
              <input
                type="password"
                value={newUser.pin}
                onChange={(e) => handleInputChange('pin', e.target.value)}
                className={formErrors.pin ? 'error' : ''}
                placeholder="Enter 4-6 digit PIN"
                disabled={submitting}
                maxLength={6}
                inputMode="numeric"
              />
              {formErrors.pin && (
                <span className="error-message">{formErrors.pin}</span>
              )}
              <small>4-6 digits only</small>
            </div>

            <div className="form-group">
              <label>Confirm PIN *</label>
              <input
                type="password"
                value={newUser.confirmPin}
                onChange={(e) => handleInputChange('confirmPin', e.target.value)}
                className={formErrors.confirmPin ? 'error' : ''}
                placeholder="Confirm PIN"
                disabled={submitting}
                maxLength={6}
                inputMode="numeric"
              />
              {formErrors.confirmPin && (
                <span className="error-message">{formErrors.confirmPin}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-success"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating...
                </>
              ) : (
                'Create Staff Admin'
              )}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowAddForm(false)}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Users List */}
      <div className="users-section">
        <h3>Staff Admin Users ({users.length})</h3>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No staff admin users created yet.</p>
            <p>Click "Add Staff Admin" to create the first user.</p>
          </div>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <h4>👤 {user.username}</h4>
                  <div className="user-details">
                    <p><strong>Role:</strong> Staff Admin</p>
                    <p><strong>Created:</strong> {formatDate(user.createdAt)}</p>
                    <p><strong>Last Login:</strong> {formatDate(user.lastLogin)}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="user-actions">
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    title="Delete user"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .user-management {
          width: 100%;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
          border: 2px solid #ffd700;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #fff;
          font-size: 0.9rem;
        }

        .message {
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .message.error {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: #fff;
          border: 2px solid #dc3545;
        }

        .message.success {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: #fff;
          border: 2px solid #28a745;
        }

        .message button {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0 5px;
        }

        .form-group small {
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

        .form-group input.error {
          border-color: #dc3545;
        }

        .users-section h3 {
          color: #ffd700;
          margin-bottom: 20px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #fff;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #333;
          border-top: 3px solid #ffd700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #ccc;
          background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
          border: 2px solid #666;
          border-radius: 8px;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }

        .user-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
          border: 2px solid #ffd700;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }

        .user-info h4 {
          color: #ffd700;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }

        .user-details p {
          color: #fff;
          margin: 8px 0;
          font-size: 0.9rem;
        }

        .status.active {
          color: #28a745;
        }

        .status.inactive {
          color: #dc3545;
        }

        .user-actions {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }

        .btn-danger {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: #fff;
          border: 2px solid #dc3545;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .btn-danger:hover {
          background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
          transform: translateY(-1px);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .users-grid {
            grid-template-columns: 1fr;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}