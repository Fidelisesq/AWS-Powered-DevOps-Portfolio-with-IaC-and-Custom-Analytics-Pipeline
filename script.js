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
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Update project and blog links
function updateLinks() {
    // Update project links with your actual GitHub/GitLab URLs
    const projectLinks = document.querySelectorAll('.project-link');
    const projectUrls = [
        'https://github.com/yourusername/infrastructure-automation',
        'https://github.com/yourusername/cicd-pipeline',
        'https://github.com/yourusername/kubernetes-cluster'
    ];
    
    projectLinks.forEach((link, index) => {
        if (projectUrls[index]) {
            link.href = projectUrls[index];
        }
    });
    
    // Update blog links with your actual blog URLs
    const blogLinks = document.querySelectorAll('.blog-link');
    const blogUrls = [
        'https://yourblog.com/aws-cost-optimization',
        'https://yourblog.com/resilient-cicd-pipelines'
    ];
    
    blogLinks.forEach((link, index) => {
        if (blogUrls[index]) {
            link.href = blogUrls[index];
        }
    });
    
    // Update social links
    const socialLinks = document.querySelectorAll('.social-link');
    const socialUrls = [
        'https://linkedin.com/in/fidelis-ikoroje',
        'https://github.com/Fidelisesq',
        'https://twitter.com/fidelisesq',
        'https://www.youtube.com/@Fidelisesq'
    ];
    
    socialLinks.forEach((link, index) => {
        if (socialUrls[index]) {
            link.href = socialUrls[index];
        }
    });
}

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

// Initialize links when page loads
document.addEventListener('DOMContentLoaded', updateLinks);