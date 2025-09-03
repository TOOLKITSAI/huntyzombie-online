/**
 * HUNTY ZOMBIE - Main Application JavaScript
 * Core functionality and interactions
 */

// =============================================
// Global Configuration
// =============================================
const CONFIG = {
    API_ENDPOINTS: {
        CODES: '/api/codes',
        STATS: '/api/stats',
        NEWS: '/api/news'
    },
    CACHE_DURATION: 3600000, // 1 hour in milliseconds
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
    SCROLL_OFFSET: 80
};

// =============================================
// DOM Elements Cache
// =============================================
const DOM = {
    navbar: null,
    mobileMenuBtn: null,
    navMenu: null,
    backToTop: null,
    langBtn: null,
    langDropdown: null,
    themeToggle: null,
    toastContainer: null,
    codesGrid: null,
    copyBtns: null
};

// =============================================
// Application State
// =============================================
const STATE = {
    currentLang: 'en',
    theme: 'dark',
    isMobileMenuOpen: false,
    isLangDropdownOpen: false,
    scrollPosition: 0,
    activeCodes: [],
    copiedCodes: new Set()
};

// =============================================
// Initialize Application
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    initializeEventListeners();
    initializeScrollEffects();
    initializeCounters();
    initializeCodeSystem();
    initializeParticles();
    loadUserPreferences();
    checkURLParams();
    initializeTooltips();
    initializeLazyLoading();
});

// =============================================
// DOM Initialization
// =============================================
function initializeDOMElements() {
    DOM.navbar = document.getElementById('navbar');
    DOM.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    DOM.navMenu = document.getElementById('navMenu');
    DOM.backToTop = document.getElementById('backToTop');
    DOM.langBtn = document.getElementById('langBtn');
    DOM.langDropdown = document.getElementById('langDropdown');
    DOM.themeToggle = document.getElementById('themeToggle');
    DOM.toastContainer = document.getElementById('toastContainer');
    DOM.codesGrid = document.getElementById('codesGrid');
    DOM.copyBtns = document.querySelectorAll('.copy-btn');
}

// =============================================
// Event Listeners
// =============================================
function initializeEventListeners() {
    // Mobile Menu Toggle
    if (DOM.mobileMenuBtn) {
        DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Language Dropdown
    if (DOM.langBtn) {
        DOM.langBtn.addEventListener('click', toggleLanguageDropdown);
    }

    // Theme Toggle
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }

    // Back to Top
    if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', scrollToTop);
    }

    // Initialize code filters
    initializeCodeFilters();
    
    // Initialize copy buttons (using enhanced version only)
    initializeCodeCopyButtons();

    // Close dropdowns on outside click
    document.addEventListener('click', handleOutsideClick);

    // Handle escape key
    document.addEventListener('keydown', handleEscapeKey);

    // Window resize
    window.addEventListener('resize', debounce(handleResize, 250));
}

// =============================================
// Mobile Menu Functions
// =============================================
function toggleMobileMenu() {
    STATE.isMobileMenuOpen = !STATE.isMobileMenuOpen;
    
    if (DOM.navMenu) {
        DOM.navMenu.classList.toggle('active');
    }
    
    if (DOM.mobileMenuBtn) {
        const icon = DOM.mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = STATE.isMobileMenuOpen ? 'hidden' : '';
}

// =============================================
// Language Functions
// =============================================
function toggleLanguageDropdown(e) {
    e.stopPropagation();
    STATE.isLangDropdownOpen = !STATE.isLangDropdownOpen;
    
    if (DOM.langDropdown) {
        DOM.langDropdown.classList.toggle('active');
    }
}

function changeLanguage(lang) {
    STATE.currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update language button text
    if (DOM.langBtn) {
        const langText = DOM.langBtn.querySelector('span');
        if (langText) {
            langText.textContent = lang.toUpperCase();
        }
    }
    
    // Load translations
    loadTranslations(lang);
    
    // Close dropdown
    if (DOM.langDropdown) {
        DOM.langDropdown.classList.remove('active');
    }
    
    showToast(`Language changed to ${lang.toUpperCase()}`, 'success');
}

// =============================================
// Theme Functions
// =============================================
function toggleTheme() {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', STATE.theme);
    
    // Update theme icon
    if (DOM.themeToggle) {
        const icon = DOM.themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    }
    
    showToast(`Theme changed to ${STATE.theme} mode`, 'success');
}

// =============================================
// Scroll Effects
// =============================================
function initializeScrollEffects() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide navbar on scroll
        if (DOM.navbar) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                DOM.navbar.style.transform = 'translateY(-100%)';
            } else {
                DOM.navbar.style.transform = 'translateY(0)';
            }
        }
        
        // Show/hide back to top button
        if (DOM.backToTop) {
            if (scrollTop > 500) {
                DOM.backToTop.classList.add('visible');
            } else {
                DOM.backToTop.classList.remove('visible');
            }
        }
        
        // Parallax effects
        applyParallaxEffects(scrollTop);
        
        // Reveal animations
        revealOnScroll();
        
        lastScrollTop = scrollTop;
    }, 100));
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function applyParallaxEffects(scrollTop) {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal:not(.revealed)');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// =============================================
// Counter Animation
// =============================================
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        
        if (current < target) {
            element.textContent = formatNumber(Math.floor(current));
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(target);
        }
    };
    
    updateCounter();
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// =============================================
// Code System
// =============================================
function initializeCodeSystem() {
    // Initialize code timers
    updateCodeTimers();
    setInterval(updateCodeTimers, 1000);
    
    // Load codes from API or local data
    loadCodes();
}

async function handleCodeCopy(e) {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    
    const code = btn.dataset.code;
    
    try {
        await navigator.clipboard.writeText(code);
        
        // Update button state
        btn.classList.add('copied');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
        
        // Track copied code
        STATE.copiedCodes.add(code);
        localStorage.setItem('copiedCodes', JSON.stringify([...STATE.copiedCodes]));
        
        // Reset button after delay
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalHTML;
        }, 2000);
        
        showToast(`Code "${code}" copied to clipboard!`, 'success');
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy code. Please try again.', 'error');
    }
}

function updateCodeTimers() {
    const timers = document.querySelectorAll('.code-timer[data-expires]');
    
    timers.forEach(timer => {
        const expiryDate = new Date(timer.dataset.expires);
        const now = new Date();
        const diff = expiryDate - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const timeLeft = timer.querySelector('.time-left');
            if (timeLeft) {
                if (days > 0) {
                    timeLeft.textContent = `${days}d ${hours}h`;
                } else if (hours > 0) {
                    timeLeft.textContent = `${hours}h ${minutes}m`;
                } else {
                    timeLeft.textContent = `${minutes}m ${seconds}s`;
                }
                
                // Add urgency styling
                if (hours < 1 && days === 0) {
                    timer.classList.add('urgent');
                }
            }
        } else {
            const codeCard = timer.closest('.code-card');
            if (codeCard) {
                codeCard.classList.remove('active');
                codeCard.classList.add('expired');
            }
        }
    });
}

async function loadCodes() {
    // Simulate loading codes from API
    // In production, this would fetch from your backend
    const mockCodes = [
        {
            code: 'ALPHA2025',
            rewards: ['1000 Coins', '50 Gems'],
            expires: '2025-09-01',
            status: 'new'
        },
        {
            code: 'SURVIVE100',
            rewards: ['Epic Armor'],
            expires: '2025-08-31',
            status: 'hot'
        },
        {
            code: 'WELCOME2HZ',
            rewards: ['Starter Pack'],
            expires: null,
            status: 'active'
        }
    ];
    
    // Store in state
    STATE.activeCodes = mockCodes;
    
    // Update UI if needed
    // renderCodes(mockCodes);
}

// =============================================
// Toast Notifications
// =============================================
function showToast(message, type = 'info') {
    if (!DOM.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type} animate-slide-right`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon} toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, CONFIG.TOAST_DURATION);
}

// =============================================
// Particle System
// =============================================
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = window.innerWidth < 768 ? 20 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * duration;
    const startX = Math.random() * 100;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${startX}%;
        background: ${Math.random() > 0.5 ? 'var(--accent-green)' : 'var(--accent-blue)'};
        animation: floatUp ${duration}s ${delay}s infinite linear;
        opacity: ${Math.random() * 0.5 + 0.3};
    `;
    
    container.appendChild(particle);
}

// Add CSS for particles
const style = document.createElement('style');
style.textContent = `
    .particle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
    }
    
    @keyframes floatUp {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// =============================================
// User Preferences
// =============================================
function loadUserPreferences() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        STATE.theme = 'light';
        if (DOM.themeToggle) {
            const icon = DOM.themeToggle.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    // Load language
    const savedLang = localStorage.getItem('language') || 'en';
    STATE.currentLang = savedLang;
    if (DOM.langBtn) {
        const langText = DOM.langBtn.querySelector('span');
        if (langText) {
            langText.textContent = savedLang.toUpperCase();
        }
    }
    
    // Load copied codes
    const copiedCodes = localStorage.getItem('copiedCodes');
    if (copiedCodes) {
        STATE.copiedCodes = new Set(JSON.parse(copiedCodes));
    }
}

// =============================================
// URL Parameters
// =============================================
function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    
    // Check for language parameter
    const lang = params.get('lang');
    if (lang && ['en', 'zh', 'ja', 'ko'].includes(lang)) {
        changeLanguage(lang);
    }
    
    // Check for theme parameter
    const theme = params.get('theme');
    if (theme && ['light', 'dark'].includes(theme)) {
        if (theme !== STATE.theme) {
            toggleTheme();
        }
    }
}

// =============================================
// Tooltips
// =============================================
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.dataset.tooltip;
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
    
    setTimeout(() => {
        tooltip.classList.add('visible');
    }, 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        setTimeout(() => {
            tooltip.remove();
        }, 300);
    }
}

// =============================================
// Lazy Loading
// =============================================
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// =============================================
// Utility Functions
// =============================================
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function handleOutsideClick(e) {
    // Close language dropdown
    if (STATE.isLangDropdownOpen && !e.target.closest('.language-selector')) {
        STATE.isLangDropdownOpen = false;
        if (DOM.langDropdown) {
            DOM.langDropdown.classList.remove('active');
        }
    }
    
    // Close mobile menu if clicking outside
    if (STATE.isMobileMenuOpen && !e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
        toggleMobileMenu();
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        // Close mobile menu
        if (STATE.isMobileMenuOpen) {
            toggleMobileMenu();
        }
        
        // Close language dropdown
        if (STATE.isLangDropdownOpen) {
            STATE.isLangDropdownOpen = false;
            if (DOM.langDropdown) {
                DOM.langDropdown.classList.remove('active');
            }
        }
    }
}

function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && STATE.isMobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Reinitialize particles on resize
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        initializeParticles();
    }
}

// =============================================
// Translations (Placeholder)
// =============================================
function loadTranslations(lang) {
    // This would normally load from a JSON file or API
    // For now, just a placeholder
    console.log(`Loading translations for ${lang}`);
}

// =============================================
// Code Filter Functions
// =============================================
function initializeCodeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const codeCards = document.querySelectorAll('.code-card');
    
    if (filterTabs.length === 0 || codeCards.length === 0) return;
    
    // Set initial state - all cards visible
    codeCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.transition = 'all 0.3s ease';
    });
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            
            // Filter code cards
            codeCards.forEach(card => {
                if (filter === 'all') {
                    // Show all cards
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    const categories = card.getAttribute('data-category') || '';
                    const categoryList = categories.split(' ').filter(c => c);
                    
                    if (categoryList.includes(filter)) {
                        // Show matching cards
                        card.style.display = 'block';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        // Hide non-matching cards
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// =============================================
// Enhanced Copy Code Function (Unified)
// =============================================
function initializeCodeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const code = btn.getAttribute('data-code');
            
            try {
                await navigator.clipboard.writeText(code);
                
                // Visual feedback
                const originalHTML = btn.innerHTML;
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
                btn.style.background = 'var(--accent-blue)';
                
                // Track copied code
                STATE.copiedCodes.add(code);
                localStorage.setItem('copiedCodes', JSON.stringify([...STATE.copiedCodes]));
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                }, 2000);
                
                showToast(`Code "${code}" copied to clipboard!`, 'success');
            } catch (err) {
                console.error('Failed to copy:', err);
                showToast('Failed to copy code. Please try again.', 'error');
            }
        });
    });
}

// =============================================
// Export for use in other modules
// =============================================
window.HuntyZombie = {
    showToast,
    changeLanguage,
    formatNumber,
    STATE,
    CONFIG
};