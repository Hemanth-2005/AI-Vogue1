/**
 * Rental Hub Page JavaScript
 * Handles filtering, animations, and interactive elements for the rental hub page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize filters
    initFilters();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize view details buttons
    initViewDetailsButtons();
    
    // Initialize review cards animation
    initReviewCards();
});

/**
 * Initialize animations for page elements
 */
function initAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.shop-card, .dress-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize filtering functionality
 */
function initFilters() {
    const locationFilter = document.getElementById('location-filter');
    const sizeFilter = document.getElementById('size-filter');
    
    if (locationFilter && sizeFilter) {
        locationFilter.addEventListener('change', applyFilters);
        sizeFilter.addEventListener('change', applyFilters);
    }
}

/**
 * Apply filters to dress listings
 */
function applyFilters() {
    // This would typically filter dress cards based on selected criteria
    // For demonstration purposes, we'll just log the selected filters
    const locationFilter = document.getElementById('location-filter');
    const sizeFilter = document.getElementById('size-filter');
    
    console.log('Filters applied:', {
        location: locationFilter.value,
        size: sizeFilter.value
    });
    
    // In a real implementation, this would filter the dress cards
    // based on data attributes or by fetching filtered results from a server
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

/**
 * Perform search based on input value
 */
function performSearch(query) {
    // This would typically search for dresses based on the query
    // For demonstration purposes, we'll just log the search query
    console.log('Search query:', query);
    
    // Scroll to dress listings section
    const dressListings = document.getElementById('dress-listings');
    if (dressListings) {
        dressListings.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Initialize view details buttons
 * Note: The main functionality is now handled in the inline script
 * in the HTML file for better integration with the modal
 */
function initViewDetailsButtons() {
    // The view details functionality is now handled in the HTML file
    // with the product detail modal implementation
    console.log('View details buttons initialized via inline script');
}

/**
 * Initialize review cards animation
 */
function initReviewCards() {
    const reviewCards = document.querySelectorAll('.review-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a delay based on the index to create a staggered animation
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });
    
    reviewCards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * Handle mobile menu toggle
 */
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
    this.classList.toggle('active');
});

/**
 * Handle newsletter form submission
 */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        
        // This would typically submit the email to a server
        // For demonstration purposes, we'll just log the email
        console.log('Newsletter subscription:', emailInput.value);
        
        // Show a success message
        alert('Thank you for subscribing to our newsletter!');
        
        // Reset the form
        this.reset();
    });
}