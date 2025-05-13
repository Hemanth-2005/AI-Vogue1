// Auth Protection Script
// This script checks if a user is authenticated for protected pages

document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is loaded
    if (typeof firebase !== 'undefined' && firebase.auth) {
        // List of public pages that don't require authentication
        const publicPages = ['index.html', 'login.html'];
        
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // If not on a public page, check authentication
        if (!publicPages.includes(currentPage)) {
            firebase.auth().onAuthStateChanged(user => {
                if (!user) {
                    // User is not signed in, redirect to login page
                    console.log('User not authenticated, redirecting to login page');
                    window.location.href = 'login.html';
                } else {
                    console.log('User authenticated:', user.displayName || user.email);
                }
            });
        }
    } else {
        console.error('Firebase Auth not loaded. Authentication protection disabled.');
    }
});