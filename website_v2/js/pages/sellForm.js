/**
 * AI Vogue - Version 2
 * Sell Form Module
 * Handles the Start Selling Modal functionality for the Thrift Store
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sellButton = document.getElementById('start-selling-btn');
    const sellModal = document.getElementById('sell-modal');
    const closeModalBtn = document.getElementById('close-sell-modal');
    const sellForm = document.getElementById('sell-form');
    const imagePreview = document.getElementById('image-preview');
    const imageUpload = document.getElementById('product-image');
    const productGrid = document.querySelector('.product-grid');
    
    // Open modal when sell button is clicked
    if (sellButton) {
        sellButton.addEventListener('click', () => {
            sellModal.classList.add('modal-active');
            document.body.classList.add('modal-open');
            
            // Pre-fill email if user is logged in
            const userEmail = document.getElementById('user-email');
            if (userEmail && localStorage.getItem('userEmail')) {
                userEmail.value = localStorage.getItem('userEmail');
            }
        });
    }
    
    // Close modal when close button is clicked
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            sellModal.classList.remove('modal-active');
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close modal when clicking outside
    if (sellModal) {
        sellModal.addEventListener('click', (e) => {
            if (e.target === sellModal) {
                sellModal.classList.remove('modal-active');
                document.body.classList.remove('modal-open');
            }
        });
    }
    
    // Handle image preview
    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product preview">`;
                    imagePreview.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle form submission
    if (sellForm) {
        sellForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(sellForm);
            const productData = {
                material: formData.get('material'),
                size: formData.get('size'),
                brand: formData.get('brand'),
                condition: formData.get('condition'),
                price: formData.get('price'),
                email: formData.get('email'),
                image: imagePreview.querySelector('img')?.src || '../images/products/placeholder.svg'
            };
            
            // Add product to grid
            addProductToGrid(productData);
            
            // Reset form and close modal
            sellForm.reset();
            imagePreview.innerHTML = '<div class="upload-placeholder">Upload Image</div>';
            imagePreview.classList.remove('has-image');
            sellModal.classList.remove('modal-active');
            document.body.classList.remove('modal-open');
            
            // Show success message
            showNotification('Product listed successfully!', 'success');
        });
    }
    
    /**
     * Adds a new product to the product grid
     * @param {Object} productData - The product data
     */
    function addProductToGrid(productData) {
        if (!productGrid) return;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${productData.image}" alt="${productData.brand} ${productData.material}">
                <div class="product-badges">
                    <span class="badge badge-condition">${productData.condition}</span>
                </div>
                <button class="quick-view-btn" data-product-id="new-${Date.now()}">Quick View</button>
            </div>
            <div class="product-info">
                <h3 class="product-brand">${productData.brand}</h3>
                <p class="product-material">${productData.material}</p>
                <p class="product-size">Size: ${productData.size}</p>
                <div class="product-price">₹${productData.price}</div>
            </div>
        `;
        
        // Add to beginning of grid
        productGrid.insertBefore(productCard, productGrid.firstChild);
        
        // Initialize quick view for the new product
        const quickViewBtn = productCard.querySelector('.quick-view-btn');
        if (quickViewBtn && typeof initializeQuickView === 'function') {
            quickViewBtn.addEventListener('click', () => {
                initializeQuickView(productData);
            });
        }
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