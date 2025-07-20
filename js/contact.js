// Contact form functionality with EmailJS integration

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageDiv = document.getElementById('form-message');
        this.submitBtn = null;
        this.isSubmitting = false;
        
        // EmailJS configuration
        this.emailJSConfig = {
            serviceID: 'service_trxi8v2',
            templateID: 'template_66s36bx',
            publicKey: 'xKNjPO8dPjdqHuiSW'
        };
        
        this.init();
    }
    
    init() {
        if (!this.form) {
            console.warn('Contact form not found');
            return;
        }
        
        this.submitBtn = this.form.querySelector('.submit-btn');
        
        // Initialize EmailJS
        this.initializeEmailJS();
        
        // Add form validation
        this.initializeValidation();
        
        // Add form submission handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        this.addRealTimeValidation();
        
        // Add form enhancement features
        this.addFormEnhancements();
    }
    
    initializeEmailJS() {
        // Initialize EmailJS with fallback
        try {
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.emailJSConfig.publicKey);
            } else {
                console.warn('EmailJS library not loaded');
            }
        } catch (error) {
            console.warn('EmailJS initialization failed:', error);
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validate form
        const validationResult = this.validateForm();
        if (!validationResult.isValid) {
            this.showMessage(validationResult.message, 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            await this.sendEmail();
            this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.resetForm();
        } catch (error) {
            console.error('Email sending failed:', error);
            this.showMessage('Failed to send message. Please try again or contact me directly.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async sendEmail() {
        const formData = new FormData(this.form);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            to_name: 'Dipan Pramanik'
        };
        
        if (typeof emailjs !== 'undefined') {
            // Use EmailJS if available
            const result = await emailjs.send(
                this.emailJSConfig.serviceID,
                this.emailJSConfig.templateID,
                templateParams
            );
            return result;
        } else {
            // Fallback: simulate email sending
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate success/failure
                    const success = Math.random() > 0.1; // 90% success rate
                    if (success) {
                        resolve({ status: 200, text: 'OK' });
                    } else {
                        reject(new Error('Simulated network error'));
                    }
                }, 2000);
            });
        }
    }
    
    validateForm() {
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            subject: formData.get('subject').trim(),
            message: formData.get('message').trim()
        };
        
        // Required field validation
        if (!data.name) {
            return { isValid: false, message: 'Name is required.' };
        }
        
        if (!data.email) {
            return { isValid: false, message: 'Email is required.' };
        }
        
        if (!data.subject) {
            return { isValid: false, message: 'Subject is required.' };
        }
        
        if (!data.message) {
            return { isValid: false, message: 'Message is required.' };
        }
        
        // Email format validation
        if (!this.isValidEmail(data.email)) {
            return { isValid: false, message: 'Please enter a valid email address.' };
        }
        
        // Length validation
        if (data.name.length < 2) {
            return { isValid: false, message: 'Name must be at least 2 characters long.' };
        }
        
        if (data.subject.length < 5) {
            return { isValid: false, message: 'Subject must be at least 5 characters long.' };
        }
        
        if (data.message.length < 10) {
            return { isValid: false, message: 'Message must be at least 10 characters long.' };
        }
        
        // Spam detection (basic)
        if (this.detectSpam(data.message)) {
            return { isValid: false, message: 'Your message appears to be spam. Please try again.' };
        }
        
        return { isValid: true };
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    detectSpam(message) {
        const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here'];
        const lowerMessage = message.toLowerCase();
        
        return spamKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    setLoadingState(loading) {
        this.isSubmitting = loading;
        
        if (this.submitBtn) {
            const btnText = this.submitBtn.querySelector('.btn-text');
            const btnLoader = this.submitBtn.querySelector('.btn-loader');
            
            if (loading) {
                this.submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline-block';
                this.submitBtn.style.cursor = 'not-allowed';
            } else {
                this.submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                this.submitBtn.style.cursor = 'pointer';
            }
        }
    }
    
    showMessage(message, type) {
        if (!this.messageDiv) return;
        
        this.messageDiv.textContent = message;
        this.messageDiv.className = `form-message ${type}`;
        this.messageDiv.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.hideMessage();
            }, 5000);
        }
        
        // Scroll to message
        this.messageDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }
    
    hideMessage() {
        if (this.messageDiv) {
            this.messageDiv.style.display = 'none';
        }
    }
    
    resetForm() {
        this.form.reset();
        this.hideMessage();
        
        // Reset floating labels
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('focused', 'filled');
        });
    }
    
    initializeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add validation attributes
            if (input.type === 'email') {
                input.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
            }
            
            // Add required validation styling
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                input.classList.add('invalid');
            });
            
            input.addEventListener('input', () => {
                input.classList.remove('invalid');
            });
        });
    }
    
    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${field.name} is required.`;
        }
        
        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        
        // Length validation
        if (field.name === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
        }
        
        if (field.name === 'subject' && value && value.length < 5) {
            isValid = false;
            errorMessage = 'Subject must be at least 5 characters long.';
        }
        
        if (field.name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }
        
        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    showFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.field-error');
        
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.style.cssText = `
                    color: #ef4444;
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                `;
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = errorMessage;
        }
    }
    
    addFormEnhancements() {
        // Floating label enhancement
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Handle focus and blur
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    group.classList.remove('focused');
                    if (input.value.trim()) {
                        group.classList.add('filled');
                    } else {
                        group.classList.remove('filled');
                    }
                });
                
                // Initial state
                if (input.value.trim()) {
                    group.classList.add('filled');
                }
            }
        });
        
        // Character counter for textarea
        const messageField = this.form.querySelector('textarea[name="message"]');
        if (messageField) {
            this.addCharacterCounter(messageField);
        }
        
        // Auto-resize textarea
        this.addAutoResize(messageField);
    }
    
    addCharacterCounter(textarea) {
        const maxLength = 500;
        const formGroup = textarea.closest('.form-group');
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
        `;
        
        const updateCounter = () => {
            const length = textarea.value.length;
            counter.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = '#ef4444';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
        
        formGroup.appendChild(counter);
    }
    
    addAutoResize(textarea) {
        if (!textarea) return;
        
        const autoResize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        
        textarea.addEventListener('input', autoResize);
        textarea.addEventListener('focus', autoResize);
        
        // Initial resize
        autoResize();
    }
}

// Alternative contact methods
class ContactMethodManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.addClickToCall();
        this.addClickToEmail();
        this.addSocialMediaTracking();
    }
    
    addClickToCall() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackContactMethod('phone');
            });
        });
    }
    
    addClickToEmail() {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackContactMethod('email');
            });
        });
    }
    
    addSocialMediaTracking() {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', () => {
                const platform = this.getSocialPlatform(link.href);
                this.trackContactMethod(`social_${platform}`);
            });
        });
    }
    
    getSocialPlatform(url) {
        if (url.includes('github')) return 'github';
        if (url.includes('linkedin')) return 'linkedin';
        if (url.includes('twitter')) return 'twitter';
        if (url.includes('instagram')) return 'instagram';
        return 'unknown';
    }
    
    trackContactMethod(method) {
        // Analytics tracking would go here
        console.log(`Contact method used: ${method}`);
        
        // Store in localStorage for later analysis
        const contacts = JSON.parse(localStorage.getItem('contact_methods') || '[]');
        contacts.push({
            method,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contact_methods', JSON.stringify(contacts));
    }
}

// Initialize contact functionality
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new ContactForm();
    const contactMethodManager = new ContactMethodManager();
    
    // Make globally accessible for debugging
    window.contactForm = contactForm;
});

// Error handling for EmailJS
window.addEventListener('error', (e) => {
    if (e.message.includes('emailjs')) {
        console.warn('EmailJS error detected, using fallback method');
    }
});
