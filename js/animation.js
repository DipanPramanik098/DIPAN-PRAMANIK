// Advanced animations and visual effects for the portfolio

class AnimationManager {
    constructor() {
        this.isReducedMotion = false;
        this.scrollY = 0;
        this.ticking = false;
        this.animations = new Map();
        this.intersectionObserver = null;
        
        this.init();
    }
    
    init() {
        // Check for reduced motion preference
        this.checkReducedMotion();
        
        // Initialize AOS with custom configuration
        this.initializeAOS();
        
        // Initialize custom animations
        this.initializeCustomAnimations();
        
        // Initialize scroll-based animations
        this.initializeScrollAnimations();
        
        // Initialize particle systems
        this.initializeParticleEffects();
        
        // Initialize micro-interactions
        this.initializeMicroInteractions();
        
        // Initialize performance optimizations
        this.initializePerformanceOptimizations();
        
        // Listen for theme changes
        this.initializeThemeAnimations();
    }
    
    checkReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.isReducedMotion = mediaQuery.matches;
        
        mediaQuery.addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            this.updateAnimationsForMotionPreference();
        });
    }
    
    initializeAOS() {
        if (typeof AOS !== 'undefined' && !this.isReducedMotion) {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 120,
                delay: 0,
                anchorPlacement: 'top-bottom',
                disable: false,
                startEvent: 'DOMContentLoaded',
                initClassName: 'aos-init',
                animatedClassName: 'aos-animate',
                useClassNames: false,
                disableMutationObserver: false,
                debounceDelay: 50,
                throttleDelay: 99
            });
            
            // Custom AOS animations
            this.addCustomAOSAnimations();
        }
    }
    
    addCustomAOSAnimations() {
        // Add custom CSS for additional AOS animations
        const customAOSStyles = `
            [data-aos="slide-up-bounce"] {
                transform: translateY(100px);
                opacity: 0;
                transition-property: transform, opacity;
            }
            
            [data-aos="slide-up-bounce"].aos-animate {
                transform: translateY(0);
                opacity: 1;
                animation: bounceIn 0.8s ease-out;
            }
            
            [data-aos="scale-rotate"] {
                transform: scale(0.5) rotate(-180deg);
                opacity: 0;
                transition-property: transform, opacity;
            }
            
            [data-aos="scale-rotate"].aos-animate {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
            
            [data-aos="flip-left"] {
                transform: perspective(400px) rotateY(-90deg);
                opacity: 0;
                transition-property: transform, opacity;
            }
            
            [data-aos="flip-left"].aos-animate {
                transform: perspective(400px) rotateY(0deg);
                opacity: 1;
            }
            
            [data-aos="elastic-in"] {
                transform: scale(0);
                opacity: 0;
                transition-property: transform, opacity;
            }
            
            [data-aos="elastic-in"].aos-animate {
                transform: scale(1);
                opacity: 1;
                animation: elasticIn 1s ease-out;
            }
            
            @keyframes bounceIn {
                0% { transform: translateY(100px); }
                60% { transform: translateY(-10px); }
                80% { transform: translateY(5px); }
                100% { transform: translateY(0); }
            }
            
            @keyframes elasticIn {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = customAOSStyles;
        document.head.appendChild(styleSheet);
    }
    
    initializeCustomAnimations() {
        // Typing animation enhancement
        this.enhanceTypingAnimation();
        
        // Progress bar animations
        this.initializeProgressBarAnimations();
        
        // Card hover animations
        this.initializeCardAnimations();
        
        // Navigation animations
        this.initializeNavigationAnimations();
        
        // Button animations
        this.initializeButtonAnimations();
    }
    
    enhanceTypingAnimation() {
        const typedElement = document.getElementById('typed-text');
        if (!typedElement) return;
        
        // Add blinking cursor animation
        const cursorElement = document.querySelector('.cursor');
        if (cursorElement && !this.isReducedMotion) {
            cursorElement.style.animation = 'blink 1s infinite';
        }
        
        // Add typewriter sound effect (optional)
        this.addTypewriterEffect(typedElement);
    }
    
    addTypewriterEffect(element) {
        if (this.isReducedMotion) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Add subtle visual feedback on text change
                    element.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 100);
                }
            });
        });
        
        observer.observe(element, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
    
    initializeProgressBarAnimations() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const animateProgressBar = (bar) => {
            if (this.isReducedMotion) {
                bar.style.width = bar.getAttribute('data-width');
                return;
            }
            
            const targetWidth = bar.getAttribute('data-width');
            const duration = 2000;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out-cubic)
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentWidth = parseInt(targetWidth) * eased;
                
                bar.style.width = currentWidth + '%';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        };
        
        // Observe progress bars for intersection
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress-bar');
                    if (progressBar) {
                        setTimeout(() => animateProgressBar(progressBar), 300);
                    }
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.skill-item').forEach(item => {
            progressObserver.observe(item);
        });
    }
    
    initializeCardAnimations() {
        const cards = document.querySelectorAll('.service-card, .project-card, .coding-card');
        
        cards.forEach(card => {
            if (this.isReducedMotion) return;
            
            // Add magnetic effect
            this.addMagneticEffect(card);
            
            // Add tilt effect
            this.addTiltEffect(card);
            
            // Add glow effect
            this.addGlowEffect(card);
        });
    }
    
    addMagneticEffect(element) {
        let isHovering = false;
        
        element.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        element.addEventListener('mouseleave', () => {
            isHovering = false;
            element.style.transform = '';
        });
        
        element.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const rotateX = deltaY * -10;
            const rotateY = deltaX * 10;
            const translateX = deltaX * 5;
            const translateY = deltaY * 5;
            
            element.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateX(${translateX}px) 
                translateY(${translateY}px)
                scale(1.02)
            `;
        });
    }
    
    addTiltEffect(element) {
        element.addEventListener('mouseenter', () => {
            if (this.isReducedMotion) return;
            element.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    }
    
    addGlowEffect(element) {
        element.addEventListener('mouseenter', () => {
            if (this.isReducedMotion) return;
            element.style.boxShadow = '0 0 30px var(--glow-color, rgba(56, 189, 248, 0.3))';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
        });
    }
    
    initializeScrollAnimations() {
        // Parallax effects for background elements
        this.initializeParallax();
        
        // Scroll-triggered counters
        this.initializeCounters();
        
        // Progress indicators
        this.initializeScrollProgress();
        
        // Reveal animations
        this.initializeRevealAnimations();
    }
    
    initializeParallax() {
        if (this.isReducedMotion) return;
        
        const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.scrollY = window.pageYOffset;
                    
                    parallaxElements.forEach((element, index) => {
                        const speed = 0.5 + (index * 0.1);
                        const yPos = -(this.scrollY * speed);
                        element.style.transform = `translateY(${yPos}px)`;
                    });
                    
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
    
    initializeCounters() {
        const counters = document.querySelectorAll('.stat-item h3, .stat-number');
        
        const animateCounter = (element) => {
            if (this.isReducedMotion) return;
            
            const target = parseInt(element.textContent.replace(/\D/g, ''));
            if (isNaN(target)) return;
            
            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const eased = progress * (2 - progress);
                const currentValue = Math.floor(startValue + (target - startValue) * eased);
                
                const originalText = element.textContent;
                const suffix = originalText.replace(/[\d,]/g, '');
                element.textContent = currentValue.toLocaleString() + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = originalText; // Restore original format
                }
            };
            
            requestAnimationFrame(animate);
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    initializeScrollProgress() {
        if (this.isReducedMotion) return;
        
        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--accent), var(--accent-hover));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            progressBar.style.width = scrolled + '%';
        });
    }
    
    initializeRevealAnimations() {
        const revealElements = document.querySelectorAll('.section-header, .project-card, .service-card');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    if (!this.isReducedMotion) {
                        entry.target.style.animationDelay = `${index * 100}ms`;
                        entry.target.classList.add('revealed');
                    }
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        revealElements.forEach(element => {
            if (!this.isReducedMotion) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
            revealObserver.observe(element);
        });
        
        // Add CSS for revealed state
        const revealStyles = `
            .revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = revealStyles;
        document.head.appendChild(styleSheet);
    }
    
    initializeParticleEffects() {
        if (this.isReducedMotion) return;
        
        // Add interactive particle system to hero section
        this.createParticleSystem();
        
        // Add mouse trail effect
        this.createMouseTrail();
    }
    
    createParticleSystem() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        hero.appendChild(particleContainer);
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            this.createParticle(particleContainer);
        }
        
        // Animate particles
        this.animateParticles(particleContainer);
    }
    
    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--accent);
            border-radius: 50%;
            opacity: 0.6;
            animation: float ${5 + Math.random() * 10}s linear infinite;
        `;
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        container.appendChild(particle);
        return particle;
    }
    
    animateParticles(container) {
        const particles = container.querySelectorAll('.particle');
        
        particles.forEach(particle => {
            const animateParticle = () => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                const duration = 5000 + Math.random() * 10000;
                
                particle.animate([
                    { transform: `translate(${x}px, ${y}px)` },
                    { transform: `translate(${x + (Math.random() - 0.5) * 200}px, ${y + (Math.random() - 0.5) * 200}px)` }
                ], {
                    duration: duration,
                    easing: 'ease-in-out',
                    iterations: Infinity,
                    direction: 'alternate'
                });
            };
            
            animateParticle();
        });
    }
    
    createMouseTrail() {
        let mouseX = 0;
        let mouseY = 0;
        const trail = [];
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Create trail dot
            const dot = document.createElement('div');
            dot.className = 'mouse-trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--accent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                opacity: 0.7;
                left: ${mouseX}px;
                top: ${mouseY}px;
                transform: translate(-50%, -50%);
                transition: opacity 0.5s ease;
            `;
            
            document.body.appendChild(dot);
            trail.push(dot);
            
            // Limit trail length
            if (trail.length > 10) {
                const oldDot = trail.shift();
                if (oldDot && oldDot.parentNode) {
                    oldDot.style.opacity = '0';
                    setTimeout(() => {
                        if (oldDot.parentNode) {
                            oldDot.parentNode.removeChild(oldDot);
                        }
                    }, 500);
                }
            }
        });
    }
    
    initializeMicroInteractions() {
        // Button press effects
        this.initializeButtonPressEffects();
        
        // Input focus effects
        this.initializeInputEffects();
        
        // Link hover effects
        this.initializeLinkEffects();
        
        // Social media hover effects
        this.initializeSocialEffects();
    }
    
    initializeButtonPressEffects() {
        const buttons = document.querySelectorAll('button, .cta-button, .project-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (this.isReducedMotion) return;
                
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });
        
        // Add ripple animation CSS
        const rippleStyles = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = rippleStyles;
        document.head.appendChild(styleSheet);
    }
    
    initializeInputEffects() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (this.isReducedMotion) return;
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 20px var(--glow-color, rgba(56, 189, 248, 0.2))';
            });
            
            input.addEventListener('blur', () => {
                input.style.transform = '';
                input.style.boxShadow = '';
            });
        });
    }
    
    initializeLinkEffects() {
        const links = document.querySelectorAll('a:not(.social-link)');
        
        links.forEach(link => {
            if (this.isReducedMotion) return;
            
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateX(5px)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });
    }
    
    initializeSocialEffects() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            if (this.isReducedMotion) return;
            
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px) scale(1.1)';
                link.style.boxShadow = '0 5px 15px var(--shadow-hover)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
                link.style.boxShadow = '';
            });
        });
    }
    
    initializeNavigationAnimations() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach((link, index) => {
            if (this.isReducedMotion) return;
            
            link.style.animationDelay = `${index * 100}ms`;
            link.classList.add('nav-fade-in');
        });
        
        // Add navigation animation styles
        const navStyles = `
            .nav-fade-in {
                animation: navFadeIn 0.6s ease-out both;
            }
            
            @keyframes navFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = navStyles;
        document.head.appendChild(styleSheet);
    }
    
    initializeButtonAnimations() {
        const buttons = document.querySelectorAll('button, .cta-button, .project-btn');
        
        buttons.forEach(button => {
            if (this.isReducedMotion) return;
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.05)';
                button.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
                button.style.boxShadow = '';
            });
            
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(0) scale(0.98)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-2px) scale(1.05)';
            });
        });
    }
    
    initializePerformanceOptimizations() {
        // Use Intersection Observer for performance
        this.setupIntersectionObserver();
        
        // Debounce scroll events
        this.setupScrollOptimization();
        
        // Optimize animations for mobile
        this.optimizeForMobile();
    }
    
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                } else {
                    entry.target.classList.remove('in-viewport');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe all animated elements
        document.querySelectorAll('[data-aos], .service-card, .project-card').forEach(el => {
            this.intersectionObserver.observe(el);
        });
    }
    
    setupScrollOptimization() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                // Perform scroll-based optimizations
                this.optimizeAnimationsOnScroll();
            }, 100);
        }, { passive: true });
    }
    
    optimizeAnimationsOnScroll() {
        const scrollTop = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        
        // Pause animations for elements far from viewport
        document.querySelectorAll('.animated-element').forEach(element => {
            const rect = element.getBoundingClientRect();
            const isNearViewport = rect.top < viewportHeight * 2 && rect.bottom > -viewportHeight;
            
            if (!isNearViewport) {
                element.style.animationPlayState = 'paused';
            } else {
                element.style.animationPlayState = 'running';
            }
        });
    }
    
    optimizeForMobile() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Reduce animation complexity on mobile
            document.body.classList.add('mobile-optimized');
            
            // Disable expensive effects
            const expensiveEffects = document.querySelectorAll('.particle-container, .mouse-trail-dot');
            expensiveEffects.forEach(effect => {
                effect.style.display = 'none';
            });
        }
    }
    
    initializeThemeAnimations() {
        window.addEventListener('themechange', (e) => {
            this.animateThemeTransition(e.detail.theme);
        });
    }
    
    animateThemeTransition(theme) {
        if (this.isReducedMotion) return;
        
        // Create smooth color transition effect
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${theme === 'dark' ? '#0f172a' : '#f9fafb'};
            opacity: 0;
            z-index: 9997;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '0.8';
        }, 50);
        
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 200);
        
        setTimeout(() => {
            overlay.remove();
        }, 500);
    }
    
    updateAnimationsForMotionPreference() {
        if (this.isReducedMotion) {
            // Disable animations
            document.body.classList.add('reduced-motion');
            
            // Stop all running animations
            document.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
            
            // Hide particle effects
            const particles = document.querySelectorAll('.particle-container, .mouse-trail-dot');
            particles.forEach(particle => {
                particle.style.display = 'none';
            });
        } else {
            document.body.classList.remove('reduced-motion');
            // Re-enable animations
            this.init();
        }
    }
    
    // Public methods for external control
    pauseAllAnimations() {
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }
    
    resumeAllAnimations() {
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
    
    refreshAnimations() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    destroy() {
        // Clean up event listeners and observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Remove created elements
        const createdElements = document.querySelectorAll(
            '.scroll-progress, .particle-container, .mouse-trail-dot'
        );
        createdElements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const animationManager = new AnimationManager();
    
    // Make globally accessible for debugging and control
    window.animationManager = animationManager;
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            animationManager.pauseAllAnimations();
        } else {
            animationManager.resumeAllAnimations();
        }
    });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}
