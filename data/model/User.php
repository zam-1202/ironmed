<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);

// mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

include_once('ActionLog.php');

class User
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
        $this->ActionLog = new ActionLog($connection);
    }

    public function getAll()
    {
        $sql = "SELECT id, first_name, last_name, username, email, password, role, status, last_login, hours, minutes, seconds from users where role != 1";
        $result = $this->conn->query($sql);

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getById($user_id)
    {
        $sql = "SELECT id, first_name, last_name, username, email, password, role, status, last_login, hours, minutes, seconds FROM users WHERE id = $user_id";
        $result = $this->conn->query($sql);

        return $result->fetch_assoc();
    }

    public function save($request)
    {
        $first_name = $request['first_name'];
        $last_name = $request['last_name'];
        $username = $request['username'];
        $email = $request['email'];
        $password = $request['password'];
        $role = $request['role'];
        $status = $request['status'];

        $password = password_hash($password, PASSWORD_BCRYPT);

        $sql = "INSERT INTO users(first_name, last_name, username, email, password, role, status) 
        VALUES (?,?,?,?,?,?,?)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssssii", $first_name, $last_name, $username, $email, $password, $role, $status);

        $result = '';
        if ($stmt->execute() === TRUE) {
            $result = "Successfully Save";
            $this->ActionLog->saveLogs('user', 'saved');
        } else {
            $result = "Error: <br>" . $this->conn->error;
        }

        $this->conn->close();

        return $result;
    }

    public function save_session($user_id, $request)
    {
        $minutes = $request['minutes'];
        $seconds = $request['seconds'];
    
        $sql = "UPDATE users SET minutes = ?, seconds = ? WHERE id = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("iii", $minutes, $seconds, $user_id);
        
        $result = '';
        if ($stmt->execute() === TRUE) {
            $result = "Successfully Saved";
            $this->ActionLog->saveLogs('user', 'saved');
        } else {
            $result = "Error: " . $stmt->error;
        }
        
        $stmt->close(); // Close the prepared statement
        
        return $result;
    }
    
    public function getSessionTimeoutSettings($user_id)
    {
        $sql = "SELECT minutes, seconds FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->bind_result($minutes, $seconds);
        $stmt->fetch();
        $stmt->close();
    
        return ['minutes' => $minutes, 'seconds' => $seconds];
    }
    

    public function update($request)
    {
        $user_id = $request['user_id'];
        $first_name = $request['first_name'];
        $last_name = $request['last_name'];
        $username = $request['username'];
        $email = $request['email'];
        $role = $request['role'];
        $status = $request['status'];
    
        $sql = "UPDATE users SET first_name=?, last_name=?, username=?, email=?, role=?, status=?";
    
        if ($status == 1) {
            $sql .= ", login_attempt=0";
        }
    
        $sql .= " WHERE id=?";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssssii", $first_name, $last_name, $username, $email, $role, $status, $user_id);

        $result = '';
        if ($stmt->execute() === TRUE) {
            $result = "Updated Successfully";
            $this->ActionLog->saveLogs('user', 'updated');
        } else {
            $result = "Error updating record: " . $this->conn->error;
        }
    
        $this->conn->close();
    
        return $result;
    }
    

    public function update_password($request)
    {
        $password = $request['password'];
        $user_id = $request['user_id'];
        $temp_password = 0;
    
        $password = password_hash($password, PASSWORD_BCRYPT);
        $expirationTimestamp = null;
    
        $sql = "UPDATE users SET password=?, temp_password=?, expiration_timestamp=? WHERE id=?";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("siii", $password, $temp_password, $expirationTimestamp, $user_id);
    
        $result = '';
        if ($stmt->execute() === TRUE) {
            $result = "Updated Successfully";
            $this->ActionLog->saveLogs('user', 'change password');
        } else {
            $result = "Error updating record: " . $this->conn->error;
        }
    
        $stmt->close();
    
        return $result;
    }
    

    public function udpate_login_details($user_id)
    {

        // $user_id = $request['user_id'];
        date_default_timezone_set("Asia/Singapore");
        $last_login = date('Y-m-d H:i:s A');
        // echo $last_login;

        $sql = "UPDATE users SET last_login=? WHERE id=?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("si", $last_login, $user_id);

        $result = '';
        if ($stmt->execute() === TRUE) {
            $result = "Updated Successfully";
        } else {
            $result = "Error updating record: " . $this->conn->error;
        }

        return $result;
    }

    public function update_login_attempt($user_id, $login_attempt)
    {

        $sql = "UPDATE users SET login_attempt=? WHERE id=?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $login_attempt, $user_id);

        $result = '';
        if ($stmt->execute() === TRUE) {
            $result = "Updated Successfully";
        } else {
            $result = "Error updating record: " . $this->conn->error;
        }

        return $result;
    }

    public function update_status($user_id, $status)
    {

        $sql = "UPDATE users SET status=? WHERE id=?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $status, $user_id);

        $result = '';
        if ($stmt->execute() === TRUE) {
            $result = "Updated Successfully";
        } else {
            $result = "Error updating record: " . $this->conn->error;
        }

        return $result;
    }

    public function verify_login($request)
    {
        $username = $request['username'];
        $password = $request['password'];
    
        $sql = "SELECT id, password, temp_password, expiration_timestamp, first_name, last_name, email, role, login_attempt, status, hours, minutes, seconds FROM users where username = ?";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
    
        $id = 0;
        $db_password = "";
        $temp_password = 0;
        $expiration_timestamp = null;
        $first_name = "";
        $last_name = "";
        $email = "";
        $role = "";
        $login_attempt = 0;
        $status = 1;
        $hours = "";
        $minutes = "";
        $seconds = "";
    
        $stmt->bind_result($id, $db_password, $temp_password, $expiration_timestamp, $first_name, $last_name, $email, $role, $login_attempt, $status, $hours, $minutes, $seconds);
        $stmt->fetch();
    
        if ($status == 0) {
            return "locked";
        } elseif ($temp_password == 1 && $expiration_timestamp !== null && $role != 1 && password_verify($password, $db_password)) {
            $currentTimestamp = new DateTime('now', new DateTimeZone('Asia/Singapore'));
            $currentTimestamp = $currentTimestamp->format('Y-m-d H:i:s');
            $expirationDateTime = new DateTime($expiration_timestamp);
    
            if ($currentTimestamp > $expirationDateTime->format('Y-m-d H:i:s')) {
                $stmt->free_result();
                $login_attempt++;
    
                if ($role != 1) {
                    $this->update_login_attempt($id, $login_attempt);
                }
    
                if ($login_attempt == 3) {
                    $this->update_status($id, 0);
                    return "threeAttempts";
                }
    
                return "temporary";
            }
        }
    
        if (password_verify($password, $db_password)) {
            $stmt->free_result();
    
            $_SESSION['user'] = [
                'id' => $id,
                'fullname' => $first_name . ' ' . $last_name,
                'role' => $role,
                'username' => $username,
                'email' => $email,
                'password' => $password,
            ];
    
            $this->update_login_attempt($id, 0);
            $this->udpate_login_details($id);
    
            $this->ActionLog->saveLogs('login');
            return "Validated";
        } else {
            $stmt->free_result();
            $login_attempt++;
    
            if ($role != 1) {
                $this->update_login_attempt($id, $login_attempt);
            }
    
            if ($login_attempt == 3) {
                $this->update_status($id, 0);
                return "threeAttempts";
            }
    
            return "Invalid Username or Password";
        }
    }
        
    public function validateAdminPassword($password)
    {
        $sql = "SELECT username,password from users where role != 3 and status = 1";
        $result = $this->conn->query($sql);

        $this->conn->close();
        $adminUsers =  $result->fetch_all(MYSQLI_ASSOC);

        $match = false;
        foreach ($adminUsers as $adminUser) {
            if (password_verify($password, $adminUser['password'])) {
                $match = true;
            }
        }
        return $match;
    }

    public function getCurrentPassword($password)
    {
        $sql = "SELECT password from user";
        $result = $this->conn->query($sql);

        return $result;
    }

    public function isUsernameTaken($username, $excludeUserId = null)
    {
        if ($excludeUserId !== null) {
            $stmt = $this->conn->prepare("SELECT id FROM users WHERE username LIKE ? AND id != ?");
            $stmt->bind_param("si", $username, $excludeUserId);
        } else {
            $stmt = $this->conn->prepare("SELECT id FROM users WHERE username LIKE ?");
            $stmt->bind_param("s", $username);
        }

        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            return true;  // Username is taken by another user
        } else {
            return false; // Username is available
        }
    }



    public function changeForgottenPassword($email, $newPassword)
    {

        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $temp_password = 0;
        $expirationTimestamp = null;

        $sql = "UPDATE users SET password = ?, temp_password=?, expiration_timestamp=?, status = 1, login_attempt = 0 WHERE email = ?";
            
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("siis", $hashedPassword, $temp_password, $expirationTimestamp, $email);
            
        $result = $stmt->execute();
        $stmt->close();

        return $result;
    }

    public function getEmailExistsStatement($email)
    {
        $stmt = $this->conn->prepare("SELECT id, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        return $stmt;
    }

    public function update_Generatepassword($request)
    {
        $password = $request['password'];
        $user_id = $request['user_id'];
        $temp_password = 1;
    
        $password = password_hash($password, PASSWORD_BCRYPT);
    
        // Get current timestamp
        $currentTimestamp = new DateTime('now', new DateTimeZone('Asia/Singapore'));
        $currentTimestamp = $currentTimestamp->format('Y-m-d H:i:s');
    
        // Calculate expiration timestamp
        if ($temp_password == 1) {
            $expirationTimestamp = new DateTime('now', new DateTimeZone('Asia/Singapore'));
            $expirationTimestamp->modify('+24 hours');
            $expirationTimestamp = $expirationTimestamp->format('Y-m-d H:i:s');
        } else {
            $expirationTimestamp = null;
        }
    
        // Check if temporary password is still within the one-minute validity period
        if ($temp_password == 1 && $currentTimestamp > $expirationTimestamp) {
            return "Temporary password has expired. Please generate a new one.";
        }
    
        $sql = "UPDATE users SET password=?, temp_password=?, expiration_timestamp=? WHERE id=?";
    
        $stmt = $this->conn->prepare($sql);
    
        if ($stmt) {
            if ($temp_password == 1) {
                $stmt->bind_param("sisi", $password, $temp_password, $expirationTimestamp, $user_id);
            } else {
                $stmt->bind_param("sii", $password, $temp_password, $user_id);
            }
    
            $result = '';
            if ($stmt->execute() === TRUE) {
                $result = "Updated Successfully";
                $this->ActionLog->saveLogs('user', 'change password');
            } else {
                $result = "Error updating record: " . $stmt->error;
            }
    
            $stmt->close();
        } else {
            $result = "Statement preparation failed: " . $this->conn->error;
        }
    
        return $result;
    }
        
    
    public function generateRandomPassword($length = 10) {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
        $password = '';
    
        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[rand(0, strlen($characters) - 1)];
        }
    
        return $password;
    }

    public function getUserEmail($user_id)
    {
        $sql = "SELECT email FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
    
        if ($stmt) {
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $stmt->bind_result($email);
            $stmt->fetch();
            $stmt->close();
    
            return $email;
        } else {
            // Handle the case where the statement preparation fails
            return false;
        }
    }
    
    
}
