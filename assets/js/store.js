// Store Manager - Handles store management functionality
const StoreManager = {
  editingItemId: null,

  load() {
    this.displayItems()
  },

  displayItems(itemsToShow = null) {
    const menuItems = itemsToShow || StorageManager.loadMenuItems()
    const container = document.getElementById("items-container")

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
  },

  filterItems() {
    const category = document.getElementById("category-filter").value
    const searchTerm = document.getElementById("search-items").value.toLowerCase()
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
  },

  searchItems() {
    this.filterItems()
  },

  showAddItemModal() {
    this.editingItemId = null
    document.getElementById("item-modal-title").textContent = "Add New Item"
    UIManager.clearForm("item-form")
    UIManager.showModal("item-modal")
  },

  editItem(itemId) {
    const menuItems = StorageManager.loadMenuItems()
    const item = menuItems.find((i) => i.id === itemId)
    if (!item) return

    this.editingItemId = itemId
    document.getElementById("item-modal-title").textContent = "Edit Item"

    document.getElementById("item-code").value = item.id
    document.getElementById("item-name").value = item.name
    document.getElementById("item-category").value = item.category
    document.getElementById("item-price").value = item.price
    document.getElementById("item-discount").value = item.discount
    document.getElementById("item-quantity").value = item.quantity
    document.getElementById("item-expiry").value = item.expiry || ""

    UIManager.showModal("item-modal")
  },

  deleteItem(itemId) {
    if (confirm("Are you sure you want to delete this item?")) {
      let menuItems = StorageManager.loadMenuItems()
      menuItems = menuItems.filter((item) => item.id !== itemId)
      StorageManager.saveMenuItems(menuItems)
      this.load()
      DashboardManager.updateStats()
    }
  },

  handleItemSubmit(e) {
    e.preventDefault()

    const itemData = {
      id: document.getElementById("item-code").value,
      name: document.getElementById("item-name").value,
      category: document.getElementById("item-category").value,
      price: Number.parseFloat(document.getElementById("item-price").value),
      discount: Number.parseInt(document.getElementById("item-discount").value) || 0,
      quantity: Number.parseInt(document.getElementById("item-quantity").value),
      expiry: document.getElementById("item-expiry").value || null,
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
    DashboardManager.updateStats()
  },
}
