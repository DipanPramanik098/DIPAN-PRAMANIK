// Theme management for dark/light mode toggle

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.body = document.body;
        this.themeKey = 'portfolio-theme';
        
        this.init();
    }
    
    init() {
        // Load saved theme or default to light
        this.loadTheme();
        
        // Add event listener for theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        this.watchSystemTheme();
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        const theme = savedTheme || systemTheme;
        
        if (theme === 'dark') {
            this.setDarkMode();
        } else {
            this.setLightMode();
        }
    }
    
    toggleTheme() {
        const isDark = this.body.classList.contains('dark-mode');
        
        if (isDark) {
            this.setLightMode();
        } else {
            this.setDarkMode();
        }
        
        // Add toggle animation
        this.animateToggle();
    }
    
    setDarkMode() {
        this.body.classList.add('dark-mode');
        this.updateToggleIcon('sun');
        localStorage.setItem(this.themeKey, 'dark');
        
        // Update theme-color meta tag for mobile browsers
        this.updateThemeColor('#0f172a');
        
        // Dispatch custom event for other components
        this.dispatchThemeChange('dark');
    }
    
    setLightMode() {
        this.body.classList.remove('dark-mode');
        this.updateToggleIcon('moon');
        localStorage.setItem(this.themeKey, 'light');
        
        // Update theme-color meta tag for mobile browsers
        this.updateThemeColor('#f9fafb');
        
        // Dispatch custom event for other components
        this.dispatchThemeChange('light');
    }
    
    updateToggleIcon(icon) {
        if (!this.themeToggle) return;
        
        const iconElement = this.themeToggle.querySelector('i');
        if (iconElement) {
            iconElement.className = icon === 'sun' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    updateThemeColor(color) {
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        
        metaTheme.content = color;
    }
    
    animateToggle() {
        if (!this.themeToggle) return;
        
        // Add rotation animation
        this.themeToggle.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 300);
        
        // Add ripple effect
        this.createRippleEffect();
    }
    
    createRippleEffect() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: var(--accent);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
            opacity: 0.3;
        `;
        
        // Add ripple animation keyframes if not exists
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.themeToggle.style.position = 'relative';
        this.themeToggle.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem(this.themeKey)) {
                if (e.matches) {
                    this.setDarkMode();
                } else {
                    this.setLightMode();
                }
            }
        });
    }
    
    dispatchThemeChange(theme) {
        const event = new CustomEvent('themechange', {
            detail: { theme }
        });
        window.dispatchEvent(event);
    }
    
    getCurrentTheme() {
        return this.body.classList.contains('dark-mode') ? 'dark' : 'light';
    }
}

// Advanced theme features
class ThemeEnhancer {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.init();
    }
    
    init() {
        // Listen for theme changes
        window.addEventListener('themechange', (e) => {
            this.onThemeChange(e.detail.theme);
        });
        
        // Initialize theme-specific features
        this.initThemeSpecificFeatures();
    }
    
    onThemeChange(theme) {
        // Update charts and visualizations
        this.updateChartThemes(theme);
        
        // Update syntax highlighting
        this.updateSyntaxHighlighting(theme);
        
        // Update third-party components
        this.updateThirdPartyComponents(theme);
        
        // Smooth transition animation
        this.animateThemeTransition();
    }
    
    updateChartThemes(theme) {
        // Update any charts or data visualizations
        const charts = document.querySelectorAll('[data-chart]');
        charts.forEach(chart => {
            // This would update chart themes if using Chart.js or similar
            if (chart.chart) {
                const newTheme = theme === 'dark' ? 'dark' : 'light';
                chart.chart.options.theme = newTheme;
                chart.chart.update();
            }
        });
    }
    
    updateSyntaxHighlighting(theme) {
        // Update code syntax highlighting themes
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            block.className = block.className.replace(/(hljs-[a-z-]+)/g, '');
            block.classList.add(`hljs-${theme}`);
        });
    }
    
    updateThirdPartyComponents(theme) {
        // Update Swiper pagination colors
        const swiperPagination = document.querySelectorAll('.swiper-pagination-bullet');
        swiperPagination.forEach(bullet => {
            bullet.style.backgroundColor = theme === 'dark' ? '#94a3b8' : '#4b5563';
        });
        
        // Update any embedded maps or iframes
        const embeds = document.querySelectorAll('[data-theme-aware]');
        embeds.forEach(embed => {
            embed.setAttribute('data-theme', theme);
        });
    }
    
    animateThemeTransition() {
        // Add smooth transition effect to the entire page
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--accent);
            opacity: 0;
            z-index: 9998;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Flash effect
        setTimeout(() => {
            overlay.style.opacity = '0.1';
        }, 50);
        
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 150);
        
        setTimeout(() => {
            overlay.remove();
        }, 450);
    }
    
    initThemeSpecificFeatures() {
        // Add theme-specific CSS custom properties
        this.addThemeCustomProperties();
        
        // Initialize theme-aware components
        this.initThemeAwareComponents();
    }
    
    addThemeCustomProperties() {
        const style = document.createElement('style');
        style.id = 'theme-custom-properties';
        style.textContent = `
            .dark-mode {
                --glow-color: rgba(56, 189, 248, 0.3);
                --card-hover: rgba(56, 189, 248, 0.1);
            }
            
            body:not(.dark-mode) {
                --glow-color: rgba(0, 188, 212, 0.3);
                --card-hover: rgba(0, 188, 212, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    initThemeAwareComponents() {
        // Add glow effects to interactive elements
        const interactiveElements = document.querySelectorAll('button, .card, .project-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = `0 0 20px var(--glow-color)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
            });
        });
    }
}

// Theme accessibility features
class ThemeAccessibility {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.init();
    }
    
    init() {
        // Add keyboard navigation for theme toggle
        this.addKeyboardSupport();
        
        // Add high contrast mode
        this.initHighContrastMode();
        
        // Add reduced motion support
        this.initReducedMotion();
    }
    
    addKeyboardSupport() {
        if (this.themeManager.themeToggle) {
            this.themeManager.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.themeManager.toggleTheme();
                }
            });
            
            // Make sure the button is focusable
            this.themeManager.themeToggle.setAttribute('tabindex', '0');
            this.themeManager.themeToggle.setAttribute('role', 'button');
            this.themeManager.themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        }
    }
    
    initHighContrastMode() {
        // Detect high contrast preference
        const highContrastMedia = window.matchMedia('(prefers-contrast: high)');
        
        const applyHighContrast = (matches) => {
            if (matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        };
        
        applyHighContrast(highContrastMedia.matches);
        highContrastMedia.addEventListener('change', (e) => applyHighContrast(e.matches));
    }
    
    initReducedMotion() {
        // Respect user's reduced motion preference
        const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const applyReducedMotion = (matches) => {
            if (matches) {
                document.body.classList.add('reduced-motion');
                
                // Disable auto-playing animations
                const autoplayElements = document.querySelectorAll('[data-autoplay]');
                autoplayElements.forEach(element => {
                    element.removeAttribute('data-autoplay');
                });
            }
        };
        
        applyReducedMotion(reducedMotionMedia.matches);
        reducedMotionMedia.addEventListener('change', (e) => applyReducedMotion(e.matches));
    }
}

// Initialize theme management when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    const themeEnhancer = new ThemeEnhancer(themeManager);
    const themeAccessibility = new ThemeAccessibility(themeManager);
    
    // Make theme manager globally accessible
    window.themeManager = themeManager;
});
