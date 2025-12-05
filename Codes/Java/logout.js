// Lunar Essence - Logout Module
// Handles user logout with security and UX best practices

/**
 * Main logout function
 * Handles the complete logout process including confirmation, cleanup, and redirect
 */
async function performLogout() {
    const config = window.APP_CONFIG || {};
    
    // Step 1: Show confirmation modal if enabled
    if (config.CONFIRM_LOGOUT) {
        const confirmed = await showLogoutConfirmation();
        if (!confirmed) {
            console.log('Logout cancelled by user');
            return false;
        }
    }
    
    // Step 2: Call server logout if enabled
    if (config.CALL_SERVER_LOGOUT) {
        try {
            await callServerLogout();
        } catch (error) {
            console.error('Server logout failed:', error);
            // Continue with client-side logout even if server fails
            showLogoutError('Server logout failed, but you will be logged out locally.');
        }
    }
    
    // Step 3: Clear client-side session data
    clearAuthData();
    
    // Step 4: Remove dashboard link if present
    removeDashboardLink();
    
    // Step 5: Emit logout event for other modules
    emitLogoutEvent();
    
    // Step 6: Show success message
    if (config.SHOW_LOGOUT_MESSAGE) {
        showLogoutSuccess();
    }
    
    // Step 7: Redirect to public page
    redirectAfterLogout();
    
    return true;
}

/**
 * Show logout confirmation modal
 * Returns a promise that resolves to true if confirmed, false if cancelled
 */
function showLogoutConfirmation() {
    return new Promise((resolve) => {
        const config = window.APP_CONFIG || {};
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'logout-modal';
        modal.innerHTML = `
            <div class="logout-modal-overlay"></div>
            <div class="logout-modal-content">
                <div class="logout-modal-header">
                    <h3>${config.LOGOUT_CONFIRM_TITLE || 'Confirm Logout'}</h3>
                </div>
                <div class="logout-modal-body">
                    <p>${config.LOGOUT_CONFIRM_MESSAGE || 'Are you sure you want to log out?'}</p>
                </div>
                <div class="logout-modal-footer">
                    <button class="btn btn-outline" id="logout-cancel">Cancel</button>
                    <button class="btn btn-primary" id="logout-confirm">Logout</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .logout-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .logout-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .logout-modal-content {
                position: relative;
                background: white;
                border-radius: 12px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .logout-modal-header h3 {
                margin: 0;
                color: var(--color-primary, #4A6B6B);
                font-family: var(--font-heading, serif);
            }
            
            .logout-modal-body {
                margin: 20px 0;
                color: var(--color-text, #2C3E50);
            }
            
            .logout-modal-footer {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Focus on confirm button
        setTimeout(() => {
            document.getElementById('logout-confirm')?.focus();
        }, 100);
        
        // Handle cancel
        const cancelBtn = document.getElementById('logout-cancel');
        const handleCancel = () => {
            modal.remove();
            style.remove();
            resolve(false);
        };
        
        cancelBtn.addEventListener('click', handleCancel);
        modal.querySelector('.logout-modal-overlay').addEventListener('click', handleCancel);
        
        // Handle confirm
        document.getElementById('logout-confirm').addEventListener('click', () => {
            modal.remove();
            style.remove();
            resolve(true);
        });
        
        // Handle ESC key
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
}

/**
 * Call server logout endpoint
 * Returns a promise that resolves when server logout is complete
 */
async function callServerLogout() {
    const config = window.APP_CONFIG || {};
    const authToken = localStorage.getItem('lunarEssence_authToken');
    
    if (!authToken) {
        console.log('No auth token found, skipping server logout');
        return;
    }
    
    try {
        const response = await fetch(config.SERVER_LOGOUT_URL || '/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Server logout failed: ${response.status}`);
        }
        
        console.log('Server logout successful');
        return await response.json();
    } catch (error) {
        console.error('Server logout error:', error);
        throw error;
    }
}

/**
 * Clear all authentication and sensitive data from localStorage
 */
function clearAuthData() {
    const config = window.APP_CONFIG || {};
    
    // Clear authentication keys
    const authKeys = config.AUTH_KEYS || [
        'lunarEssence_currentUser',
        'lunarEssence_authToken',
        'lunarEssence_sessionExpiry',
        'lunarEssence_rememberMe'
    ];
    
    authKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
        console.log(`Cleared: ${key}`);
    });
    
    // Clear sensitive data keys if specified
    const sensitiveKeys = config.SENSITIVE_KEYS || [];
    sensitiveKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
        console.log(`Cleared sensitive data: ${key}`);
    });
    
    console.log('✅ All authentication data cleared');
}

/**
 * Emit logout event for other modules to react
 */
function emitLogoutEvent() {
    // Dispatch custom event
    const logoutEvent = new CustomEvent('user:loggedout', {
        detail: {
            timestamp: new Date().toISOString(),
            reason: 'user_initiated'
        }
    });
    
    window.dispatchEvent(logoutEvent);
    console.log('Logout event emitted');
}

/**
 * Show logout success message
 */
function showLogoutSuccess() {
    const config = window.APP_CONFIG || {};
    const message = config.LOGOUT_SUCCESS_MESSAGE || 'You have been logged out successfully.';
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'logout-notification logout-success';
    notification.innerHTML = `
        <span class="notification-icon">✓</span>
        <span class="notification-text">${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Show logout error message
 */
function showLogoutError(message) {
    const config = window.APP_CONFIG || {};
    const errorMessage = message || config.LOGOUT_ERROR_MESSAGE || 'Logout failed. Please try again.';
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'logout-notification logout-error';
    notification.innerHTML = `
        <span class="notification-icon">⚠</span>
        <span class="notification-text">${errorMessage}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

/**
 * Redirect to public page after logout
 * Uses location.replace to prevent back button navigation
 */
function redirectAfterLogout() {
    const config = window.APP_CONFIG || {};
    const redirectUrl = config.PUBLIC_REDIRECT || 'auth.html';
    
    // Use setTimeout to allow success message to show
    setTimeout(() => {
        // Use replace to prevent back button navigation
        window.location.replace(redirectUrl);
    }, 1000);
}

/**
 * Add logout button to navigation
 */
function addLogoutButton() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Check if logout button already exists
    if (document.getElementById('logout-button')) return;
    
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;
    
    // Create logout button
    const logoutBtn = document.createElement('a');
    logoutBtn.id = 'logout-button';
    logoutBtn.className = 'nav-icon logout-btn';
    logoutBtn.href = '#';
    logoutBtn.setAttribute('aria-label', 'Log out');
    logoutBtn.setAttribute('role', 'button');
    logoutBtn.setAttribute('tabindex', '0');
    logoutBtn.title = 'Logout';
    
    logoutBtn.innerHTML = `
        <img src="../assets/SVG/logout.svg" alt="Logout" class="nav-icon-img">
    `;
    
    // Add click handler
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        performLogout();
    });
    
    // Add keyboard handler
    logoutBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            performLogout();
        }
    });
    
    // Insert before cart icon
    const cartIcon = navActions.querySelector('a[href="cart.html"]');
    if (cartIcon) {
        navActions.insertBefore(logoutBtn, cartIcon);
    } else {
        navActions.appendChild(logoutBtn);
    }
    
    console.log('✅ Logout button added to navigation');
}

/**
 * Remove logout button from navigation
 */
function removeLogoutButton() {
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.remove();
        console.log('✅ Logout button removed from navigation');
    }
}

/**
 * Get current user from localStorage
 */
function getCurrentUser() {
    try {
        const user = localStorage.getItem('lunarEssence_currentUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error reading current user:', error);
        return null;
    }
}

/**
 * Remove dashboard link (imported from main.js)
 */
function removeDashboardLink() {
    const dashboardLink = document.getElementById('admin-dashboard-link');
    if (dashboardLink) {
        dashboardLink.remove();
        console.log('✅ Dashboard link removed');
    }
}

/**
 * Check session validity
 * Returns true if session is valid, false if expired
 */
function checkSessionValidity() {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const config = window.APP_CONFIG || {};
    const loginTime = new Date(currentUser.loginTime);
    const now = new Date();
    const timeSinceLogin = now - loginTime;
    
    // Check if remember me is enabled
    if (currentUser.rememberMe) {
        const maxDuration = config.REMEMBER_ME_DURATION || (30 * 24 * 60 * 60 * 1000);
        if (timeSinceLogin > maxDuration) {
            console.log('Session expired (remember me timeout)');
            performLogout();
            return false;
        }
    } else {
        const maxDuration = config.SESSION_TIMEOUT || (24 * 60 * 60 * 1000);
        if (timeSinceLogin > maxDuration) {
            console.log('Session expired (normal timeout)');
            performLogout();
            return false;
        }
    }
    
    return true;
}

/**
 * Initialize logout functionality
 * Call this on page load
 */
function initializeLogout() {
    // Check session validity
    checkSessionValidity();
    
    // Add logout button if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        addLogoutButton();
    }
    
    // Listen for logout events
    window.addEventListener('user:loggedout', () => {
        console.log('Logout event received');
        removeLogoutButton();
    });
}

// Export functions
window.performLogout = performLogout;
window.addLogoutButton = addLogoutButton;
window.removeLogoutButton = removeLogoutButton;
window.initializeLogout = initializeLogout;
window.checkSessionValidity = checkSessionValidity;

// Auto-initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLogout);
} else {
    initializeLogout();
}
