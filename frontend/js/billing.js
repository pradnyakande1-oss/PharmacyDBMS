document.addEventListener("DOMContentLoaded", function() {
  loadMedicines();
  document.getElementById("billDate").value = new Date().toLocaleDateString("en-IN");
});

// Load all medicines into dropdown
function loadMedicines() {
  fetch("../../backend/get_medicine_list.php")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("medicineSelect");
      select.innerHTML = '<option value="">--Select Medicine--</option>';
      data.forEach(med => {
        const option = document.createElement("option");
        option.value = med.m_id;
        option.textContent = med.m_name;
        option.setAttribute("data-price", med.price);
        select.appendChild(option);
      });
    })
    .catch(err => console.error("Error loading medicines:", err));
}

// Update price and subtotal
function updatePrice() {
  const medicineSelect = document.getElementById("medicineSelect");
  const price = medicineSelect.selectedOptions[0]?.getAttribute("data-price") || 0;
  document.getElementById("price").value = price;
  calculateSubtotal();
}

document.getElementById("qty").addEventListener("input", calculateSubtotal);

function calculateSubtotal() {
  const price = parseFloat(document.getElementById("price").value) || 0;
  const qty = parseInt(document.getElementById("qty").value) || 0;
  document.getElementById("subtotal").value = (price * qty).toFixed(2);
}

// Add medicine row
function addMedicine() {
  const medicineSelect = document.getElementById("medicineSelect");
  const medicineName = medicineSelect.options[medicineSelect.selectedIndex].text;
  const qty = document.getElementById("qty").value;
  const price = document.getElementById("price").value;
  const subtotal = document.getElementById("subtotal").value;

  if (!medicineSelect.value || !qty) {
    alert("Please select a medicine and quantity!");
    return;
  }

  const tableBody = document.querySelector("#billTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${medicineName}</td>
    <td>${qty}</td>
    <td>${price}</td>
    <td>${subtotal}</td>
    <td><button onclick="deleteRow(this)">🗑</button></td>
  `;
  tableBody.appendChild(row);

  calculateTotal();
  document.getElementById("medicineSelect").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("price").value = "";
  document.getElementById("subtotal").value = "";
}

// Delete medicine row
function deleteRow(btn) {
  btn.closest("tr").remove();
  calculateTotal();
}

// Calculate totals
function calculateTotal() {
  const rows = document.querySelectorAll("#billTable tbody tr");
  let total = 0;

  rows.forEach(row => {
    total += parseFloat(row.children[3].textContent) || 0;
  });

  const discount = total * 0.05;
  const finalAmount = total - discount;

  document.getElementById("total").textContent = total.toFixed(2);
  document.getElementById("discount").textContent = discount.toFixed(2);
  document.getElementById("finalAmount").textContent = finalAmount.toFixed(2);
}

// Save bill to backend
function saveBill() {
  const custName = document.getElementById("custName").value;
  const total = document.getElementById("total").textContent;
  const discount = document.getElementById("discount").textContent;
  const finalAmount = document.getElementById("finalAmount").textContent;

  if (!custName || finalAmount <= 0) {
    alert("Please fill all details before saving the bill.");
    return;
  }

  const items = [];
  document.querySelectorAll("#billTable tbody tr").forEach(row => {
    const medicine = row.children[0].textContent;
    const qty = row.children[1].textContent;
    const price = row.children[2].textContent;
    items.push({ medicine, qty, price });
  });

  const formData = new FormData();
  formData.append("customer_name", custName);
  formData.append("total_amount", total);
  formData.append("discount", discount);
  formData.append("final_amount", finalAmount);
  formData.append("items", JSON.stringify(items));

  fetch("../../backend/add_bill.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    window.print();
    location.reload();
  })
  .catch(err => console.error("Error saving bill:", err));
}
