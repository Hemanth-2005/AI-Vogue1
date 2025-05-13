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
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartBadge = document.getElementById('cart-badge');
const cartTotal = document.getElementById('cart-total');
const checkoutContainer = document.getElementById('checkout-container');

// User dashboard functionality
const userDashboard = document.getElementById('user-dashboard');
const dashboardTabs = document.querySelectorAll('.dashboard-tab');
const dashboardSections = document.querySelectorAll('.dashboard-section');

// Toggle cart panel
document.getElementById('cart-toggle').addEventListener('click', () => {
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
});

document.getElementById('close-cart').addEventListener('click', () => {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartPanel.classList.remove('active');
    checkoutContainer.classList.remove('active');
    userDashboard.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Toggle checkout panel
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        cartPanel.classList.remove('active');
        checkoutContainer.classList.add('active');
    }
});

document.getElementById('close-checkout').addEventListener('click', () => {
    checkoutContainer.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Toggle user dashboard
document.getElementById('dashboard-toggle').addEventListener('click', () => {
    userDashboard.classList.add('active');
    cartOverlay.classList.add('active');
});

document.getElementById('close-dashboard').addEventListener('click', () => {
    userDashboard.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Dashboard tabs functionality
dashboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab
        dashboardTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active section
        dashboardSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === tabId) {
                section.classList.add('active');
            }
        });
    });
});

// Start selling modal
const sellModal = document.getElementById('sell-modal');

document.getElementById('start-selling-btn').addEventListener('click', () => {
    sellModal.style.display = 'block';
});

document.getElementById('close-sell-modal').addEventListener('click', () => {
    sellModal.style.display = 'none';
});

// Quick view modal
const quickViewModal = document.getElementById('quick-view-modal');
const quickViewContent = document.getElementById('quick-view-content');

document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = parseInt(btn.getAttribute('data-product-id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
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
                        <div class="quick-view-actions">
                            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                            <button class="btn btn-outline add-to-wishlist-btn" data-product-id="${product.id}">Add to Wishlist</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Show modal
            quickViewModal.style.display = 'block';
            
            // Add event listener to Add to Cart button
            document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                addToCart(product);
                quickViewModal.style.display = 'none';
            });
        }
    });
});

document.getElementById('close-quick-view').addEventListener('click', () => {
    quickViewModal.style.display = 'none';
});

// Add to cart functionality
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
    
    updateCart();
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
}

// Checkout form submission
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate successful order
    alert('Order placed successfully! Thank you for shopping with AI Vogue.');
    
    // Clear cart and close checkout
    cart = [];
    updateCart();
    checkoutContainer.classList.remove('active');
    cartOverlay.classList.remove('active');
    
    // Add to orders in dashboard (demo)
    const ordersContainer = document.getElementById('orders-container');
    const orderDate = new Date().toLocaleDateString();
    const orderTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const orderHtml = `
        <div class="order-card">
            <div class="order-header">
                <span>Order #${Math.floor(Math.random() * 10000)}</span>
                <span>${orderDate}</span>
            </div>
            <div class="order-items">
                <p>Items: ${cart.length}</p>
            </div>
            <div class="order-footer">
                <span>Total: ₹${orderTotal}</span>
                <span class="order-status processing">Processing</span>
            </div>
        </div>
    `;
    
    ordersContainer.innerHTML = orderHtml + ordersContainer.innerHTML;
});

// Sell form submission
document.getElementById('sell-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate successful listing
    alert('Your item has been listed successfully!');
    
    // Close modal
    sellModal.style.display = 'none';
    
    // Add to listings in dashboard (demo)
    const listingsContainer = document.getElementById('listings-container');
    const material = document.getElementById('material').value;
    const brand = document.getElementById('brand').value;
    const size = document.getElementById('size').value;
    const price = document.getElementById('price').value;
    
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
    
    listingsContainer.innerHTML = listingHtml + listingsContainer.innerHTML;
    
    // Reset form
    document.getElementById('sell-form').reset();
});

// Image preview for sell form
document.getElementById('product-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const imagePreview = document.getElementById('image-preview');
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product Preview">`;
        }
        
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '<div class="upload-placeholder">Upload Image</div>';
    }
});

// Filter functionality
document.getElementById('category-filter').addEventListener('change', filterProducts);
document.getElementById('size-filter').addEventListener('change', filterProducts);
document.getElementById('price-filter').addEventListener('change', filterProducts);
document.getElementById('sort-by').addEventListener('change', filterProducts);

function filterProducts() {
    // This would filter the product grid based on selected filters
    // For demo purposes, we'll just show an alert
    alert('Filters applied! This would filter the product grid in a real implementation.');
}

// Initialize cart
updateCart();

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.style.display = 'none';
    }
    if (e.target === sellModal) {
        sellModal.style.display = 'none';
    }
});