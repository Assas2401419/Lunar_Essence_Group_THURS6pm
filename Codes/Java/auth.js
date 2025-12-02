// Lunar Essence - Authentication JavaScript
// Login, registration, and user management functionality

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
});

// Initialize authentication page
function initializeAuthPage() {
    initializeTabs();
    initializeFormValidation();
    initializeFormSubmission();
    checkExistingSession();
}

// Initialize tab switching
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const switchToRegisterBtn = document.getElementById('switch-to-register');
    const switchToLoginBtn = document.getElementById('switch-to-login');
    
    // Tab button clicks
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            switchTab(targetTab);
        });
    });
    
    // Switch button clicks
    if (switchToRegisterBtn) {
        switchToRegisterBtn.addEventListener('click', () => switchTab('register'));
    }
    
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', () => switchTab('login'));
    }
}

// Switch between tabs
function switchTab(tabName) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const formContainers = document.querySelectorAll('.auth-form-container');
    
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update form containers
    formContainers.forEach(container => {
        if (container.id === `${tabName}-form-container`) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    });
    
    // Clear any existing messages
    clearMessages();
}

// Initialize form validation
function initializeFormValidation() {
    const inputs = document.querySelectorAll('.auth-form input');
    
    inputs.forEach(input => {
        // Real-time validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear validation on focus
        input.addEventListener('focus', function() {
            clearFieldValidation(this);
        });
        
        // Special handling for password confirmation
        if (input.id === 'register-confirm-password') {
            input.addEventListener('input', function() {
                validatePasswordMatch();
            });
        }
        
        // Password strength indicator
        if (input.id === 'register-password') {
            input.addEventListener('input', function() {
                validatePasswordStrength(this);
            });
        }
    });
}

// Initialize form submission
function initializeFormSubmission() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const loginData = {
        username: formData.get('username').trim(),
        password: formData.get('password'),
        rememberMe: document.getElementById('remember-me')?.checked || false
    };
    
    // Validate login form
    if (!validateLoginForm(loginData)) {
        return;
    }
    
    // Show loading state
    setFormLoading(form, true);
    
    // Simulate API call delay
    setTimeout(() => {
        processLogin(loginData, form);
    }, 1000);
}

// Process login
function processLogin(loginData, form) {
    const users = getStoredUsers();
    
    // Find user by username or email
    const user = users.find(u => 
        u.username.toLowerCase() === loginData.username.toLowerCase() ||
        u.email.toLowerCase() === loginData.username.toLowerCase()
    );
    
    if (!user) {
        setFormLoading(form, false);
        showError('User not found. Please check your username/email.');
        return;
    }
    
    // In a real app, you'd hash and compare passwords
    if (user.password !== loginData.password) {
        setFormLoading(form, false);
        showError('Incorrect password. Please try again.');
        return;
    }
    
    // Successful login
    setFormLoading(form, false);
    
    // Store current user session
    const sessionData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        loginTime: new Date().toISOString(),
        rememberMe: loginData.rememberMe
    };
    
    localStorage.setItem('lunarEssence_currentUser', JSON.stringify(sessionData));
    
    showSuccess(`Welcome back, ${user.firstName}!`);
    
    // Update navigation
    updateNavigation(true, user.firstName);
    
    // Redirect after success
    setTimeout(() => {
        const returnUrl = new URLSearchParams(window.location.search).get('return') || 'home.html';
        window.location.href = returnUrl;
    }, 1500);
}

// Handle registration form submission
function handleRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const registrationData = {
        firstName: formData.get('firstName').trim(),
        lastName: formData.get('lastName').trim(),
        email: formData.get('email').trim().toLowerCase(),
        dateOfBirth: formData.get('dateOfBirth'),
        username: formData.get('username').trim().toLowerCase(),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        termsAccepted: document.getElementById('terms-conditions')?.checked || false,
        privacyAccepted: document.getElementById('privacy-policy')?.checked || false
    };
    
    // Validate registration form
    if (!validateRegistrationForm(registrationData)) {
        return;
    }
    
    // Show loading state
    setFormLoading(form, true);
    
    // Simulate API call delay
    setTimeout(() => {
        processRegistration(registrationData, form);
    }, 1500);
}

// Process registration
function processRegistration(registrationData, form) {
    const users = getStoredUsers();
    
    // Check if username already exists
    if (users.some(u => u.username === registrationData.username)) {
        setFormLoading(form, false);
        showError('Username already exists. Please choose a different one.');
        document.getElementById('register-username').focus();
        return;
    }
    
    // Check if email already exists
    if (users.some(u => u.email === registrationData.email)) {
        setFormLoading(form, false);
        showError('Email already registered. Please use a different email or sign in.');
        document.getElementById('register-email').focus();
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateUserId(),
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        username: registrationData.username,
        password: registrationData.password, // In real app, this would be hashed
        dateOfBirth: registrationData.dateOfBirth,
        registrationDate: new Date().toISOString(),
        addresses: []
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('lunarEssence_users', JSON.stringify(users));
    
    setFormLoading(form, false);
    showSuccess(`Account created successfully! Welcome to Lunar Essence, ${newUser.firstName}!`);
    
    // Auto-login the new user
    const sessionData = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username,
        loginTime: new Date().toISOString(),
        rememberMe: false
    };
    
    localStorage.setItem('lunarEssence_currentUser', JSON.stringify(sessionData));
    
    // Update navigation
    updateNavigation(true, newUser.firstName);
    
    // Redirect after success
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 2000);
}

// Validation Functions
function validateLoginForm(data) {
    let isValid = true;
    
    // Username/Email validation
    if (!data.username) {
        showFieldError('login-username', 'Username or email is required');
        isValid = false;
    } else {
        clearFieldError('login-username');
    }
    
    // Password validation
    if (!data.password) {
        showFieldError('login-password', 'Password is required');
        isValid = false;
    } else {
        clearFieldError('login-password');
    }
    
    return isValid;
}

function validateRegistrationForm(data) {
    let isValid = true;
    
    // First name validation
    if (!data.firstName || data.firstName.length < 2) {
        showFieldError('register-firstname', 'First name must be at least 2 characters');
        isValid = false;
    } else {
        clearFieldError('register-firstname');
    }
    
    // Last name validation
    if (!data.lastName || data.lastName.length < 2) {
        showFieldError('register-lastname', 'Last name must be at least 2 characters');
        isValid = false;
    } else {
        clearFieldError('register-lastname');
    }
    
    // Email validation
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError('register-email', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearFieldError('register-email');
    }
    
    // Date of birth validation (must be 18+)
    if (!data.dateOfBirth || !isValidAge(data.dateOfBirth)) {
        showFieldError('register-dob', 'You must be 18 or older to create an account');
        isValid = false;
    } else {
        clearFieldError('register-dob');
    }
    
    // Username validation
    if (!data.username || data.username.length < 3) {
        showFieldError('register-username', 'Username must be at least 3 characters');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        showFieldError('register-username', 'Username can only contain letters, numbers, and underscores');
        isValid = false;
    } else {
        clearFieldError('register-username');
    }
    
    // Password validation
    if (!isValidPassword(data.password)) {
        showFieldError('register-password', 'Password must be at least 8 characters with 1 uppercase and 1 number');
        isValid = false;
    } else {
        clearFieldError('register-password');
    }
    
    // Password confirmation
    if (data.password !== data.confirmPassword) {
        showFieldError('register-confirm-password', 'Passwords do not match');
        isValid = false;
    } else {
        clearFieldError('register-confirm-password');
    }
    
    // Terms and conditions
    if (!data.termsAccepted) {
        showFieldError('terms-conditions', 'You must accept the Terms & Conditions');
        isValid = false;
    } else {
        clearFieldError('terms-conditions');
    }
    
    // Privacy policy
    if (!data.privacyAccepted) {
        showFieldError('privacy-policy', 'You must accept the Privacy Policy');
        isValid = false;
    } else {
        clearFieldError('privacy-policy');
    }
    
    return isValid;
}

// Field validation functions
function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    
    switch (fieldName) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(input.id, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'username':
            if (value && value.length < 3) {
                showFieldError(input.id, 'Username must be at least 3 characters');
                return false;
            }
            break;
        case 'password':
            if (input.id === 'register-password' && value && !isValidPassword(value)) {
                showFieldError(input.id, 'Password must be at least 8 characters with 1 uppercase and 1 number');
                return false;
            }
            break;
    }
    
    clearFieldError(input.id);
    return true;
}

function validatePasswordMatch() {
    const password = document.getElementById('register-password')?.value;
    const confirmPassword = document.getElementById('register-confirm-password')?.value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError('register-confirm-password', 'Passwords do not match');
        return false;
    } else {
        clearFieldError('register-confirm-password');
        return true;
    }
}

function validatePasswordStrength(input) {
    const password = input.value;
    const isStrong = isValidPassword(password);
    
    if (password.length > 0 && !isStrong) {
        input.classList.add('error');
        input.classList.remove('success');
    } else if (isStrong) {
        input.classList.add('success');
        input.classList.remove('error');
    } else {
        input.classList.remove('error', 'success');
    }
}

// Utility validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

function isValidAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }
    
    return age >= 18;
}

// UI Helper Functions
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearFieldValidation(input) {
    input.classList.remove('error', 'success');
    const errorElement = document.getElementById(`${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function showSuccess(message) {
    const successElement = document.getElementById('success-message');
    const errorElement = document.getElementById('error-message');
    
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
    
    if (successElement) {
        successElement.querySelector('.message-text').textContent = message;
        successElement.classList.remove('hidden');
    }
}

function showError(message) {
    const successElement = document.getElementById('success-message');
    const errorElement = document.getElementById('error-message');
    
    if (successElement) {
        successElement.classList.add('hidden');
    }
    
    if (errorElement) {
        errorElement.querySelector('.message-text').textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function clearMessages() {
    const successElement = document.getElementById('success-message');
    const errorElement = document.getElementById('error-message');
    
    if (successElement) {
        successElement.classList.add('hidden');
    }
    
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

function setFormLoading(form, isLoading) {
    if (isLoading) {
        form.classList.add('loading');
    } else {
        form.classList.remove('loading');
    }
}

// User Management Functions
function getStoredUsers() {
    const users = localStorage.getItem('lunarEssence_users');
    return users ? JSON.parse(users) : [];
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function checkExistingSession() {
    const currentUser = localStorage.getItem('lunarEssence_currentUser');
    
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        
        // Check if session is still valid (optional: implement session timeout)
        const loginTime = new Date(userData.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        // If remember me is false and more than 24 hours, clear session
        if (!userData.rememberMe && hoursSinceLogin > 24) {
            localStorage.removeItem('lunarEssence_currentUser');
            return;
        }
        
        // If more than 30 days, clear session regardless
        if (hoursSinceLogin > (30 * 24)) {
            localStorage.removeItem('lunarEssence_currentUser');
            return;
        }
        
        // Update navigation to show logged in state
        updateNavigation(true, userData.firstName);
        
        // Show welcome message
        showSuccess(`Welcome back, ${userData.firstName}!`);
    }
}

function updateNavigation(isLoggedIn, firstName = '') {
    const authLink = document.getElementById('auth-link');
    
    if (authLink && isLoggedIn) {
        // Update auth link to show user name or account
        authLink.innerHTML = `
            <img src="../assets/register.svg" alt="Account" class="nav-icon-img">
            <span class="user-name">${firstName}</span>
        `;
        authLink.title = `Welcome, ${firstName}`;
    }
}

// Initialize demo users for testing (remove in production)
function initializeDemoUsers() {
    const existingUsers = getStoredUsers();
    
    if (existingUsers.length === 0) {
        const demoUsers = [
            {
                id: 'demo_user_1',
                firstName: 'Luna',
                lastName: 'Starlight',
                email: 'luna@example.com',
                username: 'lunastar',
                password: 'Password123',
                dateOfBirth: '1995-06-15',
                registrationDate: new Date().toISOString(),
                addresses: []
            }
        ];
        
        localStorage.setItem('lunarEssence_users', JSON.stringify(demoUsers));
    }
}

// Initialize demo users on page load (for testing purposes)
initializeDemoUsers();