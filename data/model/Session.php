<?php

include_once('ActionLog.php');

class Session
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
        $this->ActionLog = new ActionLog($connection);
    }

    public function getAll()
    {
        $sql = "SELECT * from session_timeout";
        $result = $this->conn->query($sql);

        return $result->fetch_all(MYSQLI_ASSOC);
    }


    public function save($request)
    {
        $username = $request['username'];
        $hours = $request['hours'];
        $minutes = $request['minutes'];
    
        $sql = "INSERT INTO session_timeout (username, hours, minutes) VALUES (?, ?, ?)";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sii", $username, $hours, $minutes);
    
        $result = '';
        if ($stmt->execute() === TRUE) {
            $result = "Successfully Saved";
            $this->ActionLog->saveLogs('user', 'saved');
        } else {
            $result = "Error: <br>" . $this->conn->error;
        }
    
        $stmt->close(); // Close the prepared statement
    
        return $result;
    }
             
}
