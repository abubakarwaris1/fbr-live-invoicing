# Authentication Setup for FBR Live Invoicing

## Overview
The application now includes a complete authentication system with JWT tokens, user management, and protected routes.

## Features Implemented

### ✅ Backend Authentication
- **User Model**: MongoDB schema with password hashing
- **JWT Authentication**: Token-based authentication with 24h expiry
- **Protected Routes**: All invoice endpoints require authentication
- **Role-based Access**: Admin and user roles
- **Password Security**: bcrypt hashing with salt

### ✅ Frontend Authentication
- **Login Form**: Functional sign-in page with error handling
- **Token Management**: Automatic token storage and retrieval
- **Protected API Calls**: All invoice API calls include auth headers
- **Authentication Service**: Complete auth service with login/logout

## API Endpoints

### Authentication Routes (No Auth Required)
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

### Admin Routes (Admin Auth Required)
- `GET /api/auth/users` - Get all users
- `POST /api/auth/create-user` - Create new user

### Protected Invoice Routes (Auth Required)
- `GET /api/gov-invoices` - Get all invoices
- `POST /api/gov-invoices` - Create invoice
- `PUT /api/gov-invoices/:id` - Update invoice
- `DELETE /api/gov-invoices/:id` - Delete invoice

## Setup Instructions

### 1. MongoDB Setup
```bash
# Install MongoDB
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Check status
sudo systemctl status mongodb
```

### 2. Create Admin User
```bash
# Run the admin creation script
node server/scripts/createAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@fbr.com`
- Password: `admin123`

### 3. Environment Variables
The `.env` file should contain:
```
JWT_SECRET=fbr-live-invoicing-secret-key-2024
MONGODB_URI=mongodb://localhost:27017/fbr-invoicing
```

### 4. Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm run dev:client  # Frontend on port 5173
npm run dev:server  # Backend on port 3000
```

## Usage

### 1. Login
1. Navigate to `/auth/sign-in`
2. Use admin credentials: `admin@fbr.com` / `admin123`
3. Click "Sign In"
4. You'll be redirected to `/dashboard/invoices`

### 2. Access Protected Features
- All invoice operations now require authentication
- The frontend automatically includes auth headers
- Unauthorized requests will return 401 errors

### 3. Token Management
- Tokens are stored in localStorage
- Tokens expire after 24 hours
- Automatic token inclusion in API requests
- Automatic logout on token expiration

## Security Features

### ✅ Implemented
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Email format, password length
- **Role-based Access**: Admin and user permissions
- **Token Expiration**: 24-hour token lifetime
- **Secure Headers**: CORS and Helmet middleware

### 🔒 Best Practices
- Passwords are never stored in plain text
- Tokens are stored securely in localStorage
- All sensitive routes are protected
- Input validation on both client and server
- Error messages don't leak sensitive information

## Troubleshooting

### MongoDB Connection Issues
If you get "Command requires authentication" errors:

1. **Install MongoDB properly:**
   ```bash
   sudo apt install mongodb
   sudo systemctl start mongodb
   ```

2. **Or use MongoDB Atlas (cloud):**
   - Sign up at mongodb.com
   - Create a cluster
   - Update `MONGODB_URI` in `.env` with your connection string

### Authentication Issues
- Check that JWT_SECRET is set in `.env`
- Verify admin user was created successfully
- Check browser console for network errors
- Ensure both frontend and backend are running

### Token Issues
- Clear localStorage if tokens are corrupted
- Check token expiration (24 hours)
- Verify Authorization headers are being sent

## Next Steps

### 🔄 Future Enhancements
- Password reset functionality
- Email verification
- Session management
- Rate limiting
- Audit logging
- Multi-factor authentication

### 📝 Notes
- No signup flow implemented (admin creates users)
- No forgot password flow implemented
- Tokens are stateless (no server-side storage)
- Simple role system (admin/user only) 