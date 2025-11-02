<?php
include 'db_connect.php';

// Check if 'id' is passed in the URL
if (isset($_GET['id'])) {
    $id = intval($_GET['id']); // Convert to integer for safety

    // Prepare and execute delete query
    $stmt = $conn->prepare("DELETE FROM supplier WHERE supplier_id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "✅ Supplier deleted!";
    } else {
        echo "❌ Error deleting supplier: " . $conn->error;
    }

    $stmt->close();
} else {
    echo "⚠️ Invalid request — supplier ID missing!";
}

$conn->close();
?>
