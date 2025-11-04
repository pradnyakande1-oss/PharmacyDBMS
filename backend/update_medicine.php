<?php
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['m_id'];
    $name = $_POST['m_name'];
    $category = $_POST['category'];
    $price = $_POST['price'];
    $quantity = $_POST['quantity'];
    $supplier_id = $_POST['supplier_id'];
    $mfg = $_POST['mfg_date'];
    $exp = $_POST['exp_date'];

    $sql = $conn->prepare("UPDATE medicine 
                           SET m_name=?, category=?, price=?, quantity=?, supplier_id=?, mfg_date=?, exp_date=? 
                           WHERE m_id=?");
    $sql->bind_param("ssdiissi", $name, $category, $price, $quantity, $supplier_id, $mfg, $exp, $id);

    if ($sql->execute()) {
        echo "✅ Medicine updated successfully!";
    } else {
        echo "❌ Error updating medicine: " . $conn->error;
    }
}
?>
