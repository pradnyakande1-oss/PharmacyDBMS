<?php
include 'db_connect.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']); // ensure it's a valid number

    // Use a prepared statement to prevent SQL injection
    $stmt = $conn->prepare("DELETE FROM medicine WHERE m_id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "✅ Medicine deleted successfully!";
    } else {
        echo "❌ Error deleting medicine: " . $conn->error;
    }

    $stmt->close();
} else {
    echo "⚠️ Invalid request — no medicine ID provided.";
}

$conn->close();
?>

