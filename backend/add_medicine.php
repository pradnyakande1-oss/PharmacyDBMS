<?php
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['m_name'];
    $category = $_POST['category'];
    $price = $_POST['price'];
    $quantity = $_POST['quantity'];
    $supplier_id = $_POST['supplier_id'];
    $mfg = $_POST['mfg_date'];
    $exp = $_POST['exp_date'];
    $p_id = 1; // you are the only pharmacist

    $check = $conn->prepare("SELECT * FROM medicine WHERE m_name=? AND supplier_id=? AND mfg_date=? AND exp_date=?");
    $check->bind_param("siss", $name, $supplier_id, $mfg, $exp);
    $check->execute();
    $res = $check->get_result();

    if ($res->num_rows > 0) {
        echo "⚠️ Medicine already exists!";
    } else {
        $sql = $conn->prepare("INSERT INTO medicine (m_name, category, price, quantity, supplier_id, p_id, mfg_date, exp_date)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $sql->bind_param("ssdiisss", $name, $category, $price, $quantity, $supplier_id, $p_id, $mfg, $exp);
        if ($sql->execute()) echo "✅ Medicine added successfully!";
        else echo "❌ Error: " . $conn->error;
    }
}
?>
