# Dashboard Access Control

## 🔒 Security Implementation

The analytics dashboard (`dashboard.html`) is **restricted to admin users only**.

## Access Levels

### ❌ **Regular Customers (Non-Admin)**
- **Cannot** view the dashboard
- Will see "Access Denied" message if they try to access
- Dashboard link is not shown in navigation menu

### ✅ **Admin Users**
- **Can** view all analytics data
- **Can** see user frequency charts
- **Can** search and view all invoices
- **Can** access all analytics functions

### 🚫 **Non-Logged-In Users**
- Redirected to login page
- Must sign in before accessing dashboard

## Admin Credentials (Demo)

```
Username: admin
Password: Admin123
```

## How to Test

### Test 1: Admin Access ✅
1. Run `createDemoData()` in console
2. Login with admin credentials
3. Navigate to `dashboard.html`
4. ✅ Should see full dashboard

### Test 2: Customer Access ❌
1. Login as regular user (e.g., `johndoe` / `Password123`)
2. Navigate to `dashboard.html`
3. ❌ Should see "Access Denied" message

### Test 3: No Login ❌
1. Logout or use incognito window
2. Navigate to `dashboard.html`
3. ❌ Should be redirected to login page

## How It Works

```javascript
// Check on page load
if (!currentUser) {
    // Redirect to login
    window.location.href = 'auth.html?return=dashboard.html';
}

if (!currentUser.isAdmin) {
    // Show access denied
    // Hide dashboard content
}
```

## Making a User Admin

To make any user an admin, update their record in localStorage:

```javascript
// Get users
let users = JSON.parse(localStorage.getItem('lunarEssence_users'));

// Find user
let user = users.find(u => u.username === 'johndoe');

// Make admin
user.isAdmin = true;

// Save back
localStorage.setItem('lunarEssence_users', JSON.stringify(users));
```

## For Production

In a real application, you would:
1. Store admin status in a secure database
2. Use server-side authentication
3. Implement role-based access control (RBAC)
4. Use JWT tokens or session management
5. Add audit logging for admin actions

## Summary

✅ Dashboard is admin-only  
✅ Regular customers cannot access  
✅ Non-logged-in users are redirected  
✅ Demo admin account provided  
✅ Access control implemented  

---

**Note:** This is a client-side implementation for demonstration purposes. In production, always implement server-side authentication and authorization.
