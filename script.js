// Virtaava Oy Website JavaScript

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contact-form');
    const submitButton = document.querySelector('#submit-button');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states to buttons
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.classList.add('loading');
            }
        });
    });
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('#submit-button');
    const formData = new FormData(form);
    
    // Get form values
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Basic validation
    if (!firstName || !lastName || !email || !message) {
        showNotification('Täytä kaikki pakolliset kentät.', 'error');
        submitButton.classList.remove('loading');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Anna kelvollinen sähköpostiosoite.', 'error');
        submitButton.classList.remove('loading');
        return;
    }
    
    // Disable submit button and show loading
    submitButton.disabled = true;
    submitButton.innerHTML = 'Lähetetään...';
    
    try {
        // Since this is a static website, we'll create a mailto link as fallback
        // In production, this would connect to a backend service
        const subject = encodeURIComponent(`Yhteydenotto - ${service || 'Yleinen'}`);
        const body = encodeURIComponent(`
Nimi: ${firstName} ${lastName}
Sähköposti: ${email}
Puhelinnumero: ${phone || 'Ei annettu'}
Palvelu: ${service || 'Ei valittu'}

Viesti:
${message}
        `);
        
        const mailtoLink = `mailto:info@hyvinvointivirtaava.fi?subject=${subject}&body=${body}`;
        
        // Show success message
        showNotification('Kiitos yhteydenotosta! Sähköpostiohjelma avautuu automaattisesti.', 'success');
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('Virhe lomakkeen lähetyksessä. Yritä uudelleen tai soita suoraan numeroon 044 247 6464.', 'error');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = 'Lähetä viesti';
        submitButton.classList.remove('loading');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    
    if (type === 'success') {
        notification.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
        notification.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
    } else if (type === 'error') {
        notification.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
        notification.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
    } else {
        notification.classList.add('bg-blue-100', 'border-blue-500', 'text-blue-800');
        notification.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
    }
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'absolute top-2 right-2 text-gray-500 hover:text-gray-700';
    closeButton.innerHTML = '×';
    closeButton.addEventListener('click', () => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    });
    notification.appendChild(closeButton);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.card-hover, section h2, section p');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});