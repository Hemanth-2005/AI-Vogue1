// Thrifting Update JavaScript

// Sample product data
const products = [
    {
        id: 1,
        brand: "Levi's",
        material: "Denim Jacket",
        size: "M",
        price: 1200,
        condition: "Like New",
        badges: ["Like New", "Eco-Friendly"],
        image: "../images/products/product-1.jpg",
        description: "Classic denim jacket in excellent condition. Perfect for layering in any season."
    },
    {
        id: 2,
        brand: "Zara",
        material: "Floral Dress",
        size: "S",
        price: 800,
        condition: "Gently Used",
        badges: ["Gently Used"],
        image: "../images/products/product-2.jpg",
        description: "Beautiful floral print dress, perfect for spring and summer occasions."
    },
    {
        id: 3,
        brand: "Coach",
        material: "Leather Bag",
        size: "One Size",
        price: 2500,
        condition: "Vintage",
        badges: ["Vintage", "Premium"],
        image: "../images/products/product-3.jpg",
        description: "Authentic vintage Coach leather bag. Classic design that never goes out of style."
    },
    {
        id: 4,
        brand: "H&M",
        material: "Cotton T-shirt",
        size: "L",
        price: 350,
        condition: "Like New",
        badges: ["Like New"],
        image: "../images/products/product-4.jpg",
        description: "Comfortable cotton t-shirt, barely worn and in excellent condition."
    },
    {
        id: 5,
        brand: "Nike",
        material: "Running Shoes",
        size: "UK 8",
        price: 1800,
        condition: "Gently Used",
        badges: ["Gently Used", "Premium"],
        image: "../images/products/product-5.jpg",
        description: "High-quality running shoes with minimal wear. Great support and comfort."
    },
    {
        id: 6,
        brand: "Uniqlo",
        material: "Wool Sweater",
        size: "M",
        price: 950,
        condition: "Like New",
        badges: ["Like New", "Eco-Friendly"],
        image: "../images/products/product-6.jpg",
        description: "Warm wool sweater in excellent condition. Perfect for winter layering."
    }
];

// Cart functionality
let cart = [];
let cartPanel = null;
let cartOverlay = null;
let cartItemsContainer = null;
let cartBadge = null;
let cartTotal = null;
let checkoutContainer = null;
let quickViewModal = null;
let userDashboard = null;

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    cartPanel = document.getElementById('cart-panel');
    cartOverlay = document.getElementById('cart-overlay');
    cartItemsContainer = document.getElementById('cart-items');
    cartBadge = document.getElementById('cart-count');
    cartTotal = document.getElementById('cart-total');
    checkoutContainer = document.getElementById('checkout-container');
    quickViewModal = document.getElementById('quick-view-modal');
    userDashboard = document.getElementById('user-dashboard');

    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize product cards
    initializeProductCards();
    
    // Initialize cart buttons
    reinitializeCartButtons();
    
    // Initialize cart
    updateCart();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Cart toggle
    document.getElementById('cart-toggle').addEventListener('click', () => {
        cartPanel.classList.add('active');
        cartOverlay.classList.add('active');
    });

    document.getElementById('close-cart').addEventListener('click', () => {
        cartPanel.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    // Overlay click to close panels
    cartOverlay.addEventListener('click', () => {
        cartPanel.classList.remove('active');
        checkoutContainer.classList.remove('active');
        userDashboard.classList.remove('active');
        cartOverlay.classList.remove('active');
        
        // Close modals
        if (quickViewModal) {
            quickViewModal.style.display = 'none';
        }
        
        const sellModal = document.getElementById('sell-modal');
        if (sellModal) {
            sellModal.style.display = 'none';
        }
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            cartPanel.classList.remove('active');
            checkoutContainer.classList.add('active');
        } else {
            showToast('Your cart is empty. Add items before checkout.', 'error');
        }
    });

    document.getElementById('close-checkout').addEventListener('click', () => {
        checkoutContainer.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    // User dashboard toggle
    document.getElementById('user-dashboard-toggle').addEventListener('click', () => {
        userDashboard.classList.add('active');
        cartOverlay.classList.add('active');
    });

    document.getElementById('close-dashboard').addEventListener('click', () => {
        userDashboard.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    // Dashboard tabs functionality
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    dashboardTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            dashboardTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active section
            dashboardSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === tabId + '-section') {
                    section.classList.add('active');
                }
            });
        });
    });

    // Sell item button now opens the seller dashboard modal
    // This functionality is handled in seller-dashboard.js

    // Checkout form submission
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate form
        const name = document.getElementById('checkout-name').value;
        const email = document.getElementById('checkout-email').value;
        const address = document.getElementById('checkout-address').value;
        
        if (!name || !email || !address) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Process order
        processOrder();
    });

    // Sell form submission is now handled in seller-dashboard.js

    // Filter functionality
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', filterProducts);
    }

    // Load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            showToast('Loading more products...', 'success');
            // In a real implementation, this would load more products
        });
    }
}

// Initialize product cards with event listeners
function initializeProductCards() {
    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-product-id'));
            openQuickView(productId);
        });
    });

    // Add to cart buttons on product cards
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const productId = parseInt(btn.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
                showToast(`${product.brand} ${product.material} added to cart!`, 'success');
            }
        });
    });

    // Re-initialize cart buttons when DOM changes
    function reinitializeCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const productId = parseInt(btn.getAttribute('data-product-id'));
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    addToCart(product);
                    showToast(`${product.brand} ${product.material} added to cart!`, 'success');
                }
            });
        });
    }

    // Add to wishlist buttons
    document.querySelectorAll('.add-to-wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                showToast(`${product.brand} ${product.material} added to wishlist!`, 'success');
                // In a real implementation, this would add to wishlist
            }
        });
    });
}

// Open quick view modal for a product
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    const quickViewContent = document.getElementById('quick-view-content');
    
    if (product && quickViewContent) {
        // Populate quick view modal
        quickViewContent.innerHTML = `
            <div class="quick-view-layout">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.material}">
                </div>
                <div class="quick-view-details">
                    <h3 class="product-brand">${product.brand}</h3>
                    <p class="product-material">${product.material}</p>
                    <p class="product-size">Size: ${product.size}</p>
                    <p class="product-condition">Condition: ${product.condition}</p>
                    <div class="product-price">₹${product.price}</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-card-buttons">
                        <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                            <i class="fas fa-shopping-bag"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline add-to-wishlist-btn" data-product-id="${product.id}">
                            <i class="far fa-heart"></i> Wishlist
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        quickViewModal.style.display = 'block';
        cartOverlay.classList.add('active');
        
        // Add event listener to Add to Cart button in modal
        quickViewContent.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
            showToast(`${product.brand} ${product.material} added to cart!`, 'success');
            quickViewModal.style.display = 'none';
            cartOverlay.classList.remove('active');
        });
        
        // Add event listener to Add to Wishlist button in modal
        quickViewContent.querySelector('.add-to-wishlist-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showToast(`${product.brand} ${product.material} added to wishlist!`, 'success');
            // In a real implementation, this would add to wishlist
        });
    }
    
    // Close button for quick view
    document.getElementById('close-quick-view').addEventListener('click', () => {
        quickViewModal.style.display = 'none';
        cartOverlay.classList.remove('active');
    });
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            quantity: 1
        });
    }
    
    // Update cart display
    updateCart();
    
    // Show cart panel
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
    
    // Add animation to cart badge
    cartBadge.classList.add('pulse');
    setTimeout(() => {
        cartBadge.classList.remove('pulse');
    }, 1000);
}

// Update cart display
function updateCart() {
    // Update cart badge
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-product-id="${item.product.id}">
                <div class="cart-item-image">
                    <img src="${item.product.image}" alt="${item.product.material}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.product.brand} - ${item.product.material}</h4>
                    <p>Size: ${item.product.size}</p>
                    <p>₹${item.product.price}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease-btn" data-product-id="${item.product.id}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-product-id="${item.product.id}">+</button>
                        <button class="remove-item" data-product-id="${item.product.id}">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-product-id'));
                decreaseQuantity(productId);
            });
        });
        
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-product-id'));
                increaseQuantity(productId);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-product-id'));
                removeFromCart(productId);
            });
        });
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cartTotal.textContent = `₹${total}`;
}

// Cart quantity functions
function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.product.id === productId);
    
    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
        
        updateCart();
    }
}

function increaseQuantity(productId) {
    const cartItem = cart.find(item => item.product.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
        updateCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCart();
    showToast('Item removed from cart', 'success');
}

// Process order using Stripe payment gateway
function processOrder() {
    // Get shipping details from form
    const name = document.getElementById('checkout-name').value;
    const email = document.getElementById('checkout-email').value;
    const address = document.getElementById('checkout-address').value;
    const pincode = document.getElementById('checkout-pincode').value;
    
    // Format cart items for the payment server
    const cartItems = cart.map(item => ({
        brand: item.product.brand,
        material: item.product.material,
        size: item.product.size,
        price: item.product.price.toString(),
        quantity: item.quantity
    }));
    
    // Shipping details object
    const shippingDetails = {
        name: name,
        email: email,
        address: address,
        pincode: pincode
    };
    
    // Initialize Stripe
    const stripe = Stripe("pk_test_51RHteSB6tFqDlZGWzhxHouNYohbmGG6qacgE0noheKS4J0EPuovxuGJqgvV0slENwREkGeAFEu9LG8r2mYjSUNfM00NpUCxwFM");
    
    // Show loading indicator
    showToast('Processing your order...', 'info');
    
    // Create checkout session - using our payment server on port 5001
    fetch("http://127.0.0.1:5001/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            items: cartItems,
            shipping: shippingDetails
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then(data => {
        // Redirect to Stripe Checkout
        stripe.redirectToCheckout({ sessionId: data.id });
        
        // Listen for payment completion message
        window.addEventListener('message', function(event) {
            if (event.data === 'payment_success') {
                // Clear cart after successful payment
                cart = [];
                updateCart();
                showToast('Payment successful! Your order has been placed.', 'success');
                
                // Close checkout panel
                checkoutContainer.classList.remove('active');
                cartOverlay.classList.remove('active');
                
                // Add order to dashboard
                addNewOrder();
            } else if (event.data === 'payment_cancelled') {
                showToast('Payment was cancelled. Your cart items are still saved.', 'error');
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Payment processing error. Please try again.', 'error');
    });
}


// Add new order to dashboard
function addNewOrder() {
    const ordersContainer = document.getElementById('orders-section');
    const orderDate = new Date().toLocaleDateString();
    const orderTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const orderItems = cart.map(item => `${item.product.brand} ${item.product.material}`).join(', ');
    
    const orderHtml = `
        <div class="order-card">
            <div class="order-header">
                <span>Order #${Math.floor(Math.random() * 10000)}</span>
                <span>${orderDate}</span>
            </div>
            <div class="order-items">
                <p>Items: ${orderItems}</p>
            </div>
            <div class="order-footer">
                <span>Total: ₹${orderTotal}</span>
                <span class="order-status processing">Processing</span>
            </div>
            <button class="btn btn-sm btn-outline track-order-btn">Track Order</button>
        </div>
    `;
    
    // Add to beginning of orders list
    const firstChild = ordersContainer.firstChild;
    const orderElement = document.createElement('div');
    orderElement.innerHTML = orderHtml;
    ordersContainer.insertBefore(orderElement.firstChild, firstChild);
}

// Add new listing to dashboard
function addNewListing() {
    const listingsContainer = document.getElementById('listings-section');
    const material = document.getElementById('material').value || 'New Item';
    const brand = document.getElementById('brand').value || 'Your Brand';
    const size = document.getElementById('size').value || 'M';
    const price = document.getElementById('price').value || '1000';
    
    const listingHtml = `
        <div class="listing-item">
            <div class="listing-image">
                <div class="listing-status active">Active</div>
                <img src="../images/products/product-placeholder.jpg" alt="${material}">
            </div>
            <div class="listing-details">
                <h4>${brand} - ${material}</h4>
                <p>Size: ${size}</p>
                <p>₹${price}</p>
            </div>
            <div class="listing-actions">
                <button class="btn btn-sm btn-outline">Edit</button>
                <button class="btn btn-sm btn-secondary">Delete</button>
            </div>
        </div>
    `;
    
    // Add to beginning of listings
    const firstChild = listingsContainer.firstChild;
    const listingElement = document.createElement('div');
    listingElement.innerHTML = listingHtml;
    listingsContainer.insertBefore(listingElement.firstChild, firstChild);
    
    // Reset form
    document.getElementById('sell-form').reset();
}

// Filter products
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const size = document.getElementById('size-filter').value;
    const price = document.getElementById('price-filter').value;
    const condition = document.getElementById('condition-filter').value;
    
    showToast(`Filters applied: ${category}, ${size}, ${price}, ${condition}`, 'success');
    // In a real implementation, this would filter the product grid
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.style.display = 'none';
    }
    
    const sellModal = document.getElementById('sell-modal');
    if (e.target === sellModal) {
        sellModal.style.display = 'none';
    }
});