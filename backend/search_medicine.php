<?php
include 'db_connect.php';

if (isset($_GET['name'])) {
    $name = strtolower($_GET['name']);

    $sql = "SELECT * FROM medicine WHERE LOWER(m_name) = '$name'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "✅ $name is available in stock.";
    } else {
        echo "❌ $name not found in inventory.";
    }
}
?>
