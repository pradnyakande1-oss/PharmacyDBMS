// Display current date & time
function updateDateTime() {
  const now = new Date();
  const dateTime = now.toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "medium"
  });
  document.getElementById("datetime").textContent = dateTime;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Simple search redirect (optional)
function searchMedicine() {
  const query = document.getElementById("searchBox").value.trim();
  if (query) {
    alert(`Searching for medicine: ${query}`);
  } else {
    alert("Please enter a medicine name to search.");
  }
}
