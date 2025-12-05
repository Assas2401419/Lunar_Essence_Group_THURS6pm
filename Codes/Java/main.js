// Lunar Essence - Main JavaScript File
// Global functions, navigation, and shared functionality

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCartCount();
    initializeAuthState();
    initializeScrollEffects();
    ensureAdminExists();
    
    // Initialize logout functionality if available
    if (typeof initializeLogout === 'function') {
        initializeLogout();
    }
});

// Navigation Functionality
function initializeNavigation() {
    const mobileToggle = createMobileToggle();
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Add mobile toggle to navbar if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
        const navContainer = document.querySelector('.nav-container');
        const navActions = document.querySelector('.nav-actions');
        navContainer.insertBefore(mobileToggle, navActions);
    }
    
    // Mobile menu toggle functionality
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Close all dropdowns
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Handle dropdown clicks on mobile
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        
        dropdownLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 950) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close mobile menu when window is resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 950) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Handle navigation link clicks
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-content a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close mobile menu when navigating
            if (window.innerWidth <= 950) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
}

// Create mobile menu toggle button
function createMobileToggle() {
    const toggle = document.createElement('div');
    toggle.className = 'mobile-menu-toggle';
    toggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    return toggle;
}

// Initialize Cart Count
function initializeCartCount() {
    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
}

// Update cart count badge
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCountElement.classList.add('show');
    } else {
        cartCountElement.classList.remove('show');
    }
}

// Get cart from localStorage
function getCart() {
    try {
        const cart = localStorage.getItem('lunarEssence_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        return [];
    }
}

// Initialize Authentication State
function initializeAuthState() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;
    
    const currentUser = getCurrentUser();
    const authText = authLink.querySelector('.nav-text');
    
    if (currentUser) {
        if (authText) {
            authText.textContent = currentUser.firstName || 'Account';
        }
        authLink.title = `Logged in as ${currentUser.firstName} ${currentUser.lastName}`;
        
        // Add logout functionality
        authLink.addEventListener('click', function(e) {
            if (e.shiftKey) { // Shift+click to logout
                e.preventDefault();
                logout();
            }
        });
        
        // Show Dashboard link if user is admin
        if (currentUser.isAdmin) {
            addDashboardLink();
        }
    } else {
        if (authText) {
            authText.textContent = 'Account';
        }
        authLink.title = 'Sign in to your account';
    }
}

// Add Dashboard link to navigation (admin only)
function addDashboardLink() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Check if dashboard link already exists
    const existingDashboardLink = document.getElementById('admin-dashboard-link');
    if (existingDashboardLink) return;
    
    // Create dashboard menu item
    const dashboardItem = document.createElement('li');
    dashboardItem.className = 'nav-item';
    dashboardItem.id = 'admin-dashboard-link';
    
    // Check if current page is dashboard
    const currentPage = window.location.pathname.split('/').pop();
    const isActive = currentPage === 'dashboard.html' ? 'active' : '';
    
    dashboardItem.innerHTML = `
        <a href="dashboard.html" class="nav-link ${isActive}">
            <img src="../assets/SVG/graph.svg" alt="Dashboard" style="width: 18px; height: 18px; margin-right: 5px; vertical-align: middle;">
            Dashboard
        </a>
    `;
    
    // Insert after Care Tips (last regular menu item)
    navMenu.appendChild(dashboardItem);
    
    console.log('✅ Admin Dashboard link added to navigation');
}

// Remove Dashboard link from navigation (when logging out)
function removeDashboardLink() {
    const dashboardLink = document.getElementById('admin-dashboard-link');
    if (dashboardLink) {
        dashboardLink.remove();
        console.log('✅ Admin Dashboard link removed from navigation');
    }
}

// Get current user from localStorage
function getCurrentUser() {
    try {
        const user = localStorage.getItem('lunarEssence_currentUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error reading user from localStorage:', error);
        return null;
    }
}

// Logout functionality (legacy - redirects to new logout system)
function logout() {
    if (typeof performLogout === 'function') {
        performLogout();
    } else {
        // Fallback if logout.js not loaded
        if (confirm('Are you sure you want to sign out?')) {
            localStorage.removeItem('lunarEssence_currentUser');
            removeDashboardLink();
            window.location.href = 'auth.html';
        }
    }
}

// Initialize Scroll Effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Utility Functions

// Show notification message
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function for search/filter inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to element
function smoothScrollTo(element) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        showNotification('Please sign in to continue', 'warning');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return false;
    }
    return true;
}

// Handle page loading states
function setPageLoading(isLoading) {
    const body = document.body;
    
    if (isLoading) {
        body.classList.add('loading');
        
        // Create loading overlay if it doesn't exist
        if (!document.querySelector('.loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
            body.appendChild(overlay);
        }
    } else {
        body.classList.remove('loading');
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Export functions for use in other files
window.LunarEssence = {
    showNotification,
    formatCurrency,
    isValidEmail,
    generateId,
    debounce,
    smoothScrollTo,
    isAuthenticated,
    requireAuth,
    getCurrentUser,
    getCart,
    updateCartCount,
    setPageLoading,
    addDashboardLink,
    removeDashboardLink
};
//Shopping Cart Functions (Global)

// Add item to cart
function addToCart(productData) {
    let cart = JSON.parse(localStorage.getItem('lunarEssence_cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === productData.id && item.size === productData.size
    );
    
    if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += productData.quantity || 1;
    } else {
        // Add new item
        cart.push({
            id: productData.id,
            name: productData.name,
            collection: productData.collection,
            price: productData.price,
            size: productData.size,
            image: productData.image,
            quantity: productData.quantity || 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('lunarEssence_cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show feedback
    showAddToCartFeedback(productData.name);
    
    return true;
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('lunarEssence_cart') || '[]');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Add animation class
        cartCountElement.classList.add('updated');
        setTimeout(() => {
            cartCountElement.classList.remove('updated');
        }, 300);
    }
}

// Show add to cart feedback
function showAddToCartFeedback(productName) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <span class="notification-icon">✓</span>
        <span>${productName} added to cart</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-primary);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// Add demo cart items for testing
function addDemoCartItems() {
    const demoItems = [
        {
            id: 'lunar-glow-medium',
            name: 'Lunar Glow',
            collection: 'Full Moon',
            price: 34.99,
            size: 'Medium (12oz)',
            image: '../assets/Candle-medium.jpg',
            quantity: 2
        },
        {
            id: 'midnight-serenity-small',
            name: 'Midnight Serenity',
            collection: 'New Moon',
            price: 28.99,
            size: 'Small (8oz)',
            image: '../assets/Candle-medium.jpg',
            quantity: 1
        }
    ];
    
    localStorage.setItem('lunarEssence_cart', JSON.stringify(demoItems));
    updateCartCount();
    
    console.log('Demo cart items added for testing');
}

// Expose functions globally
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.addDemoCartItems = addDemoCartItems;

// Clear cart function for testing
function clearCart() {
    localStorage.removeItem('lunarEssence_cart');
    localStorage.removeItem('lunarEssence_appliedDiscount');
    updateCartCount();
    console.log('Cart cleared for testing');
}

// Ensure admin user exists
function ensureAdminExists() {
    try {
        const users = localStorage.getItem('lunarEssence_users');
        let usersList = users ? JSON.parse(users) : [];
        
        // Check if admin exists
        const adminExists = usersList.some(u => u.username === 'admin' && u.isAdmin === true);
        
        if (!adminExists) {
            // Create default admin
            const defaultAdmin = {
                id: 'admin_default',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@lunaressence.com',
                username: 'admin',
                password: 'Admin123',
                dateOfBirth: '1990-01-01',
                gender: 'Other',
                isAdmin: true,
                registrationDate: new Date().toISOString(),
                addresses: []
            };
            
            usersList.push(defaultAdmin);
            localStorage.setItem('lunarEssence_users', JSON.stringify(usersList));
            
            console.log('✅ Default admin user created!');
            console.log('📧 Username: admin');
            console.log('🔑 Password: Admin123');
            console.log('🔗 Dashboard: dashboard.html');
        }
    } catch (error) {
        console.error('Error ensuring admin exists:', error);
    }
}

// Expose functions globally
window.clearCart = clearCart;
window.ensureAdminExists = ensureAdminExists;