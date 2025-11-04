document.addEventListener("DOMContentLoaded", function () {
  loadCustomers();
  loadMedicines();

  // ✅ Auto-fill today's date properly in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("billDate").value = today;

  document.getElementById("saveBillBtn").addEventListener("click", saveBill);
});

function loadCustomers() {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_customer.php")
    .then((res) => res.json())
    .then((data) => {
      const customerSelect = document.getElementById("customerSelect");
      customerSelect.innerHTML = `<option value="">-- Select Customer --</option>`;
      data.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.customer_id;
        opt.textContent = c.name;
        customerSelect.appendChild(opt);
      });
    })
    .catch((err) => console.error("Error loading customers:", err));
}

function loadMedicines() {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_medicine.php")
    .then((res) => res.json())
    .then((data) => {
      const medSelect = document.getElementById("medicineSelect");
      medSelect.innerHTML = `<option value="">-- Select Medicine --</option>`;
      data.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m.m_id;
        opt.textContent = m.m_name;
        opt.setAttribute("data-price", m.price);
        medSelect.appendChild(opt);
      });
    })
    .catch((err) => console.error("Error loading medicines:", err));
}

function updatePrice() {
  const medSelect = document.getElementById("medicineSelect");
  const priceInput = document.getElementById("price");
  const selectedOption = medSelect.options[medSelect.selectedIndex];
  const price = selectedOption.getAttribute("data-price");
  priceInput.value = price ? parseFloat(price).toFixed(2) : 0;
  calculateSubtotal();
}

function calculateSubtotal() {
  const qty = parseFloat(document.getElementById("qty").value) || 0;
  const price = parseFloat(document.getElementById("price").value) || 0;
  document.getElementById("subtotal").value = (qty * price).toFixed(2);
}

function addMedicine() {
  const medSelect = document.getElementById("medicineSelect");
  const qty = parseInt(document.getElementById("qty").value);
  const price = parseFloat(document.getElementById("price").value);
  const subtotal = qty * price;

  if (!medSelect.value || qty <= 0) {
    alert("Please select a medicine and enter a valid quantity!");
    return;
  }

  const table = document.querySelector("#billTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td data-id="${medSelect.value}">${medSelect.options[medSelect.selectedIndex].text}</td>
    <td>${price.toFixed(2)}</td>
    <td>${qty}</td>
    <td>${subtotal.toFixed(2)}</td>
    <td><button onclick="this.parentElement.parentElement.remove(); updateTotals();">🗑</button></td>
  `;
  table.appendChild(row);

  updateTotals();
}

function updateTotals() {
  const rows = document.querySelectorAll("#billTable tbody tr");
  let total = 0;
  rows.forEach((row) => {
    total += parseFloat(row.cells[3].textContent);
  });

  const discount = total * 0.05;
  const finalAmount = total - discount;

  document.getElementById("total").textContent = total.toFixed(2);
  document.getElementById("discount").textContent = discount.toFixed(2);
  document.getElementById("finalAmount").textContent = finalAmount.toFixed(2);
}

// ✅ Updated Save Bill function
function saveBill() {
  const customerId = document.getElementById("customerSelect").value;
  if (!customerId) {
    alert("Please select a customer!");
    return;
  }

  const rows = document.querySelectorAll("#billTable tbody tr");
  if (rows.length === 0) {
    alert("Please add at least one medicine!");
    return;
  }

  const items = [];
  rows.forEach((row) => {
    items.push({
      medId: row.cells[0].getAttribute("data-id"),
      price: parseFloat(row.cells[1].textContent),
      qty: parseInt(row.cells[2].textContent),
      subtotal: parseFloat(row.cells[3].textContent),
    });
  });

  const billData = {
    customer_id: customerId,
    b_date: document.getElementById("billDate").value, // ✅ uses input date directly
    b_amount: parseFloat(document.getElementById("finalAmount").textContent),
    items: items,
  };

  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/add_bill.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(billData),
  })
    .then((res) => res.text())
    .then((msg) => {
      alert(msg);
      document.querySelector("#billTable tbody").innerHTML = "";
      updateTotals();
    })
    .catch((err) => console.error("Error saving bill:", err));
}
