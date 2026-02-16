<?php
// Fehlerberichterstattung unterdrücken, damit keine Warnungen das JSON kaputt machen
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "fischervorchdorf@gmx.at";

    // Daten bereinigen
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $subject_type = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : 'general';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

    if (empty($name) || empty($email) || empty($message)) {
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

    $subject_text = isset($subject_mapping[$subject_type]) ? $subject_mapping[$subject_type] : "Kontaktanfrage";
    $subject = "Kontaktanfrage: " . $subject_text . " von " . $name;

    // Absender-Adresse (wichtig für viele Hoster)
    $host = $_SERVER['HTTP_HOST'];
    $from_email = "website@" . str_replace("www.", "", $host);

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    $headers .= "From: Heimatverein Website <" . $from_email . ">\r\n";
    $headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $email_content = "Neue Nachricht vom Kontaktformular:\n\n";
    $email_content .= "Name: " . $name . "\n";
    $email_content .= "E-Mail: " . $email . "\n";
    $email_content .= "Betreff: " . $subject_text . "\n\n";
    $email_content .= "Nachricht:\n" . $message . "\n";

    if (mail($to, $subject, $email_content, $headers)) {
        echo json_encode(["status" => "success", "message" => "Vielen Dank für Ihre Nachricht! Wir werden uns so bald wie möglich bei Ihnen melden."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Die E-Mail konnte leider nicht gesendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie direkt an " . $to]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Ungültige Anfrage-Methode."]);
}