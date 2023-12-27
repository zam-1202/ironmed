<?php

include_once('../../config/database.php');
include_once('../model/User.php');
include_once('../model/Mail.php');


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$action = $_GET['action'];
$User = new User($conn);
$Mail = new Mail($conn);

if ($action == 'sendOTP') {
    $email = $_POST['email'];

    $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    $result = $Mail->save($email, $otp);

    if ($result) {

        $mail = new PHPMailer;

        // SMTP server settings 
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPSecure = 'tls';
        $mail->SMTPAuth = true;
        $mail->Username = 'pharmacyironmed@gmail.com';
        $mail->Password = 'zoicolijzeolrgxc';
        $mail->Port = 587; 

        // Email parameters
        $mail->setFrom('pharmacyironmed@gmail.com', 'IronMed');
        $mail->addAddress($email);

        // $mail->addCC('kpace1226@gmail.com', 'Kenneth Pace');
        // $mail->addCC('jirespende@gmail.com', 'John Ivan Respende');
        // $mail->addCC('pupsrcdom.fernandez@gmail.com', 'Dom Fernandez');

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'IronMed One-Time Password (OTP)';
        ob_start();
        include('../../views/master-page/OTP-email.php');
        $mail->Body = ob_get_clean();


        // Send the email
        if ($mail->send()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'FailedToSendOTP']);
        }
    } else {
        if ($Mail->getError() === 'EmailNotExists') {
            echo json_encode(['success' => false, 'error' => 'EmailNotExists']);
        } else {
            echo json_encode(['success' => false, 'error' => 'OtherError']);
        }
    }

} else if ($action == "verifyOTP") {
    // Check if 'email' is set in $_POST
    if (isset($_POST['email'])) {
        $email = $_POST['email'];
        $enteredOTP = $_POST['enteredOTP'];

        $result = $Mail->verifyOTP($email, $enteredOTP);

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $Mail->getError()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'EmailNotSet']);
    }
}
