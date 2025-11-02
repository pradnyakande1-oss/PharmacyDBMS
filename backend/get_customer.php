<?php
include 'db_connect.php';

$sql = "SELECT * FROM customer ORDER BY customer_id DESC";
$result = $conn->query($sql);

$customers = [];
while ($row = $result->fetch_assoc()) {
    $customers[] = $row;
}

header('Content-Type: application/json');
echo json_encode($customers);
$conn->close();
?>
