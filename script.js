// Virtaava Oy Website JavaScript - Modern ES6+ Implementation

class VirtaavaWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupFormHandling();
        this.setupMobileMenu();
        this.setupBackToTop();
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add loading states to buttons
        document.querySelectorAll('button, .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.type === 'submit' && !button.disabled) {
                    this.addLoadingState(button);
                }
            });
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('fade-in-up')) {
                        return; // Already animated
                    }
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll(
            '.card-hover, section h2, section h3, .service-card-primary, .service-card-secondary, .medical-card'
        );
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('nav');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Navbar hide/show on scroll
            if (navbar) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }

            // Back to top button visibility
            this.toggleBackToTopButton(currentScrollY);

            lastScrollY = currentScrollY;
        });
    }

    setupFormHandling() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.contains('hidden');
                
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
                    mobileMenuButton.setAttribute('aria-expanded', 'true');
                } else {
                    mobileMenu.style.maxHeight = '0';
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                    }, 300);
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            });

            // Close mobile menu when clicking on links
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.style.maxHeight = '0';
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                    }, 300);
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }

    setupBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            backToTopButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    toggleBackToTopButton(scrollY) {
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            if (scrollY > 400) {
                backToTopButton.classList.remove('opacity-0', 'invisible', 'translate-y-4');
                backToTopButton.classList.add('opacity-100', 'visible', 'translate-y-0');
            } else {
                backToTopButton.classList.add('opacity-0', 'invisible', 'translate-y-4');
                backToTopButton.classList.remove('opacity-100', 'visible', 'translate-y-0');
            }
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('#submit-button');
        const formData = new FormData(form);
        
        // Get form values
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message')
        };
        
        // Validation
        if (!this.validateForm(data)) {
            return;
        }
        
        // Add loading state
        this.addLoadingState(submitButton);
        
        try {
            // Since this is a static website, create a mailto link
            const subject = encodeURIComponent(`Yhteydenotto - ${data.service || 'Yleinen'}`);
            const body = encodeURIComponent(`
Nimi: ${data.firstName} ${data.lastName}
Sähköposti: ${data.email}
Puhelinnumero: ${data.phone || 'Ei annettu'}
Kiinnostava palvelu: ${data.service || 'Ei valittu'}

Viesti:
${data.message}

---
Lähetetty Virtaava Oy:n verkkosivulta
            `);
            
            const mailtoLink = `mailto:info@hyvinvointivirtaava.fi?subject=${subject}&body=${body}`;
            
            // Show success notification
            this.showNotification(
                'Kiitos yhteydenotosta! Sähköpostiohjelma avautuu automaattisesti.',
                'success'
            );
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification(
                'Virhe lomakkeen lähetyksessä. Yritä uudelleen tai soita suoraan numeroon 044 247 6464.',
                'error'
            );
        } finally {
            this.removeLoadingState(submitButton);
        }
    }

    validateForm(data) {
        // Check required fields
        if (!data.firstName || !data.lastName || !data.email || !data.message) {
            this.showNotification('Täytä kaikki pakolliset kentät (*).', 'error');
            return false;
        }

        // Validate email
        if (!this.isValidEmail(data.email)) {
            this.showNotification('Anna kelvollinen sähköpostiosoite.', 'error');
            return false;
        }

        // Validate message length
        if (data.message.length < 10) {
            this.showNotification('Viesti on liian lyhyt. Kerro meille hieman enemmän tarpeistasi.', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    addLoadingState(button) {
        button.disabled = true;
        button.classList.add('loading');
        
        const originalText = button.innerHTML;
        button.dataset.originalText = originalText;
        
        button.innerHTML = `
            <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Lähetetään...
            </span>
        `;
    }

    removeLoadingState(button) {
        button.disabled = false;
        button.classList.remove('loading');
        
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            delete button.dataset.originalText;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification-medical').forEach(notification => {
            notification.remove();
        });
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification-medical transform transition-all duration-300 translate-x-full`;
        
        const icons = {
            success: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,
            error: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            info: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`
        };

        const colors = {
            success: 'text-green-600 bg-green-50 border-green-200',
            error: 'text-red-600 bg-red-50 border-red-200',
            info: 'text-blue-600 bg-blue-50 border-blue-200'
        };

        notification.classList.add(colors[type] || colors.info);
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0 mr-3">
                    ${icons[type] || icons.info}
                </div>
                <div class="flex-1">
                    <p class="font-medium">${message}</p>
                </div>
                <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('translate-x-full');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Utility methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VirtaavaWebsite();
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            document.getElementById('mobile-menu-button')?.setAttribute('aria-expanded', 'false');
        }
        
        // Close any notifications
        document.querySelectorAll('.notification-medical').forEach(notification => {
            notification.remove();
        });
    }
});

// Enhanced accessibility
document.addEventListener('focusin', (e) => {
    if (e.target.matches('a, button, input, textarea, select')) {
        e.target.classList.add('focus:ring-medical');
    }
});

// Preload critical resources
if ('IntersectionObserver' in window) {
    const preloadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    preloadObserver.unobserve(img);
                }
            }
        });
    });

    // Observe images with data-src for lazy loading
    document.querySelectorAll('img[data-src]').forEach(img => {
        preloadObserver.observe(img);
    });
}

// Error handling for the entire application
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // Could implement error reporting here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could implement error reporting here
});

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VirtaavaWebsite;
}