<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">

    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <!-- <h2 style="color: #2dafa9; text-align: center;">Temporary Password</h2> -->

        <p>Hello,</p>

        <p>Your IronMed account password has been successfully reset.</p>
        <p>Your temporary password is: </p>

        <h3 style="text-align: center; padding: 10px; background-color: #2dafa9; color: #ffffff; border-radius: 5px;"><?php echo $password; ?></h3>

        <p style="color: red;"><strong>Note:</strong> This temporary password will expire in 24 hours.</p>
        <p>Please log in to your account using this temporary password. And we recommend changing your password after logging in for security reasons.</p>
        <p>If you did not request this password reset, please contact our support team immediately.</p>
        <p>Thank you for using IronMed!</p>

        <p style="text-align: left; color: #2dafa9; font-weight: bold;">Best regards,<br>IronMed Team</p>

        <p style="font-size: 11px; color: #6C757D;">This is an automated message. Please do not reply to this email.</p>
    </div>

</body>
</html>