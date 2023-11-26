<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IronMed One-Time Password (OTP)</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">

    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <h2 style="color: #2dafa9; text-align: center;">IronMed One-Time Password (OTP)</h2>

        <p>Hello,</p>

        <p>Your One-Time Password (OTP) for IronMed is:</p>

        <h3 style="text-align: center; padding: 10px; background-color: #2dafa9; color: #ffffff; border-radius: 5px;"><?php echo $otp; ?></h3>


        <p>Please use this OTP to verify your identity. If you did not request this OTP, please ignore this email.</p>

        <p>Thank you for using IronMed Web System.</p>

        <p style="text-align: left;">Best regards,<br>IronMed Team</p>

    </div>

</body>
</html>