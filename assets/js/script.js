let menuItems = []
let orders = []
let customers = []
let currentOrder = {
  items: [],
  customer: {},
  discount: 0,
  total: 0,
}
let editingItemId = null
let editingCustomerId = null

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  loadInitialData()
  setupEventListeners()
  loadDashboard()
  populateReportSelectors()
}

// Initial Data Setup
function loadInitialData() {
  // Load menu items from localStorage or use default data
  const savedItems = localStorage.getItem("menuItems")
  if (savedItems) {
    menuItems = JSON.parse(savedItems)
  } else {
    menuItems = getDefaultMenuItems()
    saveMenuItems()
  }

  // Load orders from localStorage
  const savedOrders = localStorage.getItem("orders")
  if (savedOrders) {
    orders = JSON.parse(savedOrders)
  }

  // Load customers from localStorage
  const savedCustomers = localStorage.getItem("customers")
  if (savedCustomers) {
    customers = JSON.parse(savedCustomers)
  }
}

function getDefaultMenuItems() {
  return [
    // Burgers
    {
      id: "B1001",
      name: "Classic Burger (Large)",
      category: "Burgers",
      price: 750.0,
      discount: 0,
      quantity: 50,
      expiry: "2024-12-31",
    },
    {
      id: "B1002",
      name: "Classic Burger (Regular)",
      category: "Burgers",
      price: 1500.0,
      discount: 15,
      quantity: 30,
      expiry: "2024-12-31",
    },
    {
      id: "B1003",
      name: "Turkey Burger",
      category: "Burgers",
      price: 1600.0,
      discount: 0,
      quantity: 25,
      expiry: "2024-12-31",
    },
    {
      id: "B1004",
      name: "Chicken Burger (Large)",
      category: "Burgers",
      price: 1400.0,
      discount: 0,
      quantity: 40,
      expiry: "2024-12-31",
    },
    {
      id: "B1005",
      name: "Chicken Burger (Regular)",
      category: "Burgers",
      price: 800.0,
      discount: 20,
      quantity: 35,
      expiry: "2024-12-31",
    },
    {
      id: "B1006",
      name: "Cheese Burger (Large)",
      category: "Burgers",
      price: 1000.0,
      discount: 0,
      quantity: 30,
      expiry: "2024-12-31",
    },
    {
      id: "B1007",
      name: "Cheese Burger (Regular)",
      category: "Burgers",
      price: 600.0,
      discount: 0,
      quantity: 25,
      expiry: "2024-12-31",
    },
    {
      id: "B1008",
      name: "Bacon Burger",
      category: "Burgers",
      price: 650.0,
      discount: 15,
      quantity: 20,
      expiry: "2024-12-31",
    },
    {
      id: "B1009",
      name: "Shawarma Burger",
      category: "Burgers",
      price: 800.0,
      discount: 0,
      quantity: 30,
      expiry: "2024-12-31",
    },
    {
      id: "B1010",
      name: "Olive Burger",
      category: "Burgers",
      price: 1800.0,
      discount: 0,
      quantity: 15,
      expiry: "2024-12-31",
    },
    {
      id: "B1012",
      name: "Double-Cheese Burger",
      category: "Burgers",
      price: 1250.0,
      discount: 20,
      quantity: 20,
      expiry: "2024-12-31",
    },
    {
      id: "B1013",
      name: "Crispy Chicken Burger (Regular)",
      category: "Burgers",
      price: 1200.0,
      discount: 0,
      quantity: 25,
      expiry: "2024-12-31",
    },
    {
      id: "B1014",
      name: "Crispy Chicken Burger (Large)",
      category: "Burgers",
      price: 1600.0,
      discount: 10,
      quantity: 20,
      expiry: "2024-12-31",
    },
    {
      id: "B1015",
      name: "Paneer Burger",
      category: "Burgers",
      price: 900.0,
      discount: 0,
      quantity: 25,
      expiry: "2024-12-31",
    },

    // Submarines
    {
      id: "B1016",
      name: "Crispy Chicken Submarine (Large)",
      category: "Submarines",
      price: 2000.0,
      discount: 0,
      quantity: 20,
      expiry: "2024-12-31",
    },
    {
      id: "B1017",
      name: "Crispy Chicken Submarine (Regular)",
      category: "Submarines",
      price: 1500.0,
      discount: 0,
      quantity: 25,
      expiry: "2024-12-31",
    },
    {
      id: "B1018",
      name: "Chicken Submarine (Large)",
      category: "Submarines",
      price: 1800.0,
      discount: 3,
      quantity: 20,
      expiry: "2024-12-31",
    },
    {
      id: "B1019",
      name: "Chicken Submarine (Regular)",
      category: "Submarines",
      price: 1400.0,
      discount: 0,
      quantity: 25,
      expiry: "2024-12-31",
    },
    {
      id: "B1020",
      name: "Grinder Submarine",
      category: "Submarines",
      price: 2300.0,
      discount: 0,
      quantity: 15,
      expiry: "2024-12-31",
    },
    {
      id: "B1021",
      name: "Cheese Submarine",
      category: "Submarines",
      price: 2200.0,
      discount: 0,
      quantity: 20,
      expiry: "2024-12-31",
    },
    {
      id: "B1022",
      name: "Double Cheese n Chicken Submarine",
      category: "Submarines",
      price: 1900.0,
      discount: 16,
      quantity: 15,
      expiry: "2024-12-31",
    },
    {
      id: "B1023",
      name: "Special Horgie Submarine",
      category: "Submarines",
      price: 2800.0,
      discount: 0,
      quantity: 10,
      expiry: "2024-12-31",
    },
    {
      id: "B1024",
      name: "MOS Special Submarine",
      category: "Submarines",
      price: 3000.0,
      discount: 0,
      quantity: 10,
      expiry: "2024-12-31",
    },

    // Fries
    {
      id: "B1025",
      name: "Steak Fries (Large)",
      category: "Fries",
      price: 1200.0,
      discount: 0,
      quantity: 40,
      expiry: "2024-12-31",
    },
    {
      id: "B1026",
      name: "Steak Fries (Medium)",
      category: "Fries",
      price: 600.0,
      discount: 0,
      quantity: 50,
      expiry: "2024-12-31",
    },
    {
      id: "B1027",
      name: "French Fries (Large)",
      category: "Fries",
      price: 800.0,
      discount: 0,
      quantity: 40,
      expiry: "2024-12-31",
    },
    {
      id: "B1028",
      name: "French Fries (Medium)",
      category: "Fries",
      price: 650.0,
      discount: 0,
      quantity: 50,
      expiry: "2024-12-31",
    },
    {
      id: "B1029",
      name: "French Fries (Small)",
      category: "Fries",
      price: 450.0,
      discount: 0,
      quantity: 60,
      expiry: "2024-12-31",
    },
    {
      id: "B1030",
      name: "Sweet Potato Fries (Large)",
      category: "Fries",
      price: 600.0,
      discount: 0,
      quantity: 30,
      expiry: "2024-12-31",
    },

    // Pasta
    {
      id: "B1031",
      name: "Chicken n Cheese Pasta",
      category: "Pasta",
      price: 1600.0,
      discount: 15,
      quantity: 25,
      expiry: "2024-12-31",
    },
    {
      id: "B1032",
      name: "Chicken Penne Pasta",
      category: "Pasta",
      price: 1700.0,
      discount: 0,
      quantity: 20,
      expiry: "2024-12-31",
    },
    {
      id: "B1033",
      name: "Ground Turkey Pasta Bake",
      category: "Pasta",
      price: 2900.0,
      discount: 10,
      quantity: 15,
      expiry: "2024-12-31",
    },
    {
      id: "B1034",
      name: "Creamy Shrimp Pasta",
      category: "Pasta",
      price: 2000.0,
      discount: 0,
      quantity: 20,
      expiry: "2024-12-31",
    },
    {
      id: "B1035",
      name: "Lemon Butter Pasta",
      category: "Pasta",
      price: 1950.0,
      discount: 0,
      quantity: 25,
      expiry: "2024-12-31",
    },
    {
      id: "B1036",
      name: "Tagliatelle Pasta",
      category: "Pasta",
      price: 2400.0,
      discount: 1,
      quantity: 15,
      expiry: "2024-12-31",
    },
    {
      id: "B1037",
      name: "Baked Ravioli",
      category: "Pasta",
      price: 2000.0,
      discount: 1,
      quantity: 20,
      expiry: "2024-12-31",
    },

    // Chicken
    {
      id: "B1038",
      name: "Fried Chicken (Small)",
      category: "Chicken",
      price: 1200.0,
      discount: 0,
      quantity: 30,
      expiry: "2024-12-31",
    },
    {
      id: "B1039",
      name: "Fried Chicken (Regular)",
      category: "Chicken",
      price: 2300.0,
      discount: 10,
      quantity: 25,
      expiry: "2024-12-31",
    },
    {
      id: "B1040",
      name: "Fried Chicken (Large)",
      category: "Chicken",
      price: 3100.0,
      discount: 5,
      quantity: 20,
      expiry: "2024-12-31",
    },
    {
      id: "B1041",
      name: "Hot Wings (Large)",
      category: "Chicken",
      price: 2400.0,
      discount: 0,
      quantity: 25,
      expiry: "2024-12-31",
    },
    {
      id: "B1042",
      name: "Devilled Chicken (Large)",
      category: "Chicken",
      price: 900.0,
      discount: 0,
      quantity: 30,
      expiry: "2024-12-31",
    },
    {
      id: "B1043",
      name: "BBQ Chicken (Regular)",
      category: "Chicken",
      price: 2100.0,
      discount: 0,
      quantity: 25,
      expiry: "2024-12-31",
    },

    // Beverages
    {
      id: "B1044",
      name: "Pepsi (330ml)",
      category: "Beverages",
      price: 990.0,
      discount: 5,
      quantity: 100,
      expiry: "2025-06-30",
    },
    {
      id: "B1045",
      name: "Coca-Cola (330ml)",
      category: "Beverages",
      price: 1230.0,
      discount: 0,
      quantity: 100,
      expiry: "2025-06-30",
    },
    {
      id: "B1046",
      name: "Sprite (330ml)",
      category: "Beverages",
      price: 1500.0,
      discount: 3,
      quantity: 100,
      expiry: "2025-06-30",
    },
    {
      id: "B1047",
      name: "Mirinda (330ml)",
      category: "Beverages",
      price: 850.0,
      discount: 7,
      quantity: 100,
      expiry: "2025-06-30",
    },
  ]
}

// Event Listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const section = this.getAttribute("data-section")
      showSection(section)
    })
  })

  // Forms
  document.getElementById("item-form").addEventListener("submit", handleItemSubmit)
  document.getElementById("customer-form").addEventListener("submit", handleCustomerSubmit)

  // Modal overlay click to close
  document.getElementById("modal-overlay").addEventListener("click", function (e) {
    if (e.target === this) {
      closeModal()
    }
  })
}

// Navigation
function showSection(sectionName) {
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
  switch (sectionName) {
    case "dashboard":
      loadDashboard()
      break
    case "store":
      loadStoreManagement()
      break
    case "orders":
      loadOrderManagement()
      break
    case "customers":
      loadCustomerManagement()
      break
    case "reports":
      loadReports()
      break
  }
}

// Dashboard Functions
function loadDashboard() {
  updateDashboardStats()
  checkExpiredItems()
}

function updateDashboardStats() {
  document.getElementById("total-orders").textContent = orders.length
  document.getElementById("total-customers").textContent = customers.length
  document.getElementById("total-items").textContent = menuItems.length

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  document.getElementById("total-revenue").textContent = `LKR ${totalRevenue.toFixed(2)}`
}

function checkExpiredItems() {
  const today = new Date()
  const expiredItems = menuItems.filter((item) => {
    if (!item.expiry) return false
    const expiryDate = new Date(item.expiry)
    return expiryDate < today
  })

  const alertContainer = document.getElementById("expired-items-alert")
  if (expiredItems.length > 0) {
    alertContainer.innerHTML = `
            <div class="alert alert-danger">
                <strong>Warning!</strong> ${expiredItems.length} item(s) have expired:
                <ul style="margin-top: 10px;">
                    ${expiredItems.map((item) => `<li>${item.name} (${item.id}) - Expired: ${item.expiry}</li>`).join("")}
                </ul>
                <button class="btn btn-danger btn-small" onclick="removeExpiredItems()" style="margin-top: 10px;">
                    Remove Expired Items
                </button>
            </div>
        `
  } else {
    alertContainer.innerHTML = '<div class="alert alert-success">No expired items found.</div>'
  }
}

function removeExpiredItems() {
  const today = new Date()
  menuItems = menuItems.filter((item) => {
    if (!item.expiry) return true
    const expiryDate = new Date(item.expiry)
    return expiryDate >= today
  })

  saveMenuItems()
  loadDashboard()
  loadStoreManagement()
  alert("Expired items have been removed successfully!")
}

// Store Management Functions
function loadStoreManagement() {
  displayItems()
}

function displayItems(itemsToShow = menuItems) {
  const container = document.getElementById("items-container")

  if (itemsToShow.length === 0) {
    container.innerHTML = "<p>No items found.</p>"
    return
  }

  container.innerHTML = itemsToShow
    .map((item) => {
      const isExpired = item.expiry && new Date(item.expiry) < new Date()
      const discountedPrice = item.price - (item.price * item.discount) / 100

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
                    <p class="price"><strong>Price:</strong> LKR ${item.price.toFixed(2)}</p>
                    ${item.discount > 0 ? `<p class="discount"><strong>Discount:</strong> ${item.discount}% (LKR ${discountedPrice.toFixed(2)})</p>` : ""}
                    <p class="quantity"><strong>Quantity:</strong> ${item.quantity}</p>
                    ${item.expiry ? `<p class="${isExpired ? "expired" : ""}"><strong>Expiry:</strong> ${item.expiry} ${isExpired ? "(EXPIRED)" : ""}</p>` : ""}
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-small" onclick="editItem('${item.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteItem('${item.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `
    })
    .join("")
}

function filterItems() {
  const category = document.getElementById("category-filter").value
  const searchTerm = document.getElementById("search-items").value.toLowerCase()

  let filteredItems = menuItems

  if (category) {
    filteredItems = filteredItems.filter((item) => item.category === category)
  }

  if (searchTerm) {
    filteredItems = filteredItems.filter(
      (item) => item.name.toLowerCase().includes(searchTerm) || item.id.toLowerCase().includes(searchTerm),
    )
  }

  displayItems(filteredItems)
}

function searchItems() {
  filterItems()
}

function showAddItemModal() {
  editingItemId = null
  document.getElementById("item-modal-title").textContent = "Add New Item"
  document.getElementById("item-form").reset()
  showModal("item-modal")
}

function editItem(itemId) {
  const item = menuItems.find((i) => i.id === itemId)
  if (!item) return

  editingItemId = itemId
  document.getElementById("item-modal-title").textContent = "Edit Item"

  document.getElementById("item-code").value = item.id
  document.getElementById("item-name").value = item.name
  document.getElementById("item-category").value = item.category
  document.getElementById("item-price").value = item.price
  document.getElementById("item-discount").value = item.discount
  document.getElementById("item-quantity").value = item.quantity
  document.getElementById("item-expiry").value = item.expiry || ""

  showModal("item-modal")
}

function deleteItem(itemId) {
  if (confirm("Are you sure you want to delete this item?")) {
    menuItems = menuItems.filter((item) => item.id !== itemId)
    saveMenuItems()
    loadStoreManagement()
    updateDashboardStats()
  }
}

function handleItemSubmit(e) {
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

  if (editingItemId) {
    // Update existing item
    const index = menuItems.findIndex((item) => item.id === editingItemId)
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

  saveMenuItems()
  closeModal()
  loadStoreManagement()
  updateDashboardStats()
}

// Order Management Functions
function loadOrderManagement() {
  displayOrders()
}

function displayOrders(ordersToShow = orders) {
  const container = document.getElementById("orders-container")

  if (ordersToShow.length === 0) {
    container.innerHTML = "<p>No orders found.</p>"
    return
  }

  container.innerHTML = ordersToShow
    .map(
      (order) => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <h3>Order #${order.id}</h3>
                    <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div class="order-total">LKR ${order.total.toFixed(2)}</div>
            </div>
            <div class="order-items">
                <h4>Items:</h4>
                ${order.items
                  .map(
                    (item) => `
                    <div class="order-item">
                        <span>${item.name} (${item.code})</span>
                        <span>Qty: ${item.quantity} × LKR ${item.price.toFixed(2)} = LKR ${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                `,
                  )
                  .join("")}
                ${order.discount > 0 ? `<p><strong>Order Discount:</strong> ${order.discount}%</p>` : ""}
            </div>
            <div class="order-actions">
                <button class="btn btn-primary btn-small" onclick="editOrder('${order.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-success btn-small" onclick="generateReceipt('${order.id}')">
                    <i class="fas fa-receipt"></i> Receipt
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteOrder('${order.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function searchOrders() {
  const searchTerm = document.getElementById("order-search").value.toLowerCase()

  if (!searchTerm) {
    displayOrders()
    return
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm) ||
      order.customer.phone.includes(searchTerm) ||
      order.customer.name.toLowerCase().includes(searchTerm),
  )

  displayOrders(filteredOrders)
}

function showNewOrderModal() {
  currentOrder = {
    items: [],
    customer: {},
    discount: 0,
    total: 0,
  }

  document.getElementById("customer-phone").value = ""
  document.getElementById("customer-name").value = ""
  document.getElementById("customer-address").value = ""
  document.getElementById("order-discount").value = "0"

  loadMenuItemsForOrder()
  updateOrderCart()
  showModal("order-modal")
}

function loadMenuItemsForOrder() {
  const container = document.getElementById("menu-items-container")
  container.innerHTML = menuItems
    .map((item) => {
      const isExpired = item.expiry && new Date(item.expiry) < new Date()
      const discountedPrice = item.price - (item.price * item.discount) / 100

      return `
            <div class="menu-item ${isExpired ? "expired" : ""}" onclick="addItemToOrder('${item.id}')">
                <div class="menu-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.id} - ${item.category}</p>
                    <p>LKR ${discountedPrice.toFixed(2)} ${item.discount > 0 ? `(${item.discount}% off)` : ""}</p>
                    <p>Stock: ${item.quantity} ${isExpired ? "- EXPIRED" : ""}</p>
                </div>
            </div>
        `
    })
    .join("")
}

function searchMenuItems() {
  const searchTerm = document.getElementById("item-search").value.toLowerCase()
  const container = document.getElementById("menu-items-container")

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm),
  )

  container.innerHTML = filteredItems
    .map((item) => {
      const isExpired = item.expiry && new Date(item.expiry) < new Date()
      const discountedPrice = item.price - (item.price * item.discount) / 100

      return `
            <div class="menu-item ${isExpired ? "expired" : ""}" onclick="addItemToOrder('${item.id}')">
                <div class="menu-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.id} - ${item.category}</p>
                    <p>LKR ${discountedPrice.toFixed(2)} ${item.discount > 0 ? `(${item.discount}% off)` : ""}</p>
                    <p>Stock: ${item.quantity} ${isExpired ? "- EXPIRED" : ""}</p>
                </div>
            </div>
        `
    })
    .join("")
}

function addItemToOrder(itemId) {
  const menuItem = menuItems.find((item) => item.id === itemId)
  if (!menuItem) return

  // Check if item is expired
  if (menuItem.expiry && new Date(menuItem.expiry) < new Date()) {
    alert("This item has expired and cannot be added to the order.")
    return
  }

  // Check if item is already in cart
  const existingItem = currentOrder.items.find((item) => item.code === itemId)
  if (existingItem) {
    if (existingItem.quantity < menuItem.quantity) {
      existingItem.quantity++
    } else {
      alert("Not enough stock available.")
      return
    }
  } else {
    if (menuItem.quantity > 0) {
      const discountedPrice = menuItem.price - (menuItem.price * menuItem.discount) / 100
      currentOrder.items.push({
        code: itemId,
        name: menuItem.name,
        price: discountedPrice,
        quantity: 1,
        maxQuantity: menuItem.quantity,
      })
    } else {
      alert("Item is out of stock.")
      return
    }
  }

  updateOrderCart()
}

function updateOrderCart() {
  const container = document.getElementById("order-cart")

  if (currentOrder.items.length === 0) {
    container.innerHTML = "<p>No items in cart</p>"
  } else {
    container.innerHTML = currentOrder.items
      .map(
        (item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.code} - LKR ${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateItemQuantity(${index}, -1)">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="setItemQuantity(${index}, this.value)" min="1" max="${item.maxQuantity}">
                        <button class="quantity-btn" onclick="updateItemQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="btn btn-danger btn-small" onclick="removeItemFromOrder(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  }

  calculateOrderTotal()
}

function updateItemQuantity(index, change) {
  const item = currentOrder.items[index]
  const newQuantity = item.quantity + change

  if (newQuantity > 0 && newQuantity <= item.maxQuantity) {
    item.quantity = newQuantity
    updateOrderCart()
  }
}

function setItemQuantity(index, quantity) {
  const item = currentOrder.items[index]
  const newQuantity = Number.parseInt(quantity)

  if (newQuantity > 0 && newQuantity <= item.maxQuantity) {
    item.quantity = newQuantity
    updateOrderCart()
  }
}

function removeItemFromOrder(index) {
  currentOrder.items.splice(index, 1)
  updateOrderCart()
}

function calculateOrderTotal() {
  const subtotal = currentOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = Number.parseFloat(document.getElementById("order-discount").value) || 0
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount

  document.getElementById("order-subtotal").textContent = `LKR ${subtotal.toFixed(2)}`
  document.getElementById("order-discount-amount").textContent = `LKR ${discountAmount.toFixed(2)}`
  document.getElementById("order-total").textContent = `LKR ${total.toFixed(2)}`

  currentOrder.total = total
  currentOrder.discount = discount
}

function loadCustomerInfo() {
  const phone = document.getElementById("customer-phone").value
  if (!phone) return

  const customer = customers.find((c) => c.phone === phone)
  if (customer) {
    document.getElementById("customer-name").value = customer.name
    document.getElementById("customer-address").value = customer.address || ""
  }
}

function completeOrder() {
  // Validate order
  if (currentOrder.items.length === 0) {
    alert("Please add items to the order.")
    return
  }

  const customerName = document.getElementById("customer-name").value.trim()
  const customerPhone = document.getElementById("customer-phone").value.trim()

  if (!customerName || !customerPhone) {
    alert("Please enter customer name and phone number.")
    return
  }

  // Create or update customer
  let customer = customers.find((c) => c.phone === customerPhone)
  if (!customer) {
    customer = {
      id: generateId(),
      name: customerName,
      phone: customerPhone,
      address: document.getElementById("customer-address").value.trim(),
      orders: [],
    }
    customers.push(customer)
  } else {
    customer.name = customerName
    customer.address = document.getElementById("customer-address").value.trim()
  }

  // Create order
  const order = {
    id: generateOrderId(),
    customer: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    },
    items: [...currentOrder.items],
    discount: currentOrder.discount,
    total: currentOrder.total,
    date: new Date().toISOString(),
  }

  // Update stock quantities
  currentOrder.items.forEach((orderItem) => {
    const menuItem = menuItems.find((item) => item.id === orderItem.code)
    if (menuItem) {
      menuItem.quantity -= orderItem.quantity
    }
  })

  // Save order
  orders.push(order)
  customer.orders.push(order.id)

  // Save data
  saveOrders()
  saveCustomers()
  saveMenuItems()

  // Generate receipt
  generateReceipt(order.id)

  // Close modal and refresh
  closeModal()
  loadOrderManagement()
  updateDashboardStats()

  alert("Order completed successfully!")
}

function editOrder(orderId) {
  // This would open the order modal with existing order data
  // For simplicity, we'll just show an alert
  alert("Order editing functionality would be implemented here.")
}

function deleteOrder(orderId) {
  if (confirm("Are you sure you want to delete this order?")) {
    orders = orders.filter((order) => order.id !== orderId)
    saveOrders()
    loadOrderManagement()
    updateDashboardStats()
  }
}

function generateReceipt(orderId) {
  const order = orders.find((o) => o.id === orderId)
  if (!order) return

  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.text("MOS BURGERS", 105, 20, { align: "center" })
  doc.setFontSize(12)
  doc.text("Receipt", 105, 30, { align: "center" })

  // Order details
  doc.text(`Order ID: ${order.id}`, 20, 50)
  doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 20, 60)
  doc.text(`Customer: ${order.customer.name}`, 20, 70)
  doc.text(`Phone: ${order.customer.phone}`, 20, 80)
  if (order.customer.address) {
    doc.text(`Address: ${order.customer.address}`, 20, 90)
  }

  // Items
  doc.text("Items:", 20, 110)
  let yPos = 120
  order.items.forEach((item) => {
    const itemTotal = item.price * item.quantity
    doc.text(`${item.name} (${item.code})`, 20, yPos)
    doc.text(`${item.quantity} x LKR ${item.price.toFixed(2)} = LKR ${itemTotal.toFixed(2)}`, 20, yPos + 10)
    yPos += 20
  })

  // Totals
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * (order.discount / 100)

  yPos += 10
  doc.text(`Subtotal: LKR ${subtotal.toFixed(2)}`, 20, yPos)
  if (order.discount > 0) {
    doc.text(`Discount (${order.discount}%): LKR ${discountAmount.toFixed(2)}`, 20, yPos + 10)
    yPos += 10
  }
  doc.setFontSize(14)
  doc.text(`Total: LKR ${order.total.toFixed(2)}`, 20, yPos + 15)

  // Footer
  doc.setFontSize(10)
  doc.text("Thank you for your business!", 105, yPos + 40, { align: "center" })

  // Save PDF
  doc.save(`receipt-${order.id}.pdf`)
}

// Customer Management Functions
function loadCustomerManagement() {
  displayCustomers()
}

function displayCustomers(customersToShow = customers) {
  const container = document.getElementById("customers-container")

  if (customersToShow.length === 0) {
    container.innerHTML = "<p>No customers found.</p>"
    return
  }

  container.innerHTML = customersToShow
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
                    <p><strong>Total Spent:</strong> LKR ${totalSpent.toFixed(2)}</p>
                </div>
                <div class="customer-actions">
                    <button class="btn btn-primary btn-small" onclick="editCustomer('${customer.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-success btn-small" onclick="viewCustomerOrders('${customer.phone}')">
                        <i class="fas fa-eye"></i> Orders
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteCustomer('${customer.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `
    })
    .join("")
}

function searchCustomers() {
  const searchTerm = document.getElementById("customer-search").value.toLowerCase()

  if (!searchTerm) {
    displayCustomers()
    return
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm)),
  )

  displayCustomers(filteredCustomers)
}

function showAddCustomerModal() {
  editingCustomerId = null
  document.getElementById("customer-modal-title").textContent = "Add Customer"
  document.getElementById("customer-form").reset()
  showModal("customer-modal")
}

function editCustomer(customerId) {
  const customer = customers.find((c) => c.id === customerId)
  if (!customer) return

  editingCustomerId = customerId
  document.getElementById("customer-modal-title").textContent = "Edit Customer"

  document.getElementById("customer-form-name").value = customer.name
  document.getElementById("customer-form-phone").value = customer.phone
  document.getElementById("customer-form-address").value = customer.address || ""
  document.getElementById("customer-form-email").value = customer.email || ""

  showModal("customer-modal")
}

function deleteCustomer(customerId) {
  if (confirm("Are you sure you want to delete this customer?")) {
    customers = customers.filter((customer) => customer.id !== customerId)
    saveCustomers()
    loadCustomerManagement()
    updateDashboardStats()
  }
}

function viewCustomerOrders(customerPhone) {
  const customerOrders = orders.filter((order) => order.customer.phone === customerPhone)

  if (customerOrders.length === 0) {
    alert("No orders found for this customer.")
    return
  }

  // Switch to orders section and filter by customer
  showSection("orders")
  document.getElementById("order-search").value = customerPhone
  searchOrders()
}

function handleCustomerSubmit(e) {
  e.preventDefault()

  const customerData = {
    name: document.getElementById("customer-form-name").value.trim(),
    phone: document.getElementById("customer-form-phone").value.trim(),
    address: document.getElementById("customer-form-address").value.trim(),
    email: document.getElementById("customer-form-email").value.trim(),
    orders: [],
  }

  if (editingCustomerId) {
    // Update existing customer
    const index = customers.findIndex((customer) => customer.id === editingCustomerId)
    if (index !== -1) {
      customerData.id = editingCustomerId
      customerData.orders = customers[index].orders
      customers[index] = customerData
    }
  } else {
    // Add new customer
    if (customers.find((customer) => customer.phone === customerData.phone)) {
      alert("Customer with this phone number already exists!")
      return
    }
    customerData.id = generateId()
    customers.push(customerData)
  }

  saveCustomers()
  closeModal()
  loadCustomerManagement()
  updateDashboardStats()
}

// Reports Functions
function loadReports() {
  generateTopCustomers()
}

function populateReportSelectors() {
  // Populate month selector
  const monthSelect = document.getElementById("month-select")
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  months.forEach((month, index) => {
    const option = document.createElement("option")
    option.value = index
    option.textContent = month
    monthSelect.appendChild(option)
  })

  // Populate year selector
  const yearSelect = document.getElementById("year-select")
  const currentYear = new Date().getFullYear()
  for (let year = currentYear - 5; year <= currentYear + 1; year++) {
    const option = document.createElement("option")
    option.value = year
    option.textContent = year
    yearSelect.appendChild(option)
  }
}

function generateMonthlySalesReport() {
  const selectedMonth = document.getElementById("month-select").value
  if (selectedMonth === "") return

  const month = Number.parseInt(selectedMonth)
  const currentYear = new Date().getFullYear()

  const monthlyOrders = orders.filter((order) => {
    const orderDate = new Date(order.date)
    return orderDate.getMonth() === month && orderDate.getFullYear() === currentYear
  })

  const totalSales = monthlyOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = monthlyOrders.length

  // Item sales analysis
  const itemSales = {}
  monthlyOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemSales[item.code]) {
        itemSales[item.code] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
        }
      }
      itemSales[item.code].quantity += item.quantity
      itemSales[item.code].revenue += item.price * item.quantity
    })
  })

  const sortedItems = Object.entries(itemSales)
    .sort(([, a], [, b]) => b.quantity - a.quantity)
    .slice(0, 10)

  const reportContainer = document.getElementById("monthly-report")
  reportContainer.innerHTML = `
        <div class="report-summary">
            <h4>Monthly Summary</h4>
            <p><strong>Total Orders:</strong> ${totalOrders}</p>
            <p><strong>Total Sales:</strong> LKR ${totalSales.toFixed(2)}</p>
            <p><strong>Average Order Value:</strong> LKR ${totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : "0.00"}</p>
        </div>
        <div class="top-items">
            <h4>Top Selling Items</h4>
            ${
              sortedItems.length > 0
                ? `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Quantity Sold</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems
                          .map(
                            ([code, data]) => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${data.quantity}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">LKR ${data.revenue.toFixed(2)}</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            `
                : "<p>No sales data available for this month.</p>"
            }
        </div>
    `
}

function generateTopCustomers() {
  const customerStats = customers
    .map((customer) => {
      const customerOrders = orders.filter((order) => order.customer.phone === customer.phone)
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0)

      return {
        ...customer,
        orderCount: customerOrders.length,
        totalSpent: totalSpent,
      }
    })
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10)

  const container = document.getElementById("top-customers")

  if (customerStats.length === 0) {
    container.innerHTML = "<p>No customer data available.</p>"
    return
  }

  container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f8f9fa;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Rank</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Customer</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Orders</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Total Spent</th>
                </tr>
            </thead>
            <tbody>
                ${customerStats
                  .map(
                    (customer, index) => `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${customer.name}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${customer.orderCount}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">LKR ${customer.totalSpent.toFixed(2)}</td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `
}

function generateAnnualReport() {
  const selectedYear = document.getElementById("year-select").value
  if (selectedYear === "") return

  const year = Number.parseInt(selectedYear)

  const annualOrders = orders.filter((order) => {
    const orderDate = new Date(order.date)
    return orderDate.getFullYear() === year
  })

  const totalSales = annualOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = annualOrders.length

  // Monthly breakdown
  const monthlyData = Array(12)
    .fill(0)
    .map((_, index) => {
      const monthOrders = annualOrders.filter((order) => {
        const orderDate = new Date(order.date)
        return orderDate.getMonth() === index
      })

      return {
        month: new Date(year, index).toLocaleString("default", { month: "long" }),
        orders: monthOrders.length,
        sales: monthOrders.reduce((sum, order) => sum + order.total, 0),
      }
    })

  // Item analysis
  const itemSales = {}
  annualOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemSales[item.code]) {
        itemSales[item.code] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
        }
      }
      itemSales[item.code].quantity += item.quantity
      itemSales[item.code].revenue += item.price * item.quantity
    })
  })

  const sortedItems = Object.entries(itemSales)
    .sort(([, a], [, b]) => b.quantity - a.quantity)
    .slice(0, 15)

  const reportContainer = document.getElementById("annual-report")
  reportContainer.innerHTML = `
        <div class="report-summary">
            <h4>Annual Summary (${year})</h4>
            <p><strong>Total Orders:</strong> ${totalOrders}</p>
            <p><strong>Total Sales:</strong> LKR ${totalSales.toFixed(2)}</p>
            <p><strong>Average Order Value:</strong> LKR ${totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : "0.00"}</p>
        </div>
        
        <div class="monthly-breakdown">
            <h4>Monthly Breakdown</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Month</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Orders</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Sales</th>
                    </tr>
                </thead>
                <tbody>
                    ${monthlyData
                      .map(
                        (data) => `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">${data.month}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${data.orders}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">LKR ${data.sales.toFixed(2)}</td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
        
        <div class="annual-items">
            <h4>Top Items (${year})</h4>
            ${
              sortedItems.length > 0
                ? `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Quantity Sold</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedItems
                          .map(
                            ([code, data]) => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${data.quantity}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">LKR ${data.revenue.toFixed(2)}</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            `
                : "<p>No sales data available for this year.</p>"
            }
        </div>
    `
}

// Modal Functions
function showModal(modalId) {
  document.getElementById("modal-overlay").classList.add("active")
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none"
  })
  document.getElementById(modalId).style.display = "block"
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active")
}

// Utility Functions
function generateId() {
  return "CUST" + Date.now() + Math.random().toString(36).substr(2, 5)
}

function generateOrderId() {
  return "ORD" + Date.now() + Math.random().toString(36).substr(2, 5)
}

// Data Persistence Functions
function saveMenuItems() {
  localStorage.setItem("menuItems", JSON.stringify(menuItems))
}

function saveOrders() {
  localStorage.setItem("orders", JSON.stringify(orders))
}

function saveCustomers() {
  localStorage.setItem("customers", JSON.stringify(customers))
}

// Mobile Menu Toggle (for responsive design)
function toggleMobileMenu() {
  const sidebar = document.querySelector(".sidebar")
  sidebar.classList.toggle("mobile-open")
}

// Add mobile menu button for small screens
if (window.innerWidth <= 768) {
  const mobileMenuBtn = document.createElement("button")
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'
  mobileMenuBtn.className = "mobile-menu-btn"
  mobileMenuBtn.onclick = toggleMobileMenu
  document.body.appendChild(mobileMenuBtn)
}
