document.addEventListener("DOMContentLoaded", function() {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});

// 🕓 Show current date and time
function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const time = now.toLocaleTimeString('en-IN');
  document.getElementById("datetime").textContent = `${date} — ${time}`;
}

// 🔍 Search medicine from database
function searchMedicine() {
  const name = document.getElementById("searchInput").value.trim();
  if (!name) return alert("Enter a medicine name!");

  console.log("Searching for medicine:", name);

  fetch("http://localhost/Pharmacy-Inventory-Management-System/backend/get_medicine.php")
    .then((res) => {
      if (!res.ok) throw new Error("HTTP error " + res.status);
      return res.text();
    })
    .then((text) => {
      console.log("Raw response:", text);
      const data = JSON.parse(text);
      const found = data.some(
        (m) => m.m_name.toLowerCase() === name.toLowerCase()
      );
      alert(found ? "✅ Medicine is available!" : "❌ Medicine not found!");
    })
    .catch((err) => {
      console.error("Search error:", err);
      alert("⚠️ Search failed! Check console for details.");
    });
}
