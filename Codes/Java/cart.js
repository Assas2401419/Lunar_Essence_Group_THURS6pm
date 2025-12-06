// Lunar Essence - Shopping Cart JavaScript
// Complete cart management functionality

// Cart state
let cart = [];
let discountCodes = {
    'LUNAR10': { type: 'percentage', value: 10, description: '10% off your order' },
    'NEWMOON': { type: 'fixed', value: 15, description: '$15 off your order' },
    'FULLMOON20': { type: 'percentage', value: 20, description: '20% off your order' },
    'WELCOME': { type: 'fixed', value: 10, description: '$10 off for new customers' }
};
let appliedDiscount = null;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

// Initialize cart functionality
function initializeCart() {
    loadCartFromStorage();
    renderCart();
    initializeEventListeners();
    updateCartCount();
}

// Load cart from localStorage
function loadCartFromStorage() {
    const storedCart = localStorage.getItem('lunarEssence_cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    
    const storedDiscount = localStorage.getItem('lunarEssence_appliedDiscount');
    if (storedDiscount) {
        appliedDiscount = JSON.parse(storedDiscount);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('lunarEssence_cart', JSON.stringify(cart));
    if (appliedDiscount) {
        localStorage.setItem('lunarEssence_appliedDiscount', JSON.stringify(appliedDiscount));
    } else {
        localStorage.removeItem('lunarEssence_appliedDiscount');
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', showClearCartModal);
    }

    // Modal event listeners
    const modal = document.getElementById('clear-cart-modal');
    const modalClose = document.getElementById('modal-close');
    const cancelClear = document.getElementById('cancel-clear');
    const confirmClear = document.getElementById('confirm-clear');

    if (modalClose) modalClose.addEventListener('click', hideClearCartModal);
    if (cancelClear) cancelClear.addEventListener('click', hideClearCartModal);
    if (confirmClear) confirmClear.addEventListener('click', clearCart);
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) hideClearCartModal();
        });
    }

    // Update cart button
    const updateCartBtn = document.getElementById('update-cart');
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', updateCart);
    }

    // Shipping method change
    const shippingSelect = document.getElementById('shipping-method');
    if (shippingSelect) {
        shippingSelect.addEventListener('change', updateOrderSummary);
    }

    // Discount code application
    const applyDiscountBtn = document.getElementById('apply-discount');
    const discountInput = document.getElementById('discount-code');
    
    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', applyDiscountCode);
    }
    
    if (discountInput) {
        discountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyDiscountCode();
            }
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartContainer = document.getElementById('empty-cart');
    const cartActionsContainer = document.getElementById('cart-actions');
    
    if (!cartItemsContainer) return;
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart state
        if (emptyCartContainer) emptyCartContainer.classList.remove('hidden');
        if (cartActionsContainer) cartActionsContainer.style.display = 'none';
        updateOrderSummary();
        return;
    }
    
    // Hide empty cart state
    if (emptyCartContainer) emptyCartContainer.classList.add('hidden');
    if (cartActionsContainer) cartActionsContainer.style.display = 'flex';
    
    // Render each cart item
    cart.forEach((item, index) => {
        const cartItemElement = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    updateOrderSummary();
}

// Create cart item element
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.index = index;
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        
        <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-collection">${item.collection} Collection</p>
            <p class="cart-item-size">Size: ${item.size}</p>
        </div>
        
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        
        <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                −
            </button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                   onchange="updateQuantity(${index}, parseInt(this.value))">
            <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})" ${item.quantity >= 10 ? 'disabled' : ''}>
                +
            </button>
        </div>
        
        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        
        <button class="remove-item-btn" onclick="removeItem(${index})" title="Remove item">
            🗑️
        </button>
    `;
    
    return cartItem;
}

// Update item quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity < 1 || newQuantity > 10) return;
    
    const cartItem = document.querySelector(`[data-index="${index}"]`);
    if (cartItem) {
        cartItem.classList.add('updating');
    }
    
    setTimeout(() => {
        cart[index].quantity = newQuantity;
        saveCartToStorage();
        renderCart();
        updateCartCount();
        
        // Show update feedback
        showCartUpdateFeedback('Item quantity updated');
    }, 300);
}

// Remove item from cart
function removeItem(index) {
    const cartItem = document.querySelector(`[data-index="${index}"]`);
    if (cartItem) {
        cartItem.classList.add('removing');
    }
    
    setTimeout(() => {
        const removedItem = cart[index];
        cart.splice(index, 1);
        saveCartToStorage();
        renderCart();
        updateCartCount();
        
        // Show removal feedback
        showCartUpdateFeedback(`${removedItem.name} removed from cart`);
    }, 300);
}

// Update cart (recalculate everything)
function updateCart() {
    // Validate all quantities
    cart.forEach((item) => {
        if (item.quantity < 1) item.quantity = 1;
        if (item.quantity > 10) item.quantity = 10;
    });
    
    saveCartToStorage();
    renderCart();
    updateCartCount();
    showCartUpdateFeedback('Cart updated successfully');
}

// Clear entire cart
function clearCart() {
    cart = [];
    appliedDiscount = null;
    saveCartToStorage();
    renderCart();
    updateCartCount();
    hideClearCartModal();
    showCartUpdateFeedback('Cart cleared');
}

// Show/hide clear cart modal
function showClearCartModal() {
    const modal = document.getElementById('clear-cart-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function hideClearCartModal() {
    const modal = document.getElementById('clear-cart-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Update order summary
function updateOrderSummary() {
    const itemCountElement = document.getElementById('item-count');
    const subtotalElement = document.getElementById('subtotal');
    const shippingCostElement = document.getElementById('shipping-cost');
    const taxAmountElement = document.getElementById('tax-amount');
    const discountAmountElement = document.getElementById('discount-amount');
    const totalAmountElement = document.getElementById('total-amount');
    const discountLineElement = document.getElementById('discount-line');
    
    // Calculate totals
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Get shipping cost
    const shippingSelect = document.getElementById('shipping-method');
    const selectedShipping = shippingSelect ? shippingSelect.selectedOptions[0] : null;
    const shippingCost = selectedShipping ? parseFloat(selectedShipping.dataset.cost) : 10;
    
    // Free shipping on orders over $75
    const finalShippingCost = subtotal >= 75 ? 0 : shippingCost;
    
    // Calculate tax (16% GCT)
    const taxRate = 0.16;
    const taxAmount = subtotal * taxRate;
    
    // Calculate discount
    let discountAmount = 0;
    if (appliedDiscount) {
        if (appliedDiscount.type === 'percentage') {
            discountAmount = subtotal * (appliedDiscount.value / 100);
        } else {
            discountAmount = appliedDiscount.value;
        }
        // Ensure discount doesn't exceed subtotal
        discountAmount = Math.min(discountAmount, subtotal);
    }
    
    // Calculate final total
    const total = subtotal + finalShippingCost + taxAmount - discountAmount;
    
    // Update DOM elements
    if (itemCountElement) itemCountElement.textContent = itemCount;
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingCostElement) {
        if (finalShippingCost === 0 && subtotal >= 75) {
            shippingCostElement.innerHTML = '<span style="text-decoration: line-through;">$' + shippingCost.toFixed(2) + '</span> FREE';
        } else {
            shippingCostElement.textContent = `$${finalShippingCost.toFixed(2)}`;
        }
    }
    if (taxAmountElement) taxAmountElement.textContent = `$${taxAmount.toFixed(2)}`;
    if (totalAmountElement) totalAmountElement.textContent = `$${total.toFixed(2)}`;
    
    // Handle discount display
    if (appliedDiscount && discountAmount > 0) {
        if (discountLineElement) discountLineElement.classList.remove('hidden');
        if (discountAmountElement) discountAmountElement.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
        if (discountLineElement) discountLineElement.classList.add('hidden');
    }
    
    // Update checkout button state
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        if (cart.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Cart is Empty';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Proceed to Checkout';
        }
    }
}

// Apply discount code
function applyDiscountCode() {
    const discountInput = document.getElementById('discount-code');
    const discountMessage = document.getElementById('discount-message');
    
    if (!discountInput || !discountMessage) return;
    
    const code = discountInput.value.trim().toUpperCase();
    
    if (!code) {
        showDiscountMessage('Please enter a discount code', 'error');
        return;
    }
    
    if (appliedDiscount && appliedDiscount.code === code) {
        showDiscountMessage('This discount code is already applied', 'error');
        return;
    }
    
    if (discountCodes[code]) {
        appliedDiscount = {
            code: code,
            type: discountCodes[code].type,
            value: discountCodes[code].value,
            description: discountCodes[code].description
        };
        
        saveCartToStorage();
        updateOrderSummary();
        
        showDiscountMessage(`Discount applied: ${appliedDiscount.description}`, 'success');
        discountInput.value = '';
    } else {
        showDiscountMessage('Invalid discount code', 'error');
    }
}

// Show discount message
function showDiscountMessage(message, type) {
    const discountMessage = document.getElementById('discount-message');
    if (!discountMessage) return;
    
    discountMessage.textContent = message;
    discountMessage.className = `discount-message ${type}`;
    discountMessage.classList.remove('hidden');
    
    // Hide message after 5 seconds
    setTimeout(() => {
        discountMessage.classList.add('hidden');
    }, 5000);
}

// Show cart update feedback
function showCartUpdateFeedback(message) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
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

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some items before checkout.');
        return;
    }
    
    // Store checkout data
    const checkoutData = {
        items: cart,
        appliedDiscount: appliedDiscount,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('lunarEssence_checkoutData', JSON.stringify(checkoutData));
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Add animation class
        cartCountElement.classList.add('updated');
        setTimeout(() => {
            cartCountElement.classList.remove('updated');
        }, 300);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-count.updated {
        animation: bounce 0.3s ease-out;
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

// Add demo items for testing
function addDemoCartItems() {
    const demoItems = [
        {
            id: 'test-candle-1',
            name: 'Lunar Glow',
            collection: 'Full Moon',
            price: 32.99,
            size: 'Medium (12oz)',
            image: '../assets/candle-1.jpg',
            quantity: 2
        },
        {
            id: 'test-candle-2',
            name: 'Midnight Serenity',
            collection: 'New Moon',
            price: 28.99,
            size: 'Small (8oz)',
            image: '../assets/candle-2.jpg',
            quantity: 1
        }
    ];
    
    localStorage.setItem('lunarEssence_cart', JSON.stringify(demoItems));
    
    // Reload the cart
    loadCartFromStorage();
    renderCart();
    updateCartCount();
    
    console.log('Demo cart items added for testing');
}

// Expose function globally for testing
window.addDemoCartItems = addDemoCartItems;