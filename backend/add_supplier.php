<?php
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $address = $_POST['address'];
    $contact_info = $_POST['contact_info'];

    // Prevent duplicate suppliers
    $check = $conn->prepare("SELECT * FROM supplier WHERE name=? AND contact_info=?");
    $check->bind_param("ss", $name, $contact_info);
    $check->execute();
    $res = $check->get_result();

    if ($res->num_rows > 0) {
        echo "⚠️ Supplier already exists!";
    } else {
        $sql = $conn->prepare("INSERT INTO supplier (name, address, contact_info) VALUES (?, ?, ?)");
        $sql->bind_param("sss", $name, $address, $contact_info);
        if ($sql->execute()) echo "✅ Supplier added successfully!";
        else echo "❌ Error: " . $conn->error;
    }
}
?>
