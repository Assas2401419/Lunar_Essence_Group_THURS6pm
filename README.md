# 🌙 Lunar Essence - E-Commerce Website

**University of Technology, Jamaica**  
**School of Computing and IT (SCIT)**  
**Web Programming (CIT2011)**

## 📋 Project Overview

Lunar Essence is a fully functional e-commerce website for luxury hand-poured candles inspired by lunar phases. The website features user authentication, product catalog, shopping cart, checkout system, invoice generation, and admin analytics dashboard.

**Group Assignment:** Simple E-commerce Website with User Data Analysis  
**Due:** Week of Nov. 24, 2025  
**Group Size:** 3-4 persons per group

---

## 👥 Group Members

| Name | Student ID | Assigned Parts |
|------|-----------|----------------|
| **Sian Sudine** | 2405547 | Part 1: User Authentication |
| **Alex Crawford** | 2307247 | Part 2 & 3: Product Catalogue & Cart |
| **Shalani Lawson** | 2401118 | Part 4 & 5: Checkout & Invoice Generation |
| **Assas Benjamin** | 2401419 | Part 6: Additional Functionality (Analytics) |

---

## 🚀 How to Run the Project

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- No server installation required (runs locally)

### Steps to Launch

1. **Download/Clone the Repository**
   ```bash
   git clone https://github.com/Assas2401419/Lunar_Essence_Group_THURS6pm.git
   cd Lunar_Essence_Group_THURS6pm
   ```

2. **Open the Website**
   - Navigate to the `Codes` folder
   - Open `home.html` in your web browser
   - Or double-click `START_HERE.html` for guided navigation

3. **Alternative: Use Live Server (Optional)**
   - If using VS Code, install "Live Server" extension
   - Right-click on `home.html` → "Open with Live Server"

---

## 🔐 Login Credentials

### Test User Account
- **TRN:** `123-456-789`
- **Email:** `test@lunaressence.com`
- **Password:** `testpass123`

### Admin Account
- **Username:** `admin`
- **Password:** `Admin123`
- **Access:** Dashboard analytics at `dashboard.html`

### Create New Account
- Go to `auth.html` → Click "Create Account"
- Fill in all required fields
- Must be 18+ years old
- TRN format: 000-000-000

---

## 📁 Project Structure

```
Lunar_Essence_Group_THURS6pm/
├── Codes/
│   ├── home.html              # Landing page
│   ├── auth.html              # Login/Registration
│   ├── products.html          # Product catalog
│   ├── cart.html              # Shopping cart
│   ├── checkout.html          # Checkout process
│   ├── dashboard.html         # Admin analytics (admin only)
│   ├── about.html             # About page
│   ├── care-tips.html         # Candle care tips
│   └── Java/
│       ├── auth.js            # Authentication logic (Q1)
│       ├── products.js        # Product catalog (Q2)
│       ├── cart.js            # Shopping cart (Q3)
│       ├── checkout.js        # Checkout & invoices (Q4 & Q5)
│       ├── analytics.js       # User analytics (Q6)
│       ├── main.js            # Core functionality
│       ├── config.js          # Configuration
│       └── logout.js          # Logout functionality
├── CSS/
│   ├── common.css             # Global styles
│   ├── navigation.css         # Navigation bar
│   ├── auth.css               # Authentication pages
│   ├── products.css           # Product pages
│   ├── cart.css               # Cart styling
│   └── checkout.css           # Checkout styling
├── assets/
│   ├── Logo 2.svg             # Main logo
│   ├── *.jpg                  # Product images
│   └── SVG/                   # Icon files
└── README.md                  # This file
```

---

## 🎯 Features Implemented

### Part 1: User Authentication (Sian Sudine - 2405547)
✅ **Registration Page**
- Form fields: First name, Last name, DOB, Gender, Phone, Email, TRN, Password
- Validation: All fields required, password 8+ chars, age 18+
- TRN format: 000-000-000 (unique, used as username)
- Data stored in `lunarEssence_users` localStorage
- Register & Cancel buttons

✅ **Login Page**
- Login with TRN or Email + Password
- 3 login attempts with counter
- Success → Redirect to products.html
- Failure → Account locked page
- Login, Cancel buttons & Reset Password link

### Part 2: Product Catalogue (Alex Crawford - 2307247)
✅ **Product List**
- Array of product objects (name, price, description, image)
- Stored in localStorage as "All Products"
- Dynamic display on website
- "Add to Cart" button on each product

### Part 3: Cart Page (Alex Crawford - 2307247)
✅ **Shopping Cart**
- Display: name, price, quantity, subtotal, discount, tax, total
- Remove items & update quantities
- Calculate total price
- Clear All, Check Out, Close buttons

### Part 4: Checkout Page (Shalani Lawson - 2401118)
✅ **Checkout Process**
- Shopping cart summary with total cost
- Shipping details form (name, address, amount paid)
- Generate invoice on confirmation
- Confirm & Cancel buttons

### Part 5: Invoice Generation (Shalani Lawson - 2401118)
✅ **Invoice Details**
- Company name, date, shipping info
- Unique invoice number, TRN
- Purchased items (name, quantity, price, discount)
- Taxes, subtotal, total cost
- Stored in user's invoices array + `AllInvoices` localStorage
- Email confirmation message

### Part 6: Additional Functionality (Assas Benjamin - 2401419)
✅ **ShowUserFrequency()**
- User count by gender (Male, Female, Other)
- User count by age groups (18-25, 26-35, 36-50, 50+)
- Displayed on admin dashboard

✅ **ShowInvoices()**
- Display all invoices
- Search by TRN
- Uses `AllInvoices` from localStorage

✅ **GetUserInvoices()**
- Display invoices for specific user by TRN
- Uses `RegisterData` from localStorage

---

## 🛠️ Technologies & Tools Used

### Frontend
- **HTML5** - Structure and content
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Client-side logic and interactivity

### Data Storage
- **localStorage** - Client-side data persistence
  - `lunarEssence_users` - User accounts
  - `lunarEssence_cart` - Shopping cart data
  - `AllInvoices` - Invoice records
  - `lunarEssence_currentUser` - Session management

### Libraries & Frameworks
- **No external libraries required** - Pure vanilla JavaScript
- **No backend server needed** - Fully client-side application

### Development Tools
- **Git** - Version control
- **GitHub** - Repository hosting
- **VS Code** - Code editor
- **Browser DevTools** - Testing and debugging

---

## 📊 localStorage Keys Used

| Key | Description | Data Type |
|-----|-------------|-----------|
| `lunarEssence_users` | All registered users | Array of Objects |
| `lunarEssence_currentUser` | Current logged-in user | Object |
| `isLoggedIn` | Login status | Boolean (string) |
| `lunarEssence_cart` | Shopping cart items | Object |
| `AllInvoices` | All generated invoices | Array of Objects |
| `lunarEssence_authToken` | Session token | String |

---

## 🧪 Testing Instructions

### 1. Test User Registration
1. Go to `auth.html`
2. Click "Create Account"
3. Fill all fields (use DOB before Dec 5, 2007 for 18+)
4. TRN format: 123-456-789
5. Click "Register"
6. Verify success message

### 2. Test Login
1. Go to `auth.html`
2. Enter TRN: `123-456-789` OR Email: `test@lunaressence.com`
3. Enter Password: `testpass123`
4. Click "Login"
5. Should redirect to products.html

### 3. Test Shopping Cart
1. Login first
2. Go to `products.html`
3. Click "Add to Cart" on any product
4. Click cart icon in navigation
5. Verify item appears with correct price
6. Update quantity or remove item
7. Click "Checkout"

### 4. Test Checkout & Invoice
1. Complete cart with items
2. Go to checkout
3. Fill shipping information
4. Click "Confirm Order"
5. Verify invoice is generated
6. Check console for invoice data

### 5. Test Admin Dashboard
1. Logout if logged in
2. Login with admin credentials
3. Navigate to `dashboard.html`
4. View user frequency charts
5. Search invoices by TRN
6. Verify data displays correctly

### 6. Test Account Lockout
1. Go to login page
2. Enter wrong password 3 times
3. Verify account locked message appears
4. Click "Back to Login" to reset

---

## 🔍 Debugging & Console Functions

Open browser console (F12) and try these functions:

```javascript
// View all registered users
console.log(JSON.parse(localStorage.getItem('lunarEssence_users')));

// View current user session
console.log(JSON.parse(localStorage.getItem('lunarEssence_currentUser')));

// View all invoices
ShowInvoices();

// View user frequency
ShowUserFrequency();

// Get invoices for specific user
GetUserInvoices('123-456-789');

// Clear all data (reset)
localStorage.clear();
```

---

## 📝 Important Notes

### Security Disclaimer
⚠️ **This is an educational project for demonstration purposes only.**

**NOT suitable for production use:**
- Passwords stored in plain text (no encryption)
- Client-side only (no server validation)
- localStorage is not secure for sensitive data
- No HTTPS/SSL implementation

**For production, you would need:**
- Server-side authentication
- Password hashing (bcrypt, argon2)
- Database (MySQL, MongoDB, etc.)
- HTTPS/SSL certificates
- CSRF protection
- Rate limiting
- Email verification
- Two-factor authentication

### Browser Compatibility
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### localStorage Limits
- Maximum 5-10MB per domain
- Data persists until manually cleared
- Not shared between browsers

---

## 🐛 Troubleshooting

### Issue: Can't login
**Solution:** 
- Check credentials are correct
- Ensure you're registered first
- Clear localStorage and re-register
- Check browser console for errors

### Issue: Cart not updating
**Solution:**
- Refresh the page
- Check localStorage is enabled
- Clear browser cache
- Verify JavaScript is enabled

### Issue: Dashboard shows "Access Denied"
**Solution:**
- Login with admin credentials
- Username: `admin`, Password: `Admin123`
- Regular users cannot access dashboard

### Issue: Invoice not generating
**Solution:**
- Ensure you're logged in
- Complete all checkout fields
- Check browser console for errors
- Verify cart has items

---

## 📚 Additional Documentation

For detailed documentation, see:
- `Codes/AUTHENTICATION_GUIDE.md` - Authentication system details
- `Codes/AUTH_QUICK_START.md` - Quick start guide
- `Codes/ADMIN_LOGIN_GUIDE.md` - Admin access instructions
- `Codes/QUICK_REFERENCE.md` - Quick reference for all features

---

## 🎓 Academic Information

**Course:** CIT2011 - Web Programming  
**Institution:** University of Technology, Jamaica  
**School:** School of Computing and IT (SCIT)  
**Semester:** Fall 2025  
**Assignment:** Group Project - E-commerce Website with User Data Analysis

---

## 📞 Support & Contact

For questions or issues:
- **Email:** assascbenjamin@utech.edu.jm
- **Repository:** [GitHub - Lunar Essence](https://github.com/Assas2401419/Lunar_Essence_Group_THURS6pm)

---

## 📄 License

This project is created for educational purposes as part of the CIT2011 course at UTech, Jamaica.

---

## 🙏 Acknowledgments

- University of Technology, Jamaica
- CIT2011 Course Instructor
- All group members for their contributions

---

**Last Updated:** December 6, 2025  
**Version:** 1.0  
**Status:** ✅ Complete and Functional

---

## 🚀 Quick Start Summary

1. Open `Codes/home.html` in browser
2. Create account at `auth.html` or use test credentials
3. Browse products at `products.html`
4. Add items to cart
5. Checkout and generate invoice
6. Admin: Login and view dashboard at `dashboard.html`

**Enjoy shopping at Lunar Essence! 🌙✨**
