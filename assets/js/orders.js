// Enhanced Order Manager with improved UX
const OrderManager = {
  currentOrder: {
    items: [],
    customer: {},
    discount: 0,
    total: 0,
  },
  searchTimeout: null,
  selectedCustomer: null,

  load() {
    console.log("Loading order management...")
    this.displayOrders()
  },

  displayOrders(ordersToShow = null) {
    try {
      const orders = ordersToShow || StorageManager.loadOrders()
      const container = document.getElementById("orders-container")

      if (!container) {
        console.error("Orders container not found")
        return
      }

      if (orders.length === 0) {
        container.innerHTML = "<p>No orders found.</p>"
        return
      }

      container.innerHTML = orders
        .map(
          (order) => `
        <div class="order-card">
          <div class="order-header">
            <div class="order-info">
              <h3>Order #${order.id}</h3>
              <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
              <p><strong>Date:</strong> ${Utils.formatDate(order.date)}</p>
            </div>
            <div class="order-total">${Utils.formatCurrency(order.total)}</div>
          </div>
          <div class="order-items">
            <h4>Items:</h4>
            ${order.items
              .map(
                (item) => `
              <div class="order-item">
                <span>${item.name} (${item.code})</span>
                <span>Qty: ${item.quantity} × ${Utils.formatCurrency(item.price)} = ${Utils.formatCurrency(item.quantity * item.price)}</span>
              </div>
            `,
              )
              .join("")}
            ${order.discount > 0 ? `<p><strong>Order Discount:</strong> ${order.discount}%</p>` : ""}
          </div>
          <div class="order-actions">
            <button class="btn btn-primary btn-small" onclick="OrderManager.editOrder('${order.id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-success btn-small" onclick="OrderManager.generateReceipt('${order.id}')">
              <i class="fas fa-receipt"></i> Receipt
            </button>
            <button class="btn btn-danger btn-small" onclick="OrderManager.deleteOrder('${order.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `,
        )
        .join("")
    } catch (error) {
      console.error("Error displaying orders:", error)
    }
  },

  searchOrders() {
    try {
      const searchInput = document.getElementById("order-search")
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""

      if (!searchTerm) {
        this.displayOrders()
        return
      }

      const orders = StorageManager.loadOrders()
      const filteredOrders = orders.filter(
        (order) =>
          Utils.searchInText(order.id, searchTerm) ||
          Utils.searchInText(order.customer.phone, searchTerm) ||
          Utils.searchInText(order.customer.name, searchTerm),
      )

      this.displayOrders(filteredOrders)
    } catch (error) {
      console.error("Error searching orders:", error)
    }
  },

  showNewOrderModal() {
    console.log("Showing enhanced new order modal...")
    this.resetOrder()
    this.loadMenuItems()
    this.updateCartDisplay()
    this.updateCompleteOrderButton()
    UIManager.showModal("order-modal")

    // Focus on customer search
    setTimeout(() => {
      const searchInput = document.getElementById("customer-search-input")
      if (searchInput) searchInput.focus()
    }, 100)
  },

  resetOrder() {
    this.currentOrder = {
      items: [],
      customer: {},
      discount: 0,
      total: 0,
    }
    this.selectedCustomer = null

    // Clear search inputs
    const customerSearch = document.getElementById("customer-search-input")
    const menuSearch = document.getElementById("menu-search-input")
    const discountInput = document.getElementById("order-discount-input")

    if (customerSearch) customerSearch.value = ""
    if (menuSearch) menuSearch.value = ""
    if (discountInput) discountInput.value = "0"

    // Clear customer results
    this.clearCustomerResults()
  },

  // Enhanced Customer Search
  searchCustomers() {
    const searchInput = document.getElementById("customer-search-input")
    const searchTerm = searchInput ? searchInput.value.trim() : ""

    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }

    // Debounce search
    this.searchTimeout = setTimeout(() => {
      this.performCustomerSearch(searchTerm)
    }, 300)
  },

  performCustomerSearch(searchTerm) {
    const resultsContainer = document.getElementById("customer-search-results")

    if (!resultsContainer) return

    if (!searchTerm) {
      this.clearCustomerResults()
      return
    }

    const customers = StorageManager.loadCustomers()
    const filteredCustomers = customers.filter(
      (customer) =>
        customer.phone.includes(searchTerm) || customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filteredCustomers.length > 0) {
      resultsContainer.innerHTML = `
        <div class="customer-search-results">
          <h5>Found Customers:</h5>
          ${filteredCustomers
            .map(
              (customer) => `
            <div class="customer-result-item" onclick="OrderManager.selectCustomer('${customer.id}')">
              <div class="customer-result-name">${customer.name}</div>
              <div class="customer-result-phone">${customer.phone}</div>
              ${customer.address ? `<div class="customer-result-address">${customer.address}</div>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `
    } else {
      resultsContainer.innerHTML = `
        <div class="customer-not-found">
          <i class="fas fa-user-plus" style="font-size: 2rem; color: #ccc; margin-bottom: 10px;"></i>
          <p>No customer found with "${searchTerm}"</p>
          <button class="add-new-customer-btn" onclick="OrderManager.showQuickAddCustomer('${searchTerm}')">
            <i class="fas fa-plus"></i>
            Add New Customer
          </button>
        </div>
      `
    }
  },

  selectCustomer(customerId) {
    const customers = StorageManager.loadCustomers()
    const customer = customers.find((c) => c.id === customerId)

    if (!customer) return

    this.selectedCustomer = customer
    this.currentOrder.customer = customer

    // Update UI to show selected customer
    const resultsContainer = document.getElementById("customer-search-results")
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="selected-customer-display">
          <div class="selected-customer-info">
            <div class="customer-avatar">
              ${customer.name.charAt(0).toUpperCase()}
            </div>
            <div class="customer-details">
              <h5>${customer.name}</h5>
              <p>${customer.phone}</p>
              ${customer.address ? `<p>${customer.address}</p>` : ""}
            </div>
            <button class="change-customer-btn" onclick="OrderManager.clearCustomerSelection()">
              Change
            </button>
          </div>
        </div>
      `
    }

    this.updateCompleteOrderButton()
    this.showNotification(`Customer ${customer.name} selected`, "success")
  },

  clearCustomerSelection() {
    this.selectedCustomer = null
    this.currentOrder.customer = {}

    const searchInput = document.getElementById("customer-search-input")
    if (searchInput) {
      searchInput.value = ""
      searchInput.focus()
    }

    this.clearCustomerResults()
    this.updateCompleteOrderButton()
  },

  clearCustomerResults() {
    const resultsContainer = document.getElementById("customer-search-results")
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="customer-search-placeholder">
          <i class="fas fa-search" style="font-size: 2rem; color: #ddd; margin-bottom: 10px;"></i>
          <p>Start typing to search for customers...</p>
        </div>
      `
    }
  },

  showQuickAddCustomer(phoneNumber = "") {
    // Show a quick add customer form
    const resultsContainer = document.getElementById("customer-search-results")
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="quick-add-customer-form">
          <h5><i class="fas fa-user-plus"></i> Add New Customer</h5>
          <div class="form-group">
            <input type="text" id="quick-customer-name" placeholder="Customer Name" required>
          </div>
          <div class="form-group">
            <input type="tel" id="quick-customer-phone" placeholder="Phone Number" value="${phoneNumber}" required>
          </div>
          <div class="form-group">
            <input type="text" id="quick-customer-address" placeholder="Address (Optional)">
          </div>
          <div class="quick-add-actions">
            <button class="btn btn-secondary btn-small" onclick="OrderManager.clearCustomerResults()">
              Cancel
            </button>
            <button class="btn btn-primary btn-small" onclick="OrderManager.saveQuickCustomer()">
              <i class="fas fa-save"></i> Save & Select
            </button>
          </div>
        </div>
      `

      // Focus on name input
      setTimeout(() => {
        const nameInput = document.getElementById("quick-customer-name")
        if (nameInput) nameInput.focus()
      }, 100)
    }
  },

  saveQuickCustomer() {
    const name = document.getElementById("quick-customer-name")?.value.trim()
    const phone = document.getElementById("quick-customer-phone")?.value.trim()
    const address = document.getElementById("quick-customer-address")?.value.trim()

    if (!name || !phone) {
      this.showNotification("Please enter customer name and phone number", "error")
      return
    }

    if (!Utils.validatePhone(phone)) {
      this.showNotification("Please enter a valid phone number", "error")
      return
    }

    // Check if customer already exists
    const customers = StorageManager.loadCustomers()
    const existingCustomer = customers.find((c) => c.phone === phone)

    if (existingCustomer) {
      this.selectCustomer(existingCustomer.id)
      return
    }

    // Create new customer
    const newCustomer = {
      id: Utils.generateCustomerId(),
      name: name,
      phone: phone,
      address: address,
      orders: [],
    }

    customers.push(newCustomer)
    StorageManager.saveCustomers(customers)

    // Select the new customer
    this.selectCustomer(newCustomer.id)

    // Update dashboard stats
    if (typeof DashboardManager !== "undefined" && DashboardManager.updateStats) {
      DashboardManager.updateStats()
    }
  },

  // Enhanced Menu Items Loading
  loadMenuItems() {
    try {
      const menuItems = StorageManager.loadMenuItems()
      const container = document.getElementById("menu-items-grid")

      if (!container) return

      // Group items by category
      const itemsByCategory = {}
      menuItems.forEach((item) => {
        if (!itemsByCategory[item.category]) {
          itemsByCategory[item.category] = []
        }
        itemsByCategory[item.category].push(item)
      })

      let html = ""
      Object.entries(itemsByCategory).forEach(([category, items]) => {
        items.forEach((item) => {
          const isExpired = Utils.isExpired(item.expiry)
          const isOutOfStock = item.quantity <= 0
          const isLowStock = item.quantity <= 5 && item.quantity > 0
          const discountedPrice = Utils.calculateDiscountedPrice(item.price, item.discount)
          const isDisabled = isExpired || isOutOfStock

          html += `
            <div class="menu-item-card ${isDisabled ? "disabled" : ""}" 
                 onclick="${!isDisabled ? `OrderManager.addItemToCart('${item.id}')` : ""}">
              <div class="menu-item-header">
                <div>
                  <h4 class="menu-item-name">${item.name}</h4>
                  <span class="menu-item-code">${item.id}</span>
                </div>
                ${!isDisabled ? `<button class="add-to-cart-btn" onclick="event.stopPropagation(); OrderManager.addItemToCart('${item.id}')">+</button>` : ""}
              </div>
              
              <div class="menu-item-price">
                ${Utils.formatCurrency(discountedPrice)}
                ${
                  item.discount > 0
                    ? `
                  <span class="original-price">${Utils.formatCurrency(item.price)}</span>
                  <span class="discount-badge">${item.discount}% OFF</span>
                `
                    : ""
                }
              </div>
              
              <div class="menu-item-stock">
                <span>Stock: ${item.quantity}</span>
                <span class="stock-status ${isOutOfStock ? "out-of-stock" : isLowStock ? "low-stock" : "in-stock"}">
                  ${isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                </span>
              </div>
              
              ${isExpired ? '<div class="expired-badge">EXPIRED</div>' : ""}
            </div>
          `
        })
      })

      container.innerHTML = html
    } catch (error) {
      console.error("Error loading menu items:", error)
    }
  },

  searchMenuItems() {
    const searchInput = document.getElementById("menu-search-input")
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""

    if (!searchTerm) {
      this.loadMenuItems()
      return
    }

    const menuItems = StorageManager.loadMenuItems()
    const filteredItems = menuItems.filter(
      (item) =>
        Utils.searchInText(item.name, searchTerm) ||
        Utils.searchInText(item.id, searchTerm) ||
        Utils.searchInText(item.category, searchTerm),
    )

    const container = document.getElementById("menu-items-grid")
    if (!container) return

    let html = ""
    filteredItems.forEach((item) => {
      const isExpired = Utils.isExpired(item.expiry)
      const isOutOfStock = item.quantity <= 0
      const isLowStock = item.quantity <= 5 && item.quantity > 0
      const discountedPrice = Utils.calculateDiscountedPrice(item.price, item.discount)
      const isDisabled = isExpired || isOutOfStock

      html += `
        <div class="menu-item-card ${isDisabled ? "disabled" : ""}" 
             onclick="${!isDisabled ? `OrderManager.addItemToCart('${item.id}')` : ""}">
          <div class="menu-item-header">
            <div>
              <h4 class="menu-item-name">${item.name}</h4>
              <span class="menu-item-code">${item.id}</span>
            </div>
            ${!isDisabled ? `<button class="add-to-cart-btn" onclick="event.stopPropagation(); OrderManager.addItemToCart('${item.id}')">+</button>` : ""}
          </div>
          
          <div class="menu-item-price">
            ${Utils.formatCurrency(discountedPrice)}
            ${
              item.discount > 0
                ? `
              <span class="original-price">${Utils.formatCurrency(item.price)}</span>
              <span class="discount-badge">${item.discount}% OFF</span>
            `
                : ""
            }
          </div>
          
          <div class="menu-item-stock">
            <span>Stock: ${item.quantity}</span>
            <span class="stock-status ${isOutOfStock ? "out-of-stock" : isLowStock ? "low-stock" : "in-stock"}">
              ${isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
            </span>
          </div>
          
          ${isExpired ? '<div class="expired-badge">EXPIRED</div>' : ""}
        </div>
      `
    })

    container.innerHTML = html || "<p>No items found matching your search.</p>"
  },

  // Enhanced Cart Management
  addItemToCart(itemId) {
    try {
      const menuItems = StorageManager.loadMenuItems()
      const menuItem = menuItems.find((item) => item.id === itemId)

      if (!menuItem) return

      // Validation checks
      if (Utils.isExpired(menuItem.expiry)) {
        this.showNotification("This item has expired and cannot be added", "error")
        return
      }

      if (menuItem.quantity <= 0) {
        this.showNotification("This item is out of stock", "error")
        return
      }

      // Check if item already exists in cart
      const existingItem = this.currentOrder.items.find((item) => item.code === itemId)

      if (existingItem) {
        if (existingItem.quantity < menuItem.quantity) {
          existingItem.quantity++
          this.showNotification(`${menuItem.name} quantity increased to ${existingItem.quantity}`, "success")
        } else {
          this.showNotification("Cannot add more - insufficient stock", "warning")
          return
        }
      } else {
        const discountedPrice = Utils.calculateDiscountedPrice(menuItem.price, menuItem.discount)
        this.currentOrder.items.push({
          code: itemId,
          name: menuItem.name,
          price: discountedPrice,
          originalPrice: menuItem.price,
          discount: menuItem.discount,
          quantity: 1,
          maxQuantity: menuItem.quantity,
        })
        this.showNotification(`${menuItem.name} added to cart`, "success")
      }

      this.updateCartDisplay()
      this.updateCompleteOrderButton()
      this.animateCartUpdate()
    } catch (error) {
      console.error("Error adding item to cart:", error)
      this.showNotification("Error adding item to cart", "error")
    }
  },

  updateCartDisplay() {
    const cartContent = document.getElementById("cart-content")
    const cartCount = document.getElementById("cart-count")

    if (!cartContent) return

    // Update cart count
    if (cartCount) {
      cartCount.textContent = this.currentOrder.items.length
    }

    if (this.currentOrder.items.length === 0) {
      cartContent.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <h5>Your cart is empty</h5>
          <p>Add items from the menu to get started</p>
        </div>
      `
    } else {
      cartContent.innerHTML = this.currentOrder.items
        .map(
          (item, index) => `
        <div class="cart-item">
          <div class="cart-item-header">
            <div class="cart-item-info">
              <h5>${item.name}</h5>
              <p class="cart-item-details">
                ${item.code} • ${Utils.formatCurrency(item.price)}
                ${item.discount > 0 ? ` (${item.discount}% off)` : ""}
              </p>
            </div>
            <button class="remove-item-btn" onclick="OrderManager.removeItemFromCart(${index})" title="Remove item">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="OrderManager.updateItemQuantity(${index}, -1)" 
                      ${item.quantity <= 1 ? "disabled" : ""}>
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn" onclick="OrderManager.updateItemQuantity(${index}, 1)"
                      ${item.quantity >= item.maxQuantity ? "disabled" : ""}>
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="item-total">
              ${Utils.formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        </div>
      `,
        )
        .join("")
    }

    this.calculateOrderTotal()
  },

  updateItemQuantity(index, change) {
    const item = this.currentOrder.items[index]
    if (!item) return

    const newQuantity = item.quantity + change

    if (newQuantity <= 0) {
      this.removeItemFromCart(index)
      return
    }

    if (newQuantity > item.maxQuantity) {
      this.showNotification("Cannot add more - insufficient stock", "warning")
      return
    }

    item.quantity = newQuantity
    this.updateCartDisplay()
    this.updateCompleteOrderButton()
  },

  removeItemFromCart(index) {
    const item = this.currentOrder.items[index]
    if (item) {
      this.showNotification(`${item.name} removed from cart`, "info")
      this.currentOrder.items.splice(index, 1)
      this.updateCartDisplay()
      this.updateCompleteOrderButton()
    }
  },

  clearCart() {
    if (this.currentOrder.items.length === 0) return

    if (confirm("Are you sure you want to clear all items from the cart?")) {
      this.currentOrder.items = []
      this.updateCartDisplay()
      this.updateCompleteOrderButton()
      this.showNotification("Cart cleared", "info")
    }
  },

  calculateOrderTotal() {
    const subtotal = this.currentOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountInput = document.getElementById("order-discount-input")
    const discount = discountInput ? Number.parseFloat(discountInput.value) || 0 : 0
    const discountAmount = subtotal * (discount / 100)
    const total = subtotal - discountAmount

    // Update display
    const subtotalEl = document.getElementById("order-subtotal")
    const discountAmountEl = document.getElementById("order-discount-amount")
    const totalEl = document.getElementById("order-total")

    if (subtotalEl) subtotalEl.textContent = Utils.formatCurrency(subtotal)
    if (discountAmountEl) discountAmountEl.textContent = Utils.formatCurrency(discountAmount)
    if (totalEl) totalEl.textContent = Utils.formatCurrency(total)

    // Update order object
    this.currentOrder.discount = discount
    this.currentOrder.total = total

    this.updateCompleteOrderButton()
  },

  updateCompleteOrderButton() {
    const button = document.getElementById("complete-order-btn")
    if (!button) return

    const hasItems = this.currentOrder.items.length > 0
    const hasCustomer = this.selectedCustomer !== null

    if (hasItems && hasCustomer) {
      button.className = "complete-order-btn ready"
      button.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Complete Order (${Utils.formatCurrency(this.currentOrder.total)})
      `
      button.disabled = false
    } else if (!hasCustomer) {
      button.className = "complete-order-btn disabled"
      button.innerHTML = `
        <i class="fas fa-user-plus"></i>
        Select a customer first
      `
      button.disabled = true
    } else if (!hasItems) {
      button.className = "complete-order-btn disabled"
      button.innerHTML = `
        <i class="fas fa-shopping-cart"></i>
        Add items to cart
      `
      button.disabled = true
    }
  },

  completeOrder() {
    if (!this.selectedCustomer || this.currentOrder.items.length === 0) {
      this.showNotification("Please select a customer and add items to cart", "error")
      return
    }

    const button = document.getElementById("complete-order-btn")
    if (button) {
      button.className = "complete-order-btn processing"
      button.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Processing Order...
      `
      button.disabled = true
    }

    try {
      // Create order
      const order = {
        id: Utils.generateOrderId(),
        customer: {
          name: this.selectedCustomer.name,
          phone: this.selectedCustomer.phone,
          address: this.selectedCustomer.address || "",
        },
        items: [...this.currentOrder.items],
        discount: this.currentOrder.discount,
        total: this.currentOrder.total,
        date: new Date().toISOString(),
      }

      // Update stock quantities
      const menuItems = StorageManager.loadMenuItems()
      this.currentOrder.items.forEach((orderItem) => {
        const menuItem = menuItems.find((item) => item.id === orderItem.code)
        if (menuItem) {
          menuItem.quantity -= orderItem.quantity
        }
      })

      // Save order
      const orders = StorageManager.loadOrders()
      orders.push(order)

      // Update customer orders
      const customers = StorageManager.loadCustomers()
      const customer = customers.find((c) => c.id === this.selectedCustomer.id)
      if (customer) {
        customer.orders.push(order.id)
      }

      // Save all data
      StorageManager.saveOrders(orders)
      StorageManager.saveCustomers(customers)
      StorageManager.saveMenuItems(menuItems)

      this.showNotification("Order completed successfully!", "success")

      // Generate receipt
      setTimeout(() => {
        this.generateReceipt(order.id)
      }, 1000)

      // Close modal and refresh
      setTimeout(() => {
        UIManager.closeModal()
        this.load()

        // Update other sections
        if (typeof DashboardManager !== "undefined") DashboardManager.updateStats()
        if (typeof StoreManager !== "undefined") StoreManager.load()
        if (typeof CustomerManager !== "undefined") CustomerManager.load()
      }, 2000)
    } catch (error) {
      console.error("Error completing order:", error)
      this.showNotification("Error completing order. Please try again.", "error")

      // Reset button
      if (button) {
        this.updateCompleteOrderButton()
      }
    }
  },

  // Utility methods
  animateCartUpdate() {
    const cartSection = document.querySelector(".cart-section")
    if (cartSection) {
      cartSection.classList.add("cart-item-added")
      setTimeout(() => {
        cartSection.classList.remove("cart-item-added")
      }, 300)
    }
  },

  showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification")
    existingNotifications.forEach((notification) => notification.remove())

    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : type === "warning" ? "exclamation-triangle" : "info-circle"}"></i>
      ${message}
    `

    document.body.appendChild(notification)

    // Auto remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOutRight 0.3s ease"
        setTimeout(() => {
          notification.remove()
        }, 300)
      }
    }, 4000)
  },

  // Existing methods (simplified for brevity)
  editOrder(orderId) {
    this.showNotification("Edit order functionality - coming soon!", "info")
  },

  deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        let orders = StorageManager.loadOrders()
        orders = orders.filter((order) => order.id !== orderId)
        StorageManager.saveOrders(orders)
        this.load()
        if (typeof DashboardManager !== "undefined") DashboardManager.updateStats()
        this.showNotification("Order deleted successfully!", "success")
      } catch (error) {
        console.error("Error deleting order:", error)
        this.showNotification("Error deleting order", "error")
      }
    }
  },

  generateReceipt(orderId) {
    try {
      const orders = StorageManager.loadOrders()
      const order = orders.find((o) => o.id === orderId)

      if (!order) {
        this.showNotification("Order not found!", "error")
        return
      }

      if (typeof window.jspdf === "undefined") {
        this.showNotification("PDF library not loaded. Please refresh the page.", "error")
        return
      }

      const { jsPDF } = window.jspdf
      const doc = new jsPDF()

      // Header
      doc.setFontSize(20)
      doc.text("MOS BURGERS", 105, 20, { align: "center" })
      doc.setFontSize(12)
      doc.text("Receipt", 105, 30, { align: "center" })

      // Order details
      doc.setFontSize(10)
      doc.text(`Order ID: ${order.id}`, 20, 50)
      doc.text(`Date: ${Utils.formatDateTime(order.date)}`, 20, 60)
      doc.text(`Customer: ${order.customer.name}`, 20, 70)
      doc.text(`Phone: ${order.customer.phone}`, 20, 80)
      if (order.customer.address) {
        doc.text(`Address: ${order.customer.address}`, 20, 90)
      }

      // Items
      doc.setFontSize(12)
      doc.text("Items:", 20, 110)
      doc.setFontSize(10)

      let yPos = 120
      order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity
        doc.text(`${item.name} (${item.code})`, 20, yPos)
        doc.text(
          `${item.quantity} x ${Utils.formatCurrency(item.price)} = ${Utils.formatCurrency(itemTotal)}`,
          20,
          yPos + 8,
        )
        yPos += 18
      })

      // Totals
      const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const discountAmount = subtotal * (order.discount / 100)

      yPos += 10
      doc.text(`Subtotal: ${Utils.formatCurrency(subtotal)}`, 20, yPos)
      if (order.discount > 0) {
        doc.text(`Discount (${order.discount}%): ${Utils.formatCurrency(discountAmount)}`, 20, yPos + 10)
        yPos += 10
      }

      doc.setFontSize(14)
      doc.text(`Total: ${Utils.formatCurrency(order.total)}`, 20, yPos + 15)

      // Footer
      doc.setFontSize(10)
      doc.text("Thank you for choosing MOS Burgers!", 105, yPos + 40, { align: "center" })

      // Save PDF
      doc.save(`MOS-Burgers-Receipt-${order.id}.pdf`)
      this.showNotification("Receipt downloaded successfully!", "success")
    } catch (error) {
      console.error("Error generating receipt:", error)
      this.showNotification("Error generating receipt", "error")
    }
  },
}

// Make OrderManager available globally
window.OrderManager = OrderManager
