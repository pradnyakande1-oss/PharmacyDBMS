document.addEventListener("DOMContentLoaded", function () {
  loadCategories();
  loadSuppliers();
});

// 🧾 Load all unique categories
function loadCategories() {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_medicine.php")
    .then(res => res.json())
    .then(data => {
      const categories = [...new Set(data.map(m => m.category))];
      const select = document.getElementById("searchCategory");
      categories.forEach(cat => {
        if (cat && cat.trim() !== "") {
          const opt = document.createElement("option");
          opt.value = cat;
          opt.textContent = cat;
          select.appendChild(opt);
        }
      });
    })
    .catch(err => console.error("Error loading categories:", err));
}

// 🧾 Load suppliers dynamically
function loadSuppliers() {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_supplier.php")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("searchSupplier");
      data.forEach(supplier => {
        const opt = document.createElement("option");
        opt.value = supplier.name.toLowerCase();
        opt.textContent = supplier.name;
        select.appendChild(opt);
      });
    })
    .catch(err => console.error("Error loading suppliers:", err));
}

// 🔍 Search medicines by name, category, or supplier
function searchMedicine() {
  const name = document.getElementById("searchBox").value.trim().toLowerCase();
  const category = document.getElementById("searchCategory").value.trim().toLowerCase();
  const supplier = document.getElementById("searchSupplier").value.trim().toLowerCase();

  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_medicine.php")
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(med => {
        const matchName = !name || med.m_name.toLowerCase().includes(name);
        const matchCategory = !category || (med.category && med.category.toLowerCase() === category);
        const matchSupplier = !supplier || (med.supplier_name && med.supplier_name.toLowerCase() === supplier);
        return matchName && matchCategory && matchSupplier;
      });

      displaySearchResults(filtered);
    })
    .catch(err => console.error("Error searching medicines:", err));
}

// 🧾 Display search results
function displaySearchResults(medicines) {
  const card = document.getElementById("searchResultsCard");
  const tbody = document.querySelector("#searchResults tbody");
  tbody.innerHTML = "";

  if (!Array.isArray(medicines) || medicines.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">❌ No medicines found</td></tr>`;
    card.style.display = "block";
    return;
  }

  medicines.forEach(m => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.m_id}</td>
      <td>${m.m_name}</td>
      <td>${m.category}</td>
      <td>${m.quantity}</td>
      <td>${m.price}</td>
      <td>${m.supplier_name || "—"}</td>
      <td>${m.exp_date}</td>
    `;
    tbody.appendChild(row);
  });

  card.style.display = "block";
}
