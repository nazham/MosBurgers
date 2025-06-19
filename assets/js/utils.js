// Utility Functions
const Utils = {
  // Generate unique IDs
  generateId(prefix = "ID") {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 5)
  },

  generateOrderId() {
    return this.generateId("ORD")
  },

  generateCustomerId() {
    return this.generateId("CUST")
  },

  // Date utilities
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
  },

  formatDateTime(dateString) {
    return new Date(dateString).toLocaleString()
  },

  isExpired(expiryDate) {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  },

  // Price calculations
  calculateDiscountedPrice(price, discount) {
    return price - (price * discount) / 100
  },

  formatCurrency(amount) {
    return `LKR ${amount.toFixed(2)}`
  },

  // Search utilities
  searchInText(text, searchTerm) {
    return text.toLowerCase().includes(searchTerm.toLowerCase())
  },

  // Validation utilities
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },

  validatePhone(phone) {
    const re = /^[0-9]{10}$/
    return re.test(phone.replace(/\s/g, ""))
  },

  // Array utilities
  sortByProperty(array, property, ascending = true) {
    return array.sort((a, b) => {
      const aVal = a[property]
      const bVal = b[property]

      if (ascending) {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  },

  // Object utilities
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  },
}

// Make Utils available globally
window.Utils = Utils
