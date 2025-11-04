document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_reports.php")
    .then(res => res.json())
    .then(data => {
      console.log("📊 Report Data:", data);

      // 🧾 Summary
      const totalBills = data.summary?.total_bills || 0;
      const totalSales = parseFloat(data.summary?.total_sales) || 0;

      document.getElementById("totalBills").textContent = totalBills;
      document.getElementById("totalSales").textContent = totalSales.toFixed(2);

      // ⚠️ Low stock
      const lowStockTable = document.getElementById("lowStockTable");
      if (data.low_stock && data.low_stock.length > 0) {
        lowStockTable.innerHTML = data.low_stock
          .map(
            (m) => `
              <tr>
                <td>${m.m_id}</td>
                <td>${m.m_name}</td>
                <td>${m.quantity}</td>
              </tr>`
          )
          .join("");
      } else {
        lowStockTable.innerHTML = `<tr><td colspan="3" style="text-align:center;">✅ All stocks sufficient</td></tr>`;
      }

      // ⏳ Expiring soon
      const expiringTable = document.getElementById("expiringTable");
      if (data.expiring_soon && data.expiring_soon.length > 0) {
        expiringTable.innerHTML = data.expiring_soon
          .map(
            (m) => `
              <tr>
                <td>${m.m_id}</td>
                <td>${m.m_name}</td>
                <td>${m.exp_date}</td>
                <td>${m.days_left} days left</td>
              </tr>`
          )
          .join("");
      } else {
        expiringTable.innerHTML = `<tr><td colspan="4" style="text-align:center;">✅ No medicines expiring soon</td></tr>`;
      }
    })
    .catch((err) => {
      console.error("Error loading reports:", err);
      alert("⚠️ Failed to load report data. Check console for details.");
    });
});

