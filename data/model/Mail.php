<?php

include_once('../../vendor/autoload.php');

class Mail
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function save($email, $otp)
    {
        if ($this->isEmailExists($email)) {
            $currentTimestamp = time(); 
            $expirationTimestamp = $currentTimestamp + 600;  // 10 minutes
    
            $sql = "UPDATE users SET otp = ?, otp_timestamp = ? WHERE email = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("sis", $otp, $expirationTimestamp, $email);
    
            $result = $stmt->execute();
            $stmt->close();
    
            return $result;
        } else {
            $this->error = 'EmailNotExists';
            return false;
        }
    }
    
    
    private function isEmailExists($email)
    {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        $emailExists = $stmt->num_rows > 0;

        $stmt->close();

        return $emailExists;
    }
    
    public function verifyOTP($email, $enteredOTP)
    {
        error_log("Verifying OTP for email: $email, entered OTP: $enteredOTP");
    
        $sql = "SELECT otp, otp_timestamp FROM users WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->bind_result($storedOTP, $otpTimestamp);
        $stmt->fetch();
        $stmt->close();
    
        // Debug statements
        error_log("Stored OTP: $storedOTP");
        error_log("OTP Timestamp: $otpTimestamp");
    
        // Verify OTP and check expiration
        $currentTimestamp = time();
        $expirationTime = 600;

        if (trim($enteredOTP) === '') {
            $this->error = 'BlankOTP';
        } elseif (trim($storedOTP) === trim($enteredOTP)) {
            if ($otpTimestamp >= $currentTimestamp && $otpTimestamp <= ($currentTimestamp + $expirationTime)) {
                unset($_SESSION['verification_email']);
                session_write_close();
                return true;
            } elseif ($otpTimestamp < $currentTimestamp) {
                $this->error = 'OTPExpired';
            } else {
                $this->error = 'InvalidOTP';
            }
        } else {
            $this->error = 'InvalidOTP';
        }
    
        return false;
    }

    public function getError()
    {
        return $this->error;
    }
}