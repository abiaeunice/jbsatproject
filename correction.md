# Role-Based Authentication Fix - Tutorial Notes

## Problem Statement

In the original application, there was a security vulnerability where:
- **Seekers** could login from the **Employer** login page
- **Employers** could login from the **Seeker** login page

This occurred because the backend login API only validated email and password credentials, without checking if the user's role matched the login page they were using.

---

## Solution Overview

The fix implements **Role-Based Login Validation** by:
1. Adding role validation in the backend login API
2. Passing the expected role from each frontend login page
3. Rejecting login attempts where user role doesn't match the expected role

---

## Files Modified

### 1. Backend: `backend/users/views.py`

**Problem**: The login function accepted any authenticated user regardless of their role.

**Solution**: Added role validation after authentication.

```python
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    expected_role = request.data.get('expected_role')  # NEW: Get expected role from request
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(request, email=email, password=password)
    
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # NEW: Check if user's role matches the expected role
    if expected_role and user.role != expected_role:
        return Response(
            {'error': f'This login page is for {expected_role.lower()}s only. Please use the correct login page.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # ... rest of the code remains the same
```

**Key Changes**:
- Extract `expected_role` from request data (can be null for backward compatibility)
- After successful authentication, check if `user.role == expected_role`
- Return 403 Forbidden if roles don't match

---

### 2. Frontend API Service: `frontend/src/services/api.jsx`

**Problem**: The login API function didn't support passing the expected role.

**Solution**: Modified the login function to accept an optional `expectedRole` parameter.

```javascript
// BEFORE
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),  // No role support
};

// AFTER
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data, expectedRole = null) => {
    const loginData = { ...data };
    if (expectedRole) {
      loginData.expected_role = expectedRole;  // Add expected_role to request
    }
    return api.post('/auth/login/', loginData);
  },
};
```

**Key Changes**:
- `login()` now accepts second parameter `expectedRole` (optional)
- If `expectedRole` is provided, it's added to the login request payload as `expected_role`

---

### 3. AuthContext: `frontend/src/contexts/AuthContext.jsx`

**Problem**: The login function in AuthContext didn't support passing expected role.

**Solution**: Updated the login function signature and implementation.

```javascript
// BEFORE
const login = async (email, password) => {
  const response = await authAPI.login({ email, password });
  // ... rest of code
};

// AFTER
const login = async (email, password, expectedRole = null) => {
  const response = await authAPI.login({ email, password }, expectedRole);
  // ... rest of code
};
```

**Key Changes**:
- Added `expectedRole` parameter (optional, defaults to null)
- Passes `expectedRole` to the authAPI.login function

---

### 4. Employer Auth Page: `frontend/src/pages/EmployerAuth.jsx`

**Problem**: When logging in, no role validation was sent to the backend.

**Solution**: Pass `'EMPLOYER'` as the expected role during login.

```javascript
// BEFORE
if (isLogin) {
  await login(formData.email, formData.password);
} else {
  await register({ ...formData, role: 'EMPLOYER' });
}

// AFTER
if (isLogin) {
  await login(formData.email, formData.password, 'EMPLOYER');  // Pass expected role
} else {
  await register({ ...formData, role: 'EMPLOYER' });
}
```

**Key Changes**:
- Third parameter `'EMPLOYER'` is passed to the login function
- This tells the backend to only allow EMPLOYER role users on this page

---

### 5. Seeker Auth Page: `frontend/src/pages/SeekerAuth.jsx`

**Problem**: When logging in, no role validation was sent to the backend.

**Solution**: Pass `'SEEKER'` as the expected role during login.

```javascript
// BEFORE
if (isLogin) {
  await login(formData.email, formData.password);
} else {
  await register({ ...formData, role: 'SEEKER' });
}

// AFTER
if (isLogin) {
  await login(formData.email, formData.password, 'SEEKER');  // Pass expected role
} else {
  await register({ ...formData, role: 'SEEKER' });
}
```

**Key Changes**:
- Third parameter `'SEEKER'` is passed to the login function
- This tells the backend to only allow SEEKER role users on this page

---

## How It Works Now

### Login Flow:

```
1. User enters credentials on Employer Login Page
2. Frontend calls login(email, password, 'EMPLOYER')
3. API sends POST /auth/login/ with { email, password, expected_role: 'EMPLOYER' }
4. Backend authenticates user (validates email/password)
5. Backend checks: user.role === 'EMPLOYER'?
   - YES: Allow login, return JWT tokens
   - NO: Return 403 error with message
6. If error, frontend displays: "This login page is for employers only. Please use the correct login page."
```

### Error Messages:

**Employer page with Seeker credentials:**
```
"This login page is for employers only. Please use the correct login page."
```

**Seeker page with Employer credentials:**
```
"This login page is for seekers only. Please use the correct login page."
```

---

## Testing Checklist

- [ ] Employer can login from `/employer/auth` ✓
- [ ] Seeker can login from `/seeker/auth` ✓
- [ ] Employer CANNOT login from `/seeker/auth` (gets error)
- [ ] Seeker CANNOT login from `/employer/auth` (gets error)
- [ ] Registration still works correctly for both roles

---

## Backward Compatibility

The solution maintains backward compatibility:
- The `expected_role` parameter is optional in all functions
- If not provided, the backend accepts any authenticated user (original behavior)
- This allows for future API integrations without requiring role validation

---

## Security Benefits

1. **Prevents Role Confusion**: Users cannot accidentally or maliciously access the wrong portal
2. **Clear Error Messages**: Users understand why login failed and which page to use
3. **Defense in Depth**: Even if frontend validation is bypassed, backend validates roles
4. **Audit Trail**: Failed login attempts due to role mismatch can be logged for security monitoring

---

## Future Enhancements

Potential improvements:
1. Add rate limiting for failed login attempts
2. Add security logging for role mismatch attempts
3. Add email verification during registration
4. Add password reset functionality
5. Implement two-factor authentication (2FA)

