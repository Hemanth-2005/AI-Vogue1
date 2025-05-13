// Firebase Authentication Script

// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHx_j9F49oBwZyvTnE48vEMgrfgWIQiJg",
    authDomain: "myapp-1a88c.firebaseapp.com",
    projectId: "myapp-1a88c",
    storageBucket: "myapp-1a88c.firebasestorage.app",
    messagingSenderId: "461917108978",
    appId: "1:461917108978:web:fe181aa7004fb8da7fee6b",
    measurementId: "G-SWKZSQJ5BP"
};

// Initialize Firebase if not already initialized
if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// Update UI based on authentication state
function updateAuthUI() {
    const loginBtn = document.querySelector('.nav-actions .btn-primary');
    const userProfileBtn = document.createElement('button');
    userProfileBtn.className = 'btn btn-outline';
    userProfileBtn.id = 'user-profile-btn';
    userProfileBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-outline';
    logoutBtn.id = 'logout-btn';
    logoutBtn.innerHTML = 'Logout';
    logoutBtn.style.marginLeft = '0.5rem';
    
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            if (loginBtn) {
                const navActions = loginBtn.parentElement;
                navActions.removeChild(loginBtn);
                navActions.appendChild(userProfileBtn);
                navActions.appendChild(logoutBtn);
                
                // Add logout functionality
                logoutBtn.addEventListener('click', () => {
                    auth.signOut().then(() => {
                        // Redirect to home page after logout
                        window.location.href = 'index.html';
                    }).catch(error => {
                        console.error('Error signing out:', error);
                    });
                });
            }
        } else {
            // User is signed out
            const userProfileBtnElement = document.getElementById('user-profile-btn');
            const logoutBtnElement = document.getElementById('logout-btn');
            
            if (userProfileBtnElement && logoutBtnElement) {
                const navActions = userProfileBtnElement.parentElement;
                navActions.removeChild(userProfileBtnElement);
                navActions.removeChild(logoutBtnElement);
                navActions.appendChild(loginBtn);
            }
        }
    });
}

// Run the auth UI update when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is loaded
    if (typeof firebase !== 'undefined' && firebase.auth) {
        updateAuthUI();
    } else {
        console.error('Firebase Auth not loaded. Authentication UI update disabled.');
    }
});