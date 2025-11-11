// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

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

// Social links are now hardcoded in HTML - no JavaScript needed

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-tag, .animate-card, .section-title');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

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

// Initialize animations
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', () => {
    animateOnScroll();
    
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

// Enhanced scroll animations with Intersection Observer
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return; // Skip animations if user prefers reduced motion
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Optional: unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.animate-tag, .animate-card');
    animateElements.forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initBackToTop();
    initScrollAnimations();
    
    // Ensure project links are not modified by any other code
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        // Preserve the original href attribute
        link.setAttribute('data-original-href', link.href);
    });
});