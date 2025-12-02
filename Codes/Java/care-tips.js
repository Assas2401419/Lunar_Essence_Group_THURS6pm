// Care Tips Page JavaScript
// Lunar Essence - Care Tips Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initializeCareTipsFeatures();
    initializeScrollAnimations();
});

// Initialize care tips interactive features
function initializeCareTipsFeatures() {
    // Add smooth scrolling for internal links
    addSmoothScrolling();
    
    // Add interactive hover effects
    addInteractiveEffects();
    
    // Add copy functionality for tips
    addCopyFeatures();
    
    // Add expandable sections
    addExpandableSections();
}

// Smooth scrolling for navigation
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add interactive hover effects
function addInteractiveEffects() {
    // Enhanced tip card interactions
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Safety item interactions
    const safetyItems = document.querySelectorAll('.safety-item');
    safetyItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Problem-solution card interactions
    const problemCards = document.querySelectorAll('.problem-solution');
    problemCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.01)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add copy functionality for tips
function addCopyFeatures() {
    // Add copy buttons to instruction items
    const instructionItems = document.querySelectorAll('.instruction-item');
    
    instructionItems.forEach(item => {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '📋';
        copyButton.className = 'copy-tip-btn';
        copyButton.title = 'Copy this tip';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--color-accent);
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Make instruction item relative for positioning
        item.style.position = 'relative';
        item.appendChild(copyButton);
        
        // Show copy button on hover
        item.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });
        
        // Copy functionality
        copyButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const stepContent = item.querySelector('.step-content');
            const title = stepContent.querySelector('h5').textContent;
            const description = stepContent.querySelector('p').textContent;
            const textToCopy = `${title}: ${description}`;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                showCopyFeedback(copyButton);
            }).catch(() => {
                // Fallback for older browsers
                fallbackCopyText(textToCopy);
                showCopyFeedback(copyButton);
            });
        });
    });
}

// Show copy feedback
function showCopyFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '✓';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = 'var(--color-accent)';
    }, 1500);
}

// Fallback copy function for older browsers
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

// Add expandable sections for mobile
function addExpandableSections() {
    // Only add on mobile devices
    if (window.innerWidth <= 768) {
        const sections = document.querySelectorAll('.care-section');
        
        sections.forEach(section => {
            const header = section.querySelector('h3');
            if (header) {
                header.style.cursor = 'pointer';
                header.style.position = 'relative';
                
                // Add expand/collapse indicator
                const indicator = document.createElement('span');
                indicator.innerHTML = '▼';
                indicator.style.cssText = `
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    transition: transform 0.3s ease;
                    font-size: 0.8em;
                `;
                header.appendChild(indicator);
                
                // Initially collapse content on mobile
                const content = section.querySelector('.section-content, .instruction-list, .storage-tips, .troubleshooting-grid');
                if (content) {
                    content.style.display = 'none';
                    
                    header.addEventListener('click', function() {
                        const isHidden = content.style.display === 'none';
                        
                        if (isHidden) {
                            content.style.display = 'grid';
                            indicator.style.transform = 'translateY(-50%) rotate(180deg)';
                        } else {
                            content.style.display = 'none';
                            indicator.style.transform = 'translateY(-50%) rotate(0deg)';
                        }
                    });
                }
            }
        });
    }
}

// Scroll animations for elements coming into view
function initializeScrollAnimations() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.tip-card, .care-section, .safety-item, .problem-solution'
    );

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Add quick navigation for long page
function addQuickNavigation() {
    const quickNav = document.createElement('div');
    quickNav.className = 'quick-navigation';
    quickNav.style.cssText = `
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: var(--color-white);
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        padding: 15px;
        z-index: 1000;
        display: none;
    `;
    
    const navItems = [
        { text: 'Quick Tips', target: '.quick-tips' },
        { text: 'First Burn', target: '.care-section:nth-child(1)' },
        { text: 'Wick Care', target: '.care-section:nth-child(2)' },
        { text: 'Safety', target: '.safety-section' },
        { text: 'Troubleshooting', target: '.troubleshooting' }
    ];
    
    navItems.forEach(item => {
        const navLink = document.createElement('a');
        navLink.textContent = item.text;
        navLink.href = '#';
        navLink.style.cssText = `
            display: block;
            padding: 8px 12px;
            color: var(--color-primary);
            text-decoration: none;
            font-size: 0.9rem;
            border-radius: 5px;
            margin-bottom: 5px;
            transition: background-color 0.3s ease;
        `;
        
        navLink.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--color-secondary)';
        });
        
        navLink.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        navLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(item.target);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        quickNav.appendChild(navLink);
    });
    
    document.body.appendChild(quickNav);
    
    // Show/hide quick nav based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const showThreshold = 500;
        
        if (scrollPosition > showThreshold && window.innerWidth > 950) {
            quickNav.style.display = 'block';
        } else {
            quickNav.style.display = 'none';
        }
    });
}

// Initialize quick navigation
if (window.innerWidth > 950) {
    addQuickNavigation();
}

// Export functions for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeCareTipsFeatures,
        addSmoothScrolling,
        addInteractiveEffects,
        showCopyFeedback
    };
}