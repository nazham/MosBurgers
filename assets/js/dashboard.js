// Dashboard Manager - Handles dashboard functionality
const DashboardManager = {
  load() {
    this.updateStats()
    this.checkExpiredItems()
  },

  updateStats() {
    const orders = StorageManager.loadOrders()
    const customers = StorageManager.loadCustomers()
    const menuItems = StorageManager.loadMenuItems()

    document.getElementById("total-orders").textContent = orders.length
    document.getElementById("total-customers").textContent = customers.length
    document.getElementById("total-items").textContent = menuItems.length

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    document.getElementById("total-revenue").textContent = Utils.formatCurrency(totalRevenue)
  },

  checkExpiredItems() {
    const menuItems = StorageManager.loadMenuItems()
    const expiredItems = menuItems.filter((item) => Utils.isExpired(item.expiry))

    const alertContainer = document.getElementById("expired-items-alert")

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
  },

  removeExpiredItems() {
    let menuItems = StorageManager.loadMenuItems()
    menuItems = menuItems.filter((item) => !Utils.isExpired(item.expiry))

    StorageManager.saveMenuItems(menuItems)
    this.load()
    StoreManager.load()
    alert("Expired items have been removed successfully!")
  },
}
