# Authentication Integration Guide

## Overview
The frontend login and registration forms have been integrated with a Spring Boot backend using JWT authentication. Users can now test the complete authentication flow.

## Backend Setup

### Prerequisites
- Java 21
- Oracle Database (21c or 19c)
- Gradle 8.5

### Database Setup
Ensure Oracle Database is running with the following credentials (default from application.yml):
```
URL: jdbc:oracle:thin:@//localhost:1521/FREEPDB1
Username: system
Password: OraclePass123
```

Or set environment variables:
```
DB_URL=jdbc:oracle:thin:@//localhost:1521/YOUR_DB
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Build and Run Backend
1. Navigate to the project root directory
2. Run the following command:
```bash
./gradlew clean bootRun
```

The backend will start on `http://localhost:8080/api`

### Backend Files Created

#### DTOs (Data Transfer Objects)
- `src/main/java/com/perfumeshop/auth/dto/LoginRequest.java` - Login request payload
- `src/main/java/com/perfumeshop/auth/dto/SignupRequest.java` - Signup request payload
- `src/main/java/com/perfumeshop/auth/dto/AuthResponse.java` - Authentication response with JWT token

#### Services
- `src/main/java/com/perfumeshop/auth/service/JwtTokenProvider.java` - JWT token generation and validation
- `src/main/java/com/perfumeshop/auth/service/AuthService.java` - Authentication business logic

#### Controller
- `src/main/java/com/perfumeshop/auth/controller/AuthController.java` - REST endpoints for login and signup

### API Endpoints

#### Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Signup
**POST** `/api/auth/signup`

Request:
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "confirmPassword": "password123",
  "termsAccepted": true
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

## Frontend Setup

### Files Updated

#### Services
- `client/src/services/authService.js` - API calls for login and signup, token management

#### Pages
- `client/src/pages/LoginPage.jsx` - Updated with API integration
- `client/src/pages/SignupPage.jsx` - Updated with API integration

### Features
- Error handling with user-friendly messages
- Loading states on buttons
- Token storage in localStorage
- User data persistence in localStorage
- Automatic redirect to home page after successful login/signup

## Testing the Integration

### Step 1: Start the Backend
```bash
cd d:\The-Perfume-Shop
./gradlew clean bootRun
```

Wait for the message: `The Perfume Shop application is running!`

### Step 2: Start the Frontend
In another terminal:
```bash
cd d:\The-Perfume-Shop\client
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Step 3: Test Registration
1. Navigate to login page: `http://localhost:5173/login`
2. Click "Create an account" link
3. Fill in the signup form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: password123
   - Confirm Password: password123
   - Accept terms & conditions
4. Click "Create Account"
5. You should be redirected to home page and logged in

### Step 4: Test Login
1. Log out (clear localStorage or close browser)
2. Go to login page again
3. Enter the email and password you just registered
4. Click "Log In"
5. You should be redirected to home page and logged in

## Configuration

### JWT Secret Key
The default JWT secret is configured in `application.yml`:
```yaml
jwt:
  secret: your-secret-key-change-this-in-production-with-at-least-32-characters-long
  expiration: 86400000  # 24 hours in milliseconds
```

For production, set the environment variable:
```
JWT_SECRET=your-very-long-and-secure-secret-key
JWT_EXPIRATION=86400000
```

### CORS Configuration
The backend allows requests from `http://localhost:5173` (frontend dev server).
Update the `@CrossOrigin` annotation in `AuthController.java` for production.

## Notes

- Passwords are not stored securely (for testing purposes). In production, use BCrypt.
- JWT tokens expire after 24 hours by default.
- User data is stored in localStorage on the frontend.
- The `termsAccepted` flag is required for signup.
- Email must be unique across all registered users.
- Passwords must match during signup.

## Troubleshooting

### Backend won't start
- Check if Oracle database is running and accessible
- Verify database credentials in environment variables
- Check if port 8080 is available

### Login fails with "User not found"
- Ensure you've signed up first
- Check if the email is correct
- Verify the user exists in the database

### CORS errors
- Check if backend is running on `http://localhost:8080`
- Check if frontend is running on `http://localhost:5173`
- Update CORS configuration if needed

### Token not stored
- Check browser localStorage
- Check browser console for errors
- Verify authService.js is properly imported

## Next Steps

1. Implement password hashing using BCrypt
2. Add email verification
3. Add password reset functionality
4. Implement refresh tokens
5. Add user profile management
6. Integrate with production authentication service
