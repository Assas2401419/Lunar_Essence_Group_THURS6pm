# 🔐 Admin Login Guide

## Quick Start - View Dashboard

### Step 1: Login as Admin
1. Open `Codes/auth.html` in your browser
2. Use these credentials:
   ```
   Username: admin
   Password: Admin123
   ```
3. Click "Sign In"

### Step 2: Access Dashboard
1. After successful login, navigate to `Codes/dashboard.html`
2. You will see the full analytics dashboard with:
   - User frequency charts (Gender & Age)
   - All invoices with search functionality
   - Demo data controls

## Default Admin Account

The system **automatically creates** a default admin account on first load:

```javascript
{
  username: 'admin',
  password: 'Admin123',
  email: 'admin@lunaressence.com',
  firstName: 'Admin',
  lastName: 'User',
  isAdmin: true
}
```

## Dashboard Features (Admin Only)

### ✅ What Admins Can See:
- 📊 User frequency by gender (Male, Female, Other)
- 📊 User frequency by age groups (18-25, 26-35, 36-50, 50+)
- 🧾 All customer invoices
- 🔍 Search invoices by TRN, order number, or customer name
- 📋 View detailed invoice information
- 🎮 Demo data controls for testing

### ❌ What Regular Customers See:
- "Access Denied" message
- Cannot view any analytics data
- Redirected to login if not signed in

## Testing the Access Control

### Test 1: Admin Access ✅
```
1. Login with: admin / Admin123
2. Go to: dashboard.html
3. Result: Full dashboard visible
```

### Test 2: Customer Access ❌
```
1. Register a new account (or login as: lunastar / Password123)
2. Go to: dashboard.html
3. Result: "Access Denied" message
```

### Test 3: No Login ❌
```
1. Logout or use incognito window
2. Go to: dashboard.html
3. Result: Redirected to login page
```

## Creating Demo Data

Once logged in as admin, click the **"Create Demo Data"** button on the dashboard to populate:
- 5 demo users (including the admin)
- 3 sample invoices
- Various gender and age distributions

## Console Functions

Open browser console (F12) and try these admin functions:

```javascript
// Show user frequency analysis
ShowUserFrequency();

// Show all invoices
ShowInvoices();

// Get invoices for specific user
GetUserInvoices('johndoe');

// Search invoice by TRN
searchInvoiceByTRN('TRN1234567890');

// Create demo data
createDemoData();
```

## Troubleshooting

### Problem: Can't login as admin
**Solution:** Run this in console to recreate admin:
```javascript
ensureAdminExists();
```

### Problem: Dashboard shows "Access Denied"
**Solution:** Make sure you're logged in as admin. Check console:
```javascript
console.log(getCurrentUser());
// Should show: isAdmin: true
```

### Problem: No data showing on dashboard
**Solution:** Create demo data:
```javascript
createDemoData();
```
Then refresh the page.

## Security Notes

⚠️ **Important:** This is a client-side demo implementation.

In production, you should:
- Use server-side authentication
- Hash passwords (never store plain text)
- Use JWT tokens or secure sessions
- Implement proper role-based access control (RBAC)
- Add audit logging for admin actions
- Use HTTPS for all communications

## File Locations

```
Codes/
├── auth.html              # Login page (shows admin credentials)
├── dashboard.html         # Admin-only analytics dashboard
├── Java/
│   ├── main.js           # Auto-creates admin on page load
│   ├── auth.js           # Handles login/registration
│   └── analytics.js      # Dashboard functions
└── ADMIN_LOGIN_GUIDE.md  # This file
```

## Summary

✅ **Default admin automatically created**  
✅ **Username:** `admin`  
✅ **Password:** `Admin123`  
✅ **Dashboard:** `dashboard.html`  
✅ **Access control:** Admin only  
✅ **Auto-initialization:** Works on any page load  

---

**Ready to test?** Just open `auth.html` and login with the admin credentials above! 🚀
