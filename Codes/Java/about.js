// About Page JavaScript
// Lunar Essence - About Page Interactions and Animations

document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    initializeInteractiveElements();
});

// Scroll Animations
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
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.story-text, .craft-text, .mission-card, .vision-card, .value-card, .info-card'
    );

    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Interactive Elements
function initializeInteractiveElements() {
    // Add hover effects to value cards
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-8px)';
        });
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.about-hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add smooth scrolling for CTA button
    const ctaButton = document.querySelector('.cta-section .btn');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Add a subtle animation when clicked
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Add typing effect to hero subtitle (optional enhancement)
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add counter animation for any numeric values (future enhancement)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Export functions for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeScrollAnimations,
        initializeInteractiveElements,
        isInViewport,
        animateCounter
    };
}