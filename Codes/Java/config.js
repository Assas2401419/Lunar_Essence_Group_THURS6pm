// Lunar Essence - Configuration File
// Centralized configuration for authentication and logout behavior

const APP_CONFIG = {
    // Authentication Keys to Clear on Logout
    AUTH_KEYS: [
        'lunarEssence_currentUser',
        'lunarEssence_authToken',
        'lunarEssence_sessionExpiry',
        'lunarEssence_rememberMe'
    ],
    
    // Sensitive Data Keys (cleared on logout)
    SENSITIVE_KEYS: [
        // Add keys here if you want to clear sensitive cached data
        // Example: 'AllInvoices' - uncomment if invoices should be private
    ],
    
    // Persistent Keys (NOT cleared on logout)
    PERSISTENT_KEYS: [
        'lunarEssence_users',      // User database
        'lunarEssence_cart',        // Shopping cart
        'AllInvoices',              // Invoice database
        'lunarEssence_uiPreferences' // UI preferences
    ],
    
    // Logout Behavior
    CONFIRM_LOGOUT: true,           // Show confirmation modal before logout
    CALL_SERVER_LOGOUT: false,      // Call server logout endpoint (set to true if using server-side sessions)
    SERVER_LOGOUT_URL: '/api/logout', // Server logout endpoint
    PUBLIC_REDIRECT: 'auth.html',   // Redirect after logout
    SHOW_LOGOUT_MESSAGE: true,      // Show success message after logout
    
    // Session Settings
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    
    // UI Settings
    LOGOUT_BUTTON_TEXT: 'Logout',
    LOGOUT_CONFIRM_TITLE: 'Confirm Logout',
    LOGOUT_CONFIRM_MESSAGE: 'Are you sure you want to log out?',
    LOGOUT_SUCCESS_MESSAGE: '✅ You have been logged out successfully.',
    LOGOUT_ERROR_MESSAGE: '⚠️ Logout failed. Please try again.'
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}

// Make available globally
window.APP_CONFIG = APP_CONFIG;
