// Order Manager - Handles order management functionality
const OrderManager = {
  currentOrder: {
    items: [],
    customer: {},
    discount: 0,
    total: 0,
  },

  load() {
    this.displayOrders()
  },

  displayOrders(ordersToShow = null) {
    const orders = ordersToShow || StorageManager.loadOrders()
    const container = document.getElementById("orders-container")

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
  },

  searchOrders() {
    const searchTerm = document.getElementById("order-search").value.toLowerCase()

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
  },

  showNewOrderModal() {
    this.currentOrder = {
      items: [],
      customer: {},
      discount: 0,
      total: 0,
    }

    document.getElementById("customer-phone").value = ""
    document.getElementById("customer-name").value = ""
    document.getElementById("customer-address").value = ""
    document.getElementById("order-discount").value = "0"

    this.loadMenuItemsForOrder()
    this.updateOrderCart()
    UIManager.showModal("order-modal")
  },

  loadMenuItemsForOrder() {
    const menuItems = StorageManager.loadMenuItems()
    const container = document.getElementById("menu-items-container")

    container.innerHTML = menuItems
      .map((item) => {
        const isExpired = Utils.isExpired(item.expiry)
        const discountedPrice = Utils.calculateDiscountedPrice(item.price, item.discount)

        return `
        <div class="menu-item ${isExpired ? "expired" : ""}" onclick="OrderManager.addItemToOrder('${item.id}')">
          <div class="menu-item-info">
            <h4>${item.name}</h4>
            <p>${item.id} - ${item.category}</p>
            <p>${Utils.formatCurrency(discountedPrice)} ${item.discount > 0 ? `(${item.discount}% off)` : ""}</p>
            <p>Stock: ${item.quantity} ${isExpired ? "- EXPIRED" : ""}</p>
          </div>
        </div>
      `
      })
      .join("")
  },

  searchMenuItems() {
    const searchTerm = document.getElementById("item-search").value.toLowerCase()
    const menuItems = StorageManager.loadMenuItems()
    const container = document.getElementById("menu-items-container")

    const filteredItems = menuItems.filter(
      (item) =>
        Utils.searchInText(item.name, searchTerm) ||
        Utils.searchInText(item.id, searchTerm) ||
        Utils.searchInText(item.category, searchTerm),
    )

    container.innerHTML = filteredItems
      .map((item) => {
        const isExpired = Utils.isExpired(item.expiry)
        const discountedPrice = Utils.calculateDiscountedPrice(item.price, item.discount)

        return `
        <div class="menu-item ${isExpired ? "expired" : ""}" onclick="OrderManager.addItemToOrder('${item.id}')">
          <div class="menu-item-info">
            <h4>${item.name}</h4>
            <p>${item.id} - ${item.category}</p>
            <p>${Utils.formatCurrency(discountedPrice)} ${item.discount > 0 ? `(${item.discount}% off)` : ""}</p>
            <p>Stock: ${item.quantity} ${isExpired ? "- EXPIRED" : ""}</p>
          </div>
        </div>
      `
      })
      .join("")
  },

  addItemToOrder(itemId) {
    const menuItems = StorageManager.loadMenuItems()
    const menuItem = menuItems.find((item) => item.id === itemId)
    if (!menuItem) return

    // Check if item is expired
    if (Utils.isExpired(menuItem.expiry)) {
      alert("This item has expired and cannot be added to the order.")
      return
    }

    // Check if item is already in cart
    const existingItem = this.currentOrder.items.find((item) => item.code === itemId)
    if (existingItem) {
      if (existingItem.quantity < menuItem.quantity) {
        existingItem.quantity++
      } else {
        alert("Not enough stock available.")
        return
      }
    } else {
      if (menuItem.quantity > 0) {
        const discountedPrice = Utils.calculateDiscountedPrice(menuItem.price, menuItem.discount)
        this.currentOrder.items.push({
          code: itemId,
          name: menuItem.name,
          price: discountedPrice,
          quantity: 1,
          maxQuantity: menuItem.quantity,
        })
      } else {
        alert("Item is out of stock.")
        return
      }
    }

    this.updateOrderCart()
  },

  updateOrderCart() {
    const container = document.getElementById("order-cart")

    if (this.currentOrder.items.length === 0) {
      container.innerHTML = "<p>No items in cart</p>"
    } else {
      container.innerHTML = this.currentOrder.items
        .map(
          (item, index) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.code} - ${Utils.formatCurrency(item.price)}</p>
          </div>
          <div class="cart-item-controls">
            <div class="quantity-control">
              <button class="quantity-btn" onclick="OrderManager.updateItemQuantity(${index}, -1)">-</button>
              <input type="number" class="quantity-input" value="${item.quantity}" 
                     onchange="OrderManager.setItemQuantity(${index}, this.value)" min="1" max="${item.maxQuantity}">
              <button class="quantity-btn" onclick="OrderManager.updateItemQuantity(${index}, 1)">+</button>
            </div>
            <button class="btn btn-danger btn-small" onclick="OrderManager.removeItemFromOrder(${index})">
              <i class="fas fa-trash"></i>
            </button>
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
    const newQuantity = item.quantity + change

    if (newQuantity > 0 && newQuantity <= item.maxQuantity) {
      item.quantity = newQuantity
      this.updateOrderCart()
    }
  },

  setItemQuantity(index, quantity) {
    const item = this.currentOrder.items[index]
    const newQuantity = Number.parseInt(quantity)

    if (newQuantity > 0 && newQuantity <= item.maxQuantity) {
      item.quantity = newQuantity
      this.updateOrderCart()
    }
  },

  removeItemFromOrder(index) {
    this.currentOrder.items.splice(index, 1)
    this.updateOrderCart()
  },

  calculateOrderTotal() {
    const subtotal = this.currentOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = Number.parseFloat(document.getElementById("order-discount").value) || 0
    const discountAmount = subtotal * (discount / 100)
    const total = subtotal - discountAmount

    document.getElementById("order-subtotal").textContent = Utils.formatCurrency(subtotal)
    document.getElementById("order-discount-amount").textContent = Utils.formatCurrency(discountAmount)
    document.getElementById("order-total").textContent = Utils.formatCurrency(total)

    this.currentOrder.total = total
    this.currentOrder.discount = discount
  },

  loadCustomerInfo() {
    const phone = document.getElementById("customer-phone").value
    if (!phone) return

    const customers = StorageManager.loadCustomers()
    const customer = customers.find((c) => c.phone === phone)
    if (customer) {
      document.getElementById("customer-name").value = customer.name
      document.getElementById("customer-address").value = customer.address || ""
    }
  },

  completeOrder() {
    // Validate order
    if (this.currentOrder.items.length === 0) {
      alert("Please add items to the order.")
      return
    }

    const customerName = document.getElementById("customer-name").value.trim()
    const customerPhone = document.getElementById("customer-phone").value.trim()

    if (!customerName || !customerPhone) {
      alert("Please enter customer name and phone number.")
      return
    }

    // Create or update customer
    const customers = StorageManager.loadCustomers()
    let customer = customers.find((c) => c.phone === customerPhone)

    if (!customer) {
      customer = {
        id: Utils.generateCustomerId(),
        name: customerName,
        phone: customerPhone,
        address: document.getElementById("customer-address").value.trim(),
        orders: [],
      }
      customers.push(customer)
    } else {
      customer.name = customerName
      customer.address = document.getElementById("customer-address").value.trim()
    }

    // Create order
    const order = {
      id: Utils.generateOrderId(),
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
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
    customer.orders.push(order.id)

    // Save data
    StorageManager.saveOrders(orders)
    StorageManager.saveCustomers(customers)
    StorageManager.saveMenuItems(menuItems)

    // Generate receipt
    this.generateReceipt(order.id)

    // Close modal and refresh
    UIManager.closeModal()
    this.load()
    DashboardManager.updateStats()

    alert("Order completed successfully!")
  },

  editOrder(orderId) {
    alert("Order editing functionality would be implemented here.")
  },

  deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
      let orders = StorageManager.loadOrders()
      orders = orders.filter((order) => order.id !== orderId)
      StorageManager.saveOrders(orders)
      this.load()
      DashboardManager.updateStats()
    }
  },

  generateReceipt(orderId) {
    const orders = StorageManager.loadOrders()
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text("MOS BURGERS", 105, 20, { align: "center" })
    doc.setFontSize(12)
    doc.text("Receipt", 105, 30, { align: "center" })

    // Order details
    doc.text(`Order ID: ${order.id}`, 20, 50)
    doc.text(`Date: ${Utils.formatDate(order.date)}`, 20, 60)
    doc.text(`Customer: ${order.customer.name}`, 20, 70)
    doc.text(`Phone: ${order.customer.phone}`, 20, 80)
    if (order.customer.address) {
      doc.text(`Address: ${order.customer.address}`, 20, 90)
    }

    // Items
    doc.text("Items:", 20, 110)
    let yPos = 120
    order.items.forEach((item) => {
      const itemTotal = item.price * item.quantity
      doc.text(`${item.name} (${item.code})`, 20, yPos)
      doc.text(
        `${item.quantity} x ${Utils.formatCurrency(item.price)} = ${Utils.formatCurrency(itemTotal)}`,
        20,
        yPos + 10,
      )
      yPos += 20
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
    doc.text("Thank you for your business!", 105, yPos + 40, { align: "center" })

    // Save PDF
    doc.save(`receipt-${order.id}.pdf`)
  },
}
