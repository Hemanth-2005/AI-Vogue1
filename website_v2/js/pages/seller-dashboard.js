/**
 * Seller Dashboard Module
 * Handles the Seller Dashboard functionality for the Thrift Store
 * Includes product listing form and user's listings management
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sellItemBtn = document.getElementById('sell-item-btn');
    const sellerDashboardModal = document.getElementById('seller-dashboard-modal');
    const closeSellerDashboardBtn = document.getElementById('close-seller-dashboard');
    const sellerForm = document.getElementById('seller-form');
    const productImageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('item-image-preview');
    const dashboardTabs = document.querySelectorAll('.seller-dashboard-tab');
    const dashboardSections = document.querySelectorAll('.seller-dashboard-section');
    const myListingsContainer = document.getElementById('my-listings-container');
    const cartOverlay = document.getElementById('cart-overlay');
    const toastContainer = document.querySelector('.toast-container');
    
    // User's listings array
    let userListings = [];
    
    // Initialize the dashboard
    function initSellerDashboard() {
        if (!sellItemBtn || !sellerDashboardModal) return;
        
        // Open dashboard when sell button is clicked
        sellItemBtn.addEventListener('click', () => {
            sellerDashboardModal.classList.add('modal-active');
            cartOverlay.classList.add('active');
            loadUserListings();
        });
        
        // Close dashboard when close button is clicked
        if (closeSellerDashboardBtn) {
            closeSellerDashboardBtn.addEventListener('click', () => {
                sellerDashboardModal.classList.remove('modal-active');
                cartOverlay.classList.remove('active');
            });
        }
        
        // Close dashboard when clicking outside
        cartOverlay.addEventListener('click', () => {
            sellerDashboardModal.classList.remove('modal-active');
            cartOverlay.classList.remove('active');
        });
        
        // Handle tab switching
        dashboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and sections
                dashboardTabs.forEach(t => t.classList.remove('active'));
                dashboardSections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding section
                tab.classList.add('active');
                const targetSection = document.getElementById(tab.dataset.target);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
        
        // Handle image preview
        if (productImageInput) {
            productImageInput.addEventListener('change', handleImagePreview);
        }
        
        // Handle form submission
        if (sellerForm) {
            sellerForm.addEventListener('submit', handleProductSubmission);
        }
    }
    
    // Handle image preview
    function handleImagePreview(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            imagePreview.innerHTML = `<img src="${event.target.result}" alt="Product Preview">`;
            imagePreview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }
    
    // Handle product submission
    function handleProductSubmission(e) {
        e.preventDefault();
        
        // Get form values
        const brand = document.getElementById('brand').value;
        const material = document.getElementById('material').value;
        const size = document.getElementById('size').value;
        const condition = document.getElementById('condition').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;
        const imageFile = productImageInput.files[0];
        
        // Create a new product object
        const newProduct = {
            id: Date.now(), // Use timestamp as unique ID
            brand,
            material,
            size,
            price: parseFloat(price),
            condition,
            description,
            image: imageFile ? URL.createObjectURL(imageFile) : '../images/products/placeholder.jpg',
            userId: 'current-user', // In a real app, this would be the actual user ID
            dateAdded: new Date().toISOString()
        };
        
        // Add to user's listings
        userListings.push(newProduct);
        
        // Save to localStorage (in a real app, this would be saved to a database)
        saveUserListings();
        
        // Add to product grid
        addProductToGrid(newProduct);
        
        // Update My Listings section
        updateMyListings();
        
        // Show success toast
        showToast('Product added successfully!', 'success');
        
        // Reset form
        sellerForm.reset();
        imagePreview.innerHTML = `
            <div class="upload-placeholder">
                <i class="fas fa-cloud-upload-alt fa-2x"></i>
                <p>Click to upload images</p>
            </div>
        `;
        imagePreview.classList.remove('has-image');
        
        // Switch to My Listings tab
        dashboardTabs.forEach(t => t.classList.remove('active'));
        dashboardSections.forEach(s => s.classList.remove('active'));
        
        const myListingsTab = document.querySelector('[data-target="my-listings-section"]');
        if (myListingsTab) {
            myListingsTab.classList.add('active');
            const myListingsSection = document.getElementById('my-listings-section');
            if (myListingsSection) {
                myListingsSection.classList.add('active');
            }
        }
    }
    
    // Add product to the main product grid
    function addProductToGrid(product) {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = product.id;
        
        productCard.innerHTML = `
            <div class="product-badge ${getBadgeClass(product.condition)}">${product.condition}</div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.material}">
                <div class="product-actions">
                    <button class="product-action-btn quick-view-btn" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="product-action-btn add-to-wishlist-btn" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="product-action-btn add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.material}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-meta">
                    <span class="product-size">Size: ${product.size}</span>
                    <span class="product-condition">Condition: ${product.condition}</span>
                </div>
            </div>
        `;
        
        productGrid.prepend(productCard);
    }
    
    // Get badge class based on condition
    function getBadgeClass(condition) {
        switch(condition) {
            case 'New with tags': return 'badge-like-new';
            case 'Like New': return 'badge-like-new';
            case 'Good': return 'badge-gently-used';
            case 'Fair': return 'badge-vintage';
            default: return 'badge-gently-used';
        }
    }
    
    // Load user's listings from localStorage
    function loadUserListings() {
        const savedListings = localStorage.getItem('userListings');
        if (savedListings) {
            userListings = JSON.parse(savedListings);
            updateMyListings();
        }
    }
    
    // Save user's listings to localStorage
    function saveUserListings() {
        localStorage.setItem('userListings', JSON.stringify(userListings));
    }
    
    // Update My Listings section
    function updateMyListings() {
        if (!myListingsContainer) return;
        
        if (userListings.length === 0) {
            myListingsContainer.innerHTML = `
                <div class="empty-listings">
                    <i class="fas fa-box-open fa-3x"></i>
                    <p>You haven't listed any items yet</p>
                    <button class="btn btn-primary seller-dashboard-tab" data-target="add-product-section">Add Your First Item</button>
                </div>
            `;
            
            // Add event listener to the newly created button
            const addFirstItemBtn = myListingsContainer.querySelector('button');
            if (addFirstItemBtn) {
                addFirstItemBtn.addEventListener('click', () => {
                    dashboardTabs.forEach(t => t.classList.remove('active'));
                    dashboardSections.forEach(s => s.classList.remove('active'));
                    
                    const addProductTab = document.querySelector('[data-target="add-product-section"]');
                    if (addProductTab) {
                        addProductTab.classList.add('active');
                        const addProductSection = document.getElementById('add-product-section');
                        if (addProductSection) {
                            addProductSection.classList.add('active');
                        }
                    }
                });
            }
            return;
        }
        
        myListingsContainer.innerHTML = '';
        
        userListings.forEach(listing => {
            const listingItem = document.createElement('div');
            listingItem.className = 'listing-item';
            listingItem.dataset.listingId = listing.id;
            
            listingItem.innerHTML = `
                <div class="listing-image">
                    <img src="${listing.image}" alt="${listing.material}">
                    <div class="listing-status active">Active</div>
                </div>
                <div class="listing-details">
                    <h4>${listing.material}</h4>
                    <p class="listing-price">$${listing.price.toFixed(2)}</p>
                    <div class="listing-meta">
                        <span>Size: ${listing.size}</span>
                        <span>Condition: ${listing.condition}</span>
                    </div>
                </div>
                <div class="listing-actions">
                    <button class="btn btn-sm btn-outline edit-listing-btn" data-listing-id="${listing.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-listing-btn" data-listing-id="${listing.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            
            myListingsContainer.appendChild(listingItem);
        });
        
        // Add event listeners to edit and delete buttons
        const editButtons = myListingsContainer.querySelectorAll('.edit-listing-btn');
        const deleteButtons = myListingsContainer.querySelectorAll('.delete-listing-btn');
        
        editButtons.forEach(btn => {
            btn.addEventListener('click', handleEditListing);
        });
        
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', handleDeleteListing);
        });
    }
    
    // Handle edit listing
    function handleEditListing(e) {
        const listingId = parseInt(e.currentTarget.dataset.listingId);
        const listing = userListings.find(item => item.id === listingId);
        
        if (!listing) return;
        
        // Switch to Add Product tab
        dashboardTabs.forEach(t => t.classList.remove('active'));
        dashboardSections.forEach(s => s.classList.remove('active'));
        
        const addProductTab = document.querySelector('[data-target="add-product-section"]');
        if (addProductTab) {
            addProductTab.classList.add('active');
            const addProductSection = document.getElementById('add-product-section');
            if (addProductSection) {
                addProductSection.classList.add('active');
            }
        }
        
        // Fill form with listing data
        document.getElementById('brand').value = listing.brand;
        document.getElementById('material').value = listing.material;
        document.getElementById('size').value = listing.size;
        document.getElementById('condition').value = listing.condition;
        document.getElementById('price').value = listing.price;
        document.getElementById('description').value = listing.description || '';
        
        // Update image preview
        imagePreview.innerHTML = `<img src="${listing.image}" alt="Product Preview">`;
        imagePreview.classList.add('has-image');
        
        // Update form to handle edit instead of add
        sellerForm.dataset.mode = 'edit';
        sellerForm.dataset.editId = listingId;
        
        // Change submit button text
        const submitBtn = sellerForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Update Product';
        }
        
        // Add cancel button if it doesn't exist
        if (!sellerForm.querySelector('.cancel-edit-btn')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn btn-outline cancel-edit-btn';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.addEventListener('click', () => {
                resetForm();
            });
            submitBtn.parentNode.insertBefore(cancelBtn, submitBtn);
        }
        
        // Update form submission handler
        sellerForm.onsubmit = function(e) {
            e.preventDefault();
            
            // Get form values
            const brand = document.getElementById('brand').value;
            const material = document.getElementById('material').value;
            const size = document.getElementById('size').value;
            const condition = document.getElementById('condition').value;
            const price = document.getElementById('price').value;
            const description = document.getElementById('description').value;
            const imageFile = productImageInput.files[0];
            
            // Find the listing to update
            const listingIndex = userListings.findIndex(item => item.id === listingId);
            
            if (listingIndex !== -1) {
                // Update listing
                userListings[listingIndex] = {
                    ...userListings[listingIndex],
                    brand,
                    material,
                    size,
                    price: parseFloat(price),
                    condition,
                    description,
                    // Only update image if a new one was selected
                    image: imageFile ? URL.createObjectURL(imageFile) : userListings[listingIndex].image
                };
                
                // Save to localStorage
                saveUserListings();
                
                // Update product in grid
                updateProductInGrid(userListings[listingIndex]);
                
                // Update My Listings section
                updateMyListings();
                
                // Show success toast
                showToast('Product updated successfully!', 'success');
                
                // Reset form
                resetForm();
            }
        };
    }
    
    // Handle delete listing
    function handleDeleteListing(e) {
        const listingId = parseInt(e.currentTarget.dataset.listingId);
        
        // Confirm deletion
        if (confirm('Are you sure you want to delete this listing?')) {
            // Find the listing index
            const listingIndex = userListings.findIndex(item => item.id === listingId);
            
            if (listingIndex !== -1) {
                // Remove from userListings array
                userListings.splice(listingIndex, 1);
                
                // Save to localStorage
                saveUserListings();
                
                // Remove from product grid
                const productCard = document.querySelector(`.product-card[data-product-id="${listingId}"]`);
                if (productCard) {
                    productCard.remove();
                }
                
                // Update My Listings section
                updateMyListings();
                
                // Show success toast
                showToast('Product deleted successfully!', 'success');
            }
        }
    }
    
    // Update product in the main product grid
    function updateProductInGrid(product) {
        const productCard = document.querySelector(`.product-card[data-product-id="${product.id}"]`);
        if (!productCard) return;
        
        // Update product card content
        productCard.innerHTML = `
            <div class="product-badge ${getBadgeClass(product.condition)}">${product.condition}</div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.material}">
                <div class="product-actions">
                    <button class="product-action-btn quick-view-btn" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="product-action-btn add-to-wishlist-btn" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="product-action-btn add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.material}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-meta">
                    <span class="product-size">Size: ${product.size}</span>
                    <span class="product-condition">Condition: ${product.condition}</span>
                </div>
            </div>
        `;
    }
    
    // Reset form to add mode
    function resetForm() {
        sellerForm.reset();
        sellerForm.dataset.mode = 'add';
        delete sellerForm.dataset.editId;
        
        // Reset image preview
        imagePreview.innerHTML = `
            <div class="upload-placeholder">
                <i class="fas fa-cloud-upload-alt fa-2x"></i>
                <p>Click to upload images</p>
            </div>
        `;
        imagePreview.classList.remove('has-image');
        
        // Reset submit button text
        const submitBtn = sellerForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Add This Product to Store';
        }
        
        // Remove cancel button if it exists
        const cancelBtn = sellerForm.querySelector('.cancel-edit-btn');
        if (cancelBtn) {
            cancelBtn.remove();
        }
        
        // Reset form submission handler
        sellerForm.onsubmit = handleProductSubmission;
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div class="toast-message">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after animation completes
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // Initialize the dashboard
    initSellerDashboard();
});