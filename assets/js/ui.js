// UI Manager - Handles all UI interactions and modal operations
const UIManager = {
  // Navigation
  showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active")
    })

    // Show selected section
    document.getElementById(sectionName).classList.add("active")

    // Update navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })
    document.querySelector(`[data-section="${sectionName}"]`).classList.add("active")

    // Load section data
    this.loadSectionData(sectionName)
  },

  loadSectionData(sectionName) {
    switch (sectionName) {
      case "dashboard":
        DashboardManager.load()
        break
      case "store":
        StoreManager.load()
        break
      case "orders":
        OrderManager.load()
        break
      case "customers":
        CustomerManager.load()
        break
      case "reports":
        ReportsManager.load()
        break
    }
  },

  // Modal operations
  showModal(modalId) {
    document.getElementById("modal-overlay").classList.add("active")
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none"
    })
    document.getElementById(modalId).style.display = "block"
  },

  closeModal() {
    document.getElementById("modal-overlay").classList.remove("active")
  },

  // Alert utilities
  showAlert(message, type = "info") {
    const alertClass = `alert-${type}`
    const alertHtml = `
      <div class="alert ${alertClass}">
        ${message}
      </div>
    `

    // You could implement a toast notification system here
    console.log(`${type.toUpperCase()}: ${message}`)
  },

  // Form utilities
  clearForm(formId) {
    document.getElementById(formId).reset()
  },

  getFormData(formId) {
    const form = document.getElementById(formId)
    const formData = new FormData(form)
    const data = {}

    for (const [key, value] of formData.entries()) {
      data[key] = value
    }

    return data
  },

  // Setup event listeners
  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const section = link.getAttribute("data-section")
        this.showSection(section)
      })
    })

    // Modal overlay click to close
    document.getElementById("modal-overlay").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        this.closeModal()
      }
    })

    // Form submissions
    document.getElementById("item-form").addEventListener("submit", (e) => {
      e.preventDefault()
      StoreManager.handleItemSubmit(e)
    })

    document.getElementById("customer-form").addEventListener("submit", (e) => {
      e.preventDefault()
      CustomerManager.handleCustomerSubmit(e)
    })
  },
}
