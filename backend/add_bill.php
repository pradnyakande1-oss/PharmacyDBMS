<?php
include 'db_connect.php';

// Read JSON body (since we are sending JSON from JS)
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    die("❌ Invalid request — no data received.");
}

$customer_id = intval($data['customer_id']);
$b_date = $data['b_date'];
$b_amount = floatval($data['b_amount']);
$items = $data['items'];
$p_id = 1; // you are the only pharmacist

if ($b_amount <= 0) {
    die("❌ Bill amount must be greater than zero.");
}

// Insert into bill table
$sql = $conn->prepare("INSERT INTO bill (b_date, b_amount, p_id, customer_id) VALUES (?, ?, ?, ?)");
$sql->bind_param("sdii", $b_date, $b_amount, $p_id, $customer_id);
$sql->execute();
$bill_id = $conn->insert_id;

// Insert each medicine item
foreach ($items as $item) {
    $med_id = intval($item['medId']);
    $qty = intval($item['qty']);
    $subtotal = floatval($item['subtotal']);

    $stmt = $conn->prepare("INSERT INTO bill_items (b_id, m_id, quantity, subtotal) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiid", $bill_id, $med_id, $qty, $subtotal);
    $stmt->execute();

    // reduce medicine stock
    $conn->query("UPDATE medicine SET quantity = quantity - $qty WHERE m_id = $med_id");
}

echo "✅ Bill saved successfully!";
$conn->close();
?>
