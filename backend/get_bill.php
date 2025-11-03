<?php
include 'db_connect.php';

$sql = "SELECT b.b_id, b.b_date, c.name AS customer_name, b.b_amount
        FROM bill b
        JOIN customer c ON b.customer_id = c.customer_id
        ORDER BY b.b_date DESC";
$result = $conn->query($sql);

$bills = [];
while ($row = $result->fetch_assoc()) {
    $bills[] = $row;
}
echo json_encode($bills);
?>
