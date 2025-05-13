/**
 * AI Vogue - Version 2
 * Product Card Module
 * Handles the Product Card and Quick View Modal functionality for the Thrift Store
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const quickViewModal = document.getElementById('quick-view-modal');
    const closeQuickViewBtn = document.getElementById('close-quick-view');
    const quickViewContent = document.getElementById('quick-view-content');
    
    // Sample product data (in a real app, this would come from a database)
    const productData = {
        '1': {
            id: '1',
            brand: 'Levi\'s',
            material: 'Denim Jacket',
            description: 'Classic denim jacket with button closure. Perfect for layering in any season.',
            size: 'M',
            condition: 'Like New',
            price: '1,200',
            seller: 'priya@example.com',
            image: '../images/products/product-1.jpg',
            badges: ['Like New', 'Eco-Friendly']
        },
        '2': {
            id: '2',
            brand: 'Zara',
            material: 'Floral Dress',
            description: 'Beautiful floral print dress with a flowy silhouette. Great for summer occasions.',
            size: 'S',
            condition: 'Gently Used',
            price: '800',
            seller: 'amit@example.com',
            image: '../images/products/product-2.jpg',
            badges: ['Gently Used']
        },
        '3': {
            id: '3',
            brand: 'Coach',
            material: 'Leather Bag',
            description: 'Authentic Coach leather bag with signature pattern. Spacious interior with multiple pockets.',
            size: 'One Size',
            condition: 'Vintage',
            price: '2,500',
            seller: 'sara@example.com',
            image: '../images/products/product-3.jpg',
            badges: ['Vintage', 'Premium']
        }
    };
    
    // Initialize Quick View buttons
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-product-id');
            openQuickView(productId);
        });
    });
    
    // Close Quick View modal
    if (closeQuickViewBtn) {
        closeQuickViewBtn.addEventListener('click', () => {
            quickViewModal.classList.remove('modal-active');
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close modal when clicking outside
    if (quickViewModal) {
        quickViewModal.addEventListener('click', (e) => {
            if (e.target === quickViewModal) {
                quickViewModal.classList.remove('modal-active');
                document.body.classList.remove('modal-open');
            }
        });
    }
    
    /**
     * Opens the Quick View modal with product details
     * @param {string} productId - The ID of the product to display
     */
    function openQuickView(productId) {
        // Get product data
        const product = productData[productId];
        
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }
        
        // Update modal title
        const modalTitle = document.getElementById('quick-view-title');
        if (modalTitle) {
            modalTitle.textContent = `${product.brand} - ${product.material}`;
        }
        
        // Populate quick view content
        quickViewContent.innerHTML = `
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.brand} ${product.material}">
            </div>
            <div class="quick-view-details">
                <h3 class="quick-view-brand">${product.brand}</h3>
                <p class="quick-view-material">${product.material}</p>
                <div class="quick-view-price">₹${product.price}</div>
                
                <div class="quick-view-info">
                    <div class="info-item">
                        <span class="info-label">Condition:</span>
                        <span>${product.condition}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Size:</span>
                        <span>${product.size}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Seller:</span>
                        <span>${product.seller}</span>
                    </div>
                </div>
                
                <p class="product-description">${product.description}</p>
                
                <div class="quick-view-actions">
                    <button class="btn btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
                    <button class="btn btn-outline" onclick="addToWishlist('${product.id}')">Add to Wishlist</button>
                </div>
            </div>
        `;
        
        // Show modal
        quickViewModal.classList.add('modal-active');
        document.body.classList.add('modal-open');
    }
    
    // Make the function globally available
    window.initializeQuickView = openQuickView;
    
    // Placeholder functions for cart and wishlist
    window.addToCart = function(productId) {
        console.log('Adding to cart:', productId);
        showNotification('Product added to cart!', 'success');
        
        // In a real app, this would add the product to the cart
        // and potentially make an API call to update the server
    };
    
    window.addToWishlist = function(productId) {
        console.log('Adding to wishlist:', productId);
        showNotification('Product added to wishlist!', 'info');
        
        // In a real app, this would add the product to the wishlist
        // and potentially make an API call to update the server
    };
    
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