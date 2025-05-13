/**
 * AI Vogue - Version 2
 * Animations and Interactive Elements
 * Handles scroll animations, interactive elements, and page transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            body.classList.toggle('mobile-menu-open');
            
            // Toggle aria-expanded for accessibility
            const expanded = body.classList.contains('mobile-menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', expanded);
            
            // Prevent scrolling when menu is open
            if (expanded) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }
    
    // Intersection Observer for scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll(
            '.feature-card, .stat-item, .future-item, .section-header, .intro-content, .future-content'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            // Set initial state
            element.style.opacity = '0';
            observer.observe(element);
        });
    };
    
    // Page transition effects
    const handlePageTransitions = () => {
        const pageTransition = document.querySelector('.page-transition');
        const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])');
        
        if (pageTransition && links.length) {
            // Show content with fade-in effect when page loads
            setTimeout(() => {
                document.body.classList.add('page-loaded');
            }, 300);
            
            // Add transition effect when navigating between pages
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    // Only apply transition for internal links
                    if (href && href.indexOf('#') !== 0 && href.indexOf('://') === -1) {
                        e.preventDefault();
                        
                        pageTransition.classList.add('active');
                        
                        setTimeout(() => {
                            window.location.href = href;
                        }, 500);
                    }
                });
            });
        }
    };
    
    // Parallax effect for hero section
    const initParallax = () => {
        const heroSection = document.querySelector('.hero');
        const shapes = document.querySelectorAll('.shape');
        
        if (heroSection && shapes.length) {
            window.addEventListener('scroll', () => {
                const scrollPosition = window.scrollY;
                
                if (scrollPosition < window.innerHeight) {
                    shapes.forEach((shape, index) => {
                        const speed = 0.1 + (index * 0.05);
                        const yPos = scrollPosition * speed;
                        shape.style.transform = `translateY(${yPos}px)`;
                    });
                }
            });
        }
    };
    
    // Initialize interactive elements
    const initInteractiveElements = () => {
        // Add hover effects to buttons and cards
        const interactiveElements = document.querySelectorAll('.btn, .feature-card, .stat-item, .future-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
        });
        
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    };
    
    // Initialize all animations and interactive elements
    const init = () => {
        animateOnScroll();
        handlePageTransitions();
        initParallax();
        initInteractiveElements();
        
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, targetId);
                }
            });
        });
    };
    
    // Run initialization
    init();
});