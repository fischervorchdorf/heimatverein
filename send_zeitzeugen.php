<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "fischervorchdorf@gmx.at";
    $subject = "Neue Zeitzeugen-Geschichte: " . ($_POST['titel'] ?? 'Kein Titel');

    $titel = $_POST['titel'] ?? 'Kein Titel';
    $geschichte = $_POST['geschichte'] ?? 'Keine Geschichte';
    $kontakt = $_POST['kontakt'] ?? 'Kein Kontakt angegeben';

    // Boundary for multipart email
    $boundary = md5(time());

    // Headers
    $from_email = "website@" . str_replace("www.", "", $_SERVER['HTTP_HOST']);
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From: Zeitzeugen-Formular <" . $from_email . ">\r\n";
    $headers .= "Reply-To: " . ($kontakt ? $kontakt : $to) . "\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

    // Message Body
    $body = "--" . $boundary . "\r\n";
    $body .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= "Titel: " . $titel . "\r\n";
    $body .= "Kontakt: " . $kontakt . "\r\n\r\n";
    $body .= "Geschichte:\r\n" . $geschichte . "\r\n\r\n";

    // Attachment
    if (isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $file_tmp_name = $_FILES['file']['tmp_name'];
        $file_name = basename($_FILES['file']['name']);
        $file_size = $_FILES['file']['size'];
        $file_type = $_FILES['file']['type'];

        $handle = fopen($file_tmp_name, "r");
        $content = fread($handle, $file_size);
        fclose($handle);
        $encoded_content = chunk_split(base64_encode($content));

        $body .= "--" . $boundary . "\r\n";
        $body .= "Content-Type: " . $file_type . "; name=\"" . $file_name . "\"\r\n";
        $body .= "Content-Disposition: attachment; filename=\"" . $file_name . "\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= $encoded_content . "\r\n";
    }

    $body .= "--" . $boundary . "--";

    // Debugging output if it fails
    if (@mail($to, $subject, $body, $headers)) {
        echo json_encode(["status" => "success", "message" => "Vielen Dank! Deine Geschichte wurde erfolgreich übermittelt."]);
    } else {
        $error = error_get_last();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Mail-Versand fehlgeschlagen.", "debug" => $error['message'] ?? 'Unbekannter PHP-Fehler']);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Methode nicht erlaubt."]);
}
?>