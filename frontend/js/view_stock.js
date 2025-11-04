document.addEventListener("DOMContentLoaded", function () {
  loadMedicines();
  loadSuppliers();

  const form = document.getElementById("medicineForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/add_medicine.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        form.reset();
        loadMedicines();
        loadSuppliers();
      })
      .catch((err) => console.error("Error adding medicine:", err));
  });
});

// 🩺 Load medicines from backend
function loadMedicines() {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_medicine.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#medicineTable tbody");
      tbody.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No medicines found</td></tr>`;
        return;
      }

      data.forEach((med) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${med.m_id}</td>
          <td>${med.m_name}</td>
          <td>${med.category || "-"}</td>
          <td>${med.quantity}</td>
          <td>${med.price}</td>
          <td>${med.mfg_date}</td>
          <td>${med.exp_date}</td>
          <td>
            <button class="edit-btn" onclick="editMedicine(${med.m_id})">✏ Edit</button>
            <button class="delete-btn" onclick="deleteMedicine(${med.m_id})">🗑 Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => console.error("Error loading medicines:", err));
}

// 🧾 Load suppliers into dropdown
function loadSuppliers() {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_supplier.php")
    .then((res) => res.json())
    .then((data) => {
      const supplierSelect = document.getElementById("supplier_id");
      if (!supplierSelect) return;

      supplierSelect.innerHTML = `<option value="">Select Supplier</option>`;
      data.forEach((supplier) => {
        const opt = document.createElement("option");
        opt.value = supplier.supplier_id;
        opt.textContent = `${supplier.supplier_id} - ${supplier.name}`;
        supplierSelect.appendChild(opt);
      });
    })
    .catch((err) => console.error("Error loading suppliers:", err));
}

// ❌ Delete a medicine
function deleteMedicine(id) {
  if (confirm("Are you sure you want to delete this medicine?")) {
    fetch(`http://localhost/Pharmacy-Inventory-Management-System/backend/delete_medicine.php?id=${id}`)
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        loadMedicines();
      })
      .catch((err) => console.error("Error deleting medicine:", err));
  }
}

// ✏ Edit a medicine
function editMedicine(id) {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_medicine.php")
    .then((res) => res.json())
    .then((data) => {
      const med = data.find((m) => m.m_id == id);
      if (!med) {
        alert("⚠️ Medicine not found!");
        return;
      }

      // Fill the form with existing data
      document.getElementById("m_name").value = med.m_name;
      document.getElementById("category").value = med.category;
      document.getElementById("quantity").value = med.quantity;
      document.getElementById("price").value = med.price;
      document.getElementById("mfg_date").value = med.mfg_date;
      document.getElementById("exp_date").value = med.exp_date;
      document.getElementById("supplier_id").value = med.supplier_id;

      // Change button text to Update
      const submitBtn = document.querySelector("#medicineForm button[type='submit']");
      submitBtn.textContent = "Update";
      submitBtn.onclick = function (e) {
        e.preventDefault();
        updateMedicine(id);
      };
    })
    .catch((err) => console.error("Error editing medicine:", err));
}

// 🔄 Update medicine
function updateMedicine(id) {
  const formData = new FormData(document.getElementById("medicineForm"));
  formData.append("m_id", id);

  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/update_medicine.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((msg) => {
      alert(msg);
      document.getElementById("medicineForm").reset();

      // Revert button back to Add
      const submitBtn = document.querySelector("#medicineForm button[type='submit']");
      submitBtn.textContent = "Add";
      submitBtn.onclick = null;

      loadMedicines();
    })
    .catch((err) => console.error("Error updating medicine:", err));
}
