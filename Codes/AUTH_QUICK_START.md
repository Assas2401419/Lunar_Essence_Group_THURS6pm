# 🚀 Authentication System - Quick Start Guide

## 📍 Files Location
- **Main Page:** `Codes/auth.html`
- **JavaScript:** `Codes/Java/auth.js`
- **Styles:** `CSS/auth.css`
- **Testing:** `Codes/auth-test.html`

## 🎯 Quick Test

### Option 1: Use Test Page
1. Open `Codes/auth-test.html` in browser
2. Click "Add Test User"
3. Click "Go to Authentication Page"
4. Login with:
   - **TRN:** 123-456-789
   - **Password:** testpass123

### Option 2: Register New User
1. Open `Codes/auth.html`
2. Click "Create Account" tab
3. Fill all fields:
   - First Name: John
   - Last Name: Doe
   - DOB: 2000-01-01 (must be 18+)
   - Gender: Male
   - Phone: 876-123-4567
   - Email: john@example.com
   - TRN: 111-222-333 (auto-formats)
   - Password: password123 (min 8 chars)
4. Click "Register"
5. Login with your TRN and password

## ✅ Features Checklist

### Registration
- [x] All 8 fields required
- [x] TRN format: 000-000-000 (auto-formats)
- [x] TRN uniqueness check
- [x] Age 18+ validation
- [x] Password 8+ characters
- [x] Register & Cancel buttons
- [x] Saves to `lunarEssence_users` database

### Login
- [x] TRN or Email input (smart formatting)
- [x] Password input
- [x] 3 attempts limit
- [x] Attempts counter display
- [x] Success → products.html
- [x] 3 failures → Account Locked page
- [x] Login & Cancel buttons
- [x] Reset Password link

### Password Reset
- [x] Enter TRN or Email to find account
- [x] New password (8+ chars)
- [x] Confirm password
- [x] Updates in database
- [x] Returns to login

### Account Locked
- [x] Shows after 3 failed attempts
- [x] Error message displayed
- [x] Back to Login button

## 🗄️ Database

**Key:** `lunarEssence_users`

**User Object Structure:**
```javascript
{
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "2000-01-01",
  gender: "Male",
  phone: "876-123-4567",
  email: "john@example.com",
  trn: "123-456-789",
  password: "password123",
  dateOfRegistration: "2025-12-05T...",
  cart: {},
  invoices: []
}
```

## 🧪 Testing Scenarios

1. **Register New User**
   - Fill all fields correctly
   - Verify success message
   - Check login works

2. **TRN Validation**
   - Try invalid format (should auto-format)
   - Try duplicate TRN (should reject)

3. **Age Validation**
   - Try DOB less than 18 years ago (should reject)

4. **Login Attempts**
   - Enter wrong password 3 times
   - Verify account locks
   - Click "Back to Login" to reset

5. **Password Reset**
   - Enter valid TRN or Email
   - Set new password
   - Login with new password

## 🔍 Debug Commands

Open browser console and run:

```javascript
// View all users
console.log(JSON.parse(localStorage.getItem('lunarEssence_users')));

// View current session
console.log(JSON.parse(localStorage.getItem('lunarEssence_currentUser')));

// Clear all data
localStorage.removeItem('lunarEssence_users');
localStorage.removeItem('lunarEssence_currentUser');
localStorage.removeItem('isLoggedIn');
```

## ⚠️ Common Issues

**"TRN already exists"**
- Use different TRN or clear database

**"Must be 18 years or older"**
- Use DOB before December 5, 2007

**Account Locked**
- Click "Back to Login" to reset attempts

**Data not saving**
- Check browser console for errors
- Ensure localStorage is enabled

## 📞 Support

- Email: assascbenjamin@utech.edu.jm
- Check `AUTHENTICATION_GUIDE.md` for full documentation
- Use `auth-test.html` for debugging

---

**Ready to test?** Open `Codes/auth.html` in your browser! 🚀
