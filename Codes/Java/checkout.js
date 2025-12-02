// Checkout System JavaScript
// Lunar Essence E-Commerce - Checkout Functionality

class CheckoutController {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 5;
        this.cartData = [];
        this.checkoutData = {
            shipping: {},
            billing: {},
            payment: {},
            special: {},
            totals: {}
        };
        
        this.init();
    }

    init() {
        this.loadCartData();
        this.setupEventListeners();
        this.updateProgressIndicator();
        this.updateOrderSummary();
        this.showStep(1);
    }

    loadCartData() {
        // Load cart data from localStorage
        const cart = localStorage.getItem('lunarEssence_cart');
        this.cartData = cart ? JSON.parse(cart) : [];
        
        // If cart is empty, redirect to products page
        if (this.cartData.length === 0) {
            window.location.href = 'products.html';
            return;
        }
    }

    setupEventListeners() {
        // Navigation buttons
        const backBtn = document.getElementById('back-btn');
        const continueBtn = document.getElementById('continue-btn');
        const placeOrderBtn = document.getElementById('place-order-btn');

        if (backBtn) {
            backBtn.addEventListener('click', () => this.previousStep());
        }

        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.nextStep());
        }

        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => this.processOrder());
        }

        // Billing same as shipping checkbox
        const sameAsShipping = document.getElementById('same-as-shipping');
        if (sameAsShipping) {
            sameAsShipping.addEventListener('change', () => this.toggleBillingFields());
        }

        // Gift message toggle
        const giftToggle = document.getElementById('gift-message-toggle');
        if (giftToggle) {
            giftToggle.addEventListener('change', () => this.toggleGiftMessage());
        }

        // Gift message character counter
        const giftMessage = document.getElementById('gift-message');
        if (giftMessage) {
            giftMessage.addEventListener('input', () => this.updateCharacterCount());
        }

        // Terms and conditions checkbox
        const termsCheckbox = document.getElementById('terms-agreement');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => this.togglePlaceOrderButton());
        }

        // Form validation on input
        this.setupFormValidation();
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('.checkout-form input, .checkout-form select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.checkout-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.getElementById(`step-${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Update navigation buttons
        this.updateNavigationButtons(stepNumber);
        
        // Update progress indicator
        this.updateProgressIndicator();
    }

    updateNavigationButtons(stepNumber) {
        const backBtn = document.getElementById('back-btn');
        const continueBtn = document.getElementById('continue-btn');
        const placeOrderBtn = document.getElementById('place-order-btn');

        // Show/hide back button
        if (backBtn) {
            backBtn.style.display = stepNumber === 1 ? 'none' : 'inline-flex';
        }

        // Show/hide continue vs place order button
        if (stepNumber === this.maxSteps) {
            if (continueBtn) continueBtn.classList.add('hidden');
            if (placeOrderBtn) placeOrderBtn.classList.remove('hidden');
        } else {
            if (continueBtn) continueBtn.classList.remove('hidden');
            if (placeOrderBtn) placeOrderBtn.classList.add('hidden');
        }
    }

    updateProgressIndicator() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                this.showStep(this.currentStep);
                
                // Special handling for review step
                if (this.currentStep === this.maxSteps) {
                    this.populateReviewStep();
                }
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return false;

        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation (basic)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.toggle('show', !!message);
        }
        
        field.classList.toggle('error', !!message);
    }

    clearFieldError(field) {
        this.showFieldError(field, '');
    }

    saveCurrentStepData() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return;

        const formData = new FormData();
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData.append(input.name, input.checked);
            } else {
                formData.append(input.name, input.value);
            }
        });

        // Save to appropriate section
        switch (this.currentStep) {
            case 1:
                this.checkoutData.shipping = Object.fromEntries(formData);
                break;
            case 2:
                this.checkoutData.billing = Object.fromEntries(formData);
                break;
            case 3:
                this.checkoutData.payment = Object.fromEntries(formData);
                break;
            case 4:
                this.checkoutData.special = Object.fromEntries(formData);
                break;
        }
    }

    toggleBillingFields() {
        const checkbox = document.getElementById('same-as-shipping');
        const billingFields = document.getElementById('billing-fields');
        
        if (checkbox && billingFields) {
            billingFields.classList.toggle('hidden', checkbox.checked);
            
            if (checkbox.checked) {
                // Copy shipping data to billing
                this.copyShippingToBilling();
            }
        }
    }

    copyShippingToBilling() {
        const shippingFields = {
            'shipping-firstname': 'billing-firstname',
            'shipping-lastname': 'billing-lastname',
            'shipping-address': 'billing-address',
            'shipping-city': 'billing-city',
            'shipping-parish': 'billing-parish',
            'shipping-postal': 'billing-postal',
            'shipping-country': 'billing-country'
        };

        Object.entries(shippingFields).forEach(([shippingId, billingId]) => {
            const shippingField = document.getElementById(shippingId);
            const billingField = document.getElementById(billingId);
            
            if (shippingField && billingField) {
                billingField.value = shippingField.value;
            }
        });
    }

    toggleGiftMessage() {
        const checkbox = document.getElementById('gift-message-toggle');
        const giftSection = document.getElementById('gift-message-section');
        
        if (checkbox && giftSection) {
            giftSection.classList.toggle('hidden', !checkbox.checked);
        }
    }

    updateCharacterCount() {
        const giftMessage = document.getElementById('gift-message');
        const charCount = document.getElementById('char-count');
        
        if (giftMessage && charCount) {
            charCount.textContent = giftMessage.value.length;
        }
    }

    togglePlaceOrderButton() {
        const termsCheckbox = document.getElementById('terms-agreement');
        const placeOrderBtn = document.getElementById('place-order-btn');
        
        if (termsCheckbox && placeOrderBtn) {
            placeOrderBtn.disabled = !termsCheckbox.checked;
        }
    }

    populateReviewStep() {
        // Populate order items
        this.populateReviewItems();
        
        // Populate addresses
        this.populateReviewAddresses();
        
        // Populate payment method
        this.populateReviewPayment();
    }

    populateReviewItems() {
        const reviewItems = document.getElementById('review-items');
        if (!reviewItems) return;

        let itemsHtml = '';
        this.cartData.forEach(item => {
            itemsHtml += `
                <div class="review-item">
                    <strong>${item.name}</strong> - ${item.size}<br>
                    Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}
                </div>
            `;
        });
        
        reviewItems.innerHTML = itemsHtml;
    }

    populateReviewAddresses() {
        const reviewShipping = document.getElementById('review-shipping');
        const reviewBilling = document.getElementById('review-billing');
        
        if (reviewShipping && this.checkoutData.shipping) {
            const shipping = this.checkoutData.shipping;
            reviewShipping.innerHTML = `
                ${shipping.shippingFirstName} ${shipping.shippingLastName}<br>
                ${shipping.shippingAddress}<br>
                ${shipping.shippingCity}, ${shipping.shippingParish} ${shipping.shippingPostal}<br>
                ${shipping.shippingCountry}<br>
                Phone: ${shipping.shippingPhone}<br>
                Email: ${shipping.shippingEmail}
            `;
        }

        if (reviewBilling) {
            const sameAsShipping = document.getElementById('same-as-shipping')?.checked;
            if (sameAsShipping) {
                reviewBilling.innerHTML = '<em>Same as shipping address</em>';
            } else if (this.checkoutData.billing) {
                const billing = this.checkoutData.billing;
                reviewBilling.innerHTML = `
                    ${billing.billingFirstName} ${billing.billingLastName}<br>
                    ${billing.billingAddress}<br>
                    ${billing.billingCity}, ${billing.billingParish} ${billing.billingPostal}<br>
                    ${billing.billingCountry}
                `;
            }
        }
    }

    populateReviewPayment() {
        const reviewPayment = document.getElementById('review-payment');
        if (reviewPayment && this.checkoutData.payment) {
            const payment = this.checkoutData.payment;
            const maskedCard = payment.cardNumber ? `**** **** **** ${payment.cardNumber.slice(-4)}` : '';
            reviewPayment.innerHTML = `
                <strong>Credit Card (Demo)</strong><br>
                Card: ${maskedCard}<br>
                Expires: ${payment.cardExpiry}<br>
                <em>Demo Mode - No real payment processed</em>
            `;
        }
    }

    updateOrderSummary() {
        this.calculateTotals();
        this.displaySummaryItems();
        this.displaySummaryTotals();
    }

    calculateTotals() {
        let subtotal = 0;
        
        this.cartData.forEach(item => {
            subtotal += item.quantity * item.price;
        });

        const tax = subtotal * 0.16; // 16% GCT
        const shipping = 10.00; // Default standard shipping
        const total = subtotal + tax + shipping;

        this.checkoutData.totals = {
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: total
        };
    }

    displaySummaryItems() {
        const summaryItems = document.getElementById('summary-items');
        if (!summaryItems) return;

        let itemsHtml = '';
        this.cartData.forEach(item => {
            itemsHtml += `
                <div class="summary-item">
                    <div class="summary-item-image">
                        <img src="${item.image || '../assets/placeholder.jpg'}" alt="${item.name}">
                    </div>
                    <div class="summary-item-details">
                        <div class="summary-item-name">${item.name}</div>
                        <div class="summary-item-info">${item.size} × ${item.quantity}</div>
                    </div>
                    <div class="summary-item-price">$${(item.quantity * item.price).toFixed(2)}</div>
                </div>
            `;
        });
        
        summaryItems.innerHTML = itemsHtml;
    }

    displaySummaryTotals() {
        const totals = this.checkoutData.totals;
        
        const elements = {
            'summary-subtotal': totals.subtotal,
            'summary-tax': totals.tax,
            'summary-shipping': totals.shipping,
            'summary-total': totals.total
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `$${value.toFixed(2)}`;
            }
        });
    }

    processOrder() {
        if (!this.validateCurrentStep()) {
            return;
        }

        // Save final step data
        this.saveCurrentStepData();

        // Generate order
        const order = this.generateOrder();
        
        // Store order in localStorage
        this.saveOrder(order);
        
        // Clear cart
        localStorage.removeItem('lunarEssence_cart');
        
        // Show confirmation
        this.showOrderConfirmation(order);
    }

    generateOrder() {
        const orderNumber = this.generateOrderNumber();
        const currentDate = new Date().toISOString();

        return {
            orderNumber: orderNumber,
            orderDate: currentDate,
            items: this.cartData,
            shippingAddress: this.checkoutData.shipping,
            billingAddress: document.getElementById('same-as-shipping')?.checked ? 
                this.checkoutData.shipping : this.checkoutData.billing,
            paymentMethod: 'Credit Card (Demo)',
            giftMessage: this.checkoutData.special?.giftMessage || '',
            deliveryInstructions: this.checkoutData.special?.deliveryInstructions || '',
            totals: this.checkoutData.totals,
            status: 'confirmed'
        };
    }

    generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 9000) + 1000;
        
        return `LE-${year}${month}${day}-${random}`;
    }

    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('lunarEssence_orders') || '[]');
        orders.push(order);
        localStorage.setItem('lunarEssence_orders', JSON.stringify(orders));
    }

    showOrderConfirmation(order) {
        const modal = document.getElementById('order-confirmation-modal');
        const orderNumberElement = document.getElementById('confirmation-order-number');
        const emailElement = document.getElementById('confirmation-email');
        const summaryElement = document.getElementById('confirmation-summary');

        if (orderNumberElement) {
            orderNumberElement.textContent = order.orderNumber;
        }

        if (emailElement) {
            emailElement.textContent = order.shippingAddress.shippingEmail;
        }

        if (summaryElement) {
            summaryElement.innerHTML = `
                <h4>Order Summary</h4>
                <p><strong>Items:</strong> ${order.items.length}</p>
                <p><strong>Total:</strong> $${order.totals.total.toFixed(2)}</p>
                <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
            `;
        }

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('show');
        }
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on checkout page
    if (document.querySelector('.checkout-section')) {
        new CheckoutController();
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckoutController;
}