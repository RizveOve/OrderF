# Admin Authentication System Requirements

## Introduction

This specification defines a two-tier authentication system for the restaurant admin dashboard. The system will have a master admin with full privileges who can create and manage normal admin users, and normal admins who can access the standard admin dashboard functionality.

## Requirements

### Requirement 1: Master Admin Authentication

**User Story:** As a restaurant owner, I want to log in with my master email and password so that I can access the master dashboard with full administrative privileges.

#### Acceptance Criteria

1. WHEN a user visits the admin page THEN the system SHALL display a login form
2. WHEN a user enters the master email and password THEN the system SHALL authenticate against predefined credentials
3. WHEN master credentials are valid THEN the system SHALL grant access to the master dashboard
4. WHEN master credentials are invalid THEN the system SHALL display an error message and remain on login screen
5. WHEN master admin is logged in THEN the system SHALL display a logout option
6. WHEN logout is clicked THEN the system SHALL clear the session and return to login screen

### Requirement 2: Master Dashboard User Management

**User Story:** As a master admin, I want to create and manage normal admin users so that I can control who has access to the admin dashboard.

#### Acceptance Criteria

1. WHEN master admin is logged in THEN the system SHALL display a "User Management" tab
2. WHEN "User Management" tab is selected THEN the system SHALL show a list of existing normal admin users
3. WHEN "Add User" button is clicked THEN the system SHALL display a form with username and PIN fields
4. WHEN a new user form is submitted with valid data THEN the system SHALL create the user in Firebase
5. WHEN a user is created successfully THEN the system SHALL display a success message and refresh the user list
6. WHEN "Delete User" is clicked THEN the system SHALL prompt for confirmation and remove the user from Firebase
7. WHEN user data is invalid THEN the system SHALL display appropriate validation errors

### Requirement 3: Normal Admin Authentication

**User Story:** As a normal admin user, I want to log in with my username and PIN so that I can access the standard admin dashboard.

#### Acceptance Criteria

1. WHEN a user selects "Staff Login" option THEN the system SHALL display username and PIN input fields
2. WHEN username and PIN are entered THEN the system SHALL validate against Firebase user collection
3. WHEN normal admin credentials are valid THEN the system SHALL grant access to standard admin dashboard
4. WHEN normal admin credentials are invalid THEN the system SHALL display an error message
5. WHEN normal admin is logged in THEN the system SHALL display their username and logout option
6. WHEN normal admin logs out THEN the system SHALL return to the login selection screen

### Requirement 4: Role-Based Access Control

**User Story:** As a system administrator, I want different access levels for master and normal admins so that sensitive functions are protected.

#### Acceptance Criteria

1. WHEN master admin is logged in THEN the system SHALL provide access to all admin functions plus user management
2. WHEN normal admin is logged in THEN the system SHALL provide access to Orders, Menu Management, and QR Generator tabs only
3. WHEN normal admin attempts to access user management THEN the system SHALL deny access
4. WHEN session expires or is invalid THEN the system SHALL redirect to login screen
5. WHEN user role changes THEN the system SHALL update access permissions immediately

### Requirement 5: Session Management

**User Story:** As an admin user, I want my login session to be secure and manageable so that unauthorized access is prevented.

#### Acceptance Criteria

1. WHEN a user logs in successfully THEN the system SHALL create a secure session
2. WHEN a user is inactive for 2 hours THEN the system SHALL automatically log them out
3. WHEN a user closes the browser THEN the system SHALL maintain session for security
4. WHEN a user logs in on another device THEN the system SHALL allow concurrent sessions
5. WHEN session data is corrupted THEN the system SHALL clear session and redirect to login

### Requirement 6: Security Features

**User Story:** As a restaurant owner, I want the admin system to be secure so that unauthorized users cannot access sensitive business data.

#### Acceptance Criteria

1. WHEN login attempts fail 3 times THEN the system SHALL implement a 5-minute lockout
2. WHEN passwords are stored THEN the system SHALL use secure hashing
3. WHEN PINs are stored THEN the system SHALL use secure hashing
4. WHEN sensitive operations are performed THEN the system SHALL log the activity
5. WHEN master credentials are hardcoded THEN they SHALL be stored securely in environment variables
