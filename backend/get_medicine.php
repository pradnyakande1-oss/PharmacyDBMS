<?php
include 'db_connect.php';

header("Content-Type: application/json");

$sql = "SELECT * FROM medicine";
$result = $conn->query($sql);

$medicines = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $medicines[] = $row;
    }
}

echo json_encode($medicines);

$conn->close();
?>


