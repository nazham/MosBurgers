// Storage Manager - Handles all localStorage operations
const StorageManager = {
  // Menu Items
  saveMenuItems(items) {
    localStorage.setItem("menuItems", JSON.stringify(items))
  },

  loadMenuItems() {
    const saved = localStorage.getItem("menuItems")
    return saved ? JSON.parse(saved) : DEFAULT_MENU_ITEMS
  },

  // Orders
  saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders))
  },

  loadOrders() {
    const saved = localStorage.getItem("orders")
    return saved ? JSON.parse(saved) : DUMMY_ORDERS
  },

  // Customers
  saveCustomers(customers) {
    localStorage.setItem("customers", JSON.stringify(customers))
  },

  loadCustomers() {
    const saved = localStorage.getItem("customers")
    return saved ? JSON.parse(saved) : DUMMY_CUSTOMERS
  },

  // Clear all data
  clearAllData() {
    localStorage.removeItem("menuItems")
    localStorage.removeItem("orders")
    localStorage.removeItem("customers")
  },

  // Export data
  exportData() {
    return {
      menuItems: this.loadMenuItems(),
      orders: this.loadOrders(),
      customers: this.loadCustomers(),
      exportDate: new Date().toISOString(),
    }
  },

  // Import data
  importData(data) {
    if (data.menuItems) this.saveMenuItems(data.menuItems)
    if (data.orders) this.saveOrders(data.orders)
    if (data.customers) this.saveCustomers(data.customers)
  },
}
