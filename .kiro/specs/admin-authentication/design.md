# Admin Authentication System Design

## Overview

The admin authentication system implements a two-tier security model with master and normal admin roles. The system uses Firebase Authentication for session management and Firestore for user data storage, providing secure access control to the restaurant admin dashboard.

## Architecture

### Authentication Flow

```
Login Page → Role Selection → Credential Validation → Dashboard Access
     ↓              ↓                    ↓                ↓
Master/Staff → Email+Password/     → Firebase Auth → Master/Normal
Selection      Username+PIN         Validation      Dashboard
```

### Component Structure

```
/pages/
  ├── admin-login.js          # Login page with role selection
  ├── admin.js                # Protected admin dashboard
  └── master-dashboard.js     # Master admin with user management

/components/
  ├── LoginForm.js            # Master admin login form
  ├── StaffLoginForm.js       # Normal admin login form
  ├── UserManagement.js       # User CRUD operations
  ├── ProtectedRoute.js       # Route protection wrapper
  └── AuthProvider.js         # Authentication context

/lib/
  ├── auth.js                 # Authentication utilities
  └── adminUsers.js           # User management functions
```

## Components and Interfaces

### 1. Authentication Context (AuthProvider.js)

```javascript
interface AuthContext {
  user: User | null
  userRole: 'master' | 'normal' | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  loading: boolean
}

interface User {
  id: string
  email?: string
  username?: string
  role: 'master' | 'normal'
  createdAt: Date
  lastLogin: Date
}
```

### 2. Login Components

```javascript
// LoginForm.js - Master Admin
interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  loading: boolean
  error: string | null
}

// StaffLoginForm.js - Normal Admin
interface StaffLoginFormProps {
  onLogin: (username: string, pin: string) => Promise<void>
  loading: boolean
  error: string | null
}
```

### 3. User Management Component

```javascript
interface UserManagementProps {
  users: NormalAdminUser[]
  onCreateUser: (userData: CreateUserData) => Promise<void>
  onDeleteUser: (userId: string) => Promise<void>
  loading: boolean
}

interface NormalAdminUser {
  id: string
  username: string
  createdAt: Date
  lastLogin?: Date
  createdBy: string
}
```

### 4. Protected Route Component

```javascript
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'master' | 'normal'
  fallback?: React.ReactNode
}
```

## Data Models

### 1. Firebase Collections

#### Master Admin Configuration

```javascript
// Environment variables (not in Firestore)
MASTER_ADMIN_EMAIL=admin@restaurant.com
MASTER_ADMIN_PASSWORD_HASH=hashed_password
```

#### Normal Admin Users Collection (`adminUsers`)

```javascript
{
  id: "auto-generated-id",
  username: "staff001",
  pinHash: "hashed_pin",
  role: "normal",
  createdAt: Timestamp,
  createdBy: "master_admin_id",
  lastLogin: Timestamp,
  isActive: true
}
```

#### Admin Sessions Collection (`adminSessions`)

```javascript
{
  id: "session-id",
  userId: "user-id",
  role: "master" | "normal",
  createdAt: Timestamp,
  expiresAt: Timestamp,
  lastActivity: Timestamp,
  ipAddress: "user-ip",
  userAgent: "browser-info"
}
```

### 2. Local Storage Schema

```javascript
// Stored in localStorage for session persistence
interface SessionData {
  sessionId: string
  userId: string
  role: 'master' | 'normal'
  username?: string
  expiresAt: number
}
```

## Error Handling

### 1. Authentication Errors

- **Invalid Credentials**: Display user-friendly error message
- **Account Locked**: Show lockout duration and retry instructions
- **Session Expired**: Redirect to login with session timeout message
- **Network Errors**: Display retry option with offline indicator

### 2. User Management Errors

- **Duplicate Username**: Validate uniqueness before creation
- **Invalid PIN Format**: Enforce 4-6 digit PIN requirements
- **Database Errors**: Show generic error with retry option
- **Permission Denied**: Redirect to appropriate access level

### 3. Security Error Handling

```javascript
// Login attempt tracking
interface LoginAttempt {
  identifier: string // email or username
  timestamp: Date
  success: boolean
  ipAddress: string
}

// Lockout logic
const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 5 * 60 * 1000 // 5 minutes
```

## Testing Strategy

### 1. Unit Tests

- **Authentication utilities**: Login validation, password hashing
- **User management functions**: CRUD operations, validation
- **Session management**: Creation, validation, expiration
- **Security functions**: Lockout logic, attempt tracking

### 2. Integration Tests

- **Login flows**: Master and normal admin authentication
- **Role-based access**: Permission enforcement across routes
- **User management**: Complete CRUD workflow
- **Session persistence**: Browser refresh, navigation

### 3. Security Tests

- **Brute force protection**: Multiple failed login attempts
- **Session security**: Token validation, expiration handling
- **Input validation**: SQL injection, XSS prevention
- **Authorization**: Role-based access control enforcement

### 4. End-to-End Tests

- **Complete authentication flow**: Login → Dashboard → Logout
- **User management workflow**: Create → Login → Delete user
- **Cross-browser compatibility**: Chrome, Firefox, Safari
- **Mobile responsiveness**: Touch-friendly login forms

## Security Considerations

### 1. Password Security

- Master password stored as environment variable hash
- Normal admin PINs hashed using bcrypt with salt
- No plaintext credentials stored anywhere
- Secure password reset mechanism for master admin

### 2. Session Security

- JWT tokens with short expiration (2 hours)
- Secure HTTP-only cookies where possible
- Session invalidation on logout
- Automatic cleanup of expired sessions

### 3. Input Validation

- Server-side validation for all inputs
- Sanitization of user-provided data
- Rate limiting on login endpoints
- CSRF protection for state-changing operations

### 4. Access Control

- Role-based permissions enforced on both client and server
- Route protection with authentication checks
- API endpoint authorization validation
- Audit logging for sensitive operations

## Implementation Notes

### 1. Environment Setup

```bash
# Required environment variables
MASTER_ADMIN_EMAIL=your-master-email@domain.com
MASTER_ADMIN_PASSWORD=your-secure-password
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 2. Firebase Security Rules

```javascript
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /adminUsers/{userId} {
      allow read, write: if request.auth != null &&
        request.auth.token.role == 'master';
    }
    match /adminSessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Deployment Considerations

- Environment variables securely configured in production
- HTTPS enforcement for all authentication endpoints
- Database connection pooling for performance
- Monitoring and alerting for failed login attempts
