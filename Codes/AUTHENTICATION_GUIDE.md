# 🌙 Lunar Essence - Authentication System Guide

## Overview
Complete user authentication system with registration, login, and password reset functionality using localStorage. All user data is stored in the Lunar Essence database (`lunarEssence_users` key).

## Features Implemented

### ✅ Registration System
- **All Required Fields:**
  - First Name
  - Last Name
  - Date of Birth
  - Gender
  - Phone Number
  - Email
  - TRN (Tax Registration Number)
  - Password

- **Validation Rules:**
  - All fields are required (HTML + JavaScript validation)
  - Password must be at least 8 characters
  - User must be 18 years or older (calculated from DOB)
  - TRN must be unique and follow format: 000-000-000
  - TRN is used as the username for login

- **Data Storage:**
  - Each user stored as JavaScript object with:
    - firstName
    - lastName
    - dateOfBirth
    - gender
    - phone
    - email
    - trn
    - password
    - dateOfRegistration
    - cart: {}
    - invoices: []
  - Saved to localStorage key: `RegistrationData` (array of objects)

- **Buttons:**
  - Register: Saves user data to localStorage
  - Cancel: Clears the registration form

### ✅ Login System
- **Login Form:**
  - TRN or Email input field (accepts both)
  - Password input field

- **Validation:**
  - Checks TRN/Email and password against `lunarEssence_users` in localStorage
  - Smart input formatting (auto-formats TRN, leaves email as-is)
  - 3 login attempts allowed
  - Success → Redirects to Product Catalog (products.html)
  - 3 Failed attempts → Redirects to Account Locked page

- **Buttons:**
  - Login: Validates credentials
  - Cancel: Clears the login form
  - Reset Password: Link to password reset

### ✅ Password Reset
- **Reset Process:**
  1. User enters their TRN
  2. System searches for TRN in `RegistrationData`
  3. If found, user can enter new password
  4. Password must be at least 8 characters
  5. Password updated in localStorage

## File Structure

```
Codes/
├── auth.html                    # Main authentication page
├── auth-test.html              # Testing and demo page
├── AUTHENTICATION_GUIDE.md     # This documentation
└── Java/
    └── auth.js                 # Authentication logic

CSS/
└── auth.css                    # Authentication styles
```

## Usage Instructions

### For Users

1. **Registration:**
   - Navigate to auth.html
   - Click "Create Account" tab
   - Fill in all required fields
   - Ensure TRN follows format: 000-000-000
   - Must be 18+ years old
   - Password minimum 8 characters
   - Click "Register"

2. **Login:**
   - Navigate to auth.html
   - Enter your TRN (format: 000-000-000) OR Email
   - Enter your password
   - Click "Login"
   - You have 3 attempts before account lockout

3. **Password Reset:**
   - Click "Reset Password" link on login page
   - Enter your TRN or Email
   - Enter new password (minimum 8 characters)
   - Confirm new password
   - Click "Reset Password"

### For Developers

#### Testing the System

1. Open `auth-test.html` in your browser
2. Click "Add Test User" to create sample data
3. Use test credentials:
   - TRN: 123-456-789
   - Password: testpass123
4. Test all features:
   - Registration validation
   - Login attempts
   - Account lockout
   - Password reset

#### Viewing Stored Data

```javascript
// View all registered users from Lunar Essence database
const users = JSON.parse(localStorage.getItem('lunarEssence_users') || '[]');
console.log(users);

// Check current session
const currentUser = JSON.parse(localStorage.getItem('lunarEssence_currentUser'));
const isLoggedIn = localStorage.getItem('isLoggedIn');
console.log('Logged in:', isLoggedIn, 'User:', currentUser);

// Clear all data
localStorage.removeItem('lunarEssence_users');
localStorage.removeItem('lunarEssence_currentUser');
localStorage.removeItem('isLoggedIn');
```

## Validation Details

### TRN Format Validation
- Pattern: `^\d{3}-\d{3}-\d{3}$`
- Example: 123-456-789
- Auto-formats as user types
- Checks uniqueness against existing users

### Age Validation
- Calculates age from date of birth
- Must be 18 years or older
- Accounts for month and day differences

### Password Validation
- Minimum 8 characters
- No special character requirements (can be enhanced)

### Phone Format
- Auto-formats as: 876-123-4567
- Accepts 10 digits

## Security Considerations

⚠️ **Important Notes:**
- This system uses localStorage (client-side storage)
- Passwords are stored in plain text (NOT recommended for production)
- No server-side validation
- No encryption
- Suitable for educational/demo purposes only

**For Production:**
- Use server-side authentication
- Hash passwords (bcrypt, argon2)
- Use HTTPS
- Implement CSRF protection
- Add rate limiting
- Use secure session management
- Add email verification
- Implement 2FA

## API Reference

### Key Functions

#### Registration
```javascript
// Save user registration
saveRegistrationData(userData)

// Check if TRN exists
isTRNExists(trn) // returns boolean

// Validate age
validateAge() // returns boolean

// Validate TRN format
validateTRN() // returns boolean
```

#### Login
```javascript
// Validate login credentials
validateLogin(trn, password) // returns user object or null

// Handle login attempts
handleLogin(event)

// Show account locked page
showAccountLocked()
```

#### Password Reset
```javascript
// Handle password reset
handleResetPassword(event)

// Show reset form
showResetPasswordForm()
```

## LocalStorage Structure

### lunarEssence_users (User Database)
```json
[
  {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2000-01-01",
    "gender": "Male",
    "phone": "876-123-4567",
    "email": "john@example.com",
    "trn": "123-456-789",
    "password": "password123",
    "dateOfRegistration": "2025-12-05T10:30:00.000Z",
    "cart": {},
    "invoices": []
  }
]
```

### Current Session
```json
{
  "lunarEssence_currentUser": {user object},
  "isLoggedIn": "true"
}
```

## Troubleshooting

### Common Issues

1. **"TRN already exists"**
   - TRN must be unique
   - Check existing users in localStorage
   - Use different TRN

2. **"Must be 18 years or older"**
   - Check date of birth
   - Must be born before December 5, 2007

3. **Account Locked**
   - 3 failed login attempts
   - Click "Back to Login" to reset
   - Or clear localStorage

4. **Data not saving**
   - Check browser console for errors
   - Ensure localStorage is enabled
   - Check browser privacy settings

## Testing Checklist

- [ ] Register new user with all fields
- [ ] Verify TRN format validation
- [ ] Test age validation (under 18)
- [ ] Test password length validation
- [ ] Test duplicate TRN prevention
- [ ] Login with correct credentials
- [ ] Login with wrong password (3 times)
- [ ] Verify account lockout
- [ ] Test password reset
- [ ] Verify data in localStorage
- [ ] Test form cancel buttons
- [ ] Test tab switching
- [ ] Test redirect to products page

## Future Enhancements

- [ ] Email verification
- [ ] Password strength meter
- [ ] Remember me functionality
- [ ] Session timeout
- [ ] Profile management
- [ ] Account deletion
- [ ] Export user data
- [ ] Admin dashboard
- [ ] Password recovery via email
- [ ] Two-factor authentication

## Support

For issues or questions:
- Email: assascbenjamin@utech.edu.jm
- Check browser console for errors
- Use auth-test.html for debugging

---

**Created by:** Assas Benjamin (2401419)  
**Course:** CIT2011  
**Date:** December 5, 2025
