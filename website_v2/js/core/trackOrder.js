/**
 * AI Vogue - Version 2
 * Order Tracking Module
 * Handles the Order Tracking UI component with animated steps
 */

/**
 * Creates and displays an order tracking component
 * @param {Object} options - Configuration options
 * @param {string} options.containerId - ID of the container element
 * @param {Object} options.orderData - Order tracking data
 * @param {string} options.orderData.orderId - The order ID
 * @param {string} options.orderData.status - Current status (confirmed, packed, shipped, delivered)
 * @param {Array} options.orderData.steps - Array of step objects with name, date, and completed status
 * @param {string} options.orderData.eta - Estimated time of arrival
 */
function createOrderTracker(options) {
    const { containerId, orderData } = options;
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container element with ID '${containerId}' not found`);
        return;
    }
    
    // Create tracking component HTML
    let stepsHtml = '';
    orderData.steps.forEach((step, index) => {
        const stepClass = step.completed ? 'completed' : '';
        const activeClass = step.active ? 'active' : '';
        const lineClass = index < orderData.steps.length - 1 ? 
            (orderData.steps[index + 1].completed ? 'completed' : '') : '';
        
        stepsHtml += `
            <div class="tracking-step ${stepClass} ${activeClass}">
                <div class="step-indicator">
                    <div class="step-icon"></div>
                    ${index < orderData.steps.length - 1 ? 
                        `<div class="step-line ${lineClass}"></div>` : ''}
                </div>
                <div class="step-content">
                    <div class="step-name">${step.name}</div>
                    <div class="step-date">${step.date || 'Pending'}</div>
                </div>
            </div>
        `;
    });
    
    const trackingHtml = `
        <div class="order-tracker">
            <div class="tracking-header">
                <div class="tracking-order-id">Order ID: ${orderData.orderId}</div>
                <div class="tracking-eta">${orderData.eta}</div>
            </div>
            <div class="tracking-steps">
                ${stepsHtml}
            </div>
        </div>
    `;
    
    // Set the HTML content
    container.innerHTML = trackingHtml;
    
    // Add animation after a short delay
    setTimeout(() => {
        animateTrackingSteps(container);
    }, 500);
}

/**
 * Animates the tracking steps sequentially
 * @param {HTMLElement} container - The container element
 */
function animateTrackingSteps(container) {
    const steps = container.querySelectorAll('.tracking-step');
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('animate');
            
            // Animate the line to the next step
            const line = step.querySelector('.step-line');
            if (line && step.classList.contains('completed')) {
                setTimeout(() => {
                    line.classList.add('animate');
                }, 300);
            }
        }, index * 600);
    });
}

/**
 * Updates an existing order tracker with new data
 * @param {Object} options - Configuration options
 * @param {string} options.containerId - ID of the container element
 * @param {Object} options.orderData - Updated order tracking data
 */
function updateOrderTracker(options) {
    // Remove existing tracker
    const container = document.getElementById(options.containerId);
    if (container) {
        container.innerHTML = '';
    }
    
    // Create new tracker with updated data
    createOrderTracker(options);
}

// Export functions for use in other modules
window.OrderTracker = {
    create: createOrderTracker,
    update: updateOrderTracker
};