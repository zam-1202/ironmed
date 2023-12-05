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

        $this->conn->close();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getById($user_id)
    {
        $sql = "SELECT id, first_name, last_name, username, email, password, role, status, last_login, hours, minutes, seconds FROM users WHERE id = $user_id";
        $result = $this->conn->query($sql);

        $this->conn->close();
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
        $hours = $request['hours'];
        $minutes = $request['minutes'];
        $seconds = $request['seconds'];
    
        $sql = "UPDATE users SET hours = ?, minutes = ?, seconds = ? WHERE id = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("iiii", $hours, $minutes, $seconds, $user_id);
        
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
        $sql = "SELECT hours, minutes, seconds FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->bind_result($hours, $minutes, $seconds);
        $stmt->fetch();
        $stmt->close();
    
        return ['hours' => $hours, 'minutes' => $minutes, 'seconds' => $seconds];
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

        $sql = "UPDATE users SET first_name=?, last_name=?, username=?, email=?, role=?, status=? WHERE id=?";

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

        $password = password_hash($password, PASSWORD_BCRYPT);

        $sql = "UPDATE users SET password=? WHERE id=?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("si", $password, $user_id);

        $result = '';
        if ($stmt->execute() === TRUE) {
            $result = "Updated Successfully";
            $this->ActionLog->saveLogs('user', 'change password');
        } else {
            $result = "Error updating record: " . $this->conn->error;
        }

        $this->conn->close();

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

        $sql = "SELECT id, password, first_name, last_name, email, role, login_attempt, status, hours, minutes, seconds FROM users where username = ?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();


        $id = 0;
        $db_password = "";
        $first_name = "";
        $last_name = "";
        $email = "";
        $role = "";
        $login_attempt = "";
        $status = "";
        $hours = "";
        $minutes = "";
        $seconds = "";
        $stmt->bind_result($id, $db_password, $first_name, $last_name, $email, $role, $login_attempt, $status, $hours, $minutes, $seconds);
        $stmt->fetch();


        if ($status == 0) {
            return "Account is deactivated";
        } else if (password_verify($password, $db_password)) {
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

            $login_attempt ++;

            if ($role != 1){
            $this->update_login_attempt($id, $login_attempt);
            }
            if ($login_attempt == 3) {
                $this->update_status($id, 0);
                return "Your Account has been lock due to many attempts. Please contact System admin.";
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
    // Check if the email exists in the users table

        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

        $sql = "UPDATE users SET password = ? WHERE email = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $hashedPassword, $email);
        
        $result = $stmt->execute(); // Use the result directly as a boolean
        $stmt->close(); // Close the prepared statement

        return $result;
}
}
