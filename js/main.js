// Main JavaScript file for portfolio functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavbar();
    initializeTypingEffect();
    initializeSkillBars();
    initializeSwiper();
    initializeScrollSpy();
    initializeSmoothScroll();
    initializeNewsletterForm();
    initializeScrollToTop();
    addNotificationStyles();
    
    // Initialize animations with delay to ensure DOM is ready
    setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }, 100);
});

// Navbar functionality
function initializeNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            if (document.body.classList.contains('dark-mode')) {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            }
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            if (document.body.classList.contains('dark-mode')) {
                navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            }
        }
    });
}

// Typing effect for hero section
function initializeTypingEffect() {
    const titles = [
        'Problem Solver',
        'Full Stack Developer',
        'React Specialist',
        'Cloud Architect',
        'UI/UX Designer'
    ];
    
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function type() {
        const currentTitle = titles[titleIndex];
        
        if (isWaiting) {
            setTimeout(type, 2000);
            isWaiting = false;
            return;
        }
        
        if (isDeleting) {
            typedText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
            }
        } else {
            typedText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentTitle.length) {
                isDeleting = true;
                isWaiting = true;
            }
        }
        
        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typingSpeed);
    }
    
    // Start typing effect
    setTimeout(type, 1000);
}

// Initialize skill progress bars
function initializeSkillBars() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Skills Swiper
if (document.querySelector('.skills-swiper')) {
    new Swiper('.skills-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        grabCursor: true,
        pagination: {
            el: '.skills-swiper .swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        },
        on: {
            init: function () {
                this.slides.forEach((slide, index) => {
                    slide.style.opacity = '0';
                    slide.style.transform = 'translateY(50px)';
                    setTimeout(() => {
                        slide.style.transition = 'all 0.6s ease';
                        slide.style.opacity = '1';
                        slide.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        }
    });
}

// Initialize Swiper sliders
function initializeSwiper() {
    // Services Swiper
    if (document.querySelector('.services-swiper')) {
        new Swiper('.services-swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            pagination: {
                el: '.services-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            breakpoints: {
                640: {
                    slidesPerView: 1.5,
                    centeredSlides: true
                },
                768: {
                    slidesPerView: 2,
                    centeredSlides: false
                },
                1024: {
                    slidesPerView: 3,
                    centeredSlides: false
                }
            },
            on: {
                init: function() {
                    // Add entrance animation to slides
                    this.slides.forEach((slide, index) => {
                        slide.style.opacity = '0';
                        slide.style.transform = 'translateY(50px)';
                        setTimeout(() => {
                            slide.style.transition = 'all 0.6s ease';
                            slide.style.opacity = '1';
                            slide.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            }
        });
    }
    
    // Projects Swiper - Same style as Services
    if (document.querySelector('.projects-swiper')) {
        new Swiper('.projects-swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            grabCursor: true,
            pagination: {
                el: '.projects-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.projects-swiper-button-next',
                prevEl: '.projects-swiper-button-prev',
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            speed: 800,
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            },
            on: {
                init: function() {
                    this.slides.forEach((slide, index) => {
                        slide.style.opacity = '0';
                        slide.style.transform = 'translateY(50px)';
                        setTimeout(() => {
                            slide.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                            slide.style.opacity = '1';
                            slide.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            }
        });
    }
    
    // Coding Swiper
    if (document.querySelector('.coding-swiper')) {
        new Swiper('.coding-swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            pagination: {
                el: '.coding-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            autoplay: {
                delay: 3500,
                disableOnInteraction: false
            },
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            },
            breakpoints: {
                640: {
                    slidesPerView: 1.5,
                    centeredSlides: true
                },
                768: {
                    slidesPerView: 2,
                    centeredSlides: true,
                    effect: 'slide'
                },
                1024: {
                    slidesPerView: 3,
                    centeredSlides: true,
                    effect: 'slide'
                }
            }
        });
    }
}

// Scroll spy for navigation
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = e.target.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                // Simulate newsletter subscription
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                e.target.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Utility functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Download Resume Function
function downloadResume() {
    // Create a mock PDF content
    const resumeContent = `
Dipan Pramanik - Full Stack Developer Resume

Contact Information:
Email: dipan.pramanik@email.com
Phone: +91 98765 43210
Location: Mumbai, India

Education:
B.Tech in Computer Science & Engineering
Meghnad Saha Institute Of Technology (2020-2024)
CGPA: 9.38

Skills:
• Frontend: React.js, Next.js, Vue.js, JavaScript, TypeScript
• Backend: Node.js, Python, Java, Express.js
• Database: MongoDB, PostgreSQL, MySQL
• Cloud: AWS, Google Cloud, Docker

Experience:
5+ years of Full Stack Development
50+ Projects Completed
100+ Satisfied Clients
    `;
    
    // Create a blob with the content
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dipan_Pramanik_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('Resume downloaded successfully!', 'success');
}

// Scroll to Top Button
function initializeScrollToTop() {
    const scrollButton = document.getElementById('scroll-to-top');
    
    if (scrollButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Add notification styles dynamically
function addNotificationStyles() {
    const notificationStyles = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification {
            animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    const closeNotification = () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeNotification);
    
    // Auto close after 5 seconds
    setTimeout(closeNotification, 5000);
}

// Intersection Observer for fade-in animations
function initializeFadeInAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
}

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling for external libraries
window.addEventListener('error', (e) => {
    console.warn('An error occurred:', e.message);
    // Graceful degradation - continue without the failed feature
});

// Initialize additional features when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFadeInAnimation();
    initializeLazyLoading();
});
