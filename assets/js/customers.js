// Customer Manager - Handles customer management functionality
const CustomerManager = {
  editingCustomerId: null,

  load() {
    this.displayCustomers()
  },

  displayCustomers(customersToShow = null) {
    const customers = customersToShow || StorageManager.loadCustomers()
    const orders = StorageManager.loadOrders()
    const container = document.getElementById("customers-container")

    if (customers.length === 0) {
      container.innerHTML = "<p>No customers found.</p>"
      return
    }

    container.innerHTML = customers
      .map((customer) => {
        const customerOrders = orders.filter((order) => order.customer.phone === customer.phone)
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0)

        return `
        <div class="customer-card">
          <div class="customer-info">
            <h3>${customer.name}</h3>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            ${customer.address ? `<p><strong>Address:</strong> ${customer.address}</p>` : ""}
            ${customer.email ? `<p><strong>Email:</strong> ${customer.email}</p>` : ""}
          </div>
          <div class="customer-stats">
            <p><strong>Total Orders:</strong> ${customerOrders.length}</p>
            <p><strong>Total Spent:</strong> ${Utils.formatCurrency(totalSpent)}</p>
          </div>
          <div class="customer-actions">
            <button class="btn btn-primary btn-small" onclick="CustomerManager.editCustomer('${customer.id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-success btn-small" onclick="CustomerManager.viewCustomerOrders('${customer.phone}')">
              <i class="fas fa-eye"></i> Orders
            </button>
            <button class="btn btn-danger btn-small" onclick="CustomerManager.deleteCustomer('${customer.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `
      })
      .join("")
  },

  searchCustomers() {
    const searchTerm = document.getElementById("customer-search").value.toLowerCase()

    if (!searchTerm) {
      this.displayCustomers()
      return
    }

    const customers = StorageManager.loadCustomers()
    const filteredCustomers = customers.filter(
      (customer) =>
        Utils.searchInText(customer.name, searchTerm) ||
        Utils.searchInText(customer.phone, searchTerm) ||
        (customer.email && Utils.searchInText(customer.email, searchTerm)),
    )

    this.displayCustomers(filteredCustomers)
  },

  showAddCustomerModal() {
    this.editingCustomerId = null
    document.getElementById("customer-modal-title").textContent = "Add Customer"
    UIManager.clearForm("customer-form")
    UIManager.showModal("customer-modal")
  },

  editCustomer(customerId) {
    const customers = StorageManager.loadCustomers()
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return

    this.editingCustomerId = customerId
    document.getElementById("customer-modal-title").textContent = "Edit Customer"

    document.getElementById("customer-form-name").value = customer.name
    document.getElementById("customer-form-phone").value = customer.phone
    document.getElementById("customer-form-address").value = customer.address || ""
    document.getElementById("customer-form-email").value = customer.email || ""

    UIManager.showModal("customer-modal")
  },

  deleteCustomer(customerId) {
    if (confirm("Are you sure you want to delete this customer?")) {
      let customers = StorageManager.loadCustomers()
      customers = customers.filter((customer) => customer.id !== customerId)
      StorageManager.saveCustomers(customers)
      this.load()
      DashboardManager.updateStats()
    }
  },

  viewCustomerOrders(customerPhone) {
    const orders = StorageManager.loadOrders()
    const customerOrders = orders.filter((order) => order.customer.phone === customerPhone)

    if (customerOrders.length === 0) {
      alert("No orders found for this customer.")
      return
    }

    // Switch to orders section and filter by customer
    UIManager.showSection("orders")
    document.getElementById("order-search").value = customerPhone
    OrderManager.searchOrders()
  },

  handleCustomerSubmit(e) {
    e.preventDefault()

    const customerData = {
      name: document.getElementById("customer-form-name").value.trim(),
      phone: document.getElementById("customer-form-phone").value.trim(),
      address: document.getElementById("customer-form-address").value.trim(),
      email: document.getElementById("customer-form-email").value.trim(),
      orders: [],
    }

    // Validate phone number
    if (!Utils.validatePhone(customerData.phone)) {
      alert("Please enter a valid 10-digit phone number.")
      return
    }

    // Validate email if provided
    if (customerData.email && !Utils.validateEmail(customerData.email)) {
      alert("Please enter a valid email address.")
      return
    }

    const customers = StorageManager.loadCustomers()

    if (this.editingCustomerId) {
      // Update existing customer
      const index = customers.findIndex((customer) => customer.id === this.editingCustomerId)
      if (index !== -1) {
        customerData.id = this.editingCustomerId
        customerData.orders = customers[index].orders
        customers[index] = customerData
      }
    } else {
      // Add new customer
      if (customers.find((customer) => customer.phone === customerData.phone)) {
        alert("Customer with this phone number already exists!")
        return
      }
      customerData.id = Utils.generateCustomerId()
      customers.push(customerData)
    }

    StorageManager.saveCustomers(customers)
    UIManager.closeModal()
    this.load()
    DashboardManager.updateStats()
  },
}
