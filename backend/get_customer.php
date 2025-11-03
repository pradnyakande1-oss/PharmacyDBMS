<?php
include 'db_connect.php';

// Fetch all customers from DB
$sql = "SELECT customer_id, name FROM customer ORDER BY customer_id DESC";
$result = $conn->query($sql);

$customers = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $customers[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($customers);
$conn->close();
?>
