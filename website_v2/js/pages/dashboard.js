/**
 * AI Vogue - Version 2
 * User Dashboard Module
 * Handles the tabbed User Dashboard functionality for the Thrift Store
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const dashboardToggle = document.getElementById('dashboard-toggle');
    const dashboardPanel = document.getElementById('user-dashboard');
    const closeDashboardBtn = document.getElementById('close-dashboard');
    
    // Initialize dashboard
    initializeDashboard();
    
    /**
     * Initializes the dashboard with event listeners and default state
     */
    function initializeDashboard() {
        // Set up tab switching
        dashboardTabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });
        
        // Toggle dashboard panel
        if (dashboardToggle) {
            dashboardToggle.addEventListener('click', toggleDashboard);
        }
        
        // Close dashboard panel
        if (closeDashboardBtn) {
            closeDashboardBtn.addEventListener('click', closeDashboard);
        }
        
        // Load sample data for dashboard sections
        loadSampleOrders();
        loadSampleWishlist();
        loadSampleListings();
    }
    
    /**
     * Switches between dashboard tabs
     * @param {string} tabId - The ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Update active tab
        dashboardTabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Show selected section
        dashboardSections.forEach(section => {
            if (section.id === tabId) {
                section.classList.add('active');
                // Add entrance animation
                section.style.animation = 'fadeIn 0.3s ease-in-out';
                setTimeout(() => {
                    section.style.animation = '';
                }, 300);
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    /**
     * Toggles the dashboard panel visibility
     */
    function toggleDashboard() {
        dashboardPanel.classList.toggle('active');
        document.body.classList.toggle('panel-open');
    }
    
    /**
     * Closes the dashboard panel
     */
    function closeDashboard() {
        dashboardPanel.classList.remove('active');
        document.body.classList.remove('panel-open');
    }
    
    /**
     * Loads sample orders for the Orders tab
     */
    function loadSampleOrders() {
        const ordersContainer = document.getElementById('orders-container');
        if (!ordersContainer) return;
        
        const sampleOrders = [
            {
                id: 'ORD123456',
                date: '2023-05-15',
                items: [
                    { name: "Levi's Denim Jacket", price: '1,200' }
                ],
                total: '1,200',
                status: 'Delivered'
            },
            {
                id: 'ORD123457',
                date: '2023-06-02',
                items: [
                    { name: 'Zara Floral Dress', price: '800' },
                    { name: 'H&M Cotton T-shirt', price: '400' }
                ],
                total: '1,200',
                status: 'Shipped'
            },
            {
                id: 'ORD123458',
                date: '2023-06-10',
                items: [
                    { name: 'Coach Leather Bag', price: '2,500' }
                ],
                total: '2,500',
                status: 'Processing'
            }
        ];
        
        ordersContainer.innerHTML = '';
        
        sampleOrders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-card';
            
            let itemsHtml = '';
            order.items.forEach(item => {
                itemsHtml += `<div class="order-item">${item.name} - ₹${item.price}</div>`;
            });
            
            orderElement.innerHTML = `
                <div class="order-header">
                    <div class="order-id">${order.id}</div>
                    <div class="order-date">${formatDate(order.date)}</div>
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
                <div class="order-footer">
                    <div class="order-total">Total: ₹${order.total}</div>
                    <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
                </div>
                <button class="btn btn-outline btn-sm track-order-btn" data-order-id="${order.id}">Track Order</button>
            `;
            
            ordersContainer.appendChild(orderElement);
        });
        
        // Add event listeners to track order buttons
        document.querySelectorAll('.track-order-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.dataset.orderId;
                showOrderTracking(orderId);
            });
        });
    }
    
    /**
     * Loads sample wishlist items for the Wishlist tab
     */
    function loadSampleWishlist() {
        const wishlistContainer = document.getElementById('wishlist-container');
        if (!wishlistContainer) return;
        
        const sampleWishlist = [
            {
                id: '4',
                brand: 'Nike',
                material: 'Running Shoes',
                price: '3,500',
                image: '../images/products/product-4.jpg'
            },
            {
                id: '5',
                brand: 'Prada',
                material: 'Sunglasses',
                price: '12,000',
                image: '../images/products/product-5.jpg'
            },
            {
                id: '6',
                brand: 'H&M',
                material: 'Cotton T-shirt',
                price: '400',
                image: '../images/products/product-6.jpg'
            }
        ];
        
        wishlistContainer.innerHTML = '';
        
        sampleWishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.innerHTML = `
                <div class="wishlist-image">
                    <img src="${item.image}" alt="${item.brand} ${item.material}">
                </div>
                <div class="wishlist-details">
                    <h4>${item.brand}</h4>
                    <p>${item.material}</p>
                    <div class="wishlist-price">₹${item.price}</div>
                </div>
                <div class="wishlist-actions">
                    <button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${item.id}">Add to Cart</button>
                    <button class="btn btn-outline btn-sm remove-wishlist-btn" data-product-id="${item.id}">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                </div>
            `;
            
            wishlistContainer.appendChild(wishlistItem);
        });
        
        // Add event listeners to wishlist buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                if (typeof window.addToCart === 'function') {
                    window.addToCart(productId);
                }
            });
        });
        
        document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                removeFromWishlist(productId);
            });
        });
    }
    
    /**
     * Loads sample listings for the My Listings tab
     */
    function loadSampleListings() {
        const listingsContainer = document.getElementById('listings-container');
        if (!listingsContainer) return;
        
        const sampleListings = [
            {
                id: '7',
                brand: 'Adidas',
                material: 'Track Pants',
                price: '900',
                status: 'Active',
                image: '../images/products/product-7.jpg'
            },
            {
                id: '8',
                brand: 'Fossil',
                material: 'Leather Watch',
                price: '4,500',
                status: 'Sold',
                image: '../images/products/product-8.jpg'
            },
            {
                id: '9',
                brand: 'Ray-Ban',
                material: 'Aviator Sunglasses',
                price: '2,800',
                status: 'Active',
                image: '../images/products/product-9.jpg'
            }
        ];
        
        listingsContainer.innerHTML = '';
        
        sampleListings.forEach(item => {
            const listingItem = document.createElement('div');
            listingItem.className = 'listing-item';
            listingItem.innerHTML = `
                <div class="listing-image">
                    <img src="${item.image}" alt="${item.brand} ${item.material}">
                    <div class="listing-status ${item.status.toLowerCase()}">${item.status}</div>
                </div>
                <div class="listing-details">
                    <h4>${item.brand}</h4>
                    <p>${item.material}</p>
                    <div class="listing-price">₹${item.price}</div>
                </div>
                <div class="listing-actions">
                    <button class="btn btn-outline btn-sm edit-listing-btn" data-product-id="${item.id}">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        Edit
                    </button>
                    <button class="btn btn-outline btn-sm delete-listing-btn" data-product-id="${item.id}">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Delete
                    </button>
                </div>
            `;
            
            listingsContainer.appendChild(listingItem);
        });
        
        // Add event listeners to listing buttons
        document.querySelectorAll('.edit-listing-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                editListing(productId);
            });
        });
        
        document.querySelectorAll('.delete-listing-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                deleteListing(productId);
            });
        });
    }
    
    /**
     * Shows the order tracking modal for a specific order
     * @param {string} orderId - The ID of the order to track
     */
    function showOrderTracking(orderId) {
        // In a real app, you would fetch the order status from an API
        // For this demo, we'll use sample data based on the order ID
        
        let trackingData;
        
        switch (orderId) {
            case 'ORD123456':
                trackingData = {
                    orderId: 'ORD123456',
                    status: 'delivered',
                    steps: [
                        { name: 'Confirmed', date: '2023-05-15', completed: true },
                        { name: 'Packed', date: '2023-05-16', completed: true },
                        { name: 'Shipped', date: '2023-05-17', completed: true },
                        { name: 'Delivered', date: '2023-05-20', completed: true }
                    ],
                    eta: 'Delivered on May 20, 2023'
                };
                break;
            case 'ORD123457':
                trackingData = {
                    orderId: 'ORD123457',
                    status: 'shipped',
                    steps: [
                        { name: 'Confirmed', date: '2023-06-02', completed: true },
                        { name: 'Packed', date: '2023-06-03', completed: true },
                        { name: 'Shipped', date: '2023-06-04', completed: true },
                        { name: 'Delivered', date: null, completed: false }
                    ],
                    eta: 'Expected delivery by June 8, 2023'
                };
                break;
            case 'ORD123458':
                trackingData = {
                    orderId: 'ORD123458',
                    status: 'processing',
                    steps: [
                        { name: 'Confirmed', date: '2023-06-10', completed: true },
                        { name: 'Packed', date: null, completed: false },
                        { name: 'Shipped', date: null, completed: false },
                        { name: 'Delivered', date: null, completed: false }
                    ],
                    eta: 'Expected delivery by June 15, 2023'
                };
                break;
            default:
                trackingData = {
                    orderId: orderId,
                    status: 'unknown',
                    steps: [
                        { name: 'Confirmed', date: null, completed: false },
                        { name: 'Packed', date: null, completed: false },
                        { name: 'Shipped', date: null, completed: false },
                        { name: 'Delivered', date: null, completed: false }
                    ],
                    eta: 'Status unknown'
                };
        }
        
        // Create and show the tracking modal
        const trackingModal = document.createElement('div');
        trackingModal.className = 'modal tracking-modal';
        trackingModal.id = 'tracking-modal';
        
        let stepsHtml = '';
        trackingData.steps.forEach((step, index) => {
            const stepClass = step.completed ? 'completed' : '';
            const lineClass = index < trackingData.steps.length - 1 ? 
                (trackingData.steps[index + 1].completed ? 'completed' : '') : '';
            
            stepsHtml += `
                <div class="tracking-step ${stepClass}">
                    <div class="step-indicator">
                        <div class="step-icon"></div>
                        ${index < trackingData.steps.length - 1 ? 
                            `<div class="step-line ${lineClass}"></div>` : ''}
                    </div>
                    <div class="step-content">
                        <div class="step-name">${step.name}</div>
                        <div class="step-date">${step.date ? formatDate(step.date) : 'Pending'}</div>
                    </div>
                </div>
            `;
        });
        
        trackingModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Order Tracking</h2>
                    <button id="close-tracking-modal" class="modal-close" aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="tracking-header">
                        <div class="tracking-order-id">Order ID: ${trackingData.orderId}</div>
                        <div class="tracking-eta">${trackingData.eta}</div>
                    </div>
                    <div class="tracking-steps">
                        ${stepsHtml}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(trackingModal);
        
        // Show modal with animation
        setTimeout(() => {
            trackingModal.classList.add('modal-active');
            document.body.classList.add('modal-open');
        }, 10);
        
        // Close modal event
        const closeTrackingBtn = document.getElementById('close-tracking-modal');
        if (closeTrackingBtn) {
            closeTrackingBtn.addEventListener('click', () => {
                trackingModal.classList.remove('modal-active');
                document.body.classList.remove('modal-open');
                
                // Remove modal from DOM after animation
                setTimeout(() => {
                    document.body.removeChild(trackingModal);
                }, 300);
            });
        }
        
        // Close modal when clicking outside
        trackingModal.addEventListener('click', (e) => {
            if (e.target === trackingModal) {
                trackingModal.classList.remove('modal-active');
                document.body.classList.remove('modal-open');
                
                // Remove modal from DOM after animation
                setTimeout(() => {
                    document.body.removeChild(trackingModal);
                }, 300);
            }
        });
    }
    
    /**
     * Removes an item from the wishlist
     * @param {string} productId - The ID of the product to remove
     */
    function removeFromWishlist(productId) {
        const wishlistItem = document.querySelector(`.remove-wishlist-btn[data-product-id="${productId}"]`).closest('.wishlist-item');
        
        // Add removal animation
        wishlistItem.style.animation = 'fadeOut 0.3s ease-in-out';
        
        // Remove item after animation
        setTimeout(() => {
            wishlistItem.remove();
            
            // Show empty message if no items left
            const wishlistContainer = document.getElementById('wishlist-container');
            if (wishlistContainer && wishlistContainer.children.length === 0) {
                wishlistContainer.innerHTML = '<div class="empty-section">Your wishlist is empty</div>';
            }
            
            showNotification('Item removed from wishlist', 'info');
        }, 300);
    }
    
    /**
     * Opens the edit form for a listing
     * @param {string} productId - The ID of the product to edit
     */
    function editListing(productId) {
        // In a real app, you would fetch the product data and populate a form
        // For this demo, we'll just show a notification
        showNotification('Edit functionality would open a form with product details', 'info');
    }
    
    /**
     * Deletes a listing
     * @param {string} productId - The ID of the product to delete
     */
    function deleteListing(productId) {
        const listingItem = document.querySelector(`.delete-listing-btn[data-product-id="${productId}"]`).closest('.listing-item');
        
        // Add removal animation
        listingItem.style.animation = 'fadeOut 0.3s ease-in-out';
        
        // Remove item after animation
        setTimeout(() => {
            listingItem.remove();
            
            // Show empty message if no items left
            const listingsContainer = document.getElementById('listings-container');
            if (listingsContainer && listingsContainer.children.length === 0) {
                listingsContainer.innerHTML = '<div class="empty-section">You have no listings</div>';
            }
            
            showNotification('Listing deleted successfully', 'success');
        }, 300);
    }
    
    /**
     * Formats a date string to a more readable format
     * @param {string} dateString - The date string to format (YYYY-MM-DD)
     * @returns {string} The formatted date string
     */
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    /**
     * Shows a notification message
     * @param {string} message - The message to display
     * @param {string} type - The type of notification (success, error, info)
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});