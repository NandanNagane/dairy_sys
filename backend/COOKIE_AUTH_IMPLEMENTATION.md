# Cookie-Based Authentication Implementation

## Overview
The authentication system has been updated to use HTTP-only cookies for storing JWT tokens, providing better security against XSS attacks.

## Changes Made

### 1. Backend Dependencies
- **Added**: `cookie-parser` package for parsing cookies

### 2. Server Configuration (`src/server.js`)
- Added `cookieParser()` middleware to parse cookies from incoming requests
- Cookie parser is placed after body parsing middleware

### 3. Auth Controller (`src/api/auth/auth.controller.js`)

#### Updated Functions:
- **`initializeAdmin`**: Now sets JWT token in HTTP-only cookie
- **`register`**: Now sets JWT token in HTTP-only cookie
- **`login`**: Now sets JWT token in HTTP-only cookie

#### New Function:
- **`logout`**: Clears the token cookie

#### Cookie Configuration:
```javascript
res.cookie('token', token, {
  httpOnly: true,                    // Prevents JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax',                  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});
```

### 4. Auth Middleware (`src/middleware/auth.middleware.js`)
- **Updated `authenticateToken`**: Now checks for token in cookies first
- Falls back to Authorization header if cookie is not present
- Maintains backward compatibility with existing token-based authentication

Token Priority:
1. Cookie token (`req.cookies.token`)
2. Authorization header (`Bearer TOKEN`)

### 5. Auth Routes (`src/api/auth/auth.routes.js`)
- **Added**: `POST /api/v1/auth/logout` endpoint

## Security Features

### HTTP-Only Cookies
- Cookies are marked as `httpOnly: true`
- Prevents client-side JavaScript from accessing the token
- Protects against XSS (Cross-Site Scripting) attacks

### Secure Flag
- In production (`NODE_ENV === 'production`), cookies are only sent over HTTPS
- Protects against man-in-the-middle attacks

### SameSite Protection
- `sameSite: 'lax'` provides CSRF protection
- Cookies are not sent with cross-site requests except for top-level navigation

### Token Expiration
- Cookies expire after 7 days
- JWT tokens also have a 7-day expiration

## Frontend Configuration

### API Client (`frontend/src/lib/api.js`)
- Already configured with `withCredentials: true`
- Axios will automatically include cookies in requests
- Still includes Authorization header for backward compatibility

## API Endpoints

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
- Sets HTTP-only cookie with token
- Returns user data and token (for compatibility)
```

### Logout
```http
POST /api/v1/auth/logout

Response:
- Clears the token cookie
- Returns success message
```

## Development vs Production

### Development
- `secure` flag is `false` (allows HTTP)
- Works with `http://localhost:5173`

### Production
- `secure` flag is `true` (requires HTTPS)
- Cookies only sent over secure connections

## Migration Notes

### Backward Compatibility
- System still supports Authorization header tokens
- Frontend can continue using localStorage tokens
- Cookie authentication takes priority when available

### Recommended Frontend Updates
1. Remove token from localStorage after login (optional)
2. Update logout to call `/api/v1/auth/logout` endpoint
3. Remove Authorization header from requests (optional, as cookies will be used)

## Testing

### Test Login with Cookies
```bash
curl -c cookies.txt -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'
```

### Test Authenticated Request
```bash
curl -b cookies.txt http://localhost:3000/api/v1/users
```

### Test Logout
```bash
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/v1/auth/logout
```

## Benefits

1. **Enhanced Security**: HTTP-only cookies prevent XSS attacks
2. **CSRF Protection**: SameSite flag protects against CSRF
3. **Automatic Cookie Management**: Browser handles cookie storage and transmission
4. **Secure by Default**: Production mode enforces HTTPS
5. **Backward Compatible**: Still supports header-based authentication

## Environment Variables

Ensure these are set in your `.env` file:

```env
NODE_ENV=development  # or 'production'
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## CORS Configuration

The CORS configuration already includes:
- `credentials: true` - Allows cookies in cross-origin requests
- Proper origin whitelist for development
- `Access-Control-Allow-Credentials: true` header

## Next Steps

1. **Frontend Logout Update**: Update the frontend logout function to call the new logout endpoint
2. **Remove localStorage Token**: Optionally remove token from localStorage after successful login
3. **Production Deployment**: Ensure HTTPS is configured for production
4. **Session Refresh**: Consider implementing token refresh mechanism

## Troubleshooting

### Cookie Not Being Set
- Check CORS configuration includes `credentials: true`
- Verify frontend has `withCredentials: true` in axios config
- In production, ensure HTTPS is enabled

### Cookie Not Being Sent
- Verify `withCredentials: true` in frontend API calls
- Check browser's cookie storage (DevTools > Application > Cookies)
- Ensure `sameSite` setting is appropriate for your setup

### 401 Unauthorized
- Check if cookie exists in browser
- Verify JWT_SECRET matches between requests
- Check token expiration
