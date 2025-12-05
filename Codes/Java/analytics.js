// Lunar Essence - Analytics & User Data Functions
// User frequency analysis and invoice management

// ==========================================
// 6. Additional Functionality
// ==========================================

/**
 * ShowUserFrequency() - Show's user frequency based on Gender and Age Groups
 * Displays:
 * i. How many registered users fall under specific gender categories (Male, Female, Other)
 * ii. How many registered users fall under different age groups (18-25, 26-35, 36-50, 50+)
 * iii. Display this data on a dashboard or a separate page
 */
function ShowUserFrequency() {
    // Get users from RegisterData (lunarEssence_users)
    const users = getStoredUsers();
    
    console.log('📊 ShowUserFrequency() - Reading from localStorage');
    console.log('   Data Source: lunarEssence_users');
    console.log('   Total Users Found:', users.length);
    
    if (users.length === 0) {
        displayUserFrequencyOnPage();
        alert('No registered users found. Register a new user or click "Create Demo Data" to populate sample users.');
        return {
            genderFrequency: { Male: 0, Female: 0, Other: 0 },
            ageFrequency: { '18-25': 0, '26-35': 0, '36-50': 0, '50+': 0 }
        };
    }
    
    // Initialize frequency counters
    const genderFrequency = {
        Male: 0,
        Female: 0,
        Other: 0
    };
    
    const ageFrequency = {
        '18-25': 0,
        '26-35': 0,
        '36-50': 0,
        '50+': 0
    };
    
    // Calculate frequencies
    users.forEach(user => {
        // Gender frequency
        if (user.gender) {
            if (genderFrequency.hasOwnProperty(user.gender)) {
                genderFrequency[user.gender]++;
            } else {
                genderFrequency.Other++;
            }
        } else {
            // If no gender specified, count as Other
            genderFrequency.Other++;
        }
        
        // Age frequency
        if (user.dateOfBirth) {
            const age = calculateAge(user.dateOfBirth);
            
            if (age >= 18 && age <= 25) {
                ageFrequency['18-25']++;
            } else if (age >= 26 && age <= 35) {
                ageFrequency['26-35']++;
            } else if (age >= 36 && age <= 50) {
                ageFrequency['36-50']++;
            } else if (age > 50) {
                ageFrequency['50+']++;
            }
        }
    });
    
    const result = {
        genderFrequency,
        ageFrequency,
        totalUsers: users.length
    };
    
    // Display on page
    displayUserFrequencyOnPage();
    
    // Show success message
    showAnalyticsMessage('success', `✅ User Frequency Analysis Complete! Total Users: ${users.length}`);
    
    return result;
}

/**
 * Display user frequency data on the page
 */
function displayUserFrequencyOnPage() {
    const users = getStoredUsers();
    const container = document.getElementById('user-frequency-dashboard');
    
    if (!container) {
        console.error('Dashboard container not found');
        return;
    }
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Users Found</h3>
                <p>Click "Create Demo Data" to populate sample users.</p>
            </div>
        `;
        return;
    }
    
    // Calculate data
    const genderFrequency = { Male: 0, Female: 0, Other: 0 };
    const ageFrequency = { '18-25': 0, '26-35': 0, '36-50': 0, '50+': 0 };
    
    users.forEach(user => {
        // Gender
        if (user.gender && genderFrequency.hasOwnProperty(user.gender)) {
            genderFrequency[user.gender]++;
        } else {
            genderFrequency.Other++;
        }
        
        // Age
        if (user.dateOfBirth) {
            const age = calculateAge(user.dateOfBirth);
            if (age >= 18 && age <= 25) ageFrequency['18-25']++;
            else if (age >= 26 && age <= 35) ageFrequency['26-35']++;
            else if (age >= 36 && age <= 50) ageFrequency['36-50']++;
            else if (age > 50) ageFrequency['50+']++;
        }
    });
    
    const totalUsers = users.length;
    
    // Create gender chart HTML
    const genderChartHTML = `
        <div class="frequency-card">
            <h3>Gender Distribution</h3>
            <div class="chart-container">
                <div class="bar-chart">
                    <div class="bar-item">
                        <div class="bar-label">Male</div>
                        <div class="bar-wrapper">
                            <div class="bar" style="width: ${totalUsers > 0 ? (genderFrequency.Male / totalUsers * 100) : 0}%">
                                <span class="bar-value">${genderFrequency.Male}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">Female</div>
                        <div class="bar-wrapper">
                            <div class="bar" style="width: ${totalUsers > 0 ? (genderFrequency.Female / totalUsers * 100) : 0}%">
                                <span class="bar-value">${genderFrequency.Female}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">Other</div>
                        <div class="bar-wrapper">
                            <div class="bar" style="width: ${totalUsers > 0 ? (genderFrequency.Other / totalUsers * 100) : 0}%">
                                <span class="bar-value">${genderFrequency.Other}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create age chart HTML
    const ageChartHTML = `
        <div class="frequency-card">
            <h3>Age Group Distribution</h3>
            <div class="chart-container">
                <div class="bar-chart">
                    <div class="bar-item">
                        <div class="bar-label">18-25</div>
                        <div class="bar-wrapper">
                            <div class="bar" style="width: ${totalUsers > 0 ? (ageFrequency['18-25'] / totalUsers * 100) : 0}%">
                                <span class="bar-value">${ageFrequency['18-25']}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">26-35</div>
                        <div class="bar-wrapper">
                            <div class="bar" style="width: ${totalUsers > 0 ? (ageFrequency['26-35'] / totalUsers * 100) : 0}%">
                                <span class="bar-value">${ageFrequency['26-35']}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">36-50</div>
                        <div class="bar-wrapper">
                            <div class="bar" style="width: ${totalUsers > 0 ? (ageFrequency['36-50'] / totalUsers * 100) : 0}%">
                                <span class="bar-value">${ageFrequency['36-50']}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">50+</div>
                        <div class="bar-wrapper">
                            <div class="bar" style="width: ${totalUsers > 0 ? (ageFrequency['50+'] / totalUsers * 100) : 0}%">
                                <span class="bar-value">${ageFrequency['50+']}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = `
        <div class="dashboard-header">
            <h2>User Analytics Dashboard</h2>
            <p>Total Registered Users: <strong>${totalUsers}</strong></p>
        </div>
        <div class="frequency-grid">
            ${genderChartHTML}
            ${ageChartHTML}
        </div>
    `;
}

/**
 * ShowInvoices() - displays all invoices and allow the visitor to search for any
 * of the invoices (using trn) stored in AllInvoices from localStorage
 */
function ShowInvoices() {
    const allInvoices = getAllInvoices();
    
    console.log('📊 ShowInvoices() - Reading from localStorage');
    console.log('   Data Source: AllInvoices');
    console.log('   Total Invoices Found:', allInvoices.length);
    
    if (allInvoices.length === 0) {
        displayInvoicesOnPage();
        alert('No invoices found. Complete a purchase or click "Create Demo Data" to populate sample invoices.');
        return [];
    }
    
    // Display on page
    displayInvoicesOnPage();
    
    // Show success message
    showAnalyticsMessage('success', `✅ Loaded ${allInvoices.length} REAL invoice(s) from localStorage. Use search to filter by TRN.`);
    
    return allInvoices;
}

/**
 * Search for a specific invoice by TRN
 */
function searchInvoiceByTRN(trn) {
    const allInvoices = getAllInvoices();
    const invoice = allInvoices.find(inv => inv.trn === trn);
    
    if (!invoice) {
        console.log(`No invoice found with TRN: ${trn}`);
        return null;
    }
    
    console.log('=== INVOICE FOUND ===');
    console.log(`TRN: ${invoice.trn}`);
    console.log(`Order Number: ${invoice.orderNumber}`);
    console.log(`User: ${invoice.userName}`);
    console.log(`Email: ${invoice.userEmail}`);
    console.log(`Date: ${new Date(invoice.date).toLocaleDateString()}`);
    console.log(`Subtotal: $${invoice.subtotal.toFixed(2)}`);
    console.log(`Tax: $${invoice.tax.toFixed(2)}`);
    console.log(`Shipping: $${invoice.shipping.toFixed(2)}`);
    console.log(`Total: $${invoice.total.toFixed(2)}`);
    console.log('\nItems:');
    invoice.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name} - ${item.size} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`);
    });
    
    return invoice;
}

/**
 * Display all invoices on the page with search functionality
 */
function displayInvoicesOnPage() {
    const container = document.getElementById('invoices-container');
    
    if (!container) {
        console.error('Invoices container not found');
        return;
    }
    
    const allInvoices = getAllInvoices();
    
    if (allInvoices.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No invoices found</p>
            </div>
        `;
        return;
    }
    
    // Create search bar
    const searchHTML = `
        <div class="invoice-search">
            <input type="text" id="invoice-search-input" placeholder="Search by TRN, Order Number, or User Name">
            <button onclick="filterInvoices()" class="btn btn-primary">Search</button>
            <button onclick="displayInvoicesOnPage()" class="btn btn-outline">Clear</button>
        </div>
    `;
    
    // Create invoices table
    const invoicesHTML = allInvoices.map(invoice => `
        <div class="invoice-card">
            <div class="invoice-header">
                <div>
                    <strong>TRN:</strong> ${invoice.trn}<br>
                    <strong>Order:</strong> ${invoice.orderNumber}
                </div>
                <div class="invoice-total">$${invoice.total.toFixed(2)}</div>
            </div>
            <div class="invoice-body">
                <p><strong>User:</strong> ${invoice.userName}</p>
                <p><strong>Email:</strong> ${invoice.userEmail}</p>
                <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Items:</strong> ${invoice.items.length}</p>
            </div>
            <div class="invoice-footer">
                <button onclick="viewInvoiceDetails('${invoice.trn}')" class="btn btn-small">View Details</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        ${searchHTML}
        <div class="invoices-grid">
            ${invoicesHTML}
        </div>
    `;
}

/**
 * Filter invoices based on search input
 */
function filterInvoices() {
    const searchInput = document.getElementById('invoice-search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayInvoicesOnPage();
        return;
    }
    
    const allInvoices = getAllInvoices();
    const filteredInvoices = allInvoices.filter(invoice => 
        invoice.trn.toLowerCase().includes(searchTerm) ||
        invoice.orderNumber.toLowerCase().includes(searchTerm) ||
        invoice.userName.toLowerCase().includes(searchTerm) ||
        invoice.userEmail.toLowerCase().includes(searchTerm)
    );
    
    const container = document.getElementById('invoices-container');
    
    if (filteredInvoices.length === 0) {
        container.innerHTML = `
            <div class="invoice-search">
                <input type="text" id="invoice-search-input" value="${searchTerm}" placeholder="Search by TRN, Order Number, or User Name">
                <button onclick="filterInvoices()" class="btn btn-primary">Search</button>
                <button onclick="displayInvoicesOnPage()" class="btn btn-outline">Clear</button>
            </div>
            <div class="empty-state">
                <p>No invoices found matching "${searchTerm}"</p>
            </div>
        `;
        return;
    }
    
    const invoicesHTML = filteredInvoices.map(invoice => `
        <div class="invoice-card">
            <div class="invoice-header">
                <div>
                    <strong>TRN:</strong> ${invoice.trn}<br>
                    <strong>Order:</strong> ${invoice.orderNumber}
                </div>
                <div class="invoice-total">$${invoice.total.toFixed(2)}</div>
            </div>
            <div class="invoice-body">
                <p><strong>User:</strong> ${invoice.userName}</p>
                <p><strong>Email:</strong> ${invoice.userEmail}</p>
                <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Items:</strong> ${invoice.items.length}</p>
            </div>
            <div class="invoice-footer">
                <button onclick="viewInvoiceDetails('${invoice.trn}')" class="btn btn-small">View Details</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="invoice-search">
            <input type="text" id="invoice-search-input" value="${searchTerm}" placeholder="Search by TRN, Order Number, or User Name">
            <button onclick="filterInvoices()" class="btn btn-primary">Search</button>
            <button onclick="displayInvoicesOnPage()" class="btn btn-outline">Clear</button>
        </div>
        <div class="invoices-grid">
            ${invoicesHTML}
        </div>
        <p class="search-results">Found ${filteredInvoices.length} invoice(s)</p>
    `;
}

/**
 * GetUserInvoices() - displays all the invoices for a user based on trn stored in
 * the localStorage key called, RegisterData (lunarEssence_users)
 */
function GetUserInvoices(userIdentifier) {
    // If no identifier provided, use current logged-in user
    if (!userIdentifier) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert('No user logged in. Please login first.');
            return [];
        }
        userIdentifier = currentUser.username;
    }
    
    // Get user by username, email, or ID from RegisterData
    const users = getStoredUsers();
    const user = users.find(u => 
        u.username === userIdentifier ||
        u.email === userIdentifier ||
        u.id === userIdentifier ||
        u.trn === userIdentifier
    );
    
    if (!user) {
        alert(`User not found: ${userIdentifier}`);
        console.error('❌ User not found:', userIdentifier);
        return [];
    }
    
    console.log('📊 GetUserInvoices() - Reading from localStorage');
    console.log('   User:', user.firstName, user.lastName);
    console.log('   User TRN:', user.trn);
    console.log('   Data Source: AllInvoices');
    
    // Get all invoices from AllInvoices
    const allInvoices = getAllInvoices();
    console.log('   Total Invoices in System:', allInvoices.length);
    
    // Filter invoices for this user by TRN (primary) or other identifiers (fallback)
    const userInvoices = allInvoices.filter(invoice => {
        const matchByTRN = invoice.trn === user.trn;
        const matchByUserId = invoice.userId === user.id;
        const matchByEmail = invoice.userEmail === user.email;
        const matchByName = invoice.userName === `${user.firstName} ${user.lastName}`;
        
        if (matchByTRN) console.log('   ✓ Invoice matched by TRN:', invoice.orderNumber);
        
        return matchByTRN || matchByUserId || matchByEmail || matchByName;
    });
    
    console.log('   User Invoices Found:', userInvoices.length);
    
    if (userInvoices.length === 0) {
        displayUserInvoicesOnPage(userIdentifier);
        showAnalyticsMessage('info', `No invoices found for ${user.firstName} ${user.lastName} (TRN: ${user.trn || 'N/A'}). User has not made any purchases yet.`);
        return [];
    }
    
    // Display on page
    displayUserInvoicesOnPage(userIdentifier);
    
    // Show success message
    showAnalyticsMessage('success', `✅ Found ${userInvoices.length} REAL invoice(s) for ${user.firstName} ${user.lastName} (TRN: ${user.trn})`);
    
    return userInvoices;
}

/**
 * Display user invoices on the page
 */
function displayUserInvoicesOnPage(userIdentifier) {
    const container = document.getElementById('user-invoices-container');
    
    if (!container) {
        console.error('User invoices container not found');
        return;
    }
    
    const users = getStoredUsers();
    const user = users.find(u => 
        u.username === userIdentifier ||
        u.email === userIdentifier ||
        u.id === userIdentifier
    );
    
    if (!user) {
        container.innerHTML = `<div class="empty-state"><p>User not found</p></div>`;
        return;
    }
    
    // Get all invoices
    const allInvoices = getAllInvoices();
    
    // Filter invoices for this user
    const userInvoices = allInvoices.filter(invoice => 
        invoice.userId === user.id ||
        invoice.userEmail === user.email ||
        invoice.userName === `${user.firstName} ${user.lastName}`
    );
    
    if (userInvoices.length === 0) {
        container.innerHTML = `
            <div class="user-info">
                <h3>${user.firstName} ${user.lastName}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>TRN:</strong> ${user.trn || 'Not assigned'}</p>
                <p><strong>Total Orders:</strong> 0</p>
            </div>
            <div class="empty-state">
                <p>No invoices found for this user</p>
            </div>
        `;
        return;
    }
    
    const invoicesHTML = userInvoices.map(invoice => `
        <div class="invoice-card">
            <div class="invoice-header">
                <div>
                    <strong>TRN:</strong> ${invoice.trn}<br>
                    <strong>Order:</strong> ${invoice.orderNumber}
                </div>
                <div class="invoice-total">$${invoice.total.toFixed(2)}</div>
            </div>
            <div class="invoice-body">
                <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Items:</strong> ${invoice.items.length}</p>
                <p><strong>Status:</strong> ${invoice.status || 'Completed'}</p>
            </div>
            <div class="invoice-footer">
                <button onclick="viewInvoiceDetails('${invoice.trn}')" class="btn btn-small">View Details</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="user-info">
            <h3>${user.firstName} ${user.lastName}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>TRN:</strong> ${user.trn || 'Not assigned'}</p>
            <p><strong>Total Orders:</strong> ${userInvoices.length}</p>
        </div>
        <div class="invoices-grid">
            ${invoicesHTML}
        </div>
    `;
}

/**
 * Show analytics message/notification
 */
function showAnalyticsMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.analytics-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `analytics-message analytics-message-${type}`;
    messageDiv.innerHTML = `
        <span class="message-text">${message}</span>
        <button class="message-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    const container = document.querySelector('.dashboard-container') || document.body;
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

/**
 * View detailed invoice information
 */
function viewInvoiceDetails(trn) {
    const invoice = searchInvoiceByTRN(trn);
    
    if (!invoice) {
        alert('Invoice not found');
        return;
    }
    
    // Create modal or detailed view
    const modal = document.createElement('div');
    modal.className = 'invoice-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Invoice Details</h3>
                <button class="modal-close" onclick="this.closest('.invoice-modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="invoice-details">
                    <div class="detail-row">
                        <strong>TRN:</strong> ${invoice.trn}
                    </div>
                    <div class="detail-row">
                        <strong>Order Number:</strong> ${invoice.orderNumber}
                    </div>
                    <div class="detail-row">
                        <strong>Customer:</strong> ${invoice.userName}
                    </div>
                    <div class="detail-row">
                        <strong>Email:</strong> ${invoice.userEmail}
                    </div>
                    <div class="detail-row">
                        <strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}
                    </div>
                    <hr>
                    <h4>Items</h4>
                    ${invoice.items.map(item => `
                        <div class="item-row">
                            <span>${item.name} - ${item.size}</span>
                            <span>x${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                    <hr>
                    <div class="detail-row">
                        <strong>Subtotal:</strong> $${invoice.subtotal.toFixed(2)}
                    </div>
                    <div class="detail-row">
                        <strong>Tax (16% GCT):</strong> $${invoice.tax.toFixed(2)}
                    </div>
                    <div class="detail-row">
                        <strong>Shipping:</strong> $${invoice.shipping.toFixed(2)}
                    </div>
                    <div class="detail-row total">
                        <strong>Total:</strong> <strong>$${invoice.total.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Get current logged-in user
 */
function getCurrentUser() {
    try {
        const user = localStorage.getItem('lunarEssence_currentUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error reading current user from localStorage:', error);
        return null;
    }
}

/**
 * Get all users from localStorage
 */
function getStoredUsers() {
    try {
        const users = localStorage.getItem('lunarEssence_users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error reading users from localStorage:', error);
        return [];
    }
}

/**
 * Get all invoices from localStorage
 */
function getAllInvoices() {
    try {
        const invoices = localStorage.getItem('AllInvoices');
        return invoices ? JSON.parse(invoices) : [];
    } catch (error) {
        console.error('Error reading invoices from localStorage:', error);
        return [];
    }
}

/**
 * Save invoice to localStorage
 */
function saveInvoice(invoiceData) {
    const allInvoices = getAllInvoices();
    allInvoices.push(invoiceData);
    localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));
    console.log('Invoice saved successfully');
}

/**
 * Generate TRN (Tax Registration Number)
 */
function generateTRN() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TRN${timestamp}${random}`;
}

/**
 * Create demo data for testing
 * WARNING: This will ADD to existing data, not replace it
 */
function createDemoData() {
    const confirmCreate = confirm('⚠️ This will ADD demo data to your existing data. Continue?');
    if (!confirmCreate) {
        console.log('Demo data creation cancelled');
        return;
    }
    
    // Get existing users
    const existingUsers = getStoredUsers();
    
    // Create demo users with gender (only if they don't exist)
    const demoUsers = [
        {
            id: 'demo_user_1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.demo@example.com',
            username: 'johndoe_demo',
            password: 'Password123',
            dateOfBirth: '1995-03-15',
            gender: 'Male',
            isAdmin: false,
            trn: 'TRN-JOHN-1000000001',
            registrationDate: new Date().toISOString()
        },
        {
            id: 'demo_user_2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.demo@example.com',
            username: 'janesmith_demo',
            password: 'Password123',
            dateOfBirth: '1988-07-22',
            gender: 'Female',
            isAdmin: false,
            trn: 'TRN-JANE-1000000002',
            registrationDate: new Date().toISOString()
        },
        {
            id: 'demo_user_3',
            firstName: 'Alex',
            lastName: 'Johnson',
            email: 'alex.demo@example.com',
            username: 'alexj_demo',
            password: 'Password123',
            dateOfBirth: '2000-11-10',
            gender: 'Other',
            isAdmin: false,
            trn: 'TRN-ALEX-1000000003',
            registrationDate: new Date().toISOString()
        }
    ];
    
    // Add demo users to existing users (avoid duplicates)
    demoUsers.forEach(demoUser => {
        const exists = existingUsers.some(u => u.username === demoUser.username || u.email === demoUser.email);
        if (!exists) {
            existingUsers.push(demoUser);
        }
    });
    
    localStorage.setItem('lunarEssence_users', JSON.stringify(existingUsers));
    
    // Get existing invoices
    const existingInvoices = getAllInvoices();
    
    // Create demo invoices (using user's TRN)
    const timestamp = Date.now();
    const demoInvoices = [
        {
            trn: 'TRN-JOHN-1000000001', // John's TRN (same for all his orders)
            orderNumber: `DEMO-${timestamp}-001`,
            userId: 'demo_user_1',
            userName: 'John Doe',
            userEmail: 'john.demo@example.com',
            date: new Date().toISOString(),
            items: [
                { name: 'New Moon Essence', size: 'Medium (10oz)', quantity: 2, price: 32.00 },
                { name: 'Crescent Glow', size: 'Large (20oz)', quantity: 1, price: 45.00 }
            ],
            subtotal: 109.00,
            tax: 17.44,
            shipping: 10.00,
            total: 136.44,
            status: 'Completed'
        },
        {
            trn: 'TRN-JOHN-1000000001', // John's second order (same TRN)
            orderNumber: `DEMO-${timestamp}-002`,
            userId: 'demo_user_1',
            userName: 'John Doe',
            userEmail: 'john.demo@example.com',
            date: new Date().toISOString(),
            items: [
                { name: 'Full Moon Luxury', size: 'Large (20oz)', quantity: 1, price: 45.00 }
            ],
            subtotal: 45.00,
            tax: 7.20,
            shipping: 10.00,
            total: 62.20,
            status: 'Completed'
        },
        {
            trn: 'TRN-JANE-1000000002', // Jane's TRN
            orderNumber: `DEMO-${timestamp}-003`,
            userId: 'demo_user_2',
            userName: 'Jane Smith',
            userEmail: 'jane.demo@example.com',
            date: new Date().toISOString(),
            items: [
                { name: 'Half Moon Harmony', size: 'Medium (10oz)', quantity: 1, price: 38.00 }
            ],
            subtotal: 38.00,
            tax: 6.08,
            shipping: 10.00,
            total: 54.08,
            status: 'Completed'
        }
    ];
    
    // Add demo invoices to existing invoices
    demoInvoices.forEach(invoice => {
        existingInvoices.push(invoice);
    });
    
    localStorage.setItem('AllInvoices', JSON.stringify(existingInvoices));
    
    console.log('✅ Demo data added successfully!');
    console.log('Total Users:', existingUsers.length);
    console.log('Total Invoices:', existingInvoices.length);
    
    // Refresh dashboard
    refreshDashboard();
    
    alert(`✅ Demo data added!\nUsers: ${existingUsers.length}\nInvoices: ${existingInvoices.length}`);
}

/**
 * Refresh dashboard data
 * Call this to reload all dashboard data
 */
function refreshDashboard() {
    console.log('🔄 Refreshing dashboard data...');
    
    // Show what data is available
    const users = getStoredUsers();
    const invoices = getAllInvoices();
    
    console.log('📊 Current Data in localStorage:');
    console.log('   Users (lunarEssence_users):', users.length);
    console.log('   Invoices (AllInvoices):', invoices.length);
    
    if (users.length > 0) {
        console.log('   Sample Users:', users.slice(0, 3).map(u => `${u.firstName} ${u.lastName} (TRN: ${u.trn})`));
    }
    
    if (invoices.length > 0) {
        console.log('   Sample Invoices:', invoices.slice(0, 3).map(inv => `Order: ${inv.orderNumber}, TRN: ${inv.trn}`));
    }
    
    // Refresh user frequency
    const userFreqContainer = document.getElementById('user-frequency-dashboard');
    if (userFreqContainer) {
        displayUserFrequencyOnPage();
    }
    
    // Refresh invoices
    const invoicesContainer = document.getElementById('invoices-container');
    if (invoicesContainer) {
        displayInvoicesOnPage();
    }
    
    showAnalyticsMessage('success', `✅ Dashboard refreshed! Users: ${users.length}, Invoices: ${invoices.length}`);
}

/**
 * Initialize dashboard auto-refresh listeners
 */
function initializeDashboardListeners() {
    // Listen for new user registrations
    window.addEventListener('user:registered', (event) => {
        console.log('New user registered:', event.detail);
        refreshDashboard();
    });
    
    // Listen for new invoices
    window.addEventListener('invoice:created', (event) => {
        console.log('New invoice created:', event.detail);
        refreshDashboard();
    });
    
    // Listen for storage changes (from other tabs)
    window.addEventListener('storage', (event) => {
        if (event.key === 'lunarEssence_users' || event.key === 'AllInvoices') {
            console.log('Storage changed:', event.key);
            refreshDashboard();
        }
    });
    
    console.log('✅ Dashboard listeners initialized');
}

// Auto-initialize listeners when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboardListeners);
} else {
    initializeDashboardListeners();
}

/**
 * Clear all invoices only (keeps user data intact)
 * WARNING: This will delete ALL invoices!
 */
function clearAllData() {
    const confirmClear = confirm('⚠️ WARNING: This will delete ALL invoices!\n\nUser accounts will NOT be deleted.\n\nAre you sure?');
    if (!confirmClear) {
        console.log('Clear invoices cancelled');
        return;
    }
    
    const doubleConfirm = confirm('This action CANNOT be undone!\n\nClick OK to proceed with deletion.');
    if (!doubleConfirm) {
        console.log('Clear invoices cancelled');
        return;
    }
    
    // Clear all invoices only
    localStorage.setItem('AllInvoices', JSON.stringify([]));
    
    // Clear orders
    localStorage.setItem('lunarEssence_orders', JSON.stringify([]));
    
    console.log('✅ All invoices cleared!');
    console.log('User accounts remain intact');
    
    // Refresh dashboard
    refreshDashboard();
    
    alert('✅ All invoices have been cleared!\nUser accounts remain intact.');
}

/**
 * Verify and display data status on dashboard load
 */
function verifyDataStatus() {
    const users = getStoredUsers();
    const invoices = getAllInvoices();
    
    console.log('═══════════════════════════════════════════');
    console.log('📊 DASHBOARD DATA VERIFICATION');
    console.log('═══════════════════════════════════════════');
    console.log('Data Source: localStorage (REAL DATA)');
    console.log('');
    console.log('Users (lunarEssence_users):');
    console.log('  Total:', users.length);
    if (users.length > 0) {
        users.forEach((u, i) => {
            console.log(`  ${i + 1}. ${u.firstName} ${u.lastName}`);
            console.log(`     - Username: ${u.username}`);
            console.log(`     - Email: ${u.email}`);
            console.log(`     - TRN: ${u.trn || 'Not assigned'}`);
            console.log(`     - Gender: ${u.gender || 'Not specified'}`);
            console.log(`     - DOB: ${u.dateOfBirth || 'Not specified'}`);
        });
    } else {
        console.log('  ⚠️ No users found. Register a new user to see data.');
    }
    console.log('');
    console.log('Invoices (AllInvoices):');
    console.log('  Total:', invoices.length);
    if (invoices.length > 0) {
        invoices.forEach((inv, i) => {
            console.log(`  ${i + 1}. Order: ${inv.orderNumber}`);
            console.log(`     - TRN: ${inv.trn}`);
            console.log(`     - User: ${inv.userName}`);
            console.log(`     - Email: ${inv.userEmail}`);
            console.log(`     - Total: $${inv.total.toFixed(2)}`);
            console.log(`     - Date: ${new Date(inv.date).toLocaleDateString()}`);
        });
    } else {
        console.log('  ⚠️ No invoices found. Complete a purchase to see data.');
    }
    console.log('═══════════════════════════════════════════');
    
    return { users: users.length, invoices: invoices.length };
}

// Export functions to global scope
window.ShowUserFrequency = ShowUserFrequency;
window.displayUserFrequencyOnPage = displayUserFrequencyOnPage;
window.ShowInvoices = ShowInvoices;
window.searchInvoiceByTRN = searchInvoiceByTRN;
window.displayInvoicesOnPage = displayInvoicesOnPage;
window.filterInvoices = filterInvoices;
window.GetUserInvoices = GetUserInvoices;
window.displayUserInvoicesOnPage = displayUserInvoicesOnPage;
window.viewInvoiceDetails = viewInvoiceDetails;
window.saveInvoice = saveInvoice;
window.generateTRN = generateTRN;
window.createDemoData = createDemoData;
window.refreshDashboard = refreshDashboard;
window.initializeDashboardListeners = initializeDashboardListeners;
window.clearAllData = clearAllData;
window.verifyDataStatus = verifyDataStatus;
