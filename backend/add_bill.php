<?php
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $customer_name = $_POST['customer_name'];
    $total_amount = $_POST['total_amount'];
    $discount = $_POST['discount'];
    $final_amount = $_POST['final_amount'];

    // Convert medicines list from JSON string to array
    $items = json_decode($_POST['items'], true);
    $b_items = "";
    foreach ($items as $item) {
        $b_items .= $item['medicine'] . " (x" . $item['qty'] . "), ";
    }
    $b_items = rtrim($b_items, ", ");

    $date = date('Y-m-d H:i:s');
    $p_id = 1; // You (the pharmacist)

    $sql = "INSERT INTO bill (b_date, b_items, b_amount, p_id)
            VALUES ('$date', '$b_items', '$final_amount', '$p_id')";

    if ($conn->query($sql)) {
        echo "✅ Bill added successfully!";
    } else {
        echo "❌ Error: " . $conn->error;
    }
}
?>
