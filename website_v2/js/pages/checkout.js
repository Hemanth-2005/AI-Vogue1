/**
 * AI Vogue - Version 2
 * Checkout Module
 * Handles the Cart Panel and Razorpay Checkout Flow for the Thrift Store
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cartToggleBtn = document.getElementById('cart-toggle');
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    
    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Initialize cart
    initializeCart();
    
    // Event Listeners
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', toggleCart);
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            // Show checkout form
            document.getElementById('checkout-container').classList.add('active');
            cartPanel.classList.remove('active');
        });
    }
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
    
    /**
     * Initializes the cart panel with items from localStorage
     */
    function initializeCart() {
        updateCartBadge();
        renderCartItems();
    }
    
    /**
     * Toggles the cart panel visibility
     */
    function toggleCart() {
        cartPanel.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.classList.toggle('panel-open');
    }
    
    /**
     * Closes the cart panel
     */
    function closeCart() {
        cartPanel.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.classList.remove('panel-open');
    }
    
    /**
     * Updates the cart badge with the number of items
     */
    function updateCartBadge() {
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }
    
    /**
     * Renders the cart items in the cart panel
     */
    function renderCartItems() {
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotal.textContent = '₹0';
            return;
        }
        
        let totalAmount = 0;
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            // Calculate item total and add to cart total
            const itemPrice = parseFloat(item.price.replace(/,/g, ''));
            const itemTotal = itemPrice * item.quantity;
            totalAmount += itemTotal;
            
            // Create cart item element
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.brand} ${item.material}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.brand}</h4>
                    <p>${item.material}</p>
                    <p>Size: ${item.size}</p>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update cart total
        cartTotal.textContent = `₹${totalAmount.toLocaleString()}`;
        
        // Add event listeners to cart item buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', () => updateItemQuantity(btn.dataset.id, -1));
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', () => updateItemQuantity(btn.dataset.id, 1));
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => removeItem(btn.dataset.id));
        });
    }
    
    /**
     * Updates the quantity of an item in the cart
     * @param {string} id - The ID of the item to update
     * @param {number} change - The amount to change the quantity by
     */
    function updateItemQuantity(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex === -1) return;
        
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.splice(itemIndex, 1);
        }
        
        // Update localStorage and UI
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
    }
    
    /**
     * Removes an item from the cart
     * @param {string} id - The ID of the item to remove
     */
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        
        // Update localStorage and UI
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
        
        showNotification('Item removed from cart', 'info');
    }
    
    /**
     * Handles the checkout form submission
     * @param {Event} e - The form submission event
     */
    function handleCheckout(e) {
        e.preventDefault();
        
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(checkoutForm);
        const orderDetails = {
            name: formData.get('name'),
            email: formData.get('email'),
            address: formData.get('address'),
            pincode: formData.get('pincode'),
            items: cart,
            total: cart.reduce((total, item) => {
                return total + (parseFloat(item.price.replace(/,/g, '')) * item.quantity);
            }, 0)
        };
        
        // Initialize Razorpay checkout
        initiateRazorpayCheckout(orderDetails);
    }
    
    /**
     * Initiates the Razorpay checkout process
     * @param {Object} orderDetails - The order details
     */
    function initiateRazorpayCheckout(orderDetails) {
        // In a real app, you would make an API call to your backend to create an order
        // and get the order ID from Razorpay. For this demo, we'll simulate it.
        
        console.log('Initiating Razorpay checkout with order details:', orderDetails);
        
        // Simulating a successful payment for demo purposes
        setTimeout(() => {
            // Clear cart after successful payment
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
            
            // Hide checkout form
            document.getElementById('checkout-container').classList.remove('active');
            
            // Show success message
            showNotification('Payment successful! Your order has been placed.', 'success');
            
            // In a real app, you would redirect to an order confirmation page
            // or show an order tracking component
        }, 1500);
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
    
    // Make addToCart function globally available
    window.addToCart = function(productId) {
        // In a real app, you would fetch the product data from an API
        // For this demo, we'll use the sample product data from productCard.js
        let product;
        
        // Check if the product is from the sample data or a new listing
        if (productId.startsWith('new-')) {
            // This is a newly listed product, get data from DOM
            const productCard = document.querySelector(`.quick-view-btn[data-product-id="${productId}"]`).closest('.product-card');
            
            product = {
                id: productId,
                brand: productCard.querySelector('.product-brand').textContent,
                material: productCard.querySelector('.product-material').textContent,
                size: productCard.querySelector('.product-size').textContent.replace('Size: ', ''),
                price: productCard.querySelector('.product-price').textContent.replace('₹', ''),
                image: productCard.querySelector('.product-image img').src,
                quantity: 1
            };
        } else if (window.productData && window.productData[productId]) {
            // This is from the sample product data
            const productData = window.productData[productId];
            product = {
                id: productId,
                brand: productData.brand,
                material: productData.material,
                size: productData.size,
                price: productData.price,
                image: productData.image,
                quantity: 1
            };
        } else {
            console.error('Product not found:', productId);
            return;
        }
        
        // Check if product is already in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            // Increase quantity if already in cart
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            cart.push(product);
        }
        
        // Update localStorage and UI
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
        
        // Show notification
        showNotification('Product added to cart!', 'success');
        
        // Open cart panel
        toggleCart();
    };
});