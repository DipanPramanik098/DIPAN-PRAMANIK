// ===== Configuration & Constants =====
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const DELAY_BETWEEN_WORDS = 1500;

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceID: 'service_trxi8v2',
    templateID: 'template_66s36bx',
    publicKey: 'xKNjPO8dPjdqHuiSW'
};

// Dynamic text options
const DYNAMIC_TEXTS = ['Full Stack Web Developer', 'Machine Learning Enthusiast', 'Problem Solver', 'Tech Explorer'];

// ===== Global Variables =====
let currentTextIndex = 0;
let currentCharIndex = 0;
let isErasing = false;
let typingInterval;

// ===== DOM Elements =====
const elements = {
    loader: document.getElementById('loader'),
    navbar: document.getElementById('navbar'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('nav-menu'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    typingText: document.getElementById('typing-text'),
    contactForm: document.getElementById('contact-form'),
    popup: document.getElementById('popup'),
    popupIcon: document.getElementById('popup-icon'),
    popupTitle: document.getElementById('popup-title'),
    popupMessage: document.getElementById('popup-message')
};

// ===== Utility Functions =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
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
};

// ===== Loading Screen =====
const hideLoader = () => {
    elements.loader.classList.add('hidden');
    setTimeout(() => {
        elements.loader.style.display = 'none';
        document.body.style.overflow = 'visible';
    }, 500);
};

// ===== Theme Management =====
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        elements.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    updateThemeIcon() {
        elements.themeIcon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ===== Navigation Management =====
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavLinks();
        this.setupStickyNavbar();
    }

    setupMobileMenu() {
        elements.hamburger.addEventListener('click', () => {
            elements.hamburger.classList.toggle('active');
            elements.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav link
        elements.navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                elements.hamburger.classList.remove('active');
                elements.navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.navbar.contains(e.target)) {
                elements.hamburger.classList.remove('active');
                elements.navMenu.classList.remove('active');
            }
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const updateActiveNavLink = throttle(() => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', updateActiveNavLink);
        updateActiveNavLink(); // Initial call
    }

    setupStickyNavbar() {
        const handleScroll = throttle(() => {
            if (window.scrollY > 100) {
                elements.navbar.style.background = 
                    document.documentElement.getAttribute('data-theme') === 'dark'
                        ? 'rgba(26, 26, 26, 0.98)'
                        : 'rgba(255, 255, 255, 0.98)';
            } else {
                elements.navbar.style.background = 
                    document.documentElement.getAttribute('data-theme') === 'dark'
                        ? 'rgba(26, 26, 26, 0.95)'
                        : 'rgba(255, 255, 255, 0.95)';
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== Text Animation =====
class TextAnimator {
    constructor() {
        this.init();
    }

    init() {
        this.startTypingAnimation();
    }

    startTypingAnimation() {
        typingInterval = setInterval(() => {
            this.updateText();
        }, TYPING_SPEED);
    }

    updateText() {
        const currentText = DYNAMIC_TEXTS[currentTextIndex];
        
        if (!isErasing && currentCharIndex <= currentText.length) {
            elements.typingText.textContent = currentText.substring(0, currentCharIndex);
            currentCharIndex++;
            
            if (currentCharIndex > currentText.length) {
                isErasing = true;
                clearInterval(typingInterval);
                setTimeout(() => {
                    typingInterval = setInterval(() => {
                        this.updateText();
                    }, ERASING_SPEED);
                }, DELAY_BETWEEN_WORDS);
            }
        } else if (isErasing && currentCharIndex >= 0) {
            elements.typingText.textContent = currentText.substring(0, currentCharIndex);
            currentCharIndex--;
            
            if (currentCharIndex < 0) {
                isErasing = false;
                currentTextIndex = (currentTextIndex + 1) % DYNAMIC_TEXTS.length;
                clearInterval(typingInterval);
                setTimeout(() => {
                    typingInterval = setInterval(() => {
                        this.updateText();
                    }, TYPING_SPEED);
                }, 500);
            }
        }
    }
}

// ===== Swiper Initialization =====
class SwiperManager {
    constructor() {
        this.init();
    }

    init() {
        this.initSkillsSwiper();
        this.initServicesSwiper();
        this.initProjectsSwiper();
        this.initCodingSwiper();
    }

    initSkillsSwiper() {
        new Swiper('.skills-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.skills-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    initServicesSwiper() {
        new Swiper('.services-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.services-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    initProjectsSwiper() {
        new Swiper('.projects-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.projects-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    initCodingSwiper() {
        new Swiper('.coding-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.coding-swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 4,
                }
            }
        });
    }
}

// ===== Animations =====
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.animateProgressBars();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('section, .skill-card, .service-card, .project-card, .coding-card, .education-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupScrollAnimations() {
        const elements = document.querySelectorAll('[data-aos]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-aos');
                    const delay = element.getAttribute('data-aos-delay') || 0;
                    
                    setTimeout(() => {
                        element.classList.add(`animate-${animationType}`);
                    }, delay);
                    
                    observer.unobserve(element);
                }
            });
        });

        elements.forEach(el => observer.observe(el));
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.getAttribute('data-progress');
                    progressBar.style.setProperty('--progress', progress + '%');
                    observer.unobserve(progressBar);
                }
            });
        });

        progressBars.forEach(bar => observer.observe(bar));
    }
}

// ===== Contact Form Management =====
class ContactFormManager {
    constructor() {
        this.init();
    }

    init() {
        // Initialize EmailJS
        emailjs.init(EMAILJS_CONFIG.publicKey);
        
        // Setup form submission
        elements.contactForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(elements.contactForm);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Show loading state
        const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            await emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                templateParams
            );

            this.showPopup('success', 'Message Sent!', 'Thank you for your message. I will get back to you soon!');
            elements.contactForm.reset();
        } catch (error) {
            console.error('EmailJS Error:', error);
            this.showPopup('error', 'Message Failed!', 'Sorry, there was an error sending your message. Please try again later or contact me directly.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showPopup(type, title, message) {
        elements.popupIcon.className = `popup-icon ${type}`;
        elements.popupIcon.innerHTML = type === 'success' ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
        elements.popupTitle.textContent = title;
        elements.popupMessage.textContent = message;
        elements.popup.classList.add('show');
    }
}

// ===== Popup Management =====
window.closePopup = () => {
    elements.popup.classList.remove('show');
};

// Close popup when clicking outside
elements.popup.addEventListener('click', (e) => {
    if (e.target === elements.popup) {
        closePopup();
    }
});

// ===== Resume Download =====
window.downloadResume = () => {
    // Direct download link (replace with your correct one)
    const directDownloadLink = 'https://drive.google.com/uc?export=download&id=1QOLiTlB5onxOSLWqKz9AHKH7FB1f4_JM';

    const element = document.createElement('a');
    element.href = directDownloadLink;
    element.download = 'Dipan_Pramanik_Resume.pdf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};


// ===== Scroll to Top Button =====
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Show/hide scroll to top button
window.addEventListener('scroll', throttle(() => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
}, 100));

// Scroll to top function
window.scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// ===== Performance Optimizations =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        // Lazy load images when they come into view
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload critical fonts and resources
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap';
        link.as = 'style';
        document.head.appendChild(link);
    }
}

// ===== Accessibility Enhancements =====
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaAttributes();
    }

    setupKeyboardNavigation() {
        // Handle Escape key for closing mobile menu and popups
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                elements.hamburger.classList.remove('active');
                elements.navMenu.classList.remove('active');
                closePopup();
            }
        });
    }

    setupFocusManagement() {
        // Trap focus within mobile menu when open
        elements.navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && elements.navMenu.classList.contains('active')) {
                const focusableElements = elements.navMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    setupAriaAttributes() {
        // Add aria-labels and roles for better screen reader support
        elements.themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
        elements.hamburger.setAttribute('aria-label', 'Toggle mobile menu');
        elements.hamburger.setAttribute('aria-expanded', 'false');

        // Update aria-expanded when mobile menu toggles
        const observer = new MutationObserver(() => {
            const isActive = elements.hamburger.classList.contains('active');
            elements.hamburger.setAttribute('aria-expanded', isActive.toString());
        });

        observer.observe(elements.hamburger, { attributes: true, attributeFilter: ['class'] });
    }
}

// ===== Error Handling =====
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', this.handleError);
        window.addEventListener('unhandledrejection', this.handlePromiseRejection);
    }

    handleError(error) {
        console.error('Application Error:', error);
        // In a production environment, you might want to send this to a logging service
    }

    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        event.preventDefault();
    }
}

// ===== Application Initialization =====
class App {
    constructor() {
        this.managers = {};
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize all managers
            this.managers.theme = new ThemeManager();
            this.managers.navigation = new NavigationManager();
            this.managers.textAnimator = new TextAnimator();
            this.managers.animation = new AnimationManager();
            this.managers.contactForm = new ContactFormManager();
            this.managers.performance = new PerformanceOptimizer();
            this.managers.accessibility = new AccessibilityManager();
            this.managers.errorHandler = new ErrorHandler();

            // Initialize Swiper after a short delay to ensure DOM is ready
            setTimeout(() => {
                this.managers.swiper = new SwiperManager();
            }, 100);

            // Hide loader after initialization
            setTimeout(hideLoader, 1000);

            console.log('🚀 Portfolio application initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            hideLoader(); // Hide loader even if initialization fails
        }
    }
}

// ===== Application Start =====
const app = new App();

// ===== Additional Event Listeners =====

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('.swiper').forEach(swiper => {
            if (swiper.swiper && swiper.swiper.autoplay) {
                swiper.swiper.autoplay.stop();
            }
        });
    } else {
        // Resume animations when page becomes visible
        document.querySelectorAll('.swiper').forEach(swiper => {
            if (swiper.swiper && swiper.swiper.autoplay) {
                swiper.swiper.autoplay.start();
            }
        });
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('🌐 Connection restored');
});

window.addEventListener('offline', () => {
    console.log('📡 Connection lost');
});

// Add smooth reveal animations on scroll
const revealElements = document.querySelectorAll('.skill-card, .service-card, .project-card, .coding-card');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});
