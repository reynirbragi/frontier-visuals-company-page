<?php
// Set up headers for POST requests
header("Content-Type: text/plain");
header("Access-Control-Allow-Origin: *");

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Sanitize and Collect Data
    $name = htmlspecialchars(trim($_POST["name"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST["phone"] ?? ''));
    $business = htmlspecialchars(trim($_POST["business"] ?? ''));
    $package = htmlspecialchars(trim($_POST["package"] ?? ''));
    
    // Check which form was submitted: 
    // The main contact form has a "message" field. The modal form has a "details" field.
    $message = htmlspecialchars(trim($_POST["message"] ?? ''));
    $details = htmlspecialchars(trim($_POST["details"] ?? ''));
    
    $finalMessage = $message ? $message : $details;

    // Validate required fields
    if (empty($name) || empty($email) || empty($finalMessage) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete all required fields properly.";
        exit;
    }

    // --- Configure Your Delivery Details ---
    // The email address where YOU will receive the inquiries
    $recipient = "reyni@yourdomain.com"; // UPDATE THIS TO YOUR ACTUAL EMAIL ADDRESS
    
    // Set the subject line for the email YOU receive
    $subject = "New Lead from Frontier Visuals: " . $name;
    
    // Build the email content for YOU
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    if (!empty($phone)) {
        $email_content .= "Phone: $phone\n";
    }
    if (!empty($business)) {
        $email_content .= "Business/Project: $business\n";
    }
    if (!empty($package)) {
        $email_content .= "Selected Package: $package\n";
    }
    $email_content .= "\nMessage:\n$finalMessage\n";

    // Build the email headers for YOU
    $headers = "From: no-reply@frontiervisuals.com\r\n"; // Ideal if you have a custom domain email
    $headers .= "Reply-To: $email\r\n";
    
    // --- Send Email to You ---
    $mail_sent = mail($recipient, $subject, $email_content, $headers);

    if ($mail_sent) {
        
        // --- Send Auto-Reply to the Visitor ---
        $visitor_subject = "Thanks for reaching out to Frontier Visuals!";
        $visitor_content = "Hi $name,\n\n";
        $visitor_content .= "Thanks for your inquiry! I have received your message and will review it shortly. ";
        $visitor_content .= "I typically get back to inquiries within 1–2 business days.\n\n";
        $visitor_content .= "If you need immediate assistance, feel free to gather any reference websites or ideas you have in the meantime. ";
        $visitor_content .= "\n\nBest regards,\nReynir\nFrontier Visuals\n\n";
        $visitor_content .= "---\nYour Message:\n$finalMessage";
        
        $visitor_headers = "From: Reynir @ Frontier Visuals <no-reply@frontiervisuals.com>\r\n"; // Ideally your business email
        $visitor_headers .= "Reply-To: $recipient\r\n"; 

        // Send the confirmation email
        mail($email, $visitor_subject, $visitor_content, $visitor_headers);

        // Success response for the Javascript fetch
        http_response_code(200);
        echo "Thank you! Your message has been sent.";
    } else {
        // Mail function failed
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }

} else {
    // Not a POST request
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
