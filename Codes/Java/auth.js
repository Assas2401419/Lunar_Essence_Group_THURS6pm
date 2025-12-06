// ============================================================================
// QUESTION 1: USER AUTHENTICATION (LocalStorage)
// Group Member Assigned: Sian Sudine (2405547) Part 1
// 
// This file implements:
// a. Registration Page:
//    - Create registration form with fields: first name, last name, DOB, gender,
//      phone number, email, TRN (tax registration number), and password
//    - Validate form: all fields required (HTML + JavaScript validation)
//    - Password must be at least 8 characters long
//    - User must be 18+ years old (calculate age using JavaScript)
//    - TRN must be unique, format 000-000-000, used as username for login
//    - Store registration data as JavaScript object with: firstName, lastName,
//      dateOfBirth, gender, phone, email, TRN, password, dateOfRegistration,
//      cart{}, invoices[]
//    - Append each registration to localStorage key "lunarEssence_users" (array of objects)
//    - Buttons: Register (saves data), Cancel (clears form)
//
// b. Login Page:
//    - Create login form where user enters TRN or Email and password
//    - Validate login by checking against lunarEssence_users in localStorage
//    - Allow 3 attempts to enter correct credentials
//    - If successful → redirect to Product Catalog (products.html)
//    - If all attempts fail → redirect to Account Locked page
//    - Buttons: Login (validates), Cancel (clears form)
//    - Reset Password link (allows password change by searching TRN/Email)
// ============================================================================

// LUNAR ESSENCE - AUTHENTICATION SYSTEM
// Handles user registration, login, and password reset with localStorage
// Uses lunarEssence_users database for storing user information

// Database key for user storage
const USER_DATABASE_KEY = 'lunarEssence_users';

// Login attempts tracking
let loginAttempts = 0;
const MAX_LOGIN_ATTEMPTS = 3;

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthSystem();
});

function initializeAuthSystem() {
    // Tab switching
    setupTabSwitching();
    
    // Form submissions
    setupRegistrationForm();
    setupLoginForm();
    setupResetPasswordForm();
    
    // Button handlers
    setupButtonHandlers();
    
    // Check if user is already logged in
    checkExistingSession();
}

// ============================================================================
// TAB SWITCHING
// ============================================================================
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', () => switchTab('register'));
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', () => switchTab('login'));
    }
}

function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Hide all containers
    document.getElementById('login-form-container').classList.add('hidden');
    document.getElementById('register-form-container').classList.add('hidden');
    document.getElementById('reset-password-container').classList.add('hidden');
    document.getElementById('account-locked-container').classList.add('hidden');
    
    // Show selected container
    if (tab === 'login') {
        document.getElementById('login-form-container').classList.remove('hidden');
    } else if (tab === 'register') {
        document.getElementById('register-form-container').classList.remove('hidden');
    }
    
    // Clear all forms
    clearAllForms();
}

// ============================================================================
// REGISTRATION FORM
// ============================================================================
function setupRegistrationForm() {
    const form = document.getElementById('register-form');
    
    if (!form) return;
    
    // Real-time validation
    const trnInput = document.getElementById('register-trn');
    const phoneInput = document.getElementById('register-phone');
    const dobInput = document.getElementById('register-dob');
    const passwordInput = document.getElementById('register-password');
    
    if (trnInput) {
        trnInput.addEventListener('input', formatTRN);
        trnInput.addEventListener('blur', validateTRN);
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhone);
    }
    
    if (dobInput) {
        dobInput.addEventListener('blur', validateAge);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePassword);
    }
    
    // Form submission
    form.addEventListener('submit', handleRegistration);
}

function formatTRN(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    
    if (value.length > 6) {
        value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
    } else if (value.length > 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    
    e.target.value = value;
}

function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    
    if (value.length > 6) {
        value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
    } else if (value.length > 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    
    e.target.value = value;
}

function validateTRN() {
    const trnInput = document.getElementById('register-trn');
    const errorSpan = document.getElementById('register-trn-error');
    const trn = trnInput.value;
    
    // Check format
    const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        showError(trnInput, errorSpan, 'TRN must be in format 000-000-000');
        return false;
    }
    
    // Check uniqueness
    if (isTRNExists(trn)) {
        showError(trnInput, errorSpan, 'This TRN is already registered');
        return false;
    }
    
    showSuccess(trnInput, errorSpan);
    return true;
}

function validateAge() {
    const dobInput = document.getElementById('register-dob');
    const errorSpan = document.getElementById('register-dob-error');
    const dob = new Date(dobInput.value);
    const today = new Date();
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    if (age < 18) {
        showError(dobInput, errorSpan, 'You must be 18 years or older to register');
        return false;
    }
    
    showSuccess(dobInput, errorSpan);
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('register-password');
    const errorSpan = document.getElementById('register-password-error');
    const password = passwordInput.value;
    
    if (password.length < 8) {
        showError(passwordInput, errorSpan, 'Password must be at least 8 characters long');
        return false;
    }
    
    showSuccess(passwordInput, errorSpan);
    return true;
}

function handleRegistration(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        firstName: document.getElementById('register-firstname').value.trim(),
        lastName: document.getElementById('register-lastname').value.trim(),
        dateOfBirth: document.getElementById('register-dob').value,
        gender: document.getElementById('register-gender').value,
        phone: document.getElementById('register-phone').value,
        email: document.getElementById('register-email').value.trim(),
        trn: document.getElementById('register-trn').value,
        password: document.getElementById('register-password').value,
        dateOfRegistration: new Date().toISOString(),
        cart: {},
        invoices: []
    };
    
    // Validate all fields
    if (!validateRegistrationForm(formData)) {
        return;
    }
    
    // Save to localStorage
    saveRegistrationData(formData);
    
    // Show success message
    showGlobalMessage('success', 'Registration successful! Please login with your TRN.');
    
    // Switch to login tab after 2 seconds
    setTimeout(() => {
        switchTab('login');
        document.getElementById('login-trn').value = formData.trn;
    }, 2000);
}

function validateRegistrationForm(data) {
    let isValid = true;
    
    // Validate first name
    if (!data.firstName) {
        showError(
            document.getElementById('register-firstname'),
            document.getElementById('register-firstname-error'),
            'First name is required'
        );
        isValid = false;
    }
    
    // Validate last name
    if (!data.lastName) {
        showError(
            document.getElementById('register-lastname'),
            document.getElementById('register-lastname-error'),
            'Last name is required'
        );
        isValid = false;
    }
    
    // Validate date of birth
    if (!validateAge()) {
        isValid = false;
    }
    
    // Validate gender
    if (!data.gender) {
        showError(
            document.getElementById('register-gender'),
            document.getElementById('register-gender-error'),
            'Please select a gender'
        );
        isValid = false;
    }
    
    // Validate phone
    if (!data.phone) {
        showError(
            document.getElementById('register-phone'),
            document.getElementById('register-phone-error'),
            'Phone number is required'
        );
        isValid = false;
    }
    
    // Validate email
    if (!data.email || !isValidEmail(data.email)) {
        showError(
            document.getElementById('register-email'),
            document.getElementById('register-email-error'),
            'Please enter a valid email address'
        );
        isValid = false;
    }
    
    // Validate TRN
    if (!validateTRN()) {
        isValid = false;
    }
    
    // Validate password
    if (!validatePassword()) {
        isValid = false;
    }
    
    return isValid;
}

function saveRegistrationData(userData) {
    // Get existing data from Lunar Essence database
    let users = JSON.parse(localStorage.getItem(USER_DATABASE_KEY) || '[]');
    
    // Add new user
    users.push(userData);
    
    // Save back to localStorage
    localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(users));
}

function isTRNExists(trn) {
    const users = JSON.parse(localStorage.getItem(USER_DATABASE_KEY) || '[]');
    return users.some(user => user.trn === trn);
}

// ============================================================================
// LOGIN FORM
// ============================================================================
function setupLoginForm() {
    const form = document.getElementById('login-form');
    
    if (!form) return;
    
    // Smart input formatting - only format if it looks like a TRN
    const loginTrnInput = document.getElementById('login-trn');
    if (loginTrnInput) {
        loginTrnInput.addEventListener('input', smartFormatLoginInput);
    }
    
    form.addEventListener('submit', handleLogin);
    
    // Update attempts display
    updateAttemptsDisplay();
}

function smartFormatLoginInput(e) {
    const value = e.target.value;
    
    // If it contains @ symbol, it's likely an email - don't format
    if (value.includes('@')) {
        return;
    }
    
    // If it's all digits or has dashes, format as TRN
    if (/^[\d-]*$/.test(value)) {
        formatTRN(e);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const identifier = document.getElementById('login-trn').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Clear previous errors
    document.getElementById('login-trn-error').textContent = '';
    document.getElementById('login-password-error').textContent = '';
    
    // Validate credentials (accepts TRN or email)
    const user = validateLogin(identifier, password);
    
    if (user) {
        // Successful login
        loginAttempts = 0;
        
        // Save session using Lunar Essence keys
        localStorage.setItem('lunarEssence_currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Show success message
        showGlobalMessage('success', 'Login successful! Redirecting...');
        
        // Redirect to products page
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1500);
    } else {
        // Failed login
        loginAttempts++;
        updateAttemptsDisplay();
        
        if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            // Show account locked page
            showAccountLocked();
        } else {
            const remainingAttempts = MAX_LOGIN_ATTEMPTS - loginAttempts;
            showError(
                document.getElementById('login-password'),
                document.getElementById('login-password-error'),
                `Invalid credentials. ${remainingAttempts} attempt(s) remaining.`
            );
        }
    }
}

function validateLogin(identifier, password) {
    const users = JSON.parse(localStorage.getItem(USER_DATABASE_KEY) || '[]');
    
    // Check if identifier is TRN or email
    return users.find(user => {
        const matchesTRN = user.trn === identifier;
        const matchesEmail = user.email.toLowerCase() === identifier.toLowerCase();
        const matchesPassword = user.password === password;
        
        return (matchesTRN || matchesEmail) && matchesPassword;
    });
}

function updateAttemptsDisplay() {
    const attemptsDiv = document.getElementById('attempts-remaining');
    if (loginAttempts > 0) {
        const remaining = MAX_LOGIN_ATTEMPTS - loginAttempts;
        attemptsDiv.textContent = `${remaining} attempt(s) remaining`;
    } else {
        attemptsDiv.textContent = '';
    }
}

function showAccountLocked() {
    document.getElementById('login-form-container').classList.add('hidden');
    document.getElementById('account-locked-container').classList.remove('hidden');
}

// ============================================================================
// RESET PASSWORD FORM
// ============================================================================
function setupResetPasswordForm() {
    const form = document.getElementById('reset-password-form');
    const resetLink = document.getElementById('reset-password-link');
    
    if (!form || !resetLink) return;
    
    resetLink.addEventListener('click', (e) => {
        e.preventDefault();
        showResetPasswordForm();
    });
    
    form.addEventListener('submit', handleResetPassword);
}

function showResetPasswordForm() {
    document.getElementById('login-form-container').classList.add('hidden');
    document.getElementById('reset-password-container').classList.remove('hidden');
    
    // Hide password fields initially
    document.getElementById('new-password-group').classList.add('hidden');
    document.getElementById('confirm-password-group').classList.add('hidden');
    
    // Add smart formatting to reset form
    const resetTrnInput = document.getElementById('reset-trn');
    if (resetTrnInput) {
        resetTrnInput.addEventListener('input', smartFormatLoginInput);
    }
}

function handleResetPassword(e) {
    e.preventDefault();
    
    const identifier = document.getElementById('reset-trn').value.trim();
    const newPassword = document.getElementById('reset-new-password').value;
    const confirmPassword = document.getElementById('reset-confirm-password').value;
    
    const newPasswordGroup = document.getElementById('new-password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    
    // First step: verify TRN or Email
    if (newPasswordGroup.classList.contains('hidden')) {
        const users = JSON.parse(localStorage.getItem(USER_DATABASE_KEY) || '[]');
        const userExists = users.some(user => 
            user.trn === identifier || user.email.toLowerCase() === identifier.toLowerCase()
        );
        
        if (userExists) {
            // Show password fields
            newPasswordGroup.classList.remove('hidden');
            confirmPasswordGroup.classList.remove('hidden');
            document.getElementById('reset-trn-error').textContent = '';
        } else {
            showError(
                document.getElementById('reset-trn'),
                document.getElementById('reset-trn-error'),
                'Account not found'
            );
        }
        return;
    }
    
    // Second step: update password
    if (newPassword.length < 8) {
        showError(
            document.getElementById('reset-new-password'),
            document.getElementById('reset-new-password-error'),
            'Password must be at least 8 characters long'
        );
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showError(
            document.getElementById('reset-confirm-password'),
            document.getElementById('reset-confirm-password-error'),
            'Passwords do not match'
        );
        return;
    }
    
    // Update password in Lunar Essence database
    let users = JSON.parse(localStorage.getItem(USER_DATABASE_KEY) || '[]');
    const userIndex = users.findIndex(user => 
        user.trn === identifier || user.email.toLowerCase() === identifier.toLowerCase()
    );
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(users));
        
        const userTRN = users[userIndex].trn;
        
        showGlobalMessage('success', 'Password reset successful! Please login with your new password.');
        
        setTimeout(() => {
            switchTab('login');
            document.getElementById('login-trn').value = userTRN;
        }, 2000);
    }
}

// ============================================================================
// BUTTON HANDLERS
// ============================================================================
function setupButtonHandlers() {
    // Cancel buttons
    const cancelLogin = document.getElementById('cancel-login');
    const cancelRegister = document.getElementById('cancel-register');
    const cancelReset = document.getElementById('cancel-reset');
    const backToLogin = document.getElementById('back-to-login');
    
    if (cancelLogin) {
        cancelLogin.addEventListener('click', () => {
            document.getElementById('login-form').reset();
            clearFormErrors('login-form');
        });
    }
    
    if (cancelRegister) {
        cancelRegister.addEventListener('click', () => {
            document.getElementById('register-form').reset();
            clearFormErrors('register-form');
        });
    }
    
    if (cancelReset) {
        cancelReset.addEventListener('click', () => {
            switchTab('login');
        });
    }
    
    if (backToLogin) {
        backToLogin.addEventListener('click', () => {
            loginAttempts = 0;
            updateAttemptsDisplay();
            switchTab('login');
        });
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function showError(input, errorSpan, message) {
    if (input) {
        input.classList.add('error');
        input.classList.remove('success');
    }
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function showSuccess(input, errorSpan) {
    if (input) {
        input.classList.remove('error');
        input.classList.add('success');
    }
    if (errorSpan) {
        errorSpan.textContent = '';
    }
}

function showGlobalMessage(type, message) {
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');
    
    if (type === 'success' && successMsg) {
        successMsg.querySelector('.message-text').textContent = message;
        successMsg.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        
        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 5000);
    } else if (type === 'error' && errorMsg) {
        errorMsg.querySelector('.message-text').textContent = message;
        errorMsg.classList.remove('hidden');
        successMsg.classList.add('hidden');
        
        setTimeout(() => {
            errorMsg.classList.add('hidden');
        }, 5000);
    }
}

function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.querySelectorAll('.error-message').forEach(span => {
        span.textContent = '';
    });
    
    form.querySelectorAll('input').forEach(input => {
        input.classList.remove('error', 'success');
    });
}

function clearAllForms() {
    const forms = ['login-form', 'register-form', 'reset-password-form'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            clearFormErrors(formId);
        }
    });
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function checkExistingSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('lunarEssence_currentUser');
    
    if (isLoggedIn === 'true' && currentUser) {
        // User is already logged in, could redirect or show message
        console.log('User already logged in:', JSON.parse(currentUser));
    }
}
