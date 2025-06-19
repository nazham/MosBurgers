// Reports Manager - Handles reports functionality
const ReportsManager = {
  load() {
    this.populateSelectors()
    this.generateTopCustomers()
  },

  populateSelectors() {
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

    // Clear existing options except the first one
    monthSelect.innerHTML = '<option value="">Select Month</option>'

    months.forEach((month, index) => {
      const option = document.createElement("option")
      option.value = index
      option.textContent = month
      monthSelect.appendChild(option)
    })

    // Populate year selector
    const yearSelect = document.getElementById("year-select")
    const currentYear = new Date().getFullYear()

    // Clear existing options except the first one
    yearSelect.innerHTML = '<option value="">Select Year</option>'

    for (let year = currentYear - 5; year <= currentYear + 1; year++) {
      const option = document.createElement("option")
      option.value = year
      option.textContent = year
      yearSelect.appendChild(option)
    }
  },

  generateMonthlySalesReport() {
    const selectedMonth = document.getElementById("month-select").value
    if (selectedMonth === "") return

    const month = Number.parseInt(selectedMonth)
    const currentYear = new Date().getFullYear()
    const orders = StorageManager.loadOrders()

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
        <p><strong>Total Sales:</strong> ${Utils.formatCurrency(totalSales)}</p>
        <p><strong>Average Order Value:</strong> ${Utils.formatCurrency(totalOrders > 0 ? totalSales / totalOrders : 0)}</p>
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
                  <td style="padding: 8px; border: 1px solid #ddd;">${Utils.formatCurrency(data.revenue)}</td>
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
  },

  generateTopCustomers() {
    const customers = StorageManager.loadCustomers()
    const orders = StorageManager.loadOrders()

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
              <td style="padding: 8px; border: 1px solid #ddd;">${Utils.formatCurrency(customer.totalSpent)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `
  },

  generateAnnualReport() {
    const selectedYear = document.getElementById("year-select").value
    if (selectedYear === "") return

    const year = Number.parseInt(selectedYear)
    const orders = StorageManager.loadOrders()

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
        <p><strong>Total Sales:</strong> ${Utils.formatCurrency(totalSales)}</p>
        <p><strong>Average Order Value:</strong> ${Utils.formatCurrency(totalOrders > 0 ? totalSales / totalOrders : 0)}</p>
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
                <td style="padding: 8px; border: 1px solid #ddd;">${Utils.formatCurrency(data.sales)}</td>
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
                  <td style="padding: 8px; border: 1px solid #ddd;">${Utils.formatCurrency(data.revenue)}</td>
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
  },
}
