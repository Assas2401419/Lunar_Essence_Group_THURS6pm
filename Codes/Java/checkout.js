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

    setupEventListeners() 
    {
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
	
	const modal = document.getElementById('order-confirmation-modal');
	if(modal)
	{
		modal.addEventListener('click', (e) =>
		{
			if(e.target === modal)
			{
				modal.classList.add('hidden');
				modal.classList.remove('show');
			}
		});
	}
	
	
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

	updateCartCount() 
	{
    		const cartCount = document.getElementById('cart-count');
    		if (cartCount) 
		{
        		cartCount.textContent = '0';
    		}
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
	
	this.updateCartCount();

        
        // Show confirmation and auto-downloaded receipt
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
        // Save to lunarEssence_orders (for customer order history)
        const orders = JSON.parse(localStorage.getItem('lunarEssence_orders') || '[]');
        orders.push(order);
        localStorage.setItem('lunarEssence_orders', JSON.stringify(orders));
        
        // Also save as invoice to AllInvoices (for admin dashboard)
        this.saveAsInvoice(order);
    }
    
    saveAsInvoice(order) {
        // Get current user
        const currentUser = this.getCurrentUser();
        
        // Get user's TRN from their account, or generate one for guest
        let userTRN;
        if (currentUser && currentUser.trn) {
            // Use existing TRN from user account
            userTRN = currentUser.trn;
        } else if (currentUser) {
            // User exists but doesn't have TRN (old account), generate and save it
            userTRN = this.generateUserTRN(currentUser.username);
            this.updateUserTRN(currentUser.id, userTRN);
        } else {
            // Guest checkout - generate temporary TRN
            userTRN = this.generateGuestTRN(order.shippingAddress.shippingEmail);
        }
        
        // Create invoice object matching the format expected by admin dashboard
        const invoice = {
            trn: userTRN, // User's unique TRN (same for all their orders)
            orderNumber: order.orderNumber, // Unique order number
            userId: currentUser?.id || 'guest',
            userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 
                     `${order.shippingAddress.shippingFirstName} ${order.shippingAddress.shippingLastName}`,
            userEmail: currentUser?.email || order.shippingAddress.shippingEmail,
            date: order.orderDate,
            items: order.items.map(item => ({
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal: order.totals.subtotal,
            tax: order.totals.tax,
            shipping: order.totals.shipping,
            total: order.totals.total,
            status: 'Completed',
            shippingAddress: order.shippingAddress,
            billingAddress: order.billingAddress
        };
        
        // Get existing invoices
        const allInvoices = JSON.parse(localStorage.getItem('AllInvoices') || '[]');
        
        // Add new invoice
        allInvoices.push(invoice);
        
        // Save back to localStorage
        localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));
        
        console.log('✅ Invoice saved to AllInvoices');
        console.log('   User TRN:', userTRN);
        console.log('   Order Number:', order.orderNumber);
        
        // Dispatch event for dashboard to listen
        window.dispatchEvent(new CustomEvent('invoice:created', { detail: invoice }));
    }
    
    generateUserTRN(username) {
        // Generate a unique TRN based on username and timestamp
        // Format: TRN-USERNAME-TIMESTAMP
        const timestamp = Date.now();
        const usernameHash = username.toUpperCase().substring(0, 4).padEnd(4, 'X');
        return `TRN-${usernameHash}-${timestamp}`;
    }
    
    generateGuestTRN(email) {
        // Generate TRN for guest checkout
        const timestamp = Date.now();
        const emailHash = email.substring(0, 4).toUpperCase().padEnd(4, 'X');
        return `TRN-GUEST-${emailHash}-${timestamp}`;
    }
    
    updateUserTRN(userId, trn) {
        // Update user's TRN in the users database
        try {
            const users = JSON.parse(localStorage.getItem('lunarEssence_users') || '[]');
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex !== -1) {
                users[userIndex].trn = trn;
                localStorage.setItem('lunarEssence_users', JSON.stringify(users));
                
                // Also update current user session
                const currentUser = this.getCurrentUser();
                if (currentUser && currentUser.id === userId) {
                    currentUser.trn = trn;
                    localStorage.setItem('lunarEssence_currentUser', JSON.stringify(currentUser));
                }
                
                console.log('✅ User TRN updated:', trn);
            }
        } catch (error) {
            console.error('Error updating user TRN:', error);
        }
    }
    
    getCurrentUser() {
        try {
            const user = localStorage.getItem('lunarEssence_currentUser');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error reading current user:', error);
            return null;
        }
    }
	downloadReceipt(order, format = 'json') 
	{
    		try 
		{
        		const receipt = {
            			receipt: {
                			orderDetails: {
                    				orderNumber: order.orderNumber,
                    				orderDate: new Date(order.orderDate).toLocaleString('en-JM'),
                    				status: order.status,
                    				orderType: "Lunar Essence Online Purchase",
                    				website: "https://lunareessence.com"
                			},
                			customer: {
                    				name: `${order.shippingAddress.shippingFirstName} ${order.shippingAddress.shippingLastName}`,
                    				email: order.shippingAddress.shippingEmail,
                    				phone: order.shippingAddress.shippingPhone,
                    				shippingAddress: {
                        				street: order.shippingAddress.shippingAddress,
                        				city: order.shippingAddress.shippingCity,
                        				parish: order.shippingAddress.shippingParish,
                        				postalCode: order.shippingAddress.shippingPostal,
                        				country: order.shippingAddress.shippingCountry
                    				}
                			},
                			items: order.items.map(item => ({
                    				name: item.name,
                    				size: item.size || "Standard",
                    				scent: item.scent || "Lunar Blend",
                    				quantity: item.quantity,
                    				unitPrice: item.price,
                    				total: (item.quantity * item.price).toFixed(2)
                			})),
                			pricing: {
                    				subtotal: order.totals.subtotal.toFixed(2),
                    				tax: order.totals.tax.toFixed(2),
                    				shipping: order.totals.shipping.toFixed(2),
                    				total: order.totals.total.toFixed(2),
                    				
                			},
                			specialInstructions: {
                    				giftMessage: order.giftMessage || "None provided",
                    				deliveryInstructions: order.deliveryInstructions || "Standard delivery"
                			},
                			payment: {
                    				method: order.paymentMethod,
                    				processedAt: new Date().toISOString(),
                    				paymentStatus: "Completed (Demo Mode)",
                    				note: "This is a demonstration transaction. No actual payment was processed."
                			},
                			merchant: {
                    				name: "Lunar Essence",
                    				tagline: "Hand-poured luxury candles inspired by lunar phases",
                    				location: "Crafted in Jamaica 🇯🇲",
                    				contact: "assascbenjamin@utech.edu.jm",
                    				website: "https://lunareessence.com",
                    				businessId: "LE-2025-2401419"
                			},
                			disclaimer: "Thank you for choosing Lunar Essence. This receipt is for your records. All transactions in this demo are simulated for educational purposes."
            			}
        		};

        		// Handle billing address separately
        		if (this.checkoutData.billing && this.checkoutData.billing.billingAddress) {
            			receipt.receipt.customer.billingAddress = {
                			street: this.checkoutData.billing.billingAddress,
                			city: this.checkoutData.billing.billingCity,
                			parish: this.checkoutData.billing.billingParish,
                			postalCode: this.checkoutData.billing.billingPostal,
                			country: this.checkoutData.billing.billingCountry
            			};
        		} else {
            			receipt.receipt.customer.billingAddress = "Same as shipping address";
        		}

        if (format === 'json') {
            // JSON format
            const jsonString = JSON.stringify(receipt, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `LunarEssence_Receipt_${order.orderNumber}.json`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            return true;
        } else if (format === 'txt') {
            const textContent = this.generateTextReceipt(receipt);
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `LunarEssence_Receipt_${order.orderNumber}.txt`;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            return true;
        }
        return false;
    } catch (error) {
        console.error('Error generating receipt:', error);
        this.showReceiptStatus('error', 'Failed to generate receipt. Please try again.');
        return false;
    }
}
	catch (error)
	{
		console.error('Error generating receipt: ', error);
		this.showReceiptStatus('error', 'Failed to generate receipt. Please try again. ');
		return false;
	}
	
	generateTextReceipt(receiptData)
	{
		const r = receiptData.receipt;
    
    		let text = `
		========================================
        	LUNAR ESSENCE RECEIPT
		========================================
		Order Number: ${r.orderDetails.orderNumber}
		Order Date: ${r.orderDetails.orderDate}
		Status: ${r.orderDetails.status.toUpperCase()}
		========================================

		CUSTOMER INFORMATION
		-------------------
		Name: ${r.customer.name}
		Email: ${r.customer.email}
		Phone: ${r.customer.phone}
		
		Shipping Address:
		${r.customer.shippingAddress.street}
		${r.customer.shippingAddress.city}, ${r.customer.shippingAddress.parish}
		${r.customer.shippingAddress.postalCode}, 						${r.customer.shippingAddress.country}

		Billing Address:
		${typeof r.customer.billingAddress === 'string' 
    		? r.customer.billingAddress 
    		: `${r.customer.billingAddress.street}\n${r.customer.billingAddress.city}, 		${r.customer.billingAddress.parish}\n							${r.customer.billingAddress.postalCode}, 						${r.customer.billingAddress.country}`}

		========================================
		
		ORDER ITEMS
		-----------
		${r.items.map(item => `${item.quantity}x ${item.name} (${item.size})
  		@ $${item.unitPrice} each = $${item.total}`).join('\n')}

		========================================

		ORDER SUMMARY
		-------------
		Subtotal: $${r.pricing.subtotal}
		Tax (16% GCT): $${r.pricing.tax}
		Shipping: $${r.pricing.shipping}
		Total: $${r.pricing.total}

		========================================

		SPECIAL INSTRUCTIONS
		-------------------
		Gift Message: ${r.specialInstructions.giftMessage}
		Delivery: ${r.specialInstructions.deliveryInstructions}

		========================================

		PAYMENT INFORMATION
		------------------
		Method: ${r.payment.method}
		Status: ${r.payment.paymentStatus}
		Processed: ${new Date(r.payment.processedAt).toLocaleString()}

		========================================

		MERCHANT INFORMATION
		-------------------
		${r.merchant.name}
		${r.merchant.tagline}
		${r.merchant.location}
		Contact: ${r.merchant.contact}
		Website: ${r.merchant.website}

		========================================

		${r.disclaimer}

		========================================
		Thank you for your purchase!
		Visit us again at ${r.merchant.website}
		========================================
   		`;
		return text;

	}
	showReceiptStatus(type, message) 
	{
    		const statusElement = document.getElementById('receipt-download-status');
    		if (statusElement) 
		{
        		statusElement.textContent = message;
        		statusElement.className = 'receipt-status';
        		statusElement.classList.add(type);
        		statusElement.classList.remove('hidden');
        
        		// Hide after 5 seconds
        		setTimeout(() => {
            		statusElement.classList.add('hidden');
        		}, 5000);
    		}
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
	//Added addition receipt details
        if (summaryElement) 
	{
            summaryElement.innerHTML = `
                <h4>Order Summary</h4>
                <p><strong>Items:</strong> ${order.items.length}</p>
                <p><strong>Total:</strong> $${order.totals.total.toFixed(2)}</p>
		<p><strong>Shipping:</strong> $${order.totals.shipping.toFixed(2)}</p>
            	<p><strong>Tax (16%):</strong> $${order.totals.tax.toFixed(2)}</p>
            	<p><strong>Total:</strong> $${order.totals.total.toFixed(2)}</p>
                <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
            `;
        }
	
	const jsonButton = document.getElementById('download-receipt-json');
	
	if(jsonButton)
	{
		jsonButton.onclick = () =>
		{
			const success = this.downloadReceipt(order, 'json');
			if(success)
			{
				this.showReceiptStatus('success', 'Receipt downloaded Successfully!');
			}
		};
	}
	
	
        if (modal) 
	{
            	modal.classList.remove('hidden');
            	modal.classList.add('show');
		
		setTimeout(() => 
		{
			const success = this.downloadReceipt(order, 'json');
			if(success)
			{
				const autoMsg = document.createElement('div');
                		autoMsg.className = 'receipt-auto-message';
                		autoMsg.innerHTML = `
                    		<strong> Receipt Automatically Downloaded</strong>
                    		<small>File: LunarEssence_Receipt_${order.orderNumber}.json</small>
                		`;
				const receiptSection = modal.querySelector('.receipt-download-section');
				
				if(receiptSection)
				{
					receiptSection.appendChild(autoMsg);
                    
                    			// Fade out after 8 seconds
                    			setTimeout(() =>
					{
						autoMsg.style.opacity ='0';
						setTimeout(() => autoMsg.remove(), 500);
					
					}, 8000);	
			
				}
			}

		}, 2000);
        }
    }
	
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => 
{
    // Only initialize on checkout page
    if (document.querySelector('.checkout-section')) {
        new CheckoutController();
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckoutController;
}