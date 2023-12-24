<?php

$host = 'localhost';
$username = 'root';
$password = '';
$db_name = 'ironmed';

$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Check for an active session before starting a new one
if (session_id() === '') {
  session_start();
}

CONST DEFAULT_PASSWORD = 'default123';


