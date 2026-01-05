# TODO: Fix Role-Based Authentication

## Task: Prevent seekers from logging in from employer page and vice versa

### Backend Changes
- [x] 1. Modify `backend/users/views.py` - Add role validation in login view
- [x] 2. Create/update API endpoint for role-specific login

### Frontend Changes
- [x] 3. Update `frontend/src/services/api.jsx` - Add expected_role to login API call
- [x] 4. Update `frontend/src/contexts/AuthContext.jsx` - Pass expected_role parameter
- [x] 5. Update `frontend/src/pages/EmployerAuth.jsx` - Pass expected_role: 'EMPLOYER'
- [x] 6. Update `frontend/src/pages/SeekerAuth.jsx` - Pass expected_role: 'SEEKER'

### Testing
- [ ] 7. Test employer login from employer page (should work)
- [ ] 8. Test seeker login from seeker page (should work)
- [ ] 9. Test employer login from seeker page (should fail)
- [ ] 10. Test seeker login from employer page (should fail)

## Summary
The authentication system now validates that users can only login from their designated login pages:
- Employer users can ONLY login from `/employer/auth`
- Seeker users can ONLY login from `/seeker/auth`

If a user tries to login from the wrong page, they will receive an error message: "This login page is for [employers/seekers] only. Please use the correct login page."


