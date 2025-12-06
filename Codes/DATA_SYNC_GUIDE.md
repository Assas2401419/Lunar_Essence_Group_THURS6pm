# Data Synchronization Guide

## Overview
The admin dashboard now automatically syncs with customer actions. When a new user registers or makes a purchase, the data immediately appears on the admin dashboard.

## Problem Fixed
**Before:** New registrations and purchases weren't showing up on the admin dashboard.  
**After:** All new data automatically syncs and displays in real-time.

## How It Works

### 1. User Registration Flow
```
Customer registers → 
  ├─ Saved to: lunarEssence_users
  ├─ Event dispatched: user:registered
  └─ Admin dashboard auto-refreshes
```

### 2. Purchase/Checkout Flow
```
Customer completes purchase → 
  ├─ Saved to: lunarEssence_orders (customer history)
  ├─ Saved to: AllInvoices (admin dashboard)
  ├─ TRN generated automatically
  ├─ Event dispatched: invoice:created
  └─ Admin dashboard auto-refreshes
```

### 3. Dashboard Refresh Flow
```
Dashboard listens for:
  ├─ user:registered events
  ├─ invoice:created events
  └─ localStorage changes (from other tabs)
  
When event detected:
  ├─ Refresh user frequency charts
  ├─ Refresh invoice list
  └─ Show success message
```

## localStorage Keys

### Customer Side (Writes)
- **`lunarEssence_users`** - All registered users
- **`lunarEssence_orders`** - Customer order history
- **`AllInvoices`** - All invoices (shared with admin)

### Admin Side (Reads)
- **`lunarEssence_users`** - Reads for user analytics
- **`AllInvoices`** - Reads for invoice display

### Shared Keys (Both Read/Write)
- **`lunarEssence_currentUser`** - Current logged-in user
- **`lunarEssence_cart`** - Shopping cart

## Data Format

### User Object
```javascript
{
  id: 'user_123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  username: 'johndoe',
  password: 'Password123',  // In production, this would be hashed
  dateOfBirth: '1995-03-15',
  gender: 'Male',
  isAdmin: false,
  registrationDate: '2025-01-15T10:30:00.000Z',
  addresses: []
}
```

### Invoice Object
```javascript
{
  trn: 'TRN1737024000000123',
  orderNumber: 'LE-20250115-1234',
  userId: 'user_123',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  date: '2025-01-15T10:30:00.000Z',
  items: [
    {
      name: 'New Moon Essence',
      size: 'Medium (10oz)',
      quantity: 2,
      price: 32.00
    }
  ],
  subtotal: 64.00,
  tax: 10.24,
  shipping: 10.00,
  total: 84.24,
  status: 'Completed',
  shippingAddress: {...},
  billingAddress: {...}
}
```

## Testing Instructions

### Test 1: New User Registration ✅
```
1. Open auth.html in one tab
2. Open dashboard.html in another tab (logged in as admin)
3. Register a new user in first tab
4. Switch to dashboard tab
5. Click "Show User Frequency"
6. ✅ New user should appear in charts
7. ✅ Total user count should increase
```

### Test 2: New Purchase ✅
```
1. Login as a customer
2. Add items to cart
3. Go to checkout
4. Complete purchase
5. Open dashboard (as admin)
6. Click "Show All Invoices"
7. ✅ New invoice should appear
8. ✅ Search by TRN should find it
```

### Test 3: Auto-Refresh ✅
```
1. Open dashboard as admin
2. Click "Show All Invoices"
3. In another tab, complete a purchase
4. Return to dashboard tab
5. ✅ Dashboard should auto-refresh
6. ✅ New invoice should appear automatically
```

### Test 4: Manual Refresh ✅
```
1. Open dashboard as admin
2. Click "🔄 Refresh Dashboard" button
3. ✅ All data should reload
4. ✅ Success message should appear
```

### Test 5: Cross-Tab Sync ✅
```
1. Open dashboard in Tab A (as admin)
2. Open dashboard in Tab B (as admin)
3. In Tab A, click "Create Demo Data"
4. Switch to Tab B
5. ✅ Tab B should auto-refresh
6. ✅ New data should appear
```

## Events System

### Dispatched Events

#### `user:registered`
Dispatched when a new user registers.
```javascript
window.dispatchEvent(new CustomEvent('user:registered', { 
  detail: {
    userId: 'user_123',
    username: 'johndoe',
    email: 'john@example.com',
    timestamp: '2025-01-15T10:30:00.000Z'
  }
}));
```

#### `invoice:created`
Dispatched when a new purchase is completed.
```javascript
window.dispatchEvent(new CustomEvent('invoice:created', { 
  detail: {
    trn: 'TRN1737024000000123',
    orderNumber: 'LE-20250115-1234',
    total: 84.24,
    // ... full invoice object
  }
}));
```

### Listening for Events

```javascript
// Listen for new registrations
window.addEventListener('user:registered', (event) => {
  console.log('New user:', event.detail.username);
  refreshDashboard();
});

// Listen for new invoices
window.addEventListener('invoice:created', (event) => {
  console.log('New invoice:', event.detail.trn);
  refreshDashboard();
});

// Listen for storage changes (cross-tab)
window.addEventListener('storage', (event) => {
  if (event.key === 'AllInvoices') {
    console.log('Invoices updated in another tab');
    refreshDashboard();
  }
});
```

## Functions

### `refreshDashboard()`
Manually refresh all dashboard data.
```javascript
refreshDashboard();
```

### `initializeDashboardListeners()`
Set up event listeners (called automatically).
```javascript
initializeDashboardListeners();
```

### `saveAsInvoice(order)`
Convert order to invoice format and save (called automatically in checkout).
```javascript
saveAsInvoice(orderObject);
```

## Troubleshooting

### Problem: New users not showing
**Check:**
1. Is user saved to `lunarEssence_users`?
   ```javascript
   console.log(JSON.parse(localStorage.getItem('lunarEssence_users')));
   ```
2. Was event dispatched?
   - Check browser console for "New user registered" message
3. Is dashboard listening?
   - Check console for "Dashboard listeners initialized"

**Solution:**
- Refresh dashboard manually: Click "🔄 Refresh Dashboard"
- Or call: `refreshDashboard()`

### Problem: New invoices not showing
**Check:**
1. Is invoice saved to `AllInvoices`?
   ```javascript
   console.log(JSON.parse(localStorage.getItem('AllInvoices')));
   ```
2. Was event dispatched?
   - Check console for "Invoice saved to AllInvoices"
3. Is TRN generated?
   - Check invoice object has `trn` field

**Solution:**
- Refresh dashboard: Click "🔄 Refresh Dashboard"
- Or call: `ShowInvoices()`

### Problem: Dashboard not auto-refreshing
**Check:**
1. Are listeners initialized?
   ```javascript
   console.log('Listeners should be initialized on page load');
   ```
2. Are events being dispatched?
   - Check browser console for event messages

**Solution:**
- Manually initialize: `initializeDashboardListeners()`
- Use manual refresh button

### Problem: Data showing in one tab but not another
**Cause:** Browser localStorage sync delay

**Solution:**
- Wait a few seconds
- Or manually refresh: `refreshDashboard()`
- Or reload page

## Code Changes Made

### Files Modified:

1. **`Codes/Java/checkout.js`**
   - Added `saveAsInvoice()` method
   - Added `generateTRN()` method
   - Added `getCurrentUser()` method
   - Modified `saveOrder()` to also save to `AllInvoices`
   - Dispatches `invoice:created` event

2. **`Codes/Java/auth.js`**
   - Dispatches `user:registered` event after registration
   - Logs registration to console

3. **`Codes/Java/analytics.js`**
   - Added `refreshDashboard()` function
   - Added `initializeDashboardListeners()` function
   - Listens for `user:registered` events
   - Listens for `invoice:created` events
   - Listens for `storage` events (cross-tab sync)

4. **`Codes/dashboard.html`**
   - Added "🔄 Refresh Dashboard" button
   - Button calls `refreshDashboard()`

## Best Practices

### For Developers:

1. **Always dispatch events** when data changes
   ```javascript
   localStorage.setItem('key', data);
   window.dispatchEvent(new CustomEvent('data:changed', { detail: data }));
   ```

2. **Use consistent data formats** between customer and admin sides

3. **Test cross-tab sync** by opening multiple tabs

4. **Log important actions** to console for debugging

5. **Handle errors gracefully** with try-catch blocks

### For Users:

1. **Use the refresh button** if data doesn't appear immediately

2. **Check browser console** for error messages

3. **Reload the page** if auto-refresh isn't working

4. **Clear cache** if seeing old data

## Summary

✅ **New users automatically appear on dashboard**  
✅ **New purchases automatically appear on dashboard**  
✅ **Dashboard auto-refreshes when data changes**  
✅ **Manual refresh button available**  
✅ **Cross-tab synchronization works**  
✅ **Events system for real-time updates**  
✅ **Consistent data format across system**  
✅ **Comprehensive error handling**  

**The data synchronization is now fully functional!** 🎉

---

**Student:** Assas Benjamin (2401419)  
**Module:** CIT2011 - Web Programming  
**Feature:** Real-Time Data Synchronization
