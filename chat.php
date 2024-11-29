<?php
header('Content-Type: application/json'); // Mengirimkan header JSON

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Mengambil input text dari pengguna
    $inputText = $_POST['text'] ?? '';

    if (empty($inputText)) {
        echo json_encode(['response' => 'No input received']);
        exit;
    }

    // Logika sederhana untuk membuat respons lebih dinamis
    if (strpos(strtolower($inputText), 'how') !== false) {
        $aiResponse = "I'm doing great, thank you for asking!";
    } else if (strpos(strtolower($inputText), 'hello') !== false) {
        $aiResponse = "Hello! How can I assist you today?";
    } else {
        $aiResponse = "AI Response: " . $inputText;  // Mengulang pesan untuk sekarang
    }

    // Mengirimkan respons dalam format JSON
    echo json_encode(['response' => $aiResponse]);
    exit;
} else {
    // Mengirimkan error jika bukan request POST
    echo json_encode(['response' => 'Invalid request method']);
    exit;
}
?>