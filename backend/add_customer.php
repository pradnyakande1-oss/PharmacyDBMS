<?php
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $address = $_POST['address'];
    $contact = $_POST['contact_info'];
    $m_id = $_POST['m_id'];

    $check = $conn->prepare("SELECT * FROM customer WHERE name=? AND contact_info=?");
    $check->bind_param("ss", $name, $contact);
    $check->execute();
    $res = $check->get_result();

    if ($res->num_rows > 0) {
        echo "⚠️ Customer already exists!";
    } else {
        $sql = $conn->prepare("INSERT INTO customer (name, address, contact_info, m_id)
                               VALUES (?, ?, ?, ?)");
        $sql->bind_param("sssi", $name, $address, $contact, $m_id);
        if ($sql->execute()) echo "✅ Customer added successfully!";
        else echo "❌ Error: " . $conn->error;
    }
}
?>
