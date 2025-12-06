// ============================================================================
// QUESTION 2: PRODUCT CATALOGUE
// Group Member Assigned: Alex Crawford (2307247) Part 2
//
// This file implements:
// a. Product List (Using Arrays & Objects):
//    - Create an array of product objects in JavaScript
//    - Each product has: name, price, description, image
//    - Updated product list kept in localStorage as "All Products"
//    - Display product list dynamically on the website
//    - Each product has an "Add to Cart" button
//
// b. Add to Cart:
//    - Shopping Cart (localStorage and Objects)
//    - When user clicks "Add to Cart", add selected product to user's shopping cart
//    - Shopping cart includes product details with taxes, discounts, subtotal, and total cost
// ============================================================================

// Lunar Essence - Products Page JavaScript
// Product catalog functionality, filtering, and display

// Product data array - each product is an object with properties
const productsData = [
    {
        id: 'new-moon-essence',
        name: 'New Moon Essence',
        collection: 'new-moon',
        price: 32.00,
        originalPrice: null,
        image: '../assets/Candle-medium.jpg',
        badge: 'BEST SELLER',
        type: 'candles',
        size: 'medium',
        scent: 'floral',
        description: 'Fresh beginnings with jasmine and white tea',
        burnTime: '50-60 hours',
        inStock: true
    },
    {
        id: 'crescent-glow',
        name: 'Crescent Glow',
        collection: 'crescent',
        price: 28.00,
        originalPrice: 35.00,
        image: '../assets/Candle-medium.jpg',
        badge: 'SALE',
        type: 'candles',
        size: 'medium',
        scent: 'fresh',
        description: 'Uplifting citrus with bergamot and lemongrass',
        burnTime: '50-60 hours',
        inStock: true
    },
    {
        id: 'half-moon-harmony',
        name: 'Half Moon Harmony',
        collection: 'half-moon',
        price: 38.00,
        originalPrice: null,
        image: '../assets/Candle-medium.jpg',
        badge: 'BEST SELLER',
        type: 'candles',
        size: 'large',
        scent: 'fresh',
        description: 'Balanced herbal blend with lavender and sage',
        burnTime: '100-120 hours',
        inStock: true
    },
    {
        id: 'gibbous-spirit',
        name: 'Gibbous Spirit',
        collection: 'gibbous',
        price: 42.00,
        originalPrice: null,
        image: '../assets/Big Candle .jpg',
        badge: 'NEW',
        type: 'candles',
        size: 'large',
        scent: 'woody',
        description: 'Sophisticated sandalwood and amber',
        burnTime: '100-120 hours',
        inStock: true
    },
    {
        id: 'full-moon-luxury',
        name: 'Full Moon Luxury',
        collection: 'full-moon',
        price: 45.00,
        originalPrice: null,
        image: '../assets/Big Candle .jpg',
        badge: null,
        type: 'candles',
        size: 'large',
        scent: 'seasonal',
        description: 'Bold coconut apricot with vanilla noir',
        burnTime: '100-120 hours',
        inStock: true
    },
    {
        id: 'new-moon-votive',
        name: 'New Moon Votive',
        collection: 'new-moon',
        price: 18.00,
        originalPrice: null,
        image: '../assets/NEW MOON-small 2.jpg',
        badge: null,
        type: 'candles',
        size: 'votive',
        scent: 'floral',
        description: 'Travel-size new moon essence',
        burnTime: '20-25 hours',
        inStock: true
    },
    {
        id: 'lunar-wax-melts',
        name: 'Lunar Wax Melts Set',
        collection: 'full-moon',
        price: 24.00,
        originalPrice: null,
        image: '../assets/wax-melts.jpg',
        badge: null,
        type: 'wax-melts',
        size: 'medium',
        scent: 'seasonal',
        description: 'Set of 6 wax melts in lunar scents',
        burnTime: '8-10 hours each',
        inStock: true
    },
    {
        id: 'moon-phase-gift-set',
        name: 'Moon Phase Gift Set',
        collection: 'full-moon',
        price: 89.00,
        originalPrice: 120.00,
        image: '../assets/Package 1.jpg',
        badge: 'GIFT SET',
        type: 'gift-sets',
        size: 'large',
        scent: 'seasonal',
        description: 'Complete set of 5 votive candles representing each moon phase',
        burnTime: '100+ hours total',
        inStock: true
    }
];

let filteredProducts = [...productsData];
let currentView = 'grid';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

// Initialize products page
function initializeProductsPage() {
    displayProducts(filteredProducts);
    initializeFilters();
    initializeSorting();
    initializeViewToggle();
    updateResultsCount();
    
    // Check for URL parameters (collection filter)
    const urlParams = new URLSearchParams(window.location.search);
    const collection = urlParams.get('collection');
    const productType = urlParams.get('product-type');
    
    if (collection) {
        filterByCollection(collection);
    }
    
    if (productType) {
        filterByProductType(productType);
    }
}

// Display products in the grid
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria.</p>
                <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            ${product.badge ? `<div class="product-badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-details">
                    <span class="burn-time">🕐 ${product.burnTime}</span>
                    <span class="collection-badge">${formatCollectionName(product.collection)}</span>
                </div>
                <div class="product-pricing">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-size">
                    <span class="size-label">${formatSize(product.size)}</span>
                </div>
                <button class="btn btn-primary add-to-cart-btn" onclick="addProductToCart('${product.id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    // Product cards are clickable - add to cart button is the main action
    // No product detail page - all info shown on products page
}

// Initialize filter functionality
function initializeFilters() {
    const filterInputs = document.querySelectorAll('.filter-option input');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Apply filters
function applyFilters() {
    const filters = {
        collections: getCheckedValues('collection'),
        productType: getRadioValue('product-type'),
        sizes: getCheckedValues('size'),
        priceRanges: getCheckedValues('price'),
        scents: getCheckedValues('scent')
    };
    
    filteredProducts = productsData.filter(product => {
        // Collection filter
        if (filters.collections.length > 0 && !filters.collections.includes(product.collection)) {
            return false;
        }
        
        // Product type filter
        if (filters.productType !== 'all' && product.type !== filters.productType) {
            return false;
        }
        
        // Size filter
        if (filters.sizes.length > 0 && !filters.sizes.includes(product.size)) {
            return false;
        }
        
        // Price range filter
        if (filters.priceRanges.length > 0) {
            const inPriceRange = filters.priceRanges.some(range => {
                if (range === '0-25') return product.price <= 25;
                if (range === '26-50') return product.price >= 26 && product.price <= 50;
                if (range === '51-75') return product.price >= 51 && product.price <= 75;
                if (range === '76+') return product.price >= 76;
                return false;
            });
            if (!inPriceRange) return false;
        }
        
        // Scent filter
        if (filters.scents.length > 0 && !filters.scents.includes(product.scent)) {
            return false;
        }
        
        return true;
    });
    
    displayProducts(filteredProducts);
    updateResultsCount();
}

// Get checked checkbox values
function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(input => input.value);
}

// Get selected radio value
function getRadioValue(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : 'all';
}

// Clear all filters
function clearAllFilters() {
    document.querySelectorAll('.filter-option input').forEach(input => {
        if (input.type === 'radio' && input.value === 'all') {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });
    
    filteredProducts = [...productsData];
    displayProducts(filteredProducts);
    updateResultsCount();
}

// Initialize sorting
function initializeSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

// Sort products
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'a-z':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            // In a real app, this would sort by date added
            filteredProducts.sort((a, b) => a.id.localeCompare(b.id));
            break;
        case 'best-sellers':
            // Prioritize products with "BEST SELLER" badge
            filteredProducts.sort((a, b) => {
                if (a.badge === 'BEST SELLER' && b.badge !== 'BEST SELLER') return -1;
                if (b.badge === 'BEST SELLER' && a.badge !== 'BEST SELLER') return 1;
                return 0;
            });
            break;
        default: // featured
            // Default order
            break;
    }
    
    displayProducts(filteredProducts);
}

// Initialize view toggle
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('products-grid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid class
            if (productsGrid) {
                productsGrid.classList.toggle('list-view', view === 'list');
            }
            
            currentView = view;
        });
    });
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const count = filteredProducts.length;
        resultsCount.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
    }
}

// Filter by collection (for URL parameters)
function filterByCollection(collection) {
    const checkbox = document.querySelector(`input[name="collection"][value="${collection}"]`);
    if (checkbox) {
        checkbox.checked = true;
        applyFilters();
    }
}

// Filter by product type (for URL parameters)
function filterByProductType(productType) {
    const radio = document.querySelector(`input[name="product-type"][value="${productType}"]`);
    if (radio) {
        radio.checked = true;
        applyFilters();
    }
}

// Format collection name for display
function formatCollectionName(collection) {
    const names = {
        'new-moon': 'New Moon',
        'crescent': 'Crescent',
        'half-moon': 'Half Moon',
        'gibbous': 'Gibbous',
        'full-moon': 'Full Moon'
    };
    return names[collection] || collection;
}

// Add to cart functionality
function addProductToCart(productId) {
    console.log('addProductToCart called with:', productId);
    
    const product = productsData.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    console.log('Found product:', product);
    
    // Create cart item with all necessary details
    const cartItem = {
        id: product.id,
        name: product.name,
        collection: formatCollectionName(product.collection),
        price: product.price,
        size: formatSize(product.size),
        image: product.image,
        quantity: 1
    };
    
    console.log('Created cart item:', cartItem);
    
    // Use the global addToCart function from main.js
    if (window.addToCart) {
        console.log('Using global addToCart function');
        window.addToCart(cartItem);
    } else {
        console.log('Using fallback cart logic');
        // Fallback if main.js function not available
        let cart = JSON.parse(localStorage.getItem('lunarEssence_cart') || '[]');
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => 
            item.id === cartItem.id && item.size === cartItem.size
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            cart[existingItemIndex].quantity += 1;
            console.log('Updated existing item quantity');
        } else {
            // Add new item
            cart.push(cartItem);
            console.log('Added new item to cart');
        }
        
        // Save to localStorage
        localStorage.setItem('lunarEssence_cart', JSON.stringify(cart));
        console.log('Saved cart to localStorage:', cart);
        
        // Update cart count
        if (window.updateCartCount) {
            window.updateCartCount();
        }
        
        // Show feedback
        showAddToCartFeedback(product.name);
    }
}

// Format size for display
function formatSize(size) {
    const sizeMap = {
        'votive': 'Small (6oz)',
        'medium': 'Medium (12oz)', 
        'large': 'Large (16oz)'
    };
    return sizeMap[size] || 'Medium (12oz)';
}

// Show add to cart feedback (fallback)
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

// Load more products (for pagination)
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'load-more') {
        // In a real app, this would load more products from the server
        window.LunarEssence.showNotification('All products loaded!', 'info');
        e.target.style.display = 'none';
    }
});

// Export functions for global access
window.ProductsPage = {
    displayProducts,
    applyFilters,
    clearAllFilters,
    sortProducts,
    addProductToCart
};
// Test function to verify cart integration
function testCartIntegration() {
    console.log('Testing cart integration...');
    
    // Test adding a product to cart
    const testProduct = productsData[0]; // New Moon Essence
    addProductToCart(testProduct.id);
    
    // Check if item was added to cart
    const cart = JSON.parse(localStorage.getItem('lunarEssence_cart') || '[]');
    console.log('Current cart:', cart);
    
    if (cart.length > 0) {
        console.log('✅ Cart integration working! Product added successfully.');
        console.log('Added product:', cart[cart.length - 1]);
    } else {
        console.log('❌ Cart integration failed. No items in cart.');
    }
}

// Expose test function globally
window.testCartIntegration = testCartIntegration;

// Make addProductToCart globally accessible
window.addProductToCart = addProductToCart;