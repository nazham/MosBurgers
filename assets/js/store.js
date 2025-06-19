// Store Manager - Handles store management functionality
const StoreManager = {
  editingItemId: null,

  load() {
    console.log("Loading store management...")
    this.displayItems()
  },

  displayItems(itemsToShow = null) {
    try {
      const menuItems = itemsToShow || StorageManager.loadMenuItems()
      const container = document.getElementById("items-container")

      console.log("Displaying items:", menuItems.length)

      if (!container) {
        console.error("Items container not found")
        return
      }

      if (menuItems.length === 0) {
        container.innerHTML = "<p>No items found.</p>"
        return
      }

      container.innerHTML = menuItems
        .map((item) => {
          const isExpired = Utils.isExpired(item.expiry)
          const discountedPrice = Utils.calculateDiscountedPrice(item.price, item.discount)

          return `
          <div class="item-card">
            <div class="item-header">
              <div class="item-info">
                <h3>${item.name}</h3>
                <span class="item-code">${item.id}</span>
              </div>
            </div>
            <div class="item-details">
              <p><strong>Category:</strong> ${item.category}</p>
              <p class="price"><strong>Price:</strong> ${Utils.formatCurrency(item.price)}</p>
              ${item.discount > 0 ? `<p class="discount"><strong>Discount:</strong> ${item.discount}% (${Utils.formatCurrency(discountedPrice)})</p>` : ""}
              <p class="quantity"><strong>Quantity:</strong> ${item.quantity}</p>
              ${item.expiry ? `<p class="${isExpired ? "expired" : ""}"><strong>Expiry:</strong> ${item.expiry} ${isExpired ? "(EXPIRED)" : ""}</p>` : ""}
            </div>
            <div class="item-actions">
              <button class="btn btn-primary btn-small" onclick="StoreManager.editItem('${item.id}')">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn btn-danger btn-small" onclick="StoreManager.deleteItem('${item.id}')">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        `
        })
        .join("")
    } catch (error) {
      console.error("Error displaying items:", error)
    }
  },

  filterItems() {
    try {
      const categoryFilter = document.getElementById("category-filter")
      const searchInput = document.getElementById("search-items")

      const category = categoryFilter ? categoryFilter.value : ""
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""

      let menuItems = StorageManager.loadMenuItems()

      if (category) {
        menuItems = menuItems.filter((item) => item.category === category)
      }

      if (searchTerm) {
        menuItems = menuItems.filter(
          (item) => Utils.searchInText(item.name, searchTerm) || Utils.searchInText(item.id, searchTerm),
        )
      }

      this.displayItems(menuItems)
    } catch (error) {
      console.error("Error filtering items:", error)
    }
  },

  searchItems() {
    this.filterItems()
  },

  showAddItemModal() {
    this.editingItemId = null
    const titleEl = document.getElementById("item-modal-title")
    if (titleEl) titleEl.textContent = "Add New Item"
    UIManager.clearForm("item-form")
    UIManager.showModal("item-modal")
  },

  editItem(itemId) {
    console.log(`Editing item: ${itemId}`)
    const menuItems = StorageManager.loadMenuItems()
    const item = menuItems.find((i) => i.id === itemId)
    if (!item) {
      alert("Item not found!")
      return
    }

    this.editingItemId = itemId
    const titleEl = document.getElementById("item-modal-title")
    if (titleEl) titleEl.textContent = "Edit Item"

    // Populate form fields
    const fields = {
      "item-code": item.id,
      "item-name": item.name,
      "item-category": item.category,
      "item-price": item.price,
      "item-discount": item.discount,
      "item-quantity": item.quantity,
      "item-expiry": item.expiry || "",
    }

    Object.entries(fields).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) element.value = value
    })

    UIManager.showModal("item-modal")
  },

  deleteItem(itemId) {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        let menuItems = StorageManager.loadMenuItems()
        const originalLength = menuItems.length
        menuItems = menuItems.filter((item) => item.id !== itemId)

        if (menuItems.length === originalLength) {
          alert("Item not found!")
          return
        }

        StorageManager.saveMenuItems(menuItems)
        this.load()
        if (typeof DashboardManager !== "undefined" && DashboardManager.updateStats) {
          DashboardManager.updateStats()
        }
        alert("Item deleted successfully!")
      } catch (error) {
        console.error("Error deleting item:", error)
        alert("Error deleting item. Please try again.")
      }
    }
  },

  handleItemSubmit(e) {
    e.preventDefault()

    try {
      const itemData = {
        id: document.getElementById("item-code").value.trim(),
        name: document.getElementById("item-name").value.trim(),
        category: document.getElementById("item-category").value,
        price: Number.parseFloat(document.getElementById("item-price").value),
        discount: Number.parseInt(document.getElementById("item-discount").value) || 0,
        quantity: Number.parseInt(document.getElementById("item-quantity").value),
        expiry: document.getElementById("item-expiry").value || null,
      }

      // Validation
      if (!itemData.id || !itemData.name || !itemData.category || isNaN(itemData.price) || isNaN(itemData.quantity)) {
        alert("Please fill in all required fields correctly.")
        return
      }

      const menuItems = StorageManager.loadMenuItems()

      if (this.editingItemId) {
        // Update existing item
        const index = menuItems.findIndex((item) => item.id === this.editingItemId)
        if (index !== -1) {
          menuItems[index] = itemData
        }
      } else {
        // Add new item
        if (menuItems.find((item) => item.id === itemData.id)) {
          alert("Item code already exists!")
          return
        }
        menuItems.push(itemData)
      }

      StorageManager.saveMenuItems(menuItems)
      UIManager.closeModal()
      this.load()
      if (typeof DashboardManager !== "undefined" && DashboardManager.updateStats) {
        DashboardManager.updateStats()
      }
      alert(this.editingItemId ? "Item updated successfully!" : "Item added successfully!")
    } catch (error) {
      console.error("Error saving item:", error)
      alert("Error saving item. Please try again.")
    }
  },
}

// Make StoreManager available globally
window.StoreManager = StoreManager
