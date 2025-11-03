<?php
include 'db_connect.php';

error_log("Request method: " . $_SERVER["REQUEST_METHOD"]);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 🧾 Read values safely
    $name = $_POST['m_name'];
    $category = $_POST['category'];
    $price = $_POST['price'];
    $quantity = $_POST['quantity'];
    $supplier_id = $_POST['supplier_id'];
    $mfg = $_POST['mfg_date'];
    $exp = $_POST['exp_date'];
    $p_id = 1; // You are the only pharmacist

    // ✅ Validate required fields
    if (empty($name) || empty($category) || empty($mfg) || empty($exp) || empty($supplier_id)) {
        echo "❌ Missing required fields!";
        exit;
    }

    // ⚠️ Check if medicine already exists (same supplier + mfg + exp)
    $check = $conn->prepare("SELECT * FROM medicine WHERE m_name=? AND supplier_id=? AND mfg_date=? AND exp_date=?");
    $check->bind_param("siss", $name, $supplier_id, $mfg, $exp);
    $check->execute();
    $res = $check->get_result();

    if ($res->num_rows > 0) {
        echo "⚠️ Medicine already exists!";
    } else {
        // ✅ Correct binding order
        $sql = $conn->prepare("INSERT INTO medicine (m_name, category, price, quantity, supplier_id, p_id, mfg_date, exp_date)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $sql->bind_param("ssdiisss", $name, $category, $price, $quantity, $supplier_id, $p_id, $mfg, $exp);

        if ($sql->execute()) {
            echo "✅ Medicine added successfully!";
        } else {
            echo "❌ Error inserting: " . $conn->error;
        }
    }
} 

?>
