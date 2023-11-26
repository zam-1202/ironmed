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
        // Check if the email exists in the users table
        if ($this->isEmailExists($email)) {
            $sql = "UPDATE users SET otp = ? WHERE email = ?";
        
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("is", $otp, $email);
        
            $result = $stmt->execute(); // Use the result directly as a boolean
            $stmt->close(); // Close the prepared statement
    
            return $result;
        } else {
            $this->error = 'EmailNotExists'; // Set an error if the email does not exist
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
    
        $sql = "SELECT otp FROM users WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->bind_result($storedOTP);
        $stmt->fetch();
        $stmt->close();
    
        // Debug statement
        error_log("Stored OTP: $storedOTP");
    
        // Verify OTP
        if (trim($storedOTP) == trim($enteredOTP)) {
            // Clear the stored email from the session after successful verification
            unset($_SESSION['verification_email']);
            session_write_close(); // Optional: close the session
    
            return true; // OTP matches
        } else {
            $this->error = 'InvalidOTP';
            return false; // OTP does not match
        }
    }
    
    public function getError()
    {
        return $this->error;
    }
}
