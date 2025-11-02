<?php
include 'db_connect.php';

$sql = "SELECT b.*, c.name AS customer_name
        FROM bill b
        LEFT JOIN customer c ON b.customer_id = c.customer_id
        ORDER BY b.b_id DESC";

$result = $conn->query($sql);
$bills = [];

while ($row = $result->fetch_assoc()) {
    $bills[] = $row;
}

header('Content-Type: application/json');
echo json_encode($bills);
$conn->close();
?>
