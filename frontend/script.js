console.log('🚀 Script.js loaded successfully');

// Smooth scrolling for navigation links with custom speed
function initSmoothScrolling() {
    console.log('Initializing smooth scrolling...'); // Debug log
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            console.log('Smooth scroll clicked:', targetId, 'Target found:', !!target); // Debug log
            
            if (target) {
                // Custom smooth scroll with slower speed
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1200; // 1.2 seconds (slower)
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }
                
                // Easing function for smooth animation
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
}

// CV Modal functionality
const cvModal = document.getElementById('cv-modal');
const cvIframe = document.getElementById('cv-iframe');
const cvClose = document.querySelector('.cv-close');

document.getElementById('cv-download').addEventListener('click', function(e) {
    e.preventDefault();
    
    // CV hosted on same S3 bucket via CloudFront
    const cvUrl = 'https://fidelis.fozdigitalz.com/cv.pdf';
    
    cvIframe.src = cvUrl;
    cvModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close modal
cvClose.addEventListener('click', function() {
    cvModal.style.display = 'none';
    cvIframe.src = '';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === cvModal) {
        cvModal.style.display = 'none';
        cvIframe.src = '';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cvModal.style.display === 'block') {
        cvModal.style.display = 'none';
        cvIframe.src = '';
        document.body.style.overflow = 'auto';
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
});

// Typing effect for about text
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect
window.addEventListener('load', () => {
    // Typing effect for about text
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const originalText = typingText.textContent;
        setTimeout(() => {
            typeWriter(typingText, originalText, 30);
        }, 1000);
    }
});

// Mobile navigation toggle
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Back to Top Button functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Simple and reliable scroll animations
function initScrollAnimations() {
    console.log('Initializing scroll animations...'); // Debug log
    
    // Find all elements to animate
    const animateElements = document.querySelectorAll('.animate-tag, .animate-card');
    console.log('Found elements to animate:', animateElements.length); // Debug log
    
    if (animateElements.length === 0) {
        console.log('No elements found with .animate-tag or .animate-card classes');
        return;
    }
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Show all elements immediately
        animateElements.forEach(element => {
            element.classList.add('animate');
        });
        console.log('Reduced motion preferred - showing all elements immediately');
        return;
    }
    
    // Use Intersection Observer if supported, otherwise fallback to scroll event
    if ('IntersectionObserver' in window) {
        console.log('Using IntersectionObserver for animations');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Element came into view:', entry.target.className);
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        console.log('Using scroll event fallback for animations');
        
        function checkScroll() {
            animateElements.forEach(element => {
                if (!element.classList.contains('animate')) {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;
                    
                    if (elementTop < window.innerHeight - elementVisible) {
                        element.classList.add('animate');
                        console.log('Element animated via scroll:', element.className);
                    }
                }
            });
        }
        
        window.addEventListener('scroll', checkScroll);
        checkScroll(); // Check on load
    }
    
    console.log('Scroll animations setup complete');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...'); // Debug log
    
    // Initialize all features
    initSmoothScrolling();
    initMobileNav();
    initBackToTop();
    
    // Small delay to ensure CSS is loaded
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
    
    // Ensure project links are not modified by any other code
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        // Preserve the original href attribute
        link.setAttribute('data-original-href', link.href);
    });
    
    console.log('All initialization complete');
});