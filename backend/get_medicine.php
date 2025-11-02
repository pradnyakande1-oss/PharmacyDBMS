<?php
include 'db_connect.php';

$sql = "SELECT * FROM medicine ORDER BY m_id DESC";
$result = $conn->query($sql);

$medicines = [];
while ($row = $result->fetch_assoc()) {
    $medicines[] = $row;
}

header('Content-Type: application/json');
echo json_encode($medicines);
$conn->close();
?>

