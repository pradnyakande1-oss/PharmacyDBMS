<?php
include 'db_connect.php';
header("Content-Type: application/json");

// Low stock
$lowStockResult = $conn->query("SELECT m_id, m_name, quantity FROM medicine WHERE quantity < 5");
$lowStock = $lowStockResult ? $lowStockResult->fetch_all(MYSQLI_ASSOC) : [];

// Expiring soon (0..7 days)
$expiringQuery = "
  SELECT m_id, m_name, exp_date, quantity,
         DATEDIFF(exp_date, CURDATE()) AS days_left
  FROM medicine
  WHERE STR_TO_DATE(exp_date, '%Y-%m-%d') BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
  ORDER BY exp_date ASC
";
$expiringResult = $conn->query($expiringQuery);
$expiring = $expiringResult ? $expiringResult->fetch_all(MYSQLI_ASSOC) : [];

// Summary totals from bill table
$summaryResult = $conn->query("SELECT COUNT(b_id) AS total_bills, IFNULL(SUM(b_amount),0) AS total_sales FROM bill");
$summary = $summaryResult ? $summaryResult->fetch_assoc() : ['total_bills'=>0,'total_sales'=>0];

echo json_encode([
  "low_stock" => $lowStock,
  "expiring_soon" => $expiring,
  "summary" => $summary
]);

$conn->close();
?>
