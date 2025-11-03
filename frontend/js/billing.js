document.addEventListener("DOMContentLoaded", function() {
  loadCustomers();
  loadMedicines();

  document.getElementById("billDate").value = new Date().toLocaleDateString();
});

function loadCustomers() {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_customer.php")
    .then(res => res.json())
    .then(data => {
      const customerSelect = document.getElementById("customerSelect");
      customerSelect.innerHTML = `<option value="">-- Select Customer --</option>`;
      data.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.customer_id;
        opt.textContent = c.name;
        customerSelect.appendChild(opt);
      });
    })
    .catch(err => console.error("Error loading customers:", err));
}

function loadMedicines() {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_medicine.php")
    .then(res => res.json())
    .then(data => {
      const medSelect = document.getElementById("medicineSelect");
      medSelect.innerHTML = `<option value="">-- Select Medicine --</option>`;
      data.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.m_id;
        opt.textContent = m.m_name;
        opt.setAttribute("data-price", m.price);
        medSelect.appendChild(opt);
      });
    })
    .catch(err => console.error("Error loading medicines:", err));
}

function updatePrice() {
  const medSelect = document.getElementById("medicineSelect");
  const priceInput = document.getElementById("price");
  const selectedOption = medSelect.options[medSelect.selectedIndex];
  const price = selectedOption.getAttribute("data-price");
  priceInput.value = price ? parseFloat(price) : 0;
  calculateSubtotal();
}

function calculateSubtotal() {
  const qty = parseFloat(document.getElementById("qty").value) || 0;
  const price = parseFloat(document.getElementById("price").value) || 0;
  document.getElementById("subtotal").value = qty * price;
}

function addMedicine() {
  const medSelect = document.getElementById("medicineSelect");
  const qty = parseInt(document.getElementById("qty").value);
  const price = parseFloat(document.getElementById("price").value);
  const subtotal = qty * price;

  if (!medSelect.value || qty <= 0) {
    alert("Please select a medicine and enter valid quantity!");
    return;
  }

  const table = document.querySelector("#billTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${medSelect.options[medSelect.selectedIndex].text}</td>
    <td>${qty}</td>
    <td>${price}</td>
    <td>${subtotal}</td>
    <td><button onclick="this.parentElement.parentElement.remove(); updateTotals();">🗑</button></td>
  `;
  table.appendChild(row);

  updateTotals();
}

function updateTotals() {
  const rows = document.querySelectorAll("#billTable tbody tr");
  let total = 0;
  rows.forEach(row => {
    total += parseFloat(row.cells[3].textContent);
  });

  const discount = total * 0.05;
  const finalAmount = total - discount;

  document.getElementById("total").textContent = total.toFixed(2);
  document.getElementById("discount").textContent = discount.toFixed(2);
  document.getElementById("finalAmount").textContent = finalAmount.toFixed(2);
}
