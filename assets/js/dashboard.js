// Dashboard Manager - Handles dashboard functionality
const DashboardManager = {
  load() {
    console.log("Loading dashboard...")
    this.updateStats()
    this.checkExpiredItems()
  },

  updateStats() {
    try {
      const orders = StorageManager.loadOrders()
      const customers = StorageManager.loadCustomers()
      const menuItems = StorageManager.loadMenuItems()

      console.log("Dashboard stats:", {
        orders: orders.length,
        customers: customers.length,
        menuItems: menuItems.length,
      })

      const totalOrdersEl = document.getElementById("total-orders")
      const totalCustomersEl = document.getElementById("total-customers")
      const totalItemsEl = document.getElementById("total-items")
      const totalRevenueEl = document.getElementById("total-revenue")

      if (totalOrdersEl) totalOrdersEl.textContent = orders.length
      if (totalCustomersEl) totalCustomersEl.textContent = customers.length
      if (totalItemsEl) totalItemsEl.textContent = menuItems.length

      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
      if (totalRevenueEl) totalRevenueEl.textContent = Utils.formatCurrency(totalRevenue)
    } catch (error) {
      console.error("Error updating dashboard stats:", error)
    }
  },

  checkExpiredItems() {
    try {
      const menuItems = StorageManager.loadMenuItems()
      const expiredItems = menuItems.filter((item) => Utils.isExpired(item.expiry))

      const alertContainer = document.getElementById("expired-items-alert")
      if (!alertContainer) return

      if (expiredItems.length > 0) {
        alertContainer.innerHTML = `
          <div class="alert alert-danger">
            <strong>Warning!</strong> ${expiredItems.length} item(s) have expired:
            <ul style="margin-top: 10px;">
              ${expiredItems.map((item) => `<li>${item.name} (${item.id}) - Expired: ${item.expiry}</li>`).join("")}
            </ul>
            <button class="btn btn-danger btn-small" onclick="DashboardManager.removeExpiredItems()" style="margin-top: 10px;">
              Remove Expired Items
            </button>
          </div>
        `
      } else {
        alertContainer.innerHTML = '<div class="alert alert-success">No expired items found.</div>'
      }
    } catch (error) {
      console.error("Error checking expired items:", error)
    }
  },

  removeExpiredItems() {
    try {
      let menuItems = StorageManager.loadMenuItems()
      const originalCount = menuItems.length
      menuItems = menuItems.filter((item) => !Utils.isExpired(item.expiry))

      StorageManager.saveMenuItems(menuItems)
      this.load()
      if (typeof StoreManager !== "undefined" && StoreManager.load) {
        StoreManager.load()
      }
      alert(`${originalCount - menuItems.length} expired items have been removed successfully!`)
    } catch (error) {
      console.error("Error removing expired items:", error)
      alert("Error removing expired items. Please try again.")
    }
  },
}

// Make DashboardManager available globally
window.DashboardManager = DashboardManager
