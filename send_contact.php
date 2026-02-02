<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "fischervorchdorf@gmx.at";

    $name = strip_tags(trim($_POST['name'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $subject_type = strip_tags(trim($_POST['subject'] ?? 'general'));
    $message = strip_tags(trim($_POST['message'] ?? ''));

    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Bitte füllen Sie alle Pflichtfelder aus."]);
        exit;
    }

    $subject_mapping = [
        "general" => "Allgemeine Anfrage",
        "volunteer" => "Mithilfe",
        "tour" => "Führung",
        "exhibition" => "Sonderausstellung",
        "donation" => "Exponat-Spende",
        "other" => "Sonstiges"
    ];

    $subject_text = $subject_mapping[$subject_type] ?? "Kontaktanfrage";
    $subject = "Kontaktanfrage: " . $subject_text . " von " . $name;

    $from_email = "website@" . str_replace("www.", "", $_SERVER['HTTP_HOST']);
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From: Kontakt-Formular <" . $from_email . ">\r\n";
    $headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $email_content = "Name: " . $name . "\n";
    $email_content .= "E-Mail: " . $email . "\n";
    $email_content .= "Betreff: " . $subject_text . "\n\n";
    $email_content .= "Nachricht:\n" . $message . "\n";

    if (@mail($to, $subject, $email_content, $headers)) {
        echo json_encode(["status" => "success", "message" => "Vielen Dank für Ihre Nachricht! Wir werden uns so bald wie möglich bei Ihnen melden."]);
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