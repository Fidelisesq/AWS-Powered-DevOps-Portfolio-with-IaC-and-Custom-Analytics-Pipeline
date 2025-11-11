// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        console.log('Smooth scroll clicked:', targetId, 'Target found:', !!target); // Debug log
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

// Enhanced scroll animations with Intersection Observer
function initScrollAnimations() {
    console.log('Initializing scroll animations...'); // Debug log
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    console.log('Prefers reduced motion:', prefersReducedMotion); // Debug log
    
    if (prefersReducedMotion) {
        // If reduced motion is preferred, show all elements immediately
        const animateElements = document.querySelectorAll('.animate-tag, .animate-card');
        animateElements.forEach(element => {
            element.classList.add('animate');
        });
        return;
    }
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver not supported, using fallback'); // Debug log
        // Fallback: show all animations immediately
        const animateElements = document.querySelectorAll('.animate-tag, .animate-card');
        animateElements.forEach(element => {
            element.classList.add('animate');
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        console.log('Observer triggered with', entries.length, 'entries'); // Debug log
        entries.forEach(entry => {
            console.log('Element intersecting:', entry.isIntersecting, entry.target.className); // Debug log
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                console.log('Added animate class to:', entry.target.className); // Debug log
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.animate-tag, .animate-card');
    console.log('Found elements to animate:', animateElements.length); // Debug log
    
    if (animateElements.length === 0) {
        console.log('No elements found with .animate-tag or .animate-card classes');
        return;
    }
    
    animateElements.forEach((element, index) => {
        console.log('Setting up element:', index, element.className, element.tagName); // Debug log
        
        // Reset any existing styles and ensure elements start hidden
        element.style.opacity = '0';
        if (element.classList.contains('animate-tag')) {
            element.style.transform = 'translateX(-30px)';
        } else {
            element.style.transform = 'translateY(30px)';
        }
        
        observer.observe(element);
        console.log('Now observing element:', index); // Debug log
    });
    
    console.log('Scroll animations setup complete'); // Debug log
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...'); // Debug log
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
});