<?php
include 'db_connect.php';

$sql = "SELECT * FROM supplier ORDER BY supplier_id DESC";
$result = $conn->query($sql);

$suppliers = [];
while ($row = $result->fetch_assoc()) {
    $suppliers[] = $row;
}

header('Content-Type: application/json');
echo json_encode($suppliers);
$conn->close();
?>
