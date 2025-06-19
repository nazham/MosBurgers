// Main Application Controller - Initializes and coordinates all modules
const App = {
  // Initialize the application
  init() {
    console.log("Initializing MOS Burgers Management System...")

    // Check if all dependencies are loaded
    if (typeof StorageManager === "undefined" || typeof UIManager === "undefined") {
      console.error("Dependencies not loaded yet, retrying in 100ms...")
      setTimeout(() => this.init(), 100)
      return
    }

    // Setup UI event listeners
    UIManager.setupEventListeners()

    // Load initial data and populate dummy data if needed
    this.initializeData()

    // Load dashboard by default
    UIManager.showSection("dashboard")

    // Setup mobile responsiveness
    this.setupMobileFeatures()

    console.log("Application initialized successfully!")
  },

  // Initialize data - load from storage or populate with dummy data
  initializeData() {
    try {
      // Check if this is the first time running the app
      const hasExistingData =
        localStorage.getItem("menuItems") || localStorage.getItem("orders") || localStorage.getItem("customers")

      if (!hasExistingData) {
        console.log("No existing data found. Loading dummy data...")

        // Use the proper dummy data from data.js
        if (typeof DEFAULT_MENU_ITEMS !== "undefined") {
          StorageManager.saveMenuItems(DEFAULT_MENU_ITEMS)
          console.log("Menu items loaded:", DEFAULT_MENU_ITEMS.length)
        }

        if (typeof DUMMY_ORDERS !== "undefined") {
          StorageManager.saveOrders(DUMMY_ORDERS)
          console.log("Orders loaded:", DUMMY_ORDERS.length)
        }

        if (typeof DUMMY_CUSTOMERS !== "undefined") {
          StorageManager.saveCustomers(DUMMY_CUSTOMERS)
          console.log("Customers loaded:", DUMMY_CUSTOMERS.length)
        }

        console.log("Dummy data loaded successfully!")
      } else {
        console.log("Existing data found. Loading from localStorage...")
        const menuItems = StorageManager.loadMenuItems()
        const orders = StorageManager.loadOrders()
        const customers = StorageManager.loadCustomers()
        console.log("Loaded data:", { menuItems: menuItems.length, orders: orders.length, customers: customers.length })
      }
    } catch (error) {
      console.error("Error initializing data:", error)
    }
  },

  // Setup mobile-specific features
  setupMobileFeatures() {
    // Add mobile menu toggle if needed
    if (window.innerWidth <= 768) {
      this.addMobileMenuButton()
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768 && !document.querySelector(".mobile-menu-btn")) {
        this.addMobileMenuButton()
      } else if (window.innerWidth > 768 && document.querySelector(".mobile-menu-btn")) {
        this.removeMobileMenuButton()
      }
    })
  },

  // Add mobile menu button
  addMobileMenuButton() {
    if (document.querySelector(".mobile-menu-btn")) return

    const mobileMenuBtn = document.createElement("button")
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
    mobileMenuBtn.className = "mobile-menu-btn"
    mobileMenuBtn.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      padding: 10px;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `

    mobileMenuBtn.onclick = this.toggleMobileMenu
    document.body.appendChild(mobileMenuBtn)
  },

  // Remove mobile menu button
  removeMobileMenuButton() {
    const btn = document.querySelector(".mobile-menu-btn")
    if (btn) {
      btn.remove()
    }
  },

  // Toggle mobile menu
  toggleMobileMenu() {
    const sidebar = document.querySelector(".sidebar")
    const isOpen = sidebar.style.transform === "translateX(0px)"

    if (isOpen) {
      sidebar.style.transform = "translateX(-100%)"
    } else {
      sidebar.style.transform = "translateX(0px)"
    }
  },

  // Utility methods for global app operations
  exportAllData() {
    const data = StorageManager.exportData()
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(dataBlob)
    link.download = `mos-burgers-backup-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  },

  importData(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        StorageManager.importData(data)

        // Refresh all sections
        const DashboardManager = { load: () => console.log("DashboardManager.load()") }
        const StoreManager = { load: () => console.log("StoreManager.load()") }
        const OrderManager = { load: () => console.log("OrderManager.load()") }
        const CustomerManager = { load: () => console.log("CustomerManager.load()") }
        const ReportsManager = { load: () => console.log("ReportsManager.load()") }

        DashboardManager.load()
        StoreManager.load()
        OrderManager.load()
        CustomerManager.load()
        ReportsManager.load()

        alert("Data imported successfully!")
      } catch (error) {
        alert("Error importing data. Please check the file format.")
        console.error("Import error:", error)
      }
    }
    reader.readAsText(file)
  },

  resetAllData() {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      StorageManager.clearAllData()
      this.initializeData()

      // Refresh all sections
      const DashboardManager = { load: () => console.log("DashboardManager.load()") }
      const StoreManager = { load: () => console.log("StoreManager.load()") }
      const OrderManager = { load: () => console.log("OrderManager.load()") }
      const CustomerManager = { load: () => console.log("CustomerManager.load()") }
      const ReportsManager = { load: () => console.log("ReportsManager.load()") }

      DashboardManager.load()
      StoreManager.load()
      OrderManager.load()
      CustomerManager.load()
      ReportsManager.load()

      alert("All data has been reset to default values.")
    }
  },
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  App.init()
})

// Global error handler
window.addEventListener("error", (e) => {
  console.error("Application Error:", e.error)
  // You could implement a user-friendly error notification here
})

// Make App available globally
window.App = App
