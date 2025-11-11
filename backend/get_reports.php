<?php
include 'db_connect.php';
header("Content-Type: application/json");

// 🔹 Low stock medicines
$lowStock = [];
$result = $conn->query("SELECT * FROM medicine WHERE quantity < 5");
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $lowStock[] = $row;
  }
}

// 🔹 Expiring soon (within 7 days)
$expiring = [];
$result = $conn->query("
  SELECT * FROM medicine 
  WHERE exp_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
");
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $expiring[] = $row;
  }
}

// 🔹 Total bills and total sales
$summary = ["total_bills" => 0, "total_sales" => 0];
$result = $conn->query("SELECT COUNT(*) as total_bills, SUM(b_amount) as total_sales FROM bill");
if ($result) {
  $summary = $result->fetch_assoc();
}

// 🔹 Top 3 highest sales
$topSales = [];
$result = $conn->query("
  SELECT b.b_id, c.name AS customer_name, b.b_date, b.b_amount
  FROM bill b
  JOIN customer c ON b.customer_id = c.customer_id
  ORDER BY b.b_amount DESC
  LIMIT 3
");
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $topSales[] = $row;
  }
}

echo json_encode([
  "lowStock" => $lowStock,
  "expiring" => $expiring,
  "summary" => $summary,
  "topSales" => $topSales
]);

$conn->close();
?>
