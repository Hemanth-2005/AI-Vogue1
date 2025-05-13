/**
 * AI Vogue - Version 2
 * Theme Toggle Functionality
 * Handles switching between light and dark mode with smooth transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Apply the saved theme or use system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }
    
    // Ensure body has at least one theme class
    if (!body.classList.contains('light-mode') && !body.classList.contains('dark-mode')) {
        body.classList.add('light-mode');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        // Create a smooth transition effect
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Toggle the class
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        
        // Save the preference
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        
        // Announce theme change for screen readers
        const themeAnnouncement = document.createElement('div');
        themeAnnouncement.setAttribute('aria-live', 'polite');
        themeAnnouncement.classList.add('visually-hidden');
        themeAnnouncement.textContent = `Theme changed to ${currentTheme} mode`;
        document.body.appendChild(themeAnnouncement);
        
        // Remove the announcement after it's been read
        setTimeout(() => {
            document.body.removeChild(themeAnnouncement);
        }, 3000);
    });
    
    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
            }
        }
    });
});