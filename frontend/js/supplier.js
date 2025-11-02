document.addEventListener("DOMContentLoaded", function() {
  loadSuppliers();

  // Handle Add Supplier form submission
  const form = document.getElementById("supplierForm");
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(form);
    fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/add_supplier.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      form.reset();
      loadSuppliers();
    })
    .catch(err => console.error("Error adding supplier:", err));
  });
});

// Load suppliers from backend
function loadSuppliers() {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_supplier.php")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#supplierTable tbody");
      tbody.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No suppliers found</td></tr>`;
        return;
      }

      data.forEach(supplier => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${supplier.supplier_id}</td>
          <td>${supplier.name}</td>
          <td>${supplier.address}</td>
          <td>${supplier.contact_info}</td>
          <td><button onclick="deleteSupplier(${supplier.supplier_id})">🗑 Delete</button></td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error loading suppliers:", err));
}

// ✅ Fixed Delete supplier path
function deleteSupplier(id) {
  if (confirm("Are you sure you want to delete this supplier?")) {
    fetch(`http://localhost/Pharmacy-Inventory-Management-System/backend/delete_supplier.php?id=${id}`)
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        loadSuppliers();
      })
      .catch(err => console.error("Error deleting supplier:", err));
  }
}
