# Dashboard Quick Reference

## 🔑 Admin Login
- **Username**: `admin`
- **Password**: `Admin123`

## 📊 Data Sources (localStorage)
- **Users**: `lunarEssence_users`
- **Invoices**: `AllInvoices`
- **Orders**: `lunarEssence_orders`

## 🎯 Dashboard Functions

### ShowUserFrequency()
Shows gender and age group breakdown of registered users.
- **Data Source**: `lunarEssence_users`
- **Displays**: Gender (Male/Female/Other) and Age Groups (18-25, 26-35, 36-50, 50+)

### ShowInvoices()
Shows all invoices with search functionality.
- **Data Source**: `AllInvoices`
- **Search By**: TRN, Order Number, User Name, Email

### GetUserInvoices(username)
Shows all invoices for a specific user.
- **Data Source**: `lunarEssence_users` + `AllInvoices`
- **Matches By**: User's TRN (primary), userId, email, name

## 🧪 Console Commands

```javascript
// Verify data status
verifyDataStatus()

// Refresh dashboard
refreshDashboard()

// Check users
JSON.parse(localStorage.getItem('lunarEssence_users'))

// Check invoices
JSON.parse(localStorage.getItem('AllInvoices'))

// Get user invoices
GetUserInvoices('username')

// Show user frequency
ShowUserFrequency()

// Show all invoices
ShowInvoices()
```

## 🔍 Debugging

### Check Console Logs
Open browser console (F12) to see:
- Data verification table on dashboard load
- Function execution logs
- Data source confirmation
- TRN matching details

### Verify Data Flow
1. Register user → Check console for TRN
2. Complete order → Check console for invoice save
3. Open dashboard → Check console for data verification
4. Run functions → Check console for detailed logs

## ⚠️ Important

- Dashboard shows **REAL DATA ONLY** from localStorage
- Demo data only added when "Add Demo Data" button clicked
- "Clear All Invoices" keeps user accounts intact
- Each user has unique TRN that persists across all orders
- Dashboard auto-refreshes on new registrations/purchases

## 📝 Testing Flow

1. **Register User** → `auth.html`
2. **Make Purchase** → Add to cart → Checkout
3. **View Dashboard** → Login as admin → `dashboard.html`
4. **Verify Data** → Check console → Run functions
5. **Search Invoices** → Use TRN or username

## 🎯 Expected Console Output

```
═══════════════════════════════════════════
📊 DASHBOARD DATA VERIFICATION
═══════════════════════════════════════════
Data Source: localStorage (REAL DATA)

Users (lunarEssence_users):
  Total: X
  [List of users with TRNs]

Invoices (AllInvoices):
  Total: X
  [List of invoices with TRNs]
═══════════════════════════════════════════
```

## 📚 Documentation Files

- `REAL_DATA_VERIFICATION_GUIDE.md` - Complete testing guide
- `DASHBOARD_FIXES_SUMMARY.md` - Summary of changes
- `QUICK_REFERENCE.md` - This file
