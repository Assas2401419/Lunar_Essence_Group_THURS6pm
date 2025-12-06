# Lunar Essence - Analytics Functions Documentation

## Overview
This document explains the additional functionality implemented for user data analysis and invoice management as per the assignment requirements.

## Functions Implemented

### 1. ShowUserFrequency()
**Purpose:** Display user frequency based on Gender and Age Groups

**Features:**
- Shows how many registered users fall under specific gender categories (Male, Female, Other)
- Shows how many registered users fall under different age groups (18-25, 26-35, 36-50, 50+)
- Displays data on a dashboard page with visual charts

**Usage:**
```javascript
// Call in browser console
ShowUserFrequency();

// Or display on page
displayUserFrequencyOnPage();
```

**Output:**
- Console: Prints gender and age distribution statistics
- Page: Displays interactive bar charts showing the distribution

### 2. ShowInvoices()
**Purpose:** Display all invoices and allow searching by TRN

**Features:**
- Displays all invoices stored in `AllInvoices` localStorage key
- Allows searching for invoices using TRN (Tax Registration Number)
- Uses console.log() to display invoice details

**Usage:**
```javascript
// Show all invoices in console
ShowInvoices();

// Search for specific invoice by TRN
searchInvoiceByTRN('TRN1234567890');

// Display invoices on page with search functionality
displayInvoicesOnPage();
```

**Output:**
- Console: Lists all invoices with TRN, order number, user, date, total, and item count
- Page: Interactive invoice cards with search functionality

### 3. GetUserInvoices()
**Purpose:** Display all invoices for a specific user

**Features:**
- Retrieves invoices based on user identifier (username, email, or ID)
- Uses TRN stored in localStorage under `RegisterData` key
- Displays user-specific invoice history

**Usage:**
```javascript
// Get invoices for a specific user (by username)
GetUserInvoices('johndoe');

// Get invoices by email
GetUserInvoices('john@example.com');

// Display on page
displayUserInvoicesOnPage('johndoe');
```

**Output:**
- Console: Lists all invoices for the specified user
- Page: User profile with their invoice history

## Dashboard Page

Access the analytics dashboard at: `Codes/dashboard.html`

The dashboard includes:
1. **User Frequency Charts** - Visual representation of gender and age distribution
2. **Invoice Management** - Search and view all invoices
3. **Demo Controls** - Buttons to test functionality

## Demo Data

To test the functionality, use the demo data creator:

```javascript
// Create demo users and invoices
createDemoData();
```

This creates:
- 4 demo users with different genders and age groups
- 3 demo invoices with various products

## localStorage Keys

The system uses the following localStorage keys:

- `lunarEssence_users` - Stores all registered users
- `AllInvoices` - Stores all invoices
- `lunarEssence_currentUser` - Stores current logged-in user session

## Admin Access

The dashboard is **restricted to admin users only**. Regular customers cannot access this page.

### Admin Login Credentials (Demo):
- **Username:** `admin`
- **Password:** `Admin123`

### Access Control:
- Non-logged-in users are redirected to login page
- Regular users see "Access Denied" message
- Only users with `isAdmin: true` can view the dashboard

## Testing Instructions

1. **Create demo data first:**
   - Open browser console (F12)
   - Run: `createDemoData()`
   - This creates admin user and test data

2. **Login as admin:**
   - Go to `Codes/auth.html`
   - Username: `admin`
   - Password: `Admin123`

3. **Access the dashboard:**
   - Navigate to `Codes/dashboard.html`
   - You should now see the analytics dashboard

4. **Test ShowUserFrequency():**
   - Click "Show User Frequency (Console)" button
   - Check browser console for output
   - View charts on the dashboard

5. **Test ShowInvoices():**
   - Click "Show All Invoices (Console)" button
   - Check browser console for output
   - Use search bar on dashboard to filter invoices

6. **Test GetUserInvoices():**
   - Click "Get User Invoices (Console)" button
   - Check browser console for user-specific invoices
   - Or call `GetUserInvoices('johndoe')` in console

7. **Test customer access (optional):**
   - Logout or use incognito window
   - Try to access `Codes/dashboard.html`
   - You should be redirected to login or see access denied

## Browser Console Commands

Open browser console (F12) and try these commands:

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

## Registration Form Updates

The registration form now includes a **Gender** field:
- Male
- Female
- Other

This data is used for the ShowUserFrequency() analysis.

## File Structure

```
Codes/
├── Java/
│   ├── analytics.js      # New analytics functions
│   ├── auth.js           # Updated with gender field
│   └── main.js           # Existing main functions
├── dashboard.html        # New analytics dashboard
└── auth.html            # Updated with gender field
```

## Notes

- All data is stored in browser localStorage
- TRN (Tax Registration Number) is automatically generated for each invoice
- Age is calculated from the dateOfBirth field
- The system uses console.log() as specified in requirements
- Charts are displayed using HTML/CSS (no external charting libraries)

## Assignment Requirements Met

✅ **ShowUserFrequency()** - Shows user frequency by gender and age groups  
✅ **ShowInvoices()** - Displays all invoices with TRN search functionality  
✅ **GetUserInvoices()** - Displays invoices for specific user based on TRN  
✅ **Dashboard Page** - Separate page displaying all analytics data  
✅ **Console Output** - All functions use console.log() as required  
✅ **localStorage Integration** - Uses AllInvoices and RegisterData keys

---

**Student:** Assas Benjamin (2401419)  
**Module:** CIT2011 - Web Programming  
**Assignment:** Individual Assignment #2
