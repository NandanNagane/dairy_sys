# Testing Guide - Cookie Authentication

## ✅ Status
- **Backend**: Running on http://localhost:3000
- **Prisma Client**: Regenerated successfully  
- **Cookie Name**: `token`

## 🧪 Test Steps

### Step 1: Clear All Cookies in Postman
1. Go to Postman
2. Click on Cookies (below the Send button)
3. Remove ALL cookies for `localhost:3000`
4. This ensures you start fresh

### Step 2: Login
**Request:**
```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "role": "ADMIN",
    "name": "Admin User"
  },
  "token": "eyJhbGc..."
}
```

**Check Cookies:**
- After login, check Postman cookies
- You should see a cookie named `token`
- This cookie will be automatically sent with all future requests

### Step 3: Get Users
**Request:**
```
GET http://localhost:3000/api/v1/users?role=FARMER
```

**No body, no headers needed!** The `token` cookie is auto-sent.

**Expected Response:**
```json
{
  "users": [
    {
      "id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "farmer@example.com",
      "role": "FARMER"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

## 🎯 Frontend Testing

### Step 1: Clear Browser Storage
1. Open DevTools (F12)
2. Go to Application > Cookies
3. Delete all cookies for `localhost:5174`
4. Go to Application > Local Storage
5. Delete all items

### Step 2: Login in Frontend
1. Navigate to `http://localhost:5174/login`
2. Login with admin credentials
3. Check DevTools > Application > Cookies
4. You should see a `token` cookie

### Step 3: Open Record Collection Dialog
1. Go to Dashboard
2. Click "Record Collection" button
3. Dialog should open
4. Farmers dropdown should load (check Network tab for API call)
5. **Should NOT redirect to login**

## 🐛 Debugging

### If still redirecting to login:

1. **Check Browser Console** for errors
2. **Check Network Tab**:
   - Look for the `/api/v1/users` request
   - Check if cookie is being sent in Request Headers
   - Check response status (should be 200, not 401)

3. **Check Backend Console** for debug logs:
   - Should show "Auth Middleware - Token found: true"
   - Should show decoded user data

### Common Issues:

1. **Wrong cookie name**: Make sure login sets cookie named `token`
2. **Cookie not sent**: Check if `withCredentials: true` in API client
3. **CORS issues**: Check CORS configuration allows credentials
4. **Token expired**: Login again to get fresh token

## ✅ Success Criteria

- ✅ Login works and sets `token` cookie
- ✅ `/api/v1/users` returns farmer list (not 401 error)
- ✅ Record Collection dialog opens without redirect
- ✅ Farmers dropdown shows list of farmers
- ✅ Can submit milk collection form
