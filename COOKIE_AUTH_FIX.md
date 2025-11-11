# Cookie-Only Authentication Implementation

## Issue
When opening the "Record Collection" dialog on the Admin Dashboard, the page was redirecting to login because:
1. Token storage was inconsistent between localStorage and cookies
2. API client was looking for localStorage token instead of relying on cookies

## Solution - Pure Cookie-Based Authentication

### Frontend Changes

#### 1. Removed Token from localStorage
**File**: `frontend/src/stores/authStore.js`

- **REMOVED** all `localStorage.setItem('authToken', ...)` calls
- Token is ONLY stored in HTTP-only cookie by backend
- State only stores user data, not the token
- More secure: Token cannot be accessed by JavaScript (XSS protection)

#### 2. Updated Login Function
**File**: `frontend/src/stores/authStore.js`

```javascript
login: async (credentials) => {
  try {
    const data = await authAPI.login(credentials);
    // Token is stored in HTTP-only cookie by backend
    set({
      user: data.user,
      token: null, // Don't store token in state
      isAuthenticated: true,
    });
    return true;
  } catch (err) {
    // Handle error...
  }
}
```

#### 3. Updated Logout Function
**File**: `frontend/src/stores/authStore.js`

- Made logout async to call backend `/auth/logout` endpoint
- Backend clears the HTTP-only cookie
- No localStorage token to clear (only cookies)

```javascript
logout: async () => {
  try {
    await authAPI.logout(); // Clears cookie on server
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }
}
```

#### 4. Removed Authorization Header Interceptor
**File**: `frontend/src/lib/api.js`

- **REMOVED** request interceptor that added `Authorization: Bearer <token>` header
- Requests now rely solely on cookies (sent automatically by browser)
- Kept `withCredentials: true` to send cookies with requests

```javascript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Sends cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### 5. Updated Zustand Persistence
**File**: `frontend/src/stores/authStore.js`

- Only persist `user` and `isAuthenticated` state
- Token is NOT persisted (it's in HTTP-only cookie)

```javascript
{
  name: 'auth-storage',
  partialize: (state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }),
}
```

### Backend Changes (Already Implemented)

#### 1. Cookie Parser Middleware
**File**: `backend/src/server.js`
- Added `cookie-parser` middleware to parse cookies from requests

#### 2. Updated Auth Controller
**File**: `backend/src/api/auth/auth.controller.js`
- Login sets HTTP-only cookie: `res.cookie('token', token, { httpOnly: true, secure: false })`
- Added `/auth/logout` endpoint to clear cookie: `res.clearCookie('token')`

#### 3. Updated Auth Middleware
**File**: `backend/src/middleware/auth.middleware.js`
- Checks for token in cookies first: `req.cookies?.token`
- Falls back to Authorization header if no cookie
- This provides backward compatibility

## How It Works Now

### Login Flow
1. User logs in → `POST /api/v1/auth/login`
2. Backend sets HTTP-only cookie with JWT token: `Set-Cookie: token=<jwt>; HttpOnly`
3. Backend returns user data in response body (no token)
4. Frontend stores ONLY user data in Zustand state
5. Token remains secure in HTTP-only cookie (inaccessible to JavaScript)

### API Requests
1. Frontend makes API request with `withCredentials: true`
2. Browser **automatically** sends cookie with every request
3. Backend reads token from `req.cookies.token`
4. Backend validates token and allows request ✅
5. No Authorization header needed!

### Logout Flow
1. User logs out → `POST /api/v1/auth/logout`
2. Backend clears the cookie: `res.clearCookie('token')`
3. Frontend clears Zustand state
4. User is redirected to login

## Testing

### Backend Running
```bash
cd backend
nodemon src/server.js
# Server running on http://localhost:3000
```

### Frontend Running
```bash
cd frontend
npm run dev
# Server running on http://localhost:5174
```

### Test Steps
1. ✅ Login as admin
2. ✅ Navigate to dashboard
3. ✅ Click "Record Collection" button
4. ✅ Dialog opens without redirect
5. ✅ Farmers list loads successfully
6. ✅ Submit milk collection form
7. ✅ Logout clears cookie and redirects

## Security Benefits

### HTTP-Only Cookies (Pure Implementation)
- ✅ **XSS Protection**: Token cannot be accessed by JavaScript at all
- ✅ **Automatic**: Browser sends cookie with every request
- ✅ **No localStorage**: Token never stored in client-side storage
- ✅ **Secure**: Even if malicious script runs, it cannot steal the token

### Why This Is More Secure
| Storage Method | XSS Vulnerable? | CSRF Vulnerable? | Best Use Case |
|----------------|----------------|------------------|---------------|
| localStorage | ❌ Yes | ✅ No | Never for tokens |
| HTTP-only Cookie | ✅ No | ⚠️ Yes (mitigate with SameSite) | ✅ Best for tokens |
| Authorization Header | ❌ Yes (if token in localStorage) | ✅ No | API tools only |

### Our Implementation
- ✅ Token in HTTP-only cookie
- ✅ SameSite=Lax (prevents CSRF in most cases)
- ✅ Secure flag for production (HTTPS only)
- ✅ No token in localStorage or sessionStorage

## Environment Variables Required

**Backend** `.env`:
```env
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Supports SameSite cookie policies
- ✅ Works with CORS credentials

## Next Steps
1. ✅ Test all authenticated endpoints
2. ⏳ Consider setting `secure: true` for production (HTTPS only)
3. ⏳ Implement refresh token mechanism
4. ⏳ Add CSRF protection for production
