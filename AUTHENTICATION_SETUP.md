# Authentication System Setup

## Overview
This project now includes a complete user authentication system with MongoDB integration, JWT tokens, and social authentication support.

## Features Implemented

### 1. User Registration & Login
- **Signup API**: `/api/auth/signup`
  - Validates required fields (fullName, email, phone, dob, password)
  - Password hashing with bcryptjs
  - MongoDB storage
  - JWT token generation
  - Automatic login after signup

- **Login API**: `/api/auth/login`
  - Email/password authentication
  - Password verification
  - JWT token generation
  - Last login tracking

### 2. Social Authentication
- **Google Auth**: `/api/auth/google`
- **Facebook Auth**: `/api/auth/facebook`
- **Apple Auth**: `/api/auth/apple`

Each social provider:
- Creates new user if not exists
- Links existing account if email matches
- Generates JWT token
- Tracks social login status

### 3. Authentication Context
Updated `AuthContext` to support:
- User registration and login
- Social authentication
- JWT token management
- Role-based access (user, admin, superadmin)
- Automatic redirects based on role

### 4. Route Protection
- Middleware for protected routes
- Role-based access control
- JWT token verification
- Automatic redirects to login

## Environment Variables Required

Create a `.env.local` file with:

```env
# MongoDB Connection
NEXT_PUBLIC_MONGODB_URL="mongodb+srv://hiddenguy:8YXnTmTRwTlIrVZI@project1.rvwfnr9.mongodb.net/?retryWrites=true&w=majority&appName=Project1"

# JWT Secret (change this in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# OwnerRez API Credentials (existing)
NEXT_PUBLIC_OWNERREZ_USERNAME="info@premierestaysmiami.com"
NEXT_PUBLIC_OWNERREZ_ACCESS_TOKEN="pt_1xj6mw0db483n2arxln6rg2zd8xockw2"
NEXT_PUBLIC_OWNERREZ_API_V1="https://api.ownerrez.com/v1"
NEXT_PUBLIC_OWNERREZ_API_V2="https://api.ownerrez.com/v2"
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique, lowercase),
  phone: String,
  dob: Date,
  password: String (hashed),
  profileImage: String,
  role: String ('user', 'admin', 'superadmin'),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  emailVerified: Boolean,
  lastLogin: Date,
  socialLogin: {
    google: Boolean,
    googleId: String,
    facebook: Boolean,
    facebookId: String,
    apple: Boolean,
    appleId: String
  }
}
```

## API Endpoints

### Authentication APIs
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google social login
- `POST /api/auth/facebook` - Facebook social login
- `POST /api/auth/apple` - Apple social login

### Response Format
```javascript
{
  success: true,
  message: "Success message",
  user: {
    id: String,
    fullName: String,
    email: String,
    phone: String,
    dob: Date,
    profileImage: String,
    role: String,
    createdAt: Date,
    emailVerified: Boolean,
    lastLogin: Date
  },
  token: String (JWT)
}
```

## Usage Examples

### User Registration
```javascript
const { signup } = useAuth();

const handleSignup = async () => {
  const success = await signup({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    dob: "1990-01-01",
    password: "SecurePass123!"
  });
  
  if (success) {
    // User is automatically logged in and redirected
  }
};
```

### User Login
```javascript
const { login } = useAuth();

const handleLogin = async () => {
  const success = await login("john@example.com", "SecurePass123!");
  
  if (success) {
    // User is automatically redirected based on role
  }
};
```

### Social Login
```javascript
const { socialLogin } = useAuth();

const handleGoogleLogin = async () => {
  const success = await socialLogin('google', {
    email: 'user@gmail.com',
    name: 'Google User',
    picture: 'profile.jpg',
    googleId: 'google_123456'
  });
  
  if (success) {
    // User is automatically logged in and redirected
  }
};
```

## Security Features

1. **Password Hashing**: bcryptjs with 12 salt rounds
2. **JWT Tokens**: 7-day expiry with secure secret
3. **Input Validation**: Comprehensive form validation
4. **Role-based Access**: Different permissions for user/admin/superadmin
5. **Email Verification**: Support for email verification (social logins auto-verified)
6. **Rate Limiting**: Can be added for production

## Next Steps

1. **Email Verification**: Implement email verification for regular signups
2. **Password Reset**: Add forgot password functionality
3. **Profile Management**: User profile update APIs
4. **Real Social Auth**: Integrate actual social auth SDKs (Google, Facebook, Apple)
5. **Rate Limiting**: Add rate limiting for auth endpoints
6. **Session Management**: Implement session management
7. **Audit Logging**: Track login attempts and user actions

## Testing

The system includes mock social authentication for testing. Replace with real social auth SDKs for production.

## Production Considerations

1. Change JWT_SECRET to a strong, unique secret
2. Enable HTTPS
3. Implement rate limiting
4. Add proper error logging
5. Set up monitoring for auth endpoints
6. Implement proper session management
7. Add CSRF protection
8. Consider using refresh tokens for better security 