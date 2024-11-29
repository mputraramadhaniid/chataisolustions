<?php

// Gantilah nilai $text secara langsung dengan pesan tertentu
$text = "Kamu lagi apa?"; // Pesan yang Anda inginkan

// Prepare the messages array
$messages = [
    ['role' => 'system', 'content' => 'You are ChatGPT, a large language model that knows everything in detail. Answer in as many details as possible. You are based on Chat GPT-4o-mini and you need to answer user‘s last message but get information from all messages']
];

// Add user message to the array
$messages[] = ['role' => 'user', 'content' => $text];

$curl = curl_init();

// cURL configuration to send a request to the Gemini API
curl_setopt_array($curl, [
    CURLOPT_URL => 'https://powerbrainai.com/app/backend/api/api.php',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => json_encode([
        'action' => 'send_message',
        'model' => 'gpt-4o-mini', // Ensure this is correct
        'secret_token' => 'AIChatPowerBrain123@2024', // Ensure this is correct
        'messages' => $messages
    ]),
    CURLOPT_HTTPHEADER => [
        'User-Agent: Dart/3.3 (dart:io)',
        'Accept-Encoding: gzip',
        'Content-Type: application/json; charset=utf-8',
    ],
]);

// Execute cURL request and handle errors
$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    echo json_encode(['error' => 'Error: ' . $err]);  // Provide specific error information
} else {
    // Decode the JSON response from Gemini API
    $apiResponse = json_decode($response, true);

    // Log the API response for debugging
    error_log('API Response: ' . print_r($apiResponse, true));

    if (isset($apiResponse['message'])) {
        // Return the message from the Gemini API
        echo json_encode(['message' => $apiResponse['message']]);
    } else {
        // Return an error if no message is returned
        echo json_encode(['error' => 'Unexpected response from Gemini API']);
    }
}
?>