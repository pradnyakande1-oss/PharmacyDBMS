<?php
include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    die("❌ Invalid request — no data received.");
}

$customer_id = intval($data['customer_id']);
$b_date = $data['b_date'];
$b_amount = floatval($data['b_amount']);
$items = $data['items'];
$p_id = 1; // Assuming only one pharmacist for now

if ($b_amount <= 0) {
    die("❌ Bill amount must be greater than zero.");
}

// ✅ Insert into bill table
$sql = $conn->prepare("INSERT INTO bill (b_date, b_amount, p_id, customer_id) VALUES (?, ?, ?, ?)");
$sql->bind_param("sdii", $b_date, $b_amount, $p_id, $customer_id);
$sql->execute();
$bill_id = $conn->insert_id;

// ✅ Prepare item name summary for b_items column
$item_summary = [];

// ✅ Insert each medicine item into bill_items
foreach ($items as $item) {
    $med_id = intval($item['medId']);
    $qty = intval($item['qty']);
    $subtotal = floatval($item['subtotal']);
    $price = floatval($item['price']);

    $stmt = $conn->prepare("INSERT INTO bill_items (bill_id, m_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iiidd", $bill_id, $med_id, $qty, $price, $subtotal);
    $stmt->execute();

    // Reduce medicine stock
    $conn->query("UPDATE medicine SET quantity = quantity - $qty WHERE m_id = $med_id");

    // Get medicine name for summary
    $res = $conn->query("SELECT m_name FROM medicine WHERE m_id = $med_id");
    $m_name = $res->fetch_assoc()['m_name'] ?? 'Unknown';
    $item_summary[] = "$m_name - $qty pcs";
}

// ✅ Update b_items field with readable summary
$summary_text = implode(", ", $item_summary);
$conn->query("UPDATE bill SET b_items = '$summary_text' WHERE b_id = $bill_id");

echo "✅ Bill saved successfully!";
$conn->close();
?>
