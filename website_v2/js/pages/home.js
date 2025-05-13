/**
 * AI Vogue - Version 2
 * Home Page Specific JavaScript
 * Handles home page specific interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Hero section animations
    const animateHero = () => {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroCta = document.querySelector('.hero-cta');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroTitle && heroSubtitle && heroCta && heroImage) {
            // Apply staggered animations
            setTimeout(() => {
                heroTitle.classList.add('animate-fadeIn');
            }, 300);
            
            setTimeout(() => {
                heroSubtitle.classList.add('animate-fadeIn');
            }, 600);
            
            setTimeout(() => {
                heroCta.classList.add('animate-fadeIn');
            }, 900);
            
            setTimeout(() => {
                heroImage.classList.add('animate-fadeIn');
            }, 1200);
        }
    };
    
    // Animate statistics counter
    const animateStats = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const finalValue = parseInt(target.textContent.replace(/\D/g, ''), 10);
                        let startValue = 0;
                        const duration = 2000;
                        const increment = Math.ceil(finalValue / (duration / 20));
                        
                        const counter = setInterval(() => {
                            startValue += increment;
                            
                            if (startValue >= finalValue) {
                                target.textContent = target.textContent.includes('+') ? 
                                    `${finalValue}+` : 
                                    `${finalValue}%`;
                                clearInterval(counter);
                            } else {
                                target.textContent = target.textContent.includes('+') ? 
                                    `${startValue}+` : 
                                    `${startValue}%`;
                            }
                        }, 20);
                        
                        observer.unobserve(target);
                    }
                });
            }, {
                threshold: 0.5
            });
            
            statNumbers.forEach(stat => {
                observer.observe(stat);
            });
        }
    };
    
    // Feature cards hover effects
    const enhanceFeatureCards = () => {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = 'var(--shadow-lg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-md)';
            });
        });
    };
    
    // Newsletter form submission
    const handleNewsletterForm = () => {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (email) {
                    // Show success message (in a real app, this would send data to a server)
                    const formContainer = newsletterForm.parentElement;
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('success-message');
                    successMessage.innerHTML = `
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        <p>Thank you for subscribing to our newsletter!</p>
                    `;
                    
                    // Replace form with success message
                    formContainer.innerHTML = '';
                    formContainer.appendChild(successMessage);
                    
                    // Style the success message
                    successMessage.style.display = 'flex';
                    successMessage.style.alignItems = 'center';
                    successMessage.style.gap = 'var(--spacing-sm)';
                    successMessage.style.color = 'var(--color-primary)';
                    successMessage.style.fontWeight = '500';
                    successMessage.style.padding = 'var(--spacing-md)';
                    successMessage.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
                    successMessage.style.borderRadius = 'var(--border-radius-md)';
                    successMessage.style.animation = 'fadeIn 0.5s ease-out';
                }
            });
        }
    };
    
    // Initialize all home page specific functionality
    const init = () => {
        animateHero();
        animateStats();
        enhanceFeatureCards();
        handleNewsletterForm();
    };
    
    // Run initialization
    init();
});