// Storage Manager - Handles all localStorage operations
const StorageManager = {
  // Menu Items
  saveMenuItems(items) {
    localStorage.setItem("menuItems", JSON.stringify(items))
  },

  loadMenuItems() {
    const saved = localStorage.getItem("menuItems")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error parsing menu items from localStorage:", error)
        return typeof DEFAULT_MENU_ITEMS !== "undefined" ? DEFAULT_MENU_ITEMS : []
      }
    }
    return typeof DEFAULT_MENU_ITEMS !== "undefined" ? DEFAULT_MENU_ITEMS : []
  },

  // Orders
  saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders))
  },

  loadOrders() {
    const saved = localStorage.getItem("orders")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error parsing orders from localStorage:", error)
        return typeof DUMMY_ORDERS !== "undefined" ? DUMMY_ORDERS : []
      }
    }
    return typeof DUMMY_ORDERS !== "undefined" ? DUMMY_ORDERS : []
  },

  // Customers
  saveCustomers(customers) {
    localStorage.setItem("customers", JSON.stringify(customers))
  },

  loadCustomers() {
    const saved = localStorage.getItem("customers")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error parsing customers from localStorage:", error)
        return typeof DUMMY_CUSTOMERS !== "undefined" ? DUMMY_CUSTOMERS : []
      }
    }
    return typeof DUMMY_CUSTOMERS !== "undefined" ? DUMMY_CUSTOMERS : []
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

// Make StorageManager available globally
window.StorageManager = StorageManager
