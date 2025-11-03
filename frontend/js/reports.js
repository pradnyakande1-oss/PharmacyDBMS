document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_bill.php")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#reportTable tbody");
      tbody.innerHTML = "";
      data.forEach(bill => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${bill.b_id}</td>
          <td>${bill.b_date}</td>
          <td>${bill.customer_name}</td>
          <td>${bill.b_amount}</td>
        `;
        tbody.appendChild(row);
      });
    });
});
